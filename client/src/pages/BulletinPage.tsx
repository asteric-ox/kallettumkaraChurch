import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import api from '../services/api';
import type { Announcement, MassTiming } from '../types';

export default function BulletinPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [specials, setSpecials] = useState<MassTiming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/announcements').then(r => setAnnouncements(r.data)),
      api.get('/mass-timings/special').then(r => setSpecials(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff > 0) return `In ${diff} days`;
    return null;
  };

  return (
    <>
      <PageHero subtitle="Parish Updates" title="Parish Bulletin" desc="Stay up-to-date with all parish news and events" />

      <section style={{ padding: '5rem 1rem', background: 'var(--church-bg)' }}>
        <div style={{ maxWidth: '52rem', margin: '0 auto' }}>

          {loading && (
            <div style={{ textAlign: 'center', color: 'var(--gold-400)', padding: '3rem' }}>Loading...</div>
          )}

          {/* ── Special Masses Section ── */}
          {!loading && specials.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff' }}>Special Masses</h2>
                <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-400)', border: '1px solid rgba(212,175,55,0.3)', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>UPCOMING</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {specials.map(s => {
                  const countdown = daysUntil(s.special_date);
                  return (
                    <div key={s._id} style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)', position: 'relative', overflow: 'hidden' }}>
                      {/* Gold glow strip */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold-600), var(--gold-400), var(--gold-600))' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <h3 className="font-heading" style={{ color: 'var(--gold-400)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                            ✨ {s.special_occasion}
                          </h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                              🕐 <strong style={{ color: '#fff' }}>{s.time}</strong>
                            </span>
                            <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                              📅 <strong style={{ color: '#fff' }}>
                                {s.special_date
                                  ? new Date(s.special_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                  : s.day}
                              </strong>
                            </span>
                          </div>
                          {s.description && s.description !== s.special_occasion && (
                            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.6rem', lineHeight: 1.6 }}>{s.description}</p>
                          )}
                        </div>
                        {countdown && (
                          <div style={{ textAlign: 'center', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0.75rem', padding: '0.5rem 1rem', flexShrink: 0 }}>
                            <p style={{ color: 'var(--gold-400)', fontWeight: 800, fontSize: '1rem' }}>{countdown}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Regular Announcements ── */}
          {!loading && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📢</span>
                <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff' }}>Announcements</h2>
              </div>

              {announcements.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', borderRadius: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📋</div>
                  <h3 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Weekly Bulletin</h3>
                  <p style={{ color: '#9ca3af', lineHeight: 1.6, marginBottom: '2rem' }}>
                    The parish bulletin is distributed every Sunday after Mass. It contains important announcements, prayer requests, and upcoming events. Contact the parish office for a copy.
                  </p>
                  <a href="tel:+917909151122" className="btn-gold">Contact Parish Office</a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {announcements.map(a => (
                    <div key={a._id} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', borderLeft: '3px solid var(--gold-600)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{a.title}</h3>
                          <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.7 }}>{a.content}</p>
                          {a.pdf_url && (
                            <a href={a.pdf_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.75rem', color: 'var(--gold-400)', fontSize: '0.8rem', textDecoration: 'underline' }}>
                              📄 View PDF
                            </a>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: '#4b5563', marginTop: '0.25rem' }}>
                            Until {new Date(a.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}