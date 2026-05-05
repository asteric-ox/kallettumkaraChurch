import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { FamilyUnit } from '../types';

export default function FamilyUnitDetailPage() {
  const { id } = useParams();
  const [unit, setUnit] = useState<FamilyUnit | null>(null);
  useEffect(() => { if (id) api.get(`/family-units/${id}`).then(r => setUnit(r.data)); }, [id]);
  if (!unit) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="animate-spin" style={{ width:40, height:40, border:'3px solid rgba(212,175,55,0.2)', borderTop:'3px solid var(--gold-500)', borderRadius:'50%' }} /></div>;
  const leaders = [{ role:'President', data:unit.president },{ role:'Secretary', data:unit.secretary },{ role:'Treasurer', data:unit.treasurer }];
  const visibleFamilies = unit.families.filter(f => f.visible);
  return (
    <div style={{ paddingTop:'6rem' }}>
      <section style={{ padding:'3rem 1rem', background:'rgba(26,20,16,0.5)' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
          <Link to="/family-units" style={{ color:'var(--gold-400)', textDecoration:'none', fontSize:'0.875rem', display:'inline-flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem' }}>← Back to Family Units</Link>
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'2rem' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:700, color:'var(--maroon-950)' }} className="font-heading">{unit.unit_number}</div>
            <div>
              <h1 className="font-heading" style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)', fontWeight:700, color:'#fff' }}>{unit.name} Unit</h1>
              <p style={{ color:'var(--gold-500)', fontSize:'0.875rem' }}>Family Unit #{unit.unit_number}</p>
            </div>
          </div>
          {/* Leadership */}
          <div style={{ marginBottom:'3rem' }}>
            <h2 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff', marginBottom:'1.5rem' }}>Unit Leadership</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
              {leaders.map(({ role, data }) => (
                <div key={role} className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', textAlign:'center' }}>
                  {unit.show_photo && data.image_url
                    ? <img src={data.image_url} alt={data.name} style={{ width:72, height:72, borderRadius:'50%', objectFit:'cover', margin:'0 auto 0.75rem', border:'2px solid rgba(212,175,55,0.3)' }} />
                    : <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--church-accent)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.75rem', fontSize:'1.5rem', color:'var(--gold-400)', fontWeight:700 }} className="font-heading">{data.name !== '—' ? data.name[0] : '?'}</div>
                  }
                  <span style={{ fontSize:'0.75rem', color:'var(--gold-500)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:'0.25rem' }}>{role}</span>
                  <p style={{ color:'#fff', fontWeight:500, fontSize:'0.9375rem' }}>{data.name}</p>
                  {data.phone && data.phone !== '—' && <a href={`tel:${data.phone}`} style={{ fontSize:'0.75rem', color:'#9ca3af', textDecoration:'none' }}>{data.phone}</a>}
                </div>
              ))}
            </div>
          </div>
          {/* Families */}
          {visibleFamilies.length > 0 && (
            <div>
              <h2 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff', marginBottom:'1.5rem' }}>Parish Families ({visibleFamilies.length})</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
                {visibleFamilies.map((family, i) => (
                  <div key={i} className="glass-card" style={{ padding:'1rem', borderRadius:'0.75rem', textAlign:'center' }}>
                    {unit.show_photo && family.image_url
                      ? <img src={family.image_url} alt={family.name} style={{ width:56, height:56, borderRadius:'50%', objectFit:'cover', margin:'0 auto 0.75rem', border:'2px solid rgba(212,175,55,0.2)' }} />
                      : <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(42,31,21,0.8)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.75rem', color:'var(--gold-400)', fontWeight:700, fontSize:'1.125rem' }} className="font-heading">{family.name[0]}</div>
                    }
                    <p style={{ color:'#fff', fontWeight:500, fontSize:'0.875rem' }}>{family.name}</p>
                    {family.address && <p style={{ fontSize:'0.75rem', color:'#6b7280', marginTop:'0.25rem' }}>{family.address}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
