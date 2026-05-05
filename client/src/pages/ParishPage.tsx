import { useEffect, useState } from 'react';
import api from '../services/api';
import type { ParishCouncilMember } from '../types';
import PageHero from '../components/PageHero';

export default function ParishPage() {
  const [council, setCouncil] = useState<ParishCouncilMember[]>([]);
  useEffect(() => { api.get('/parish-council').then(r => setCouncil(r.data)); }, []);
  return (
    <>
      <PageHero subtitle="Leadership" title="Parish Council" desc="Our dedicated priests and council serving the community" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.5rem' }}>
            {council.map(p => (
              <div key={p._id} className="glass-card" style={{ padding:'2rem', borderRadius:'1rem', textAlign:'center', transition:'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width:96, height:96, borderRadius:'50%', objectFit:'cover', margin:'0 auto 1rem', border:'2px solid rgba(212,175,55,0.3)', display:'block' }} />
                  : <div style={{ width:96, height:96, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'2.5rem', color:'var(--maroon-950)', fontWeight:700 }} className="font-heading">{p.name[0]}</div>
                }
                <h3 className="font-heading" style={{ fontSize:'1.125rem', fontWeight:600, color:'#fff', marginBottom:'0.25rem' }}>{p.name}</h3>
                <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', marginBottom:'0.75rem' }}>{p.role}</p>
                {p.phone && <a href={`tel:${p.phone}`} style={{ fontSize:'0.8125rem', color:'#9ca3af', textDecoration:'none', display:'block', marginBottom:'0.5rem' }}>{p.phone}</a>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
