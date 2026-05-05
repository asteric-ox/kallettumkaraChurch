import { useState } from 'react';
import PageHero from '../components/PageHero';
import api from '../services/api';

export default function HallBookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    event_type: '',
    booking_date: '',
    time_slot: 'Full Day',
    additional_info: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/hall-bookings', formData);
      setMessage({ type: 'success', text: 'Your booking request has been submitted successfully! We will contact you soon.' });
      setFormData({
        name: '',
        phone: '',
        email: '',
        event_type: '',
        booking_date: '',
        time_slot: 'Full Day',
        additional_info: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit request. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const getSlotTiming = (slot: string) => {
    switch(slot) {
      case 'Morning': return '8:00 AM – 1:00 PM';
      case 'Afternoon': return '2:00 PM – 9:00 PM';
      case 'Full Day': return '8:00 AM – 9:00 PM';
      default: return '';
    }
  };

  return (
    <>
      <PageHero title="Parish Hall Booking" subtitle="Reserve our sacred space for your celebrations" />
      
      <section style={{ padding: '5rem 1rem', background: 'var(--church-bg)' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            
            {/* Info Section */}
            <div className="animate-fade-in-up">
              <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>Hall Facilities</h2>
              <p style={{ color: '#d1d5db', lineHeight: 1.8, marginBottom: '2rem' }}>
                Our Parish Hall is available for weddings, baptism receptions, meetings, and other community gatherings. 
                We offer a spacious environment with modern amenities.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
                {[
                  { icon: '👥', label: 'Capacity: 500+ Guests' },
                  { icon: '❄️', label: 'Fully Ventilated' },
                  { icon: '🍽️', label: 'Dining Area & Kitchen' },
                  { icon: '🅿️', label: 'Spacious Parking' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(212,175,55,0.05)', borderRadius: '0.75rem', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <span style={{ color: 'var(--gold-400)', fontWeight: 500 }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Timing Display */}
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(212,175,55,0.2)' }}>
                <h4 className="font-heading" style={{ color: 'var(--gold-400)', marginBottom: '1rem' }}>Booking Slots</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['Morning', 'Afternoon', 'Full Day'].map(slot => (
                    <div key={slot} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{slot}</span>
                      <span style={{ color: '#9ca3af' }}>{getSlotTiming(slot)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="glass-card animate-fade-in-up-delay" style={{ padding: '2.5rem', borderRadius: '1.5rem' }}>
              <h3 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--gold-400)', marginBottom: '2rem' }}>Booking Request</h3>
              
              {message && (
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  marginBottom: '1.5rem', 
                  background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: message.type === 'success' ? '#4ade80' : '#f87171',
                  border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  fontSize: '0.875rem'
                }}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Name</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Phone</label>
                    <input 
                      type="tel" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email (Optional)</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Event Type</label>
                  <select 
                    required
                    value={formData.event_type}
                    onChange={e => setFormData({...formData, event_type: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                  >
                    <option value="" style={{ background: '#1a1410' }}>Select Event</option>
                    <option value="Wedding" style={{ background: '#1a1410' }}>Wedding Reception</option>
                    <option value="Baptism" style={{ background: '#1a1410' }}>Baptism Reception</option>
                    <option value="Funeral" style={{ background: '#1a1410' }}>Funeral Service</option>
                    <option value="Meeting" style={{ background: '#1a1410' }}>Community Meeting</option>
                    <option value="Other" style={{ background: '#1a1410' }}>Other</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Date</label>
                    <input 
                      type="date" required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.booking_date}
                      onChange={e => setFormData({...formData, booking_date: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Slot</label>
                    <select 
                      value={formData.time_slot}
                      onChange={e => setFormData({...formData, time_slot: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff' }}
                    >
                      <option value="Full Day" style={{ background: '#1a1410' }}>Full Day</option>
                      <option value="Morning" style={{ background: '#1a1410' }}>Morning</option>
                      <option value="Afternoon" style={{ background: '#1a1410' }}>Afternoon</option>
                    </select>
                  </div>
                </div>

                {/* Selected Slot Preview */}
                {formData.time_slot && (
                  <div style={{ padding: '0.75rem', background: 'rgba(212,175,55,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(212,175,55,0.2)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--gold-400)', fontSize: '0.8rem', fontWeight: 600 }}>
                      Selected Timing: {getSlotTiming(formData.time_slot)}
                    </p>
                  </div>
                )}


                <div className="form-group">
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Additional Notes</label>
                  <textarea 
                    rows={3}
                    value={formData.additional_info}
                    onChange={e => setFormData({...formData, additional_info: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: '#fff', resize: 'none' }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-gold" 
                  style={{ marginTop: '1rem', padding: '1rem' }}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
