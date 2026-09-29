import { getImageUrl } from '../../utils/imageUtils';
import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import type { ParishCouncilMember } from '../../types';

export default function AdminParishCouncil() {
  const [members, setMembers] = useState<ParishCouncilMember[]>([]);
  const [form, setForm] = useState({ name: '', role: '', phone: '', dob: '', feast_day: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editCurrentImage, setEditCurrentImage] = useState('');
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/parish-council').then(r => setMembers(r.data));
  useEffect(() => { load(); }, []);

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({ name: '', role: '', phone: '', dob: '', feast_day: '' });
    setImageFile(null);
    setImagePreview('');
    setEditId(null);
    setEditCurrentImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('role', form.role);
      fd.append('phone', form.phone);
      fd.append('dob', form.dob);
      fd.append('feast_day', form.feast_day);
      // Keep existing image if no new one selected
      if (editId && !imageFile) fd.append('image_url', editCurrentImage);
      if (imageFile) fd.append('image_file', imageFile);

      if (editId) {
        await api.put(`/parish-council/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        notify('Member updated!');
      } else {
        await api.post('/parish-council', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        notify('Member added!');
      }
      resetForm();
      load();
    } catch {
      notify('Error saving member.');
    } finally {
      setUploading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    await api.delete(`/parish-council/${id}`);
    load();
  };

  const startEdit = (m: ParishCouncilMember) => {
    setEditId(m._id);
    setForm({ name: m.name, role: m.role, phone: m.phone, dob: m.dob, feast_day: m.feast_day });
    setEditCurrentImage(m.image_url || '');
    setImagePreview(m.image_url ? getImageUrl(m.image_url) : '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>Parish Council</h1>

      {msg && (
        <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', marginBottom: '1rem', fontSize: '0.875rem' }}>
          ✅ {msg}
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={submit} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
        <h3 className="font-heading" style={{ color: 'var(--gold-400)', fontWeight: 600, marginBottom: '1.25rem' }}>
          {editId ? 'Edit Member' : 'Add Member'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Name *</label>
            <input className="form-input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Role *</label>
            <input className="form-input" placeholder="Vicar / Assistant Vicar…" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Phone</label>
            <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Date of Birth</label>
            <input className="form-input" placeholder="e.g. 01 Jan 1980" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Feast Day</label>
            <input className="form-input" placeholder="e.g. 03 Jan" value={form.feast_day} onChange={e => setForm({ ...form, feast_day: e.target.value })} />
          </div>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Photo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Preview */}
            <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, var(--gold-500), var(--gold-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a1410', fontSize: '1.5rem', border: '2px solid rgba(212,175,55,0.3)' }}>
              {imagePreview
                ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (form.name ? form.name[0]?.toUpperCase() : '📷')}
            </div>

            <div style={{ flex: 1 }}>
              {/* Hidden real input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="parish-image-upload"
              />
              <label
                htmlFor="parish-image-upload"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'rgba(212,175,55,0.1)', border: '1px dashed rgba(212,175,55,0.4)', borderRadius: '0.75rem', color: 'var(--gold-400)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
              >
                📁 {imageFile ? 'Change Photo' : editId ? 'Replace Photo' : 'Upload Photo'}
              </label>
              {imageFile && (
                <p style={{ color: '#6ee7b7', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                  ✅ {imageFile.name}
                </p>
              )}
              {editId && !imageFile && editCurrentImage && (
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                  Current photo kept. Upload to replace.
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn-gold" style={{ padding: '0.75rem 1.5rem' }} disabled={uploading}>
            {uploading ? 'Saving...' : editId ? 'Update' : 'Add'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#9ca3af', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ── Member Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {members.map(m => (
          <div key={m._id} className="glass-card" style={{ padding: '1.25rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, var(--gold-500), var(--gold-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a1410' }} className="font-heading">
                {m.image_url
                  ? <img src={getImageUrl(m.image_url)} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : m.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="font-heading" style={{ fontWeight: 600, color: '#fff', fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                <p style={{ color: 'var(--gold-500)', fontSize: '0.8125rem' }}>{m.role}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(m)} className="btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8125rem' }}>Edit</button>
              <button onClick={() => del(m._id)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.8125rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '0.75rem', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
