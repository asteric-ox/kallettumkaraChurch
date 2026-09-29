import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

interface PrayerRequest {
  _id: string;
  name: string;
  email: string;
  intention: string;
  createdAt: string;
}

type SortKey = 'newest' | 'oldest';

export default function AdminPrayerIntentions() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prayer-requests');
      setPrayers(res.data);
    } catch {
      notify('Failed to load prayer intentions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const del = async (id: string) => {
    if (!confirm('Remove this prayer intention?')) return;
    setDeleting(id);
    try {
      await api.delete(`/prayer-requests/${id}`);
      setPrayers(prev => prev.filter(p => p._id !== id));
      notify('✅ Prayer intention removed.');
    } catch {
      notify('❌ Failed to delete.');
    } finally {
      setDeleting(null);
    }
  };

  const clearAll = async () => {
    if (!confirm(`Clear ALL ${prayers.length} prayer intentions? This cannot be undone.`)) return;
    try {
      await api.delete('/prayer-requests');
      setPrayers([]);
      notify('✅ All prayer intentions cleared.');
    } catch {
      notify('❌ Failed to clear.');
    }
  };

  const filtered = useMemo(() => {
    let list = [...prayers];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.intention.toLowerCase().includes(q)
      );
    }
    if (sort === 'oldest') list.reverse();
    return list;
  }, [prayers, search, sort]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    if (diffD < 7) return `${diffD}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const todayCount = prayers.filter(p => {
    const d = new Date(p.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const weekCount = prayers.filter(p => {
    const diffD = (Date.now() - new Date(p.createdAt).getTime()) / 86400000;
    return diffD <= 7;
  }).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
            🙏 Prayer Intentions
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>View and manage submitted prayer requests from the faithful.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={load} style={{ padding: '0.5rem 1rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-400)', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
            🔄 Refresh
          </button>
          {prayers.length > 0 && (
            <button onClick={clearAll} style={{ padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.startsWith('✅') ? '#6ee7b7' : '#f87171', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {msg}
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Intentions', value: prayers.length, icon: '🙏', color: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.2)' },
          { label: 'This Week', value: weekCount, icon: '📅', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
          { label: 'Today', value: todayCount, icon: '⏰', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '1.25rem', borderRadius: '1rem', background: s.bg, border: `1px solid ${s.border}`, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Sort Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '0.9rem', pointerEvents: 'none' }}>🔍</span>
          <input
            className="form-input"
            placeholder="Search by name, email or intention…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['newest', 'oldest'] as SortKey[]).map(s => (
            <button key={s} onClick={() => setSort(s)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: sort === s ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)', color: sort === s ? 'var(--gold-400)' : '#6b7280', border: sort === s ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', textTransform: 'capitalize' }}>
              {s === 'newest' ? '↓ Newest' : '↑ Oldest'}
            </button>
          ))}
        </div>
        {search && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.75rem', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '9999px', fontSize: '0.75rem', color: '#60a5fa' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(212,175,55,0.2)', borderTop: '3px solid var(--gold-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
          <p style={{ fontSize: '1.1rem', color: '#4b5563' }}>{search ? 'No results found.' : 'No prayer intentions submitted yet.'}</p>
        </div>
      )}

      {/* Cards */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filtered.map((p, idx) => {
            const isExpanded = expanded === p._id;
            const isLong = p.intention.length > 160;
            return (
              <div
                key={p._id}
                style={{ padding: '1.25rem 1.5rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s', position: 'relative' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.2)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                {/* Row number */}
                <span style={{ position: 'absolute', top: '1.1rem', right: '1.25rem', fontSize: '0.65rem', color: '#4b5563', fontWeight: 700 }}>#{idx + 1}</span>

                <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(244,114,182,0.1))', border: '1px solid rgba(244,114,182,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#f472b6', flexShrink: 0 }}>
                    {p.name !== 'Anonymous' ? p.name[0]?.toUpperCase() : '🙏'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + time */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{p.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{formatDate(p.createdAt)}</span>
                    </div>

                    {/* Email */}
                    {p.email && (
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.6rem' }}>
                        ✉️ {p.email}
                      </p>
                    )}

                    {/* Intention */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.875rem', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '3px solid rgba(244,114,182,0.4)' }}>
                      <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {isLong && !isExpanded ? `${p.intention.slice(0, 160)}…` : p.intention}
                      </p>
                      {isLong && (
                        <button onClick={() => setExpanded(isExpanded ? null : p._id)} style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.4rem', padding: 0 }}>
                          {isExpanded ? '▲ Show less' : '▼ Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.875rem' }}>
                  <button
                    onClick={() => del(p._id)}
                    disabled={deleting === p._id}
                    style={{ padding: '0.3rem 0.875rem', fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, opacity: deleting === p._id ? 0.5 : 1 }}
                  >
                    {deleting === p._id ? 'Removing…' : '🗑️ Remove'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
