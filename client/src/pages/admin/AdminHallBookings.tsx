import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  event_type: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  time_slot: string;
  status: 'Pending' | 'Approved' | 'Declined';
  additional_info: string;
  created_at: string;
}

const STATUS_STYLE = {
  Pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)',  icon: '⏳' },
  Approved: { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.25)',   icon: '✅' },
  Declined: { color: '#f87171', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.25)',   icon: '❌' },
};

type FilterType = 'All' | 'Pending' | 'Approved' | 'Declined';

export default function AdminHallBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('All');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/hall-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'Approved' | 'Declined') => {
    setUpdating(id);
    try {
      await api.patch(`/hall-bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);
  const counts = {
    All: bookings.length,
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Approved: bookings.filter(b => b.status === 'Approved').length,
    Declined: bookings.filter(b => b.status === 'Declined').length,
  };

  if (loading) return <div style={{ color: 'var(--gold-400)', padding: '2rem' }}>Loading bookings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff' }}>Manage Hall Bookings</h2>
        <button onClick={fetchBookings} style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-400)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}>🔄 Refresh</button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['All', 'Pending', 'Approved', 'Declined'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              border: filter === f
                ? `1px solid ${f === 'All' ? 'rgba(212,175,55,0.5)' : STATUS_STYLE[f as keyof typeof STATUS_STYLE]?.border || 'rgba(212,175,55,0.5)'}`
                : '1px solid rgba(255,255,255,0.08)',
              background: filter === f
                ? (f === 'All' ? 'rgba(212,175,55,0.15)' : STATUS_STYLE[f as keyof typeof STATUS_STYLE]?.bg || 'rgba(212,175,55,0.15)')
                : 'rgba(255,255,255,0.03)',
              color: filter === f
                ? (f === 'All' ? 'var(--gold-400)' : STATUS_STYLE[f as keyof typeof STATUS_STYLE]?.color || 'var(--gold-400)')
                : '#6b7280',
              transition: 'all 0.2s',
            }}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {(['Pending', 'Approved', 'Declined'] as const).map(s => (
          <div key={s} style={{ padding: '1.25rem', borderRadius: '1rem', background: STATUS_STYLE[s].bg, border: `1px solid ${STATUS_STYLE[s].border}`, textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: STATUS_STYLE[s].color }}>{counts[s]}</p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>{STATUS_STYLE[s].icon} {s}</p>
          </div>
        ))}
      </div>

      {/* Booking Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>No {filter !== 'All' ? filter.toLowerCase() : ''} booking requests found.</p>
        ) : (
          filtered.map(booking => {
            const st = STATUS_STYLE[booking.status];
            return (
              <div
                key={booking._id}
                style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: `1px solid ${booking.status === 'Pending' ? 'rgba(245,158,11,0.2)' : 'rgba(212,175,55,0.1)'}`, transition: 'border-color 0.3s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#fff', fontWeight: 600 }}>{booking.name}</h3>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontWeight: 700 }}>
                        {st.icon} {booking.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>📞 {booking.phone} {booking.email ? `| 📧 ${booking.email}` : ''}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--gold-400)', fontWeight: 600 }}>{new Date(booking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.start_time} – {booking.end_time} ({booking.time_slot})</p>
                    {booking.created_at && <p style={{ fontSize: '0.65rem', color: '#4b5563', marginTop: '0.25rem' }}>Submitted: {new Date(booking.created_at).toLocaleDateString()}</p>}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}><strong>Event:</strong> {booking.event_type}</p>
                  {booking.additional_info && <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}><strong>Notes:</strong> {booking.additional_info}</p>}
                </div>

                {booking.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button
                      onClick={() => updateStatus(booking._id, 'Approved')}
                      disabled={updating === booking._id}
                      className="btn-gold"
                      style={{ flex: 1, padding: '0.6rem', opacity: updating === booking._id ? 0.6 : 1 }}
                    >
                      {updating === booking._id ? '...' : '✅ Approve'}
                    </button>
                    <button
                      onClick={() => updateStatus(booking._id, 'Declined')}
                      disabled={updating === booking._id}
                      style={{ flex: 1, padding: '0.6rem', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.5rem', cursor: 'pointer', opacity: updating === booking._id ? 0.6 : 1, fontWeight: 600 }}
                    >
                      {updating === booking._id ? '...' : '❌ Decline'}
                    </button>
                  </div>
                )}

                {booking.status !== 'Pending' && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.75rem', background: st.bg, border: `1px solid ${st.border}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{st.icon}</span>
                    <span style={{ color: st.color, fontSize: '0.85rem', fontWeight: 600 }}>
                      This booking has been {booking.status.toLowerCase()}.
                    </span>
                    <button
                      onClick={() => updateStatus(booking._id, booking.status === 'Approved' ? 'Declined' : 'Approved')}
                      style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${st.border}`, color: st.color, borderRadius: '0.5rem', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Undo
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
