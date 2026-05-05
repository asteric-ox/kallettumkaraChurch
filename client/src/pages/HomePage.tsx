import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Announcement, ParishCouncilMember, Trustee, MassTiming } from '../types';
import PriestModal from '../components/PriestModal';
import TrusteeModal from '../components/TrusteeModal';
import PrayerForm from '../components/PrayerForm';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [council, setCouncil] = useState<ParishCouncilMember[]>([]);
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [allTimings, setAllTimings] = useState<MassTiming[]>([]);
  const today = DAYS[new Date().getDay()];
  const [selectedPriest, setSelectedPriest] = useState<ParishCouncilMember | null>(null);
  const [selectedTrustee, setSelectedTrustee] = useState<Trustee | null>(null);

  useEffect(() => {
    api.get('/announcements').then(r => setAnnouncements(r.data));
    api.get('/parish-council').then(r => setCouncil(r.data));
    api.get('/trustees').then(r => setTrustees(r.data));
    api.get('/mass-timings').then(r => setAllTimings(r.data));
  }, []);

  const dailyMasses = allTimings.filter(m => m.day === today);
  const sundayMasses = allTimings.filter(m => m.category === 'Sunday');

  return (
    <>
      {/* HERO */}
      <section id="hero" style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        <div className="parallax-bg" style={{ position:'absolute', inset:0 }} />
        <div className="hero-pattern" style={{ position:'absolute', inset:0, opacity:0.1 }} />
        <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 1rem', maxWidth:'56rem', margin:'0 auto' }}>
          <div className="animate-fade-in" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.375rem 1rem', borderRadius:'9999px', border:'1px solid rgba(212,175,55,0.3)', background:'rgba(212,175,55,0.05)', marginBottom:'2rem' }}>
            <span className="animate-pulse" style={{ width:8, height:8, borderRadius:'50%', background:'var(--gold-500)', display:'inline-block' }} />
            <span style={{ fontSize:'0.75rem', fontWeight:500, color:'var(--gold-400)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Syro-Malabar Catholic Church • Diocese of Irinjalakuda</span>
          </div>
          <h1 className="font-heading animate-fade-in-up" style={{ fontSize:'clamp(2.5rem,7vw,5rem)', fontWeight:700, color:'#fff', marginBottom:'1rem', lineHeight:1.1 }}>
            Infant Jesus<br/><span style={{ color:'var(--gold-400)' }}>Church</span>
          </h1>
          <p className="animate-fade-in-up-delay" style={{ fontSize:'clamp(1rem,2vw,1.25rem)', color:'#d1d5db', marginBottom:'2.5rem', fontWeight:300 }}>
            Kallettumkara, Thrissur – Diocese of Irinjalakuda
          </p>
          <div className="animate-fade-in-up-delay" style={{ display:'flex', justifyContent:'center', gap:'1.5rem' }}>
            {[
              { href:'https://www.youtube.com/@infantjesuschurchkallettumkara', color:'#ef4444', path:'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
              { href:'https://www.instagram.com/kallettumkara_church', color:'#ec4899', path:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              { href:'https://www.facebook.com/groups/ijckallettumkara/', color:'#3b82f6', path:'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
            ].map(({ href, color, path }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                style={{ width:48, height:48, borderRadius:'0.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af', transition:'all 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = color; (e.currentTarget as HTMLElement).style.borderColor = `${color}50`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d={path}/></svg>
              </a>
            ))}
          </div>
        </div>
        <div className="animate-bounce" style={{ position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)' }}>
          <svg width="24" height="24" fill="none" stroke="rgba(212,175,55,0.6)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
        </div>
      </section>

      {/* ANNOUNCEMENTS MARQUEE */}
      {announcements.length > 0 && (
        <section style={{ background:'linear-gradient(to right, var(--gold-700), var(--gold-600), var(--gold-700))', padding:'0.75rem 0', overflow:'hidden', position:'relative' }}>
          <div className="marquee-track" style={{ display:'flex', gap:'4rem', whiteSpace:'nowrap' }}>
            {[...announcements, ...announcements].map((a, i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', color:'var(--maroon-950)', fontWeight:600, fontSize:'0.875rem' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--maroon-700)', display:'inline-block' }} />
                {a.title}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PARISH OVERVIEW */}
      <section style={{ padding:'6rem 1rem', background:'rgba(26,20,16,0.3)' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'4rem', alignItems:'center' }}>
            <div className="animate-fade-in-up">
              <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Our Sacred Community</p>
              <h2 className="font-heading" style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'#fff', marginBottom:'2rem' }}>A Legacy of Faith</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', color:'#d1d5db', lineHeight:1.8, fontSize:'1.125rem', fontWeight:300 }}>
                <p>Infant Jesus Church, Kallettumkara, is a beacon of Syro-Malabar Catholicism. Our parish is not just a building, but a living body of Christ, serving as a sanctuary for thousands of faithful.</p>
                <p>From the solemnity of the Holy Qurbana to the vibrant community life in our family units, the parish is the heart of our spiritual journey.</p>
              </div>
              <div style={{ marginTop:'3rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
                {[['800+','Families'],['IJK','Diocese']].map(([val, label]) => (
                  <div key={label} className="glass-card" style={{ padding:'2rem', borderRadius:'1rem', textAlign:'center', border:'1px solid rgba(212,175,55,0.1)' }}>
                    <span className="font-heading" style={{ display:'block', fontSize:'2.25rem', fontWeight:700, color:'var(--gold-500)', marginBottom:'0.5rem' }}>{val}</span>
                    <span style={{ fontSize:'0.75rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position:'relative', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 25px 50px rgba(0,0,0,0.5)', border:'1px solid rgba(212,175,55,0.2)', aspectRatio:'4/5' }}>
              <img src="/uploads/ASH09186.JPG" alt="Infant Jesus Church" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 1s' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, var(--church-bg), transparent, transparent)', opacity:0.6 }} />
            </div>
          </div>
        </div>
      </section>

      {/* PARISH LEADERSHIP */}
      {council.length > 0 && (
        <section id="council" style={{ padding:'5rem 1rem', background:'var(--church-bg)' }}>
          <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Serving the Parish</p>
              <h2 className="font-heading" style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'#fff' }}>Parish Leadership</h2>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'2rem' }}>
              {council.map(p => (
                <div key={p._id} className="priest-card glass-card" style={{ borderRadius:'1rem', padding:'2rem', textAlign:'center', cursor:'pointer' }}
                  onClick={() => setSelectedPriest(p)}>
                  <div style={{ position:'relative', width:112, height:112, margin:'0 auto 1.25rem' }}>
                    <div className="animate-pulse" style={{ position:'absolute', inset:-4, borderRadius:'50%', background:'linear-gradient(135deg,rgba(212,175,55,0.2),rgba(212,175,55,0.1))' }} />
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} style={{ width:112, height:112, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(212,175,55,0.3)', position:'relative', zIndex:1 }} />
                      : <div style={{ width:112, height:112, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color:'var(--maroon-950)', fontWeight:700, position:'relative', zIndex:1 }} className="font-heading">{p.name[0]}</div>
                    }
                  </div>
                  <h3 className="font-heading" style={{ fontSize:'1.125rem', fontWeight:600, color:'#fff', marginBottom:'0.25rem' }}>{p.name}</h3>
                  <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', marginBottom:'0.75rem' }}>{p.role}</p>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem', padding:'0.25rem 0.75rem', borderRadius:'9999px', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.1)', fontSize:'0.75rem', color:'#9ca3af' }}>View Profile</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUSTEES */}
      {trustees.length > 0 && (
        <section id="trustees" style={{ padding:'5rem 1rem', background:'rgba(15,10,7,0.5)' }}>
          <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Our Trustees</p>
              <h2 className="font-heading" style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'#fff' }}>Parish Trustees</h2>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'2rem' }}>
              {trustees.map(t => (
                <div key={t._id} className="trustee-card glass-card" style={{ borderRadius:'1rem', padding:'2rem', textAlign:'center', cursor:'pointer' }}
                  onClick={() => setSelectedTrustee(t)}>
                  <div style={{ width:96, height:96, margin:'0 auto 1.25rem' }}>
                    {t.image_url
                      ? <img src={t.image_url} alt={t.name} style={{ width:96, height:96, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(212,175,55,0.2)' }} />
                      : <div style={{ width:96, height:96, borderRadius:'50%', background:'var(--church-accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', color:'var(--gold-400)', fontWeight:700 }} className="font-heading">{t.name[0]}</div>
                    }
                  </div>
                  <h3 className="font-heading" style={{ fontSize:'1.125rem', fontWeight:600, color:'#fff', marginBottom:'0.25rem' }}>{t.name}</h3>
                  <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', marginBottom:'0.75rem' }}>{t.role}</p>
                  <div style={{ display:'inline-flex', padding:'0.25rem 0.75rem', borderRadius:'9999px', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.1)', fontSize:'0.75rem', color:'#9ca3af' }}>View Profile</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TODAY'S MASS */}
      <section id="mass-widget" style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Holy Qurbana</p>
            <h2 className="font-heading" style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'#fff' }}>Today's Holy Mass – {today}</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'2rem' }}>
            <div className="glass-card" style={{ borderRadius:'1rem', padding:'2rem' }}>
              <h3 className="font-heading" style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--gold-400)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ width:40, height:40, borderRadius:'0.5rem', background:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>☀</span>
                {today === 'Sunday' ? 'Sunday Schedule' : today}
              </h3>
              {dailyMasses.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  {dailyMasses.map(m => (
                    <div key={m._id} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem', borderRadius:'0.75rem', background:'rgba(15,10,7,0.5)' }}>
                      <span className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--gold-400)', minWidth:80 }}>{m.time}</span>
                      <div><p style={{ color:'#fff', fontWeight:500 }}>{m.description}</p><p style={{ fontSize:'0.75rem', color:'#6b7280' }}>{m.category}</p></div>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color:'#9ca3af', fontStyle:'italic' }}>No Mass scheduled today.</p>}
            </div>
            <div className="glass-card" style={{ borderRadius:'1rem', padding:'2rem', border:'1px solid rgba(212,175,55,0.1)' }}>
              <h3 className="font-heading" style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--gold-400)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ width:40, height:40, borderRadius:'0.5rem', background:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>📅</span>
                Weekly Mass Schedule
              </h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {[['Mon, Tue, Thu, Fri, Sat','06:00 AM\n07:00 AM'],['Wednesday','06:00 AM\n05:00 PM']].map(([day, times]) => (
                  <div key={day} style={{ padding:'1rem', borderRadius:'0.75rem', background:'rgba(42,31,21,0.3)', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--gold-500)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{day}</span>
                      <span className="font-heading" style={{ fontSize:'1.125rem', fontWeight:700, color:'#fff', textAlign:'right', whiteSpace:'pre' }}>{times}</span>
                    </div>
                  </div>
                ))}
                <div style={{ padding:'1rem', borderRadius:'0.75rem', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.2)' }}>
                  <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--gold-500)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:'0.75rem' }}>Sunday Services</span>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                    {sundayMasses.map(m => (
                      <div key={m._id}>
                        <span className="font-heading" style={{ fontSize:'1.125rem', fontWeight:700, color:'#fff', display:'block' }}>{m.time}</span>
                        <span style={{ fontSize:'0.625rem', color:'#6b7280', textTransform:'uppercase' }}>{m.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section id="announcements" style={{ padding:'5rem 1rem', background:'rgba(26,20,16,0.5)' }}>
          <div style={{ maxWidth:'72rem', margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Stay Informed</p>
              <h2 className="font-heading" style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'#fff' }}>Parish Announcements</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.5rem' }}>
              {announcements.map(a => (
                <div key={a._id} className="glass-card" style={{ borderRadius:'1rem', padding:'1.5rem', transition:'transform 0.3s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--gold-500)', display:'inline-block' }} />
                    <span style={{ fontSize:'0.75rem', color:'var(--gold-600)' }}>{new Date(a.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                  </div>
                  <h3 className="font-heading" style={{ fontSize:'1.125rem', fontWeight:600, color:'#fff', marginBottom:'0.5rem' }}>{a.title}</h3>
                  <p style={{ fontSize:'0.875rem', color:'#9ca3af', lineHeight:1.6 }}>{a.content}</p>
                  {a.pdf_url && <a href={a.pdf_url} style={{ display:'inline-block', marginTop:'1rem', color:'var(--gold-400)', fontSize:'0.875rem', fontWeight:500, textDecoration:'none' }}>Download PDF →</a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRAYER REQUEST */}
      <section id="prayer" style={{ padding:'5rem 1rem' }}>
        <PrayerForm />
      </section>

      {/* Modals */}
      {selectedPriest && <PriestModal priest={selectedPriest} onClose={() => setSelectedPriest(null)} />}
      {selectedTrustee && <TrusteeModal trustee={selectedTrustee} onClose={() => setSelectedTrustee(null)} />}
    </>
  );
}
