import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { ParishCouncilMember } from '../../types';

export default function AdminParishCouncil() {
  const [members, setMembers] = useState<ParishCouncilMember[]>([]);
  const [form, setForm] = useState({ name:'', role:'', phone:'', dob:'', feast_day:'', normal_mass_time:'', special_mass_time:'', image_url:'' });
  const [editId, setEditId] = useState<string|null>(null);
  const [msg, setMsg] = useState('');
  const load = () => api.get('/parish-council').then(r => setMembers(r.data));
  useEffect(() => { load(); }, []);
  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) { await api.put(`/parish-council/${editId}`, form); notify('Updated!'); setEditId(null); }
    else { await api.post('/parish-council', form); notify('Added!'); }
    setForm({ name:'', role:'', phone:'', dob:'', feast_day:'', normal_mass_time:'', special_mass_time:'', image_url:'' });
    load();
  };
  const del = async (id: string) => { if (confirm('Delete?')) { await api.delete(`/parish-council/${id}`); load(); }};
  const startEdit = (m: ParishCouncilMember) => { setEditId(m._id); setForm({ name:m.name, role:m.role, phone:m.phone, dob:m.dob, feast_day:m.feast_day, normal_mass_time:m.normal_mass_time, special_mass_time:m.special_mass_time, image_url:m.image_url }); };

  const fields = [
    { key:'name', label:'Name', required:true },
    { key:'role', label:'Role', required:true },
    { key:'phone', label:'Phone' },
    { key:'dob', label:'Date of Birth' },
    { key:'feast_day', label:'Feast Day' },
    { key:'normal_mass_time', label:'Normal Mass Time' },
    { key:'special_mass_time', label:'Special Mass Time' },
    { key:'image_url', label:'Image URL' },
  ];

  return (
    <div>
      <h1 className="font-heading" style={{ fontSize:'1.75rem', fontWeight:700, color:'#fff', marginBottom:'2rem' }}>Parish Council</h1>
      {msg && <div style={{ padding:'0.75rem', borderRadius:'0.75rem', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', color:'#6ee7b7', marginBottom:'1rem', fontSize:'0.875rem' }}>{msg}</div>}
      <form onSubmit={submit} className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', marginBottom:'2rem' }}>
        <h3 className="font-heading" style={{ color:'var(--gold-400)', fontWeight:600, marginBottom:'1rem' }}>{editId ? 'Edit Member' : 'Add Member'}</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
          {fields.map(({ key, label, required }) => (
            <div key={key}>
              <label style={{ fontSize:'0.8125rem', color:'#9ca3af', display:'block', marginBottom:'0.5rem' }}>{label}</label>
              <input className="form-input" placeholder={label} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={required} />
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button type="submit" className="btn-gold" style={{ padding:'0.75rem 1.5rem' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="btn-ghost" onClick={() => { setEditId(null); setForm({ name:'', role:'', phone:'', dob:'', feast_day:'', normal_mass_time:'', special_mass_time:'', image_url:'' }); }} style={{ padding:'0.75rem 1.5rem' }}>Cancel</button>}
        </div>
      </form>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem' }}>
        {members.map(m => (
          <div key={m._id} className="glass-card" style={{ padding:'1.25rem', borderRadius:'1rem' }}>
            <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start', marginBottom:'1rem' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', overflow:'hidden', flexShrink:0, background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--maroon-950)' }} className="font-heading">
                {m.image_url ? <img src={m.image_url} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : m.name[0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p className="font-heading" style={{ fontWeight:600, color:'#fff', fontSize:'0.9375rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.name}</p>
                <p style={{ color:'var(--gold-500)', fontSize:'0.8125rem' }}>{m.role}</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={() => startEdit(m)} className="btn-outline" style={{ flex:1, padding:'0.5rem', fontSize:'0.8125rem' }}>Edit</button>
              <button onClick={() => del(m._id)} style={{ flex:1, padding:'0.5rem', fontSize:'0.8125rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:'0.75rem', cursor:'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
