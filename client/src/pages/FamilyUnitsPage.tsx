import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { FamilyUnit } from '../types';
import PageHero from '../components/PageHero';

export default function FamilyUnitsPage() {
  const [units, setUnits] = useState<FamilyUnit[]>([]);
  useEffect(() => { api.get('/family-units').then(r => setUnits(r.data)); }, []);
  return (
    <>
      <PageHero subtitle="Our Community" title="Family Units" desc="25 family units serving 800+ parish families" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
            {units.map(unit => (
              <Link key={unit._id} to={`/family-units/${unit._id}`} style={{ textDecoration:'none' }}>
                <div className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', textAlign:'center', transition:'all 0.3s', cursor:'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.08)'; }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'0.75rem', fontWeight:700, color:'var(--maroon-950)' }}>
                    {unit.unit_number}
                  </div>
                  <h3 className="font-heading" style={{ fontSize:'0.9375rem', fontWeight:600, color:'#fff', marginBottom:'0.25rem' }}>{unit.name}</h3>
                  <p style={{ fontSize:'0.75rem', color:'#6b7280' }}>{unit.families.filter(f => f.visible).length} families</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
