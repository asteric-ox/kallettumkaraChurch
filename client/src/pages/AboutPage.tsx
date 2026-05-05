import { useEffect, useState } from 'react';
import api from '../services/api';
import type { ParishCouncilMember } from '../types';
import PageHero from '../components/PageHero';

export default function AboutPage() {
  const [council, setCouncil] = useState<ParishCouncilMember[]>([]);
  useEffect(() => { api.get('/parish-council').then(r => setCouncil(r.data)); }, []);
  return (
    <>
      <PageHero subtitle="Our Parish Family" title="About Us" desc="Get to know our community, leadership and mission" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'56rem', margin:'0 auto' }}>
          <div className="glass-card" style={{ padding:'2.5rem', borderRadius:'1rem', marginBottom:'4rem' }}>
            <h2 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--gold-400)', marginBottom:'1.5rem' }}>Our Parish</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', color:'#d1d5db', lineHeight:1.8 }}>
              <p>Infant Jesus Church, Kallettumkara, is a vibrant parish of the <strong style={{ color:'var(--gold-400)' }}>Syro-Malabar Catholic Church</strong>, under the Diocese of Irinjalakuda. With a rich history spanning over a century, we are one of the important Christian communities in Thrissur district.</p>
              <p>Our parish is home to over 800 families organised into 25 family units. Through our various parish organisations — including Mathrusangham, KCYM, and Catechism — we strive to build a strong, faith-filled community.</p>
              <p>We welcome all faithful and pilgrims, especially during our annual parish feast of Infant Jesus, celebrated with great solemnity.</p>
            </div>
          </div>
        </div>
      </section>
      {council.length > 0 && (
        <section style={{ padding:'5rem 1rem', background:'rgba(26,20,16,0.5)' }}>
          <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Leadership</p>
              <h2 className="font-heading" style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'#fff' }}>Parish Council</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.5rem' }}>
              {council.map(p => (
                <div key={p._id} className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', textAlign:'center', transition:'transform 0.3s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                  <div style={{ width:96, height:96, margin:'0 auto 1rem', borderRadius:'50%', background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color:'var(--maroon-950)', fontWeight:700, boxShadow:'0 8px 20px rgba(212,175,55,0.2)' }} className="font-heading">{p.name[0]}</div>
                  <h3 className="font-heading" style={{ fontSize:'1rem', fontWeight:600, color:'#fff', marginBottom:'0.25rem' }}>{p.name}</h3>
                  <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', marginBottom:'0.5rem' }}>{p.role}</p>
                  {p.phone && <a href={`tel:${p.phone}`} style={{ fontSize:'0.75rem', color:'#9ca3af', textDecoration:'none' }}>{p.phone}</a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Community</p>
            <h2 className="font-heading" style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'#fff' }}>Parish Organisations</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem' }}>
            {[['👨‍👩‍👧‍👦','Parish Council','Governing body of the parish elected by the community.'],['🙏','Mathrusangham',"Mothers' association for spiritual growth and charity."],['⚡','KCYM','Youth movement nurturing faith-based leadership.'],['📖','Catechism','Sunday School for children\'s faith formation.']].map(([icon,name,desc]) => (
              <div key={name} className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', textAlign:'center' }}>
                <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{icon}</div>
                <h3 className="font-heading" style={{ fontSize:'1rem', fontWeight:600, color:'#fff', marginBottom:'0.5rem' }}>{name}</h3>
                <p style={{ fontSize:'0.8125rem', color:'#9ca3af' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
