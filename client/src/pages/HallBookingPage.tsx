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
    name: '', phone: '', email: '', event_type: '',
    booking_date: '', time_slot: 'Full Day',
    start_time: '08:00 AM', end_time: '10:00 PM', additional_info: ''
  });
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/hall-bookings/public');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching availability');
    }
  };

  const handleSlotChange = (slot: string) => {
    let start = '08:00 AM', end = '10:00 PM';
    if (slot === 'Morning') { start = '08:00 AM'; end = '12:00 PM'; }
    else if (slot === 'Afternoon') { start = '01:00 PM'; end = '06:00 PM'; }
    setFormData({ ...formData, time_slot: slot, start_time: start, end_time: end });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/hall-bookings', formData);
      setMessage({ type: 'success', text: 'Booking request submitted successfully!' });
      setFormData({
        name: '', phone: '', email: '', event_type: '',
        booking_date: '', time_slot: 'Full Day',
        start_time: '08:00 AM', end_time: '10:00 PM', additional_info: ''
      });
      fetchBookings();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit request.' });
    } finally {
      setLoading(false);
    }
  };

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));

  const isBooked = (date: Date) => {
    return bookings.some(b => {
      const bDate = new Date(b.booking_date);
      return bDate.getDate() === date.getDate() && 
             bDate.getMonth() === date.getMonth() && 
             bDate.getFullYear() === date.getFullYear();
    });
  };

  return (
    <>
      <PageHero title="Parish Hall Booking" subtitle="Experience elegance and tradition" />
      
      <section style={{ padding: '5rem 1rem', background: 'var(--church-bg)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          
          {/* TOP SECTION: Details (Left) and Form (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            
            {/* Left Side: Hall Details */}
            <div className="animate-fade-in-up">
              <h2 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1.5rem' }}>The Parish Hall</h2>
              <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                A perfect venue for your most cherished moments. Our hall combines traditional Syro-Malabar architecture with modern comforts to make your event truly special.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  { icon: '🏛️', title: 'Legacy', desc: 'Historic & Grand' },
                  { icon: '👥', title: '500+', desc: 'Seating Capacity' },
                  { icon: '❄️', title: 'Airy', desc: 'Natural Ventilation' },
                  { icon: '🅿️', title: 'Parking', desc: 'Secure Space' }
                ].map(item => (
                  <div key={item.title} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{item.icon}</span>
                    <h4 style={{ color: 'var(--gold-400)', fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</h4>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Booking Form */}
            <div className="glass-card animate-fade-in-up-delay" style={{ padding: '3rem', borderRadius: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <h3 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--gold-400)', marginBottom: '2rem' }}>Reserve Your Date</h3>
              
              {message && (
                <div style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#4ade80' : '#f87171', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="label-small">Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-premium" />
                  </div>
                  <div className="form-group">
                    <label className="label-small">Phone</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-premium" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="label-small">Event Type</label>
                    <select required value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} className="input-premium">
                      <option value="" style={{background:'#1a1410'}}>Select Event</option>
                      <option value="Wedding" style={{background:'#1a1410'}}>Wedding</option>
                      <option value="Baptism" style={{background:'#1a1410'}}>Baptism</option>
                      <option value="Meeting" style={{background:'#1a1410'}}>Meeting</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label-small">Date</label>
                    <input type="date" required value={formData.booking_date} onChange={e => setFormData({...formData, booking_date: e.target.value})} className="input-premium" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label-small">Slot</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Full Day', 'Morning', 'Afternoon'].map(slot => (
                      <button key={slot} type="button" onClick={() => handleSlotChange(slot)} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', cursor: 'pointer', background: formData.time_slot === slot ? 'var(--gold-600)' : 'rgba(255,255,255,0.05)', color: formData.time_slot === slot ? '#000' : '#fff', border: '1px solid rgba(212,175,55,0.2)' }}>{slot}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="label-small">Start Time</label>
                    <input type="text" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="input-premium" />
                  </div>
                  <div className="form-group">
                    <label className="label-small">End Time</label>
                    <input type="text" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="input-premium" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-gold" style={{ marginTop: '1rem', padding: '1.25rem' }}>{loading ? 'Submitting...' : 'Request Booking'}</button>
              </form>
            </div>
          </div>

          {/* BOTTOM SECTION: Full Month Calendar */}
          <div className="animate-fade-in-up" style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem', borderRadius: '2.5rem', border: '1px solid rgba(212,175,55,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff' }}>Availability Calendar</h2>
                <p style={{ color: '#6b7280' }}>Dates highlighted in gold are already reserved.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="cal-btn">←</button>
                <span style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1.25rem', minWidth: '150px', textAlign: 'center' }}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="cal-btn">→</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ textAlign: 'center', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem', paddingBottom: '1rem' }}>{day}</div>
              ))}
              {days.map((date, idx) => (
                <div key={idx} style={{ 
                  aspectRatio: '1/1', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '1rem',
                  background: date && isBooked(date) ? 'rgba(212,175,55,0.2)' : date ? 'rgba(255,255,255,0.03)' : 'transparent',
                  border: date && isBooked(date) ? '1px solid var(--gold-500)' : '1px solid transparent',
                  position: 'relative',
                  transition: 'all 0.3s'
                }}>
                  {date && (
                    <>
                      <span style={{ color: isBooked(date) ? 'var(--gold-400)' : '#9ca3af', fontWeight: isBooked(date) ? 700 : 400 }}>{date.getDate()}</span>
                      {isBooked(date) && <span style={{ fontSize: '0.6rem', color: 'var(--gold-500)', marginTop: '4px', fontWeight: 700 }}>RESERVED</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <style>{`
        .label-small { display: block; color: #9ca3af; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.6rem; letter-spacing: 0.05em; }
        .input-premium { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 1rem; color: #fff; font-size: 0.95rem; transition: all 0.3s; }
        .input-premium:focus { border-color: var(--gold-500); outline: none; background: rgba(255,255,255,0.08); box-shadow: 0 0 20px rgba(212,175,55,0.1); }
        .cal-btn { background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); color: var(--gold-400); width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; alignItems: center; justifyContent: center; transition: all 0.3s; }
        .cal-btn:hover { background: var(--gold-600); color: #000; }
      `}</style>
    </>
  );
}
