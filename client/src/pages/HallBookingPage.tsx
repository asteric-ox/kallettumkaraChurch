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
  const [settings, setSettings] = useState({ hall_booking_enabled: true });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchBookings();
    fetchSettings();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Error fetching settings');
    }
  };

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

  const handleDateClick = (date: Date, booking: Booking | null) => {
    if (booking) {
      setSelectedBooking(booking);
    } else if (settings.hall_booking_enabled) {
      const formatted = date.toISOString().split('T')[0];
      setFormData({ ...formData, booking_date: formatted });
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <>
      <PageHero title="Parish Hall Booking" subtitle="Experience elegance and tradition" />
      
      <section style={{ padding: '5rem 1rem', background: 'var(--church-bg)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            {/* Left Side: Hall Details */}
            <div className="animate-fade-in-up">
              <h2 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1.5rem' }}>The Parish Hall</h2>
              <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                A perfect venue for your most cherished moments. Our hall combines traditional Syro-Malabar architecture with modern comforts.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[{ icon: '🏛️', title: 'Legacy', desc: 'Historic & Grand' }, { icon: '👥', title: '500+', desc: 'Seating Capacity' }, { icon: '❄️', title: 'Airy', desc: 'Natural Ventilation' }, { icon: '🅿️', title: 'Parking', desc: 'Secure Space' }].map(item => (
                  <div key={item.title} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{item.icon}</span>
                    <h4 style={{ color: 'var(--gold-400)', fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</h4>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Booking Form */}
            <div id="booking-form" className="glass-card animate-fade-in-up-delay" style={{ padding: '3rem', borderRadius: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {settings.hall_booking_enabled ? (
                <>
                  <h3 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--gold-400)', marginBottom: '2rem' }}>Reserve Your Date</h3>
                  {message && <div style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: message.type === 'success' ? '#4ade80' : '#f87171', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>{message.text}</div>}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group"><label className="label-small">Full Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-premium" /></div>
                      <div className="form-group"><label className="label-small">Phone</label><input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-premium" /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group"><label className="label-small">Event Type</label><select required value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} className="input-premium"><option value="" style={{background:'#1a1410'}}>Select Event</option><option value="Wedding" style={{background:'#1a1410'}}>Wedding</option><option value="Baptism" style={{background:'#1a1410'}}>Baptism</option><option value="Meeting" style={{background:'#1a1410'}}>Meeting</option></select></div>
                      <div className="form-group"><label className="label-small">Date</label><input type="date" required value={formData.booking_date} onChange={e => setFormData({...formData, booking_date: e.target.value})} className="input-premium" /></div>
                    </div>
                    <div className="form-group"><label className="label-small">Slot</label><div style={{ display: 'flex', gap: '0.5rem' }}>{['Full Day', 'Morning', 'Afternoon'].map(slot => (<button key={slot} type="button" onClick={() => handleSlotChange(slot)} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', cursor: 'pointer', background: formData.time_slot === slot ? 'var(--gold-600)' : 'rgba(255,255,255,0.05)', color: formData.time_slot === slot ? '#000' : '#fff', border: '1px solid rgba(212,175,55,0.2)' }}>{slot}</button>))}</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group"><label className="label-small">Start Time</label><input type="text" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="input-premium" /></div>
                      <div className="form-group"><label className="label-small">End Time</label><input type="text" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="input-premium" /></div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-gold" style={{ marginTop: '1rem', padding: '1.25rem' }}>{loading ? 'Submitting...' : 'Request Booking'}</button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div><h3 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--gold-400)', marginBottom: '1rem' }}>Bookings Paused</h3><p style={{ color: '#9ca3af', lineHeight: 1.6 }}>Hall bookings are currently closed.</p><a href="tel:+917909151122" className="btn-gold" style={{ display: 'inline-block', marginTop: '2rem', padding: '0.75rem 2rem' }}>Call Office</a></div>
              )}
            </div>
          </div>

          {/* BOTTOM SECTION: Full Month Calendar */}
          <div className="animate-fade-in-up" style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem', borderRadius: '3rem', border: '1px solid rgba(212,175,55,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
              <div><h2 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff' }}>Availability Calendar</h2><div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}><span style={{ color: '#6b7280' }}>Current Time:</span><span style={{ color: 'var(--gold-400)', fontWeight: 600, background: 'rgba(212,175,55,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{currentTime.toLocaleTimeString()}</span></div></div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="premium-nav-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg></button>
                <span style={{ color: 'var(--gold-400)', fontWeight: 800, fontSize: '1.25rem', minWidth: '160px', textAlign: 'center', textTransform: 'uppercase' }}>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="premium-nav-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1.25rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} style={{ textAlign: 'center', color: 'var(--gold-500)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', paddingBottom: '1.5rem' }}>{day}</div>))}
              {days.map((date, idx) => {
                const booking = date ? bookings.find(b => {
                  const bDate = new Date(b.booking_date);
                  return bDate.getDate() === date.getDate() && bDate.getMonth() === date.getMonth() && bDate.getFullYear() === date.getFullYear();
                }) : null;
                const active = date && isToday(date);
                return (
                  <div key={idx} onClick={() => date && handleDateClick(date, booking || null)} style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '1.5rem', background: booking ? 'rgba(212,175,55,0.1)' : active ? 'rgba(212,175,55,0.15)' : date ? 'rgba(255,255,255,0.02)' : 'transparent', border: booking ? '1px solid rgba(212,175,55,0.4)' : active ? '1px solid var(--gold-500)' : date ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: date ? 'pointer' : 'initial', transform: active ? 'scale(1.02)' : 'none', boxShadow: active ? '0 10px 20px rgba(212,175,55,0.1)' : 'none' }}>
                    {date && (
                      <><div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color: booking ? 'var(--gold-400)' : active ? 'var(--gold-300)' : '#4b5563', fontWeight: 800 }}>{date.getDate()}</span>{active && <span style={{ fontSize:'0.5rem', background:'var(--gold-600)', color:'#000', padding:'2px 6px', borderRadius:'4px' }}>TODAY</span>}</div>
                        {booking && (<div className="animate-fade-in" style={{ background: 'rgba(212,175,55,0.2)', padding: '0.75rem', borderRadius: '0.75rem', marginTop: 'auto', border: '1px solid rgba(212,175,55,0.3)' }}><p style={{ color: 'var(--gold-400)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{booking.event_type}</p><p style={{ color: '#9ca3af', fontSize: '0.65rem' }}>{booking.start_time} - {booking.end_time}</p></div>)}
                        {!booking && date && <div style={{ marginTop:'auto', opacity:0 }} className="hover-show"><span style={{ fontSize:'0.65rem', color:'var(--gold-500)' }}>+ REQUEST</span></div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setSelectedBooking(null)}>
          <div style={{ background: '#1a1410', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '2rem', padding: '3rem', maxWidth: '500px', width: '100%', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#6b7280', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setSelectedBooking(null)}>✕</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📜</div>
              <h3 className="font-heading" style={{ fontSize: '2rem', color: 'var(--gold-400)', marginBottom: '1rem' }}>Booking Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>Event Type</p>
                  <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600 }}>{selectedBooking.event_type}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1rem' }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</p>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{new Date(selectedBooking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1rem' }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</p>
                    <p style={{ color: '#4ade80', fontWeight: 600 }}>Confirmed</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p style={{ color: 'var(--gold-400)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Reserved Time</p>
                  <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{selectedBooking.start_time} - {selectedBooking.end_time}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="btn-gold" style={{ marginTop: '2.5rem', width: '100%', padding: '1rem' }}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .label-small { display: block; color: #9ca3af; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.6rem; letter-spacing: 0.05em; }
        .input-premium { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 1rem; color: #fff; font-size: 0.95rem; }
        .premium-nav-btn { background: transparent; border: 1px solid rgba(212,175,55,0.3); color: var(--gold-400); width: 44px; height: 44px; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.4s; }
        .premium-nav-btn:hover { background: var(--gold-600); color: #000; transform: translateY(-2px); }
        .hover-show { opacity: 0; transition: opacity 0.3s; }
        [style*="cursor: pointer"]:hover .hover-show { opacity: 1; }
        [style*="cursor: pointer"]:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(212,175,55,0.4) !important; }
      `}</style>
    </>
  );
}
