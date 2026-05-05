import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import type { FamilyUnit } from '../../types';

export default function AdminFamilyUnitEdit() {
  const { id } = useParams();
  const [unit, setUnit] = useState<FamilyUnit | null>(null);
  const [addForm, setAddForm] = useState({ name:'', phone:'', address:'', email:'' });
  const [msg, setMsg] = useState('');
  const load = () => { if (id) api.get(`/family-units/${id}`).then(r => setUnit(r.data)); };
  useEffect(() => { load(); }, [id]);
  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const togglePhoto = async () => { await api.patch(`/family-units/${id}/toggle-photo`); load(); notify('Photo visibility toggled!'); };
  const addFamily = async (e: React.FormEvent) => { e.preventDefault(); await api.post(`/family-units/${id}/families`, addForm); setAddForm({ name:'', phone:'', address:'', email:'' }); load(); notify('Family added!'); };
  const toggleFamily = async (idx: number) => { await api.patch(`/family-units/${id}/families/${idx}/toggle`); load(); };
  const delFamily = async (idx: number) => { if (confirm('Remove family?')) { await api.delete(`/family-units/${id}/families/${idx}`); load(); notify('Removed!'); }};

  if (!unit) return <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}><div className="animate-spin" style={{ width:40, height:40, border:'3px solid rgba(212,175,55,0.2)', borderTop:'3px solid var(--gold-500)', borderRadius:'50%' }} /></div>;
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
        <Link to="/admin/family-units" style={{ color:'var(--gold-400)', textDecoration:'none', fontSize:'0.875rem' }}>← Back</Link>
        <h1 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff' }}>{unit.name} Unit (#{unit.unit_number})</h1>
        <button onClick={togglePhoto} className={unit.show_photo ? 'btn-outline' : 'btn-gold'} style={{ padding:'0.5rem 1rem', fontSize:'0.8125rem', marginLeft:'auto' }}>
          Photos: {unit.show_photo ? 'ON' : 'OFF'}
        </button>
      </div>
      {msg && <div style={{ padding:'0.75rem', borderRadius:'0.75rem', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', color:'#6ee7b7', marginBottom:'1rem', fontSize:'0.875rem' }}>{msg}</div>}

      {/* Add Family Form */}
      <form onSubmit={addFamily} className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', marginBottom:'2rem' }}>
        <h3 className="font-heading" style={{ color:'var(--gold-400)', fontWeight:600, marginBottom:'1rem' }}>Add Family</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
          {[['name','Family Name',true],['phone','Phone'],['address','Address'],['email','Email']].map(([k,l,r]:any) => (
            <div key={k}><label style={{ fontSize:'0.8125rem', color:'#9ca3af', display:'block', marginBottom:'0.5rem' }}>{l}</label>
              <input className="form-input" placeholder={l} value={(addForm as any)[k]} onChange={e => setAddForm({...addForm,[k]:e.target.value})} required={r} /></div>
          ))}
        </div>
        <button type="submit" className="btn-gold" style={{ padding:'0.75rem 1.5rem' }}>Add Family</button>
      </form>

      {/* Families List */}
      <div className="glass-card" style={{ borderRadius:'1rem', overflow:'hidden' }}>
        <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="font-heading" style={{ color:'#fff', fontWeight:600 }}>Families ({unit.families.length})</h3>
        </div>
        {unit.families.length === 0
          ? <div style={{ padding:'2rem', textAlign:'center', color:'#6b7280' }}>No families yet.</div>
          : unit.families.map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.875rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:500, color: f.visible ? '#fff' : '#6b7280', fontSize:'0.9375rem' }}>{f.name}</p>
                <p style={{ fontSize:'0.75rem', color:'#6b7280' }}>{f.phone} {f.address && `• ${f.address}`}</p>
              </div>
              <span style={{ fontSize:'0.75rem', padding:'0.25rem 0.5rem', borderRadius:'9999px', background: f.visible ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', color: f.visible ? '#6ee7b7' : '#6b7280' }}>{f.visible ? 'Visible' : 'Hidden'}</span>
              <button onClick={() => toggleFamily(i)} style={{ padding:'0.25rem 0.625rem', fontSize:'0.75rem', background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.2)', color:'var(--gold-400)', borderRadius:'0.375rem', cursor:'pointer' }}>Toggle</button>
              <button onClick={() => delFamily(i)} style={{ padding:'0.25rem 0.625rem', fontSize:'0.75rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:'0.375rem', cursor:'pointer' }}>Remove</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
