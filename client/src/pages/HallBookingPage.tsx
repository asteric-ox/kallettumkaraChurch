import { useState, useEffect, useCallback } from 'react';
import PageHero from '../components/PageHero';
import TimeInput from '../components/TimeInput';
import api from '../services/api';

type HallType = 'Main Parish Hall' | 'Mini Parish Hall' | 'Both (Main & Mini Hall)';

interface Booking {
  _id: string;
  name?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'Pending' | 'Approved' | 'Declined';
  event_type: string;
  time_slot: string;
  hall_type?: HallType;
  amount?: number;
}

const STATUS_CONFIG = {
  Pending: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    icon: '⏳',
    label: 'Pending Review',
    desc: 'Your request has been received. The admin will review and confirm shortly.',
  },
  Approved: {
    color: '#4ade80',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.3)',
    icon: '✅',
    label: 'Approved',
    desc: 'Congratulations! Your hall booking has been approved.',
  },
  Declined: {
    color: '#f87171',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
    icon: '❌',
    label: 'Declined',
    desc: 'Unfortunately your request was declined. Please call the office for details.',
  },
};

export default function HallBookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    hall_type: 'Main Parish Hall' as HallType,
    event_type: '',
    booking_date: '',
    time_slot: 'Full Day',
    start_time: '08:00 AM',
    end_time: '10:00 PM',
    additional_info: ''
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ hall_booking_enabled: true });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Submitted booking tracking
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [statusPolling, setStatusPolling] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchBookings = useCallback(async () => {
    try {
      const response = await api.get('/hall-bookings/public');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching availability');
    }
  }, []);

  const fetchSubmittedStatus = useCallback(async (id: string) => {
    try {
      const res = await api.get(`/hall-bookings/status/${id}`);
      setSubmittedBooking(res.data);
      if (res.data.status !== 'Pending') {
        setStatusPolling(false);
      }
      fetchBookings();
    } catch (err) {
      console.error('Error polling booking status');
    }
  }, [fetchBookings]);

  useEffect(() => {
    fetchBookings();
    fetchSettings();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [fetchBookings]);

  useEffect(() => {
    if (!statusPolling || !submittedBooking) return;
    const interval = setInterval(() => {
      fetchSubmittedStatus(submittedBooking._id);
    }, 15000);
    return () => clearInterval(interval);
  }, [statusPolling, submittedBooking, fetchSubmittedStatus]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Error fetching settings');
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
    setSubmittedBooking(null);
    try {
      const res = await api.post('/hall-bookings', formData);
      const newBooking: Booking = res.data.booking;
      setSubmittedBooking(newBooking);
      setStatusPolling(true);
      setMessage({ type: 'success', text: 'Booking request submitted successfully!' });
      setFormData({
        name: '',
        phone: '',
        email: '',
        hall_type: 'Main Parish Hall',
        event_type: '',
        booking_date: '',
        time_slot: 'Full Day',
        start_time: '08:00 AM',
        end_time: '10:00 PM',
        additional_info: ''
      });
      fetchBookings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to submit request.' });
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

  const getBookingForDate = (date: Date) => {
    return bookings.find(b => {
      const bDate = new Date(b.booking_date);
      return bDate.getDate() === date.getDate() &&
             bDate.getMonth() === date.getMonth() &&
             bDate.getFullYear() === date.getFullYear();
    });
  };

  const getCalendarStyle = (booking: Booking | undefined, active: boolean, hasDate: boolean) => {
    if (!hasDate) return { background: 'transparent', border: 'none' };
    if (booking?.status === 'Approved') return {
      background: 'rgba(34,197,94,0.08)',
      border: '1px solid rgba(34,197,94,0.4)',
    };
    if (booking?.status === 'Pending') return {
      background: 'rgba(245,158,11,0.08)',
      border: '1px solid rgba(245,158,11,0.35)',
    };
    if (active) return {
      background: 'rgba(212,175,55,0.15)',
      border: '1px solid var(--gold-500)',
    };
    return {
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
    };
  };

  return (
    <>
      <PageHero title="Parish Hall Booking" subtitle="Experience elegance and tradition" />

      <section style={{ padding: '5rem 1rem', background: 'var(--church-bg)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            {/* Left Side: Original Hall Details Preserved */}
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
                    
                    {/* Email and Hall Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="label-small">Email (Private to Admin)</label>
                        <input type="email" required placeholder="yourname@gmail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-premium" />
                      </div>
                      <div className="form-group">
                        <label className="label-small">Select Hall</label>
                        <select required value={formData.hall_type} onChange={e => setFormData({...formData, hall_type: e.target.value as any})} className="input-premium">
                          <option value="Main Parish Hall" style={{background:'#1a1410'}}>Main Parish Hall (₹10,000)</option>
                          <option value="Mini Parish Hall" style={{background:'#1a1410'}}>Mini Parish Hall (₹5,000)</option>
                          <option value="Both (Main & Mini Hall)" style={{background:'#1a1410'}}>Both Halls (₹15,000)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group"><label className="label-small">Event Type</label><select required value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})} className="input-premium"><option value="" style={{background:'#1a1410'}}>Select Event</option><option value="Wedding" style={{background:'#1a1410'}}>Wedding</option><option value="Baptism" style={{background:'#1a1410'}}>Baptism</option><option value="Meeting" style={{background:'#1a1410'}}>Meeting</option></select></div>
                      <div className="form-group"><label className="label-small">Date</label><input type="date" required value={formData.booking_date} onChange={e => setFormData({...formData, booking_date: e.target.value})} className="input-premium" /></div>
                    </div>
                    <div className="form-group"><label className="label-small">Slot</label><div style={{ display: 'flex', gap: '0.5rem' }}>{['Full Day', 'Morning', 'Afternoon'].map(slot => (<button key={slot} type="button" onClick={() => handleSlotChange(slot)} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.5rem', cursor: 'pointer', background: formData.time_slot === slot ? 'var(--gold-600)' : 'rgba(255,255,255,0.05)', color: formData.time_slot === slot ? '#000' : '#fff', border: '1px solid rgba(212,175,55,0.2)' }}>{slot}</button>))}</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group"><label className="label-small">Start Time</label><TimeInput className="input-premium" value={formData.start_time} onChange={v => setFormData({...formData, start_time: v})} required /></div>
                      <div className="form-group"><label className="label-small">End Time</label><TimeInput className="input-premium" value={formData.end_time} onChange={v => setFormData({...formData, end_time: v})} required /></div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-gold" style={{ marginTop: '1rem', padding: '1.25rem' }}>{loading ? 'Submitting...' : 'Request Booking'}</button>
                  </form>

                  {/* ── Booking Status Tracker ── */}
                  {submittedBooking && (() => {
                    const cfg = STATUS_CONFIG[submittedBooking.status];
                    return (
                      <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '1.25rem', background: cfg.bg, border: `1px solid ${cfg.border}`, transition: 'all 0.5s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{cfg.icon}</span>
                          <div>
                            <p style={{ color: cfg.color, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Request Status</p>
                            <p style={{ color: cfg.color, fontSize: '1.1rem', fontWeight: 800 }}>{cfg.label}</p>
                          </div>
                          {submittedBooking.status === 'Pending' && (
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                              <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>Live</span>
                            </div>
                          )}
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>{cfg.desc}</p>
                        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase' }}>Event</p>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{submittedBooking.event_type}</p>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase' }}>Date</p>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{new Date(submittedBooking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        {submittedBooking.status === 'Pending' && (
                          <button
                            onClick={() => fetchSubmittedStatus(submittedBooking._id)}
                            style={{ marginTop: '1rem', width: '100%', padding: '0.6rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            🔄 Refresh Status
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div><h3 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--gold-400)', marginBottom: '1rem' }}>Bookings Paused</h3><p style={{ color: '#9ca3af', lineHeight: 1.6 }}>Hall bookings are currently closed.</p><a href="tel:+917909151122" className="btn-gold" style={{ display: 'inline-block', marginTop: '2rem', padding: '0.75rem 2rem' }}>Call Office</a></div>
              )}
            </div>
          </div>

          {/* Calendar Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {[
              { color: '#4ade80', border: 'rgba(34,197,94,0.4)', label: 'Approved / Reserved' },
              { color: '#f59e0b', border: 'rgba(245,158,11,0.4)', label: 'Pending Confirmation' },
              { color: 'var(--gold-400)', border: 'rgba(212,175,55,0.4)', label: 'Today' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, border: `1.5px solid ${item.border}`, background: `${item.color}22`, display: 'inline-block' }}></span>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{item.label}</span>
              </div>
            ))}
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
                const booking = date ? getBookingForDate(date) : undefined;
                const active = date ? isToday(date) : false;
                const calStyle = getCalendarStyle(booking, active, !!date);
                const dateColor = booking?.status === 'Approved' ? '#4ade80' : booking?.status === 'Pending' ? '#f59e0b' : active ? 'var(--gold-300)' : '#4b5563';
                const badgeColor = booking?.status === 'Approved' ? { bg: 'rgba(34,197,94,0.2)', border: 'rgba(34,197,94,0.3)', text: '#4ade80', label: '✓ Reserved' } : { bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', label: '⏳ Pending' };

                return (
                  <div
                    key={idx}
                    onClick={() => date && handleDateClick(date, booking || null)}
                    style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '1.5rem', ...calStyle, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: date ? 'pointer' : 'initial', transform: active ? 'scale(1.02)' : 'none', boxShadow: active ? '0 10px 20px rgba(212,175,55,0.1)' : 'none' }}
                  >
                    {date && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: dateColor, fontWeight: 800 }}>{date.getDate()}</span>
                          {active && <span style={{ fontSize: '0.5rem', background: 'var(--gold-600)', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>TODAY</span>}
                        </div>
                        {booking && (
                          <div className="animate-fade-in" style={{ background: badgeColor.bg, padding: '0.75rem', borderRadius: '0.75rem', marginTop: 'auto', border: `1px solid ${badgeColor.border}` }}>
                            <p style={{ color: badgeColor.text, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>{badgeColor.label}</p>
                            <p style={{ color: '#d1d5db', fontSize: '0.65rem', marginTop: '0.2rem', fontWeight: 600 }}>{booking.event_type}</p>
                            <p style={{ color: '#9ca3af', fontSize: '0.6rem' }}>{booking.start_time} - {booking.end_time}</p>
                          </div>
                        )}
                        {!booking && (
                          <div style={{ marginTop: 'auto', opacity: 0 }} className="hover-show">
                            <span style={{ fontSize: '0.65rem', color: 'var(--gold-500)' }}>+ REQUEST</span>
                          </div>
                        )}
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
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{selectedBooking.status === 'Approved' ? '✅' : selectedBooking.status === 'Declined' ? '❌' : '⏳'}</div>
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
                  <div style={{ background: STATUS_CONFIG[selectedBooking.status].bg, padding: '1.25rem', borderRadius: '1rem', border: `1px solid ${STATUS_CONFIG[selectedBooking.status].border}` }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</p>
                    <p style={{ color: STATUS_CONFIG[selectedBooking.status].color, fontWeight: 600 }}>{selectedBooking.status}</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p style={{ color: 'var(--gold-400)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Reserved Time</p>
                  <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
                    {selectedBooking.start_time && selectedBooking.end_time
                      ? `${selectedBooking.start_time} - ${selectedBooking.end_time}`
                      : (selectedBooking as any).time_slot || 'Full Day'}
                  </p>
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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </>
  );
}
