import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Trustee } from '../../types';

export default function AdminTrustees() {
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [form, setForm] = useState({ name:'', role:'Trustee', phone:'', dob:'', feast_day:'', installation_date:'', image_url:'' });
  const [editId, setEditId] = useState<string|null>(null);
  const [msg, setMsg] = useState('');
  const load = () => api.get('/trustees').then(r => setTrustees(r.data));
  useEffect(() => { load(); }, []);
  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) { await api.put(`/trustees/${editId}`, form); notify('Updated!'); setEditId(null); }
    else { await api.post('/trustees', form); notify('Added!'); }
    setForm({ name:'', role:'Trustee', phone:'', dob:'', feast_day:'', installation_date:'', image_url:'' });
    load();
  };
  const del = async (id: string) => { if (confirm('Delete?')) { await api.delete(`/trustees/${id}`); load(); }};
  const startEdit = (t: Trustee) => { setEditId(t._id); setForm({ name:t.name, role:t.role, phone:t.phone, dob:t.dob, feast_day:t.feast_day, installation_date:t.installation_date, image_url:t.image_url }); };
  const fields = [
    { key:'name', label:'Name', required:true }, { key:'role', label:'Role' }, { key:'phone', label:'Phone' },
    { key:'dob', label:'Date of Birth' }, { key:'feast_day', label:'Feast Day' }, { key:'installation_date', label:'Installation Date' }, { key:'image_url', label:'Image URL' },
  ];
  return (
    <div>
      <h1 className="font-heading" style={{ fontSize:'1.75rem', fontWeight:700, color:'#fff', marginBottom:'2rem' }}>Trustees</h1>
      {msg && <div style={{ padding:'0.75rem', borderRadius:'0.75rem', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', color:'#6ee7b7', marginBottom:'1rem', fontSize:'0.875rem' }}>{msg}</div>}
      <form onSubmit={submit} className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', marginBottom:'2rem' }}>
        <h3 className="font-heading" style={{ color:'var(--gold-400)', fontWeight:600, marginBottom:'1rem' }}>{editId ? 'Edit Trustee' : 'Add Trustee'}</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
          {fields.map(({ key, label, required }) => (
            <div key={key}><label style={{ fontSize:'0.8125rem', color:'#9ca3af', display:'block', marginBottom:'0.5rem' }}>{label}</label>
              <input className="form-input" placeholder={label} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={required} /></div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button type="submit" className="btn-gold" style={{ padding:'0.75rem 1.5rem' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="btn-ghost" onClick={() => { setEditId(null); setForm({ name:'', role:'Trustee', phone:'', dob:'', feast_day:'', installation_date:'', image_url:'' }); }} style={{ padding:'0.75rem 1.5rem' }}>Cancel</button>}
        </div>
      </form>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
        {trustees.map(t => (
          <div key={t._id} className="glass-card" style={{ padding:'1.25rem', borderRadius:'1rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'var(--church-accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--gold-400)', flexShrink:0, overflow:'hidden' }} className="font-heading">
                {t.image_url ? <img src={t.image_url} alt={t.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : t.name[0]}
              </div>
              <div><p className="font-heading" style={{ fontWeight:600, color:'#fff', fontSize:'0.9375rem' }}>{t.name}</p><p style={{ color:'var(--gold-500)', fontSize:'0.8125rem' }}>{t.role}</p></div>
            </div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={() => startEdit(t)} className="btn-outline" style={{ flex:1, padding:'0.5rem', fontSize:'0.8125rem' }}>Edit</button>
              <button onClick={() => del(t._id)} style={{ flex:1, padding:'0.5rem', fontSize:'0.8125rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:'0.75rem', cursor:'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
