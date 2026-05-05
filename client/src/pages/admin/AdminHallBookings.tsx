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
}

export default function AdminHallBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await api.patch(`/hall-bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div style={{ color: 'var(--gold-400)' }}>Loading bookings...</div>;

  return (
    <div>
      <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '2rem' }}>Manage Hall Bookings</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bookings.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No booking requests found.</p>
        ) : (
          bookings.map(booking => (
            <div key={booking._id} className="admin-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: '#fff', fontWeight: 600 }}>{booking.name}</h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '9999px',
                      background: booking.status === 'Approved' ? 'rgba(34,197,94,0.1)' : booking.status === 'Declined' ? 'rgba(239,68,68,0.1)' : 'rgba(212,175,55,0.1)',
                      color: booking.status === 'Approved' ? '#4ade80' : booking.status === 'Declined' ? '#f87171' : 'var(--gold-400)'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>📞 {booking.phone} {booking.email ? `| 📧 ${booking.email}` : ''}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--gold-400)', fontWeight: 600 }}>{new Date(booking.booking_date).toLocaleDateString()}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.start_time} - {booking.end_time} ({booking.time_slot})</p>
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}><strong>Event:</strong> {booking.event_type}</p>
                {booking.additional_info && <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}><strong>Notes:</strong> {booking.additional_info}</p>}
              </div>

              {booking.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button onClick={() => updateStatus(booking._id, 'Approved')} className="btn-gold" style={{ flex: 1, padding: '0.5rem' }}>Approve</button>
                  <button onClick={() => updateStatus(booking._id, 'Declined')} style={{ flex: 1, padding: '0.5rem', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', cursor: 'pointer' }}>Decline</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
