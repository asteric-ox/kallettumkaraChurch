import { useEffect, useState } from 'react';
import api from '../services/api';
import type { MassTiming } from '../types';
import PageHero from '../components/PageHero';

export default function SpiritualLifePage() {
  const [timings, setTimings] = useState<MassTiming[]>([]);
  useEffect(() => { api.get('/mass-timings').then(r => setTimings(r.data)); }, []);
  const weekday = timings.filter(m => m.category === 'Weekday');
  const sunday = timings.filter(m => m.category === 'Sunday');
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return (
    <>
      <PageHero subtitle="Worship & Prayer" title="Spiritual Life" desc="Deepen your faith through the sacraments and devotional life" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
          <h2 className="font-heading" style={{ fontSize:'1.75rem', fontWeight:700, color:'var(--gold-400)', marginBottom:'2rem', textAlign:'center' }}>Holy Qurbana Schedule</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'2rem', marginBottom:'3rem' }}>
            <div className="glass-card" style={{ padding:'2rem', borderRadius:'1rem' }}>
              <h3 className="font-heading" style={{ fontSize:'1.25rem', fontWeight:700, color:'#fff', marginBottom:'1.5rem' }}>Weekday Masses</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {days.map(day => {
                  const dm = weekday.filter(m => m.day === day);
                  if (!dm.length) return null;
                  return (
                    <div key={day} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 1rem', borderRadius:'0.75rem', background:'rgba(42,31,21,0.3)', border:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--gold-500)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{day}</span>
                      <span className="font-heading" style={{ fontWeight:700, color:'#fff', textAlign:'right' }}>{dm.map(m => m.time).join(' / ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="glass-card" style={{ padding:'2rem', borderRadius:'1rem', border:'1px solid rgba(212,175,55,0.15)' }}>
              <h3 className="font-heading" style={{ fontSize:'1.25rem', fontWeight:700, color:'#fff', marginBottom:'1.5rem' }}>Sunday Services</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {sunday.map(m => (
                  <div key={m._id} style={{ display:'flex', justifyContent:'space-between', padding:'0.75rem 1rem', borderRadius:'0.75rem', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.1)' }}>
                    <span className="font-heading" style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--gold-400)' }}>{m.time}</span>
                    <span style={{ fontSize:'0.875rem', color:'#d1d5db' }}>{m.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'1.5rem' }}>
            {[
              { icon:'🕯️', title:'Adoration', desc:'Perpetual adoration of the Blessed Sacrament is held every Wednesday evening.' },
              { icon:'📿', title:'Rosary', desc:'The Holy Rosary is prayed daily before the morning Mass.' },
              { icon:'✝', title:'Way of the Cross', desc:'Way of the Cross is conducted every Friday evening during Lent.' },
              { icon:'🌟', title:'Novena', desc:'Wednesday Novena to Infant Jesus is held every week at 5:00 PM.' },
            ].map(item => (
              <div key={item.title} className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', textAlign:'center' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>{item.icon}</div>
                <h3 className="font-heading" style={{ fontSize:'1.125rem', fontWeight:700, color:'#fff', marginBottom:'0.5rem' }}>{item.title}</h3>
                <p style={{ color:'#9ca3af', fontSize:'0.875rem', lineHeight:1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
