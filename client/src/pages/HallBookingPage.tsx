import { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import api from '../services/api';

interface Booking {
  _id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  event_type: string;
}

export default function HallBookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    event_type: '',
    booking_date: '',
    time_slot: 'Full Day',
    start_time: '08:00 AM',
    end_time: '10:00 PM',
    additional_info: ''
  });
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch approved bookings to show availability
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/hall-bookings/public'); // We'll create this route
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching availability');
      }
    };
    fetchBookings();
  }, []);

  const handleSlotChange = (slot: string) => {
    let start = '08:00 AM';
    let end = '10:00 PM';
    
    if (slot === 'Morning') {
      start = '08:00 AM';
      end = '12:00 PM';
    } else if (slot === 'Afternoon') {
      start = '01:00 PM';
      end = '06:00 PM';
    }
    
    setFormData({ ...formData, time_slot: slot, start_time: start, end_time: end });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/hall-bookings', formData);
      setMessage({ type: 'success', text: 'Booking request submitted! We will contact you shortly.' });
      setFormData({
        name: '', phone: '', email: '', event_type: '',
        booking_date: '', time_slot: 'Full Day',
        start_time: '08:00 AM', end_time: '10:00 PM', additional_info: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error submitting request. Please check if the date is available.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero title="Parish Hall Booking" subtitle="Check availability and reserve your date" />
      
      <section style={{ padding: '5rem 1rem', background: 'var(--church-bg)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            
            {/* Availability Calendar/List */}
            <div className="animate-fade-in-up">
              <h2 className="font-heading" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--gold-400)' }}>📅</span> Current Bookings
              </h2>
              <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Check the list below to see if your preferred date is already reserved.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {bookings.length > 0 ? (
                  bookings.map(b => (
                    <div key={b._id} className="glass-card" style={{ padding: '1.25rem', borderRadius: '1rem', borderLeft: '4px solid var(--gold-600)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.125rem' }}>
                            {new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <p style={{ color: 'var(--gold-500)', fontSize: '0.875rem' }}>{b.start_time} - {b.end_time}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-400)', fontWeight: 600 }}>Booked</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px dashed rgba(212,175,55,0.2)' }}>
                    <p style={{ color: '#6b7280' }}>No upcoming bookings found. All dates are available!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="glass-card animate-fade-in-up-delay" style={{ padding: '2.5rem', borderRadius: '1.5rem' }}>
              <h3 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--gold-400)', marginBottom: '2rem' }}>Reserve the Hall</h3>
              
              {message && (
                <div style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#4ade80' : '#f87171', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="label-small">Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-dark" />
                  </div>
                  <div className="form-group">
                    <label className="label-small">Phone Number</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-dark" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label-small">Event Type</label>
                  <select required value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} className="input-dark">
                    <option value="">Select Event</option>
                    <option value="Wedding">Wedding Reception</option>
                    <option value="Baptism">Baptism Reception</option>
                    <option value="Meeting">Community Meeting</option>
                    <option value="Other">Other Celebration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label-small">Booking Date</label>
                  <input type="date" required value={formData.booking_date} onChange={e => setFormData({...formData, booking_date: e.target.value})} className="input-dark" />
                </div>

                <div className="form-group">
                  <label className="label-small">Booking Slot</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Full Day', 'Morning', 'Afternoon', 'Custom'].map(slot => (
                      <button key={slot} type="button" 
                        onClick={() => handleSlotChange(slot)}
                        style={{ 
                          flex: 1, padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer',
                          background: formData.time_slot === slot ? 'var(--gold-600)' : 'rgba(255,255,255,0.05)',
                          color: formData.time_slot === slot ? '#000' : '#fff',
                          border: '1px solid rgba(212,175,55,0.2)',
                          transition: 'all 0.3s'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="label-small">Start Time</label>
                    <input type="text" placeholder="e.g. 09:00 AM" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="input-dark" />
                  </div>
                  <div className="form-group">
                    <label className="label-small">End Time</label>
                    <input type="text" placeholder="e.g. 05:00 PM" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="input-dark" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-gold" style={{ marginTop: '1rem', padding: '1rem' }}>
                  {loading ? 'Processing...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .label-small { display: block; color: #9ca3af; fontSize: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .input-dark { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; color: #fff; font-size: 0.9rem; }
        .input-dark:focus { border-color: var(--gold-500); outline: none; background: rgba(255,255,255,0.08); }
      `}</style>
    </>
  );
}
