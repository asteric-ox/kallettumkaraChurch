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
  admin_remarks?: string;
}

const HALL_OPTIONS: {
  id: HallType;
  name: string;
  amount: number;
  capacity: string;
  desc: string;
  icon: string;
  badge?: string;
}[] = [
  {
    id: 'Main Parish Hall',
    name: 'Main Parish Hall',
    amount: 10000,
    capacity: '500+ Capacity',
    desc: 'Grand auditorium with elevated stage, natural airflow, and spacious dining facility.',
    icon: '🏛️',
    badge: 'Grand Venue',
  },
  {
    id: 'Mini Parish Hall',
    name: 'Mini Parish Hall',
    amount: 5000,
    capacity: '100+ Capacity',
    desc: 'Compact hall ideal for baptisms, meetings, intimate family celebrations, and seminars.',
    icon: '🏢',
    badge: 'Intimate',
  },
  {
    id: 'Both (Main & Mini Hall)',
    name: 'Both Halls Combined',
    amount: 15000,
    capacity: '600+ Capacity',
    desc: 'Complete venue privilege: Main auditorium and mini hall together for grand weddings.',
    icon: '🌟',
    badge: 'Complete Access',
  },
];

const STATUS_CONFIG = {
  Pending: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    icon: '⏳',
    label: 'Pending Review',
    desc: 'Your request has been received. The church administration will review and send a confirmation email shortly.',
  },
  Approved: {
    color: '#4ade80',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.3)',
    icon: '✅',
    label: 'Approved & Confirmed',
    desc: 'Congratulations! Your hall booking has been approved. A confirmation email has been dispatched.',
  },
  Declined: {
    color: '#f87171',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
    icon: '❌',
    label: 'Declined',
    desc: 'Unfortunately your request could not be confirmed. An email update has been sent. Please contact the parish office for assistance.',
  },
};

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
    hall_type: 'Main Parish Hall' as HallType,
    additional_info: '',
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

  const currentHallConfig = HALL_OPTIONS.find(h => h.id === formData.hall_type) || HALL_OPTIONS[0];

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
        setStatusPolling(false); // stop polling once resolved
      }
      fetchBookings(); // refresh calendar too
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

  // Poll booking status every 15s while pending
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
    setFormData(prev => ({ ...prev, time_slot: slot, start_time: start, end_time: end }));
  };

  const handleDateClick = (date: Date, booking: Booking | null) => {
    if (booking) {
      setSelectedBooking(booking);
    } else if (settings.hall_booking_enabled) {
      const formatted = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, booking_date: formatted }));
      const formEl = document.getElementById('booking-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    setSubmittedBooking(null);
    try {
      const res = await api.post('/hall-bookings', formData);
      const newBooking: Booking = res.data.booking;
      setSubmittedBooking(newBooking);
      setStatusPolling(true);
      setMessage({
        type: 'success',
        text: `Booking request for ${formData.hall_type} (₹${currentHallConfig.amount.toLocaleString('en-IN')}) submitted successfully! We will email you once reviewed.`,
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        event_type: '',
        booking_date: '',
        time_slot: 'Full Day',
        start_time: '08:00 AM',
        end_time: '10:00 PM',
        hall_type: 'Main Parish Hall',
        additional_info: '',
      });
      fetchBookings();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to submit booking request.',
      });
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
      <PageHero title="Parish Hall Booking" subtitle="Infant Jesus Church, Kallettumkara" />

      <section style={{ padding: '5rem 1rem', background: 'var(--church-bg)' }}>
        <div style={{ maxWidth: '82rem', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
            
            {/* Left Side: Venue Details & Pricing Showcase */}
            <div className="animate-fade-in-up">
              <span style={{ color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 700 }}>
                Venue & Facilities
              </span>
              <h2 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0 1.5rem 0' }}>
                Parish Halls & Pricing
              </h2>
              <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '2rem' }}>
                Host your auspicious events in an atmosphere of sacred grace and modern comfort. Choose between our grand Main Parish Hall, the compact Mini Parish Hall, or reserve both together.
              </p>

              {/* Hall Pricing Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {HALL_OPTIONS.map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setFormData(prev => ({ ...prev, hall_type: opt.id }))}
                    className="glass-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '1.25rem',
                      border: formData.hall_type === opt.id ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.08)',
                      background: formData.hall_type === opt.id ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                    }}
                  >
                    <span style={{ fontSize: '2.2rem' }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>{opt.name}</h4>
                        <span style={{ fontSize: '0.65rem', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-400)', border: '1px solid rgba(212,175,55,0.3)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                          {opt.badge}
                        </span>
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>{opt.desc}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>👥 {opt.capacity}</p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '95px' }}>
                      <p style={{ color: 'var(--gold-400)', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                        ₹{opt.amount.toLocaleString('en-IN')}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.7rem', margin: 0 }}>per booking</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Facility Highlights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {[
                  { icon: '🏛️', title: 'Grand Stage', desc: 'Decor & Program Ready' },
                  { icon: '🍽️', title: 'Dining Area', desc: 'Spacious Kitchen Space' },
                  { icon: '❄️', title: 'Well Ventilated', desc: 'Airy & High Ceiling' },
                  { icon: '🅿️', title: 'Ample Parking', desc: 'Secure Church Grounds' }
                ].map(item => (
                  <div key={item.title} className="glass-card" style={{ padding: '1.25rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.35rem' }}>{item.icon}</span>
                    <h4 style={{ color: 'var(--gold-400)', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{item.title}</h4>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '0.2rem 0 0 0' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Booking Form */}
            <div id="booking-form" className="glass-card animate-fade-in-up-delay" style={{ padding: '2.5rem', borderRadius: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {settings.hall_booking_enabled ? (
                <>
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h3 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--gold-400)', margin: '0 0 0.5rem 0' }}>
                      Reserve Your Date
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                      Fill in your details below. You will receive an email upon admin review.
                    </p>
                  </div>

                  {message && (
                    <div style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '0.75rem',
                      marginBottom: '1.75rem',
                      background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: message.type === 'success' ? '#4ade80' : '#f87171',
                      border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                    }}>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Hall Selector Pills */}
                    <div className="form-group">
                      <label className="label-small">Select Hall Option *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
                        {HALL_OPTIONS.map(opt => {
                          const isSelected = formData.hall_type === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, hall_type: opt.id }))}
                              style={{
                                padding: '0.75rem 0.5rem',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: isSelected ? 'var(--gold-600)' : 'rgba(255,255,255,0.04)',
                                color: isSelected ? '#000' : '#e5e7eb',
                                border: isSelected ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.2s',
                              }}
                            >
                              <span style={{ fontSize: '1.25rem', display: 'block' }}>{opt.icon}</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginTop: '0.25rem' }}>
                                {opt.name}
                              </span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#1a1410' : 'var(--gold-400)', display: 'block', marginTop: '0.2rem' }}>
                                ₹{opt.amount.toLocaleString('en-IN')}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Phone */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="label-small">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="input-premium"
                        />
                      </div>
                      <div className="form-group">
                        <label className="label-small">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="input-premium"
                        />
                      </div>
                    </div>

                    {/* Email Input (Admin Only Visibility Highlight) */}
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label className="label-small" style={{ margin: 0 }}>Email Address (For Updates & Confirmation) *</label>
                        <span style={{ fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          🔒 Confidential (Admin only)
                        </span>
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="input-premium"
                      />
                      <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0.35rem 0 0 0' }}>
                        We will send booking acceptance/rejection notifications to this email address. It will not be shown publicly.
                      </p>
                    </div>

                    {/* Event Type & Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="label-small">Event Type *</label>
                        <select
                          required
                          value={formData.event_type}
                          onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                          className="input-premium"
                        >
                          <option value="" style={{ background: '#1a1410' }}>Select Event</option>
                          <option value="Wedding" style={{ background: '#1a1410' }}>Wedding</option>
                          <option value="Wedding Reception" style={{ background: '#1a1410' }}>Wedding Reception</option>
                          <option value="Baptism" style={{ background: '#1a1410' }}>Baptism</option>
                          <option value="Holy Communion" style={{ background: '#1a1410' }}>Holy Communion</option>
                          <option value="Memorial / Funeral" style={{ background: '#1a1410' }}>Memorial / Funeral</option>
                          <option value="Meeting / Seminar" style={{ background: '#1a1410' }}>Meeting / Seminar</option>
                          <option value="Other" style={{ background: '#1a1410' }}>Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="label-small">Event Date *</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.booking_date}
                          onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                          className="input-premium"
                        />
                      </div>
                    </div>

                    {/* Slot */}
                    <div className="form-group">
                      <label className="label-small">Time Slot *</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['Full Day', 'Morning', 'Afternoon'].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleSlotChange(slot)}
                            style={{
                              flex: 1,
                              padding: '0.6rem',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              background: formData.time_slot === slot ? 'var(--gold-600)' : 'rgba(255,255,255,0.05)',
                              color: formData.time_slot === slot ? '#000' : '#fff',
                              border: '1px solid rgba(212,175,55,0.2)',
                              fontWeight: formData.time_slot === slot ? 700 : 500,
                              fontSize: '0.85rem',
                            }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Start Time & End Time */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="label-small">Start Time *</label>
                        <TimeInput
                          className="input-premium"
                          value={formData.start_time}
                          onChange={v => setFormData({ ...formData, start_time: v })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="label-small">End Time *</label>
                        <TimeInput
                          className="input-premium"
                          value={formData.end_time}
                          onChange={v => setFormData({ ...formData, end_time: v })}
                          required
                        />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="form-group">
                      <label className="label-small">Additional Notes / Special Requests (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Estimated guest count, sound requirements, catering setup..."
                        value={formData.additional_info}
                        onChange={e => setFormData({ ...formData, additional_info: e.target.value })}
                        className="input-premium"
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* Fee Summary Banner */}
                    <div style={{
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '0.75rem',
                      padding: '0.9rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div>
                        <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase' }}>Selected Venue Fee</p>
                        <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '2px 0 0 0' }}>
                          {currentHallConfig.name}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--gold-400)', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                          ₹{currentHallConfig.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{ marginTop: '0.5rem', padding: '1.1rem', fontSize: '1rem', fontWeight: 700 }}
                    >
                      {loading ? 'Submitting Request...' : `Submit Booking Request • ₹${currentHallConfig.amount.toLocaleString('en-IN')}`}
                    </button>
                  </form>

                  {/* ── Booking Status Tracker ── */}
                  {submittedBooking && (() => {
                    const cfg = STATUS_CONFIG[submittedBooking.status];
                    return (
                      <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '1.25rem', background: cfg.bg, border: `1px solid ${cfg.border}`, transition: 'all 0.5s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{cfg.icon}</span>
                          <div>
                            <p style={{ color: cfg.color, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Request Status</p>
                            <p style={{ color: cfg.color, fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{cfg.label}</p>
                          </div>
                          {submittedBooking.status === 'Pending' && (
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                              <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>Live Tracking</span>
                            </div>
                          )}
                        </div>
                        <p style={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: 1.6, margin: '0.5rem 0' }}>{cfg.desc}</p>
                        
                        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase', margin: 0 }}>Hall</p>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', margin: '2px 0 0 0' }}>{submittedBooking.hall_type || 'Main Parish Hall'}</p>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase', margin: 0 }}>Fee Amount</p>
                            <p style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                              ₹{submittedBooking.amount ? submittedBooking.amount.toLocaleString('en-IN') : '10,000'}
                            </p>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase', margin: 0 }}>Date</p>
                            <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', margin: '2px 0 0 0' }}>{new Date(submittedBooking.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>

                        {submittedBooking.status === 'Pending' && (
                          <button
                            onClick={() => fetchSubmittedStatus(submittedBooking._id)}
                            style={{ marginTop: '1rem', width: '100%', padding: '0.6rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            🔄 Check Status Now
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                  <h3 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--gold-400)', marginBottom: '1rem' }}>Bookings Paused</h3>
                  <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>Hall bookings are currently closed.</p>
                  <a href="tel:+917909151122" className="btn-gold" style={{ display: 'inline-block', marginTop: '2rem', padding: '0.75rem 2rem' }}>Call Office</a>
                </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', margin: 0 }}>Availability Calendar</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ color: '#6b7280' }}>Current Time:</span>
                  <span style={{ color: 'var(--gold-400)', fontWeight: 600, background: 'rgba(212,175,55,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="premium-nav-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg></button>
                <span style={{ color: 'var(--gold-400)', fontWeight: 800, fontSize: '1.25rem', minWidth: '160px', textAlign: 'center', textTransform: 'uppercase' }}>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="premium-nav-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1.25rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ textAlign: 'center', color: 'var(--gold-500)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', paddingBottom: '1.5rem' }}>
                  {day}
                </div>
              ))}
              {days.map((date, idx) => {
                const booking = date ? getBookingForDate(date) : undefined;
                const active = date ? isToday(date) : false;
                const calStyle = getCalendarStyle(booking, active, !!date);
                const dateColor = booking?.status === 'Approved' ? '#4ade80' : booking?.status === 'Pending' ? '#f59e0b' : active ? 'var(--gold-300)' : '#4b5563';
                const badgeColor = booking?.status === 'Approved'
                  ? { bg: 'rgba(34,197,94,0.2)', border: 'rgba(34,197,94,0.3)', text: '#4ade80', label: '✓ Reserved' }
                  : { bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', label: '⏳ Pending' };

                return (
                  <div
                    key={idx}
                    onClick={() => date && handleDateClick(date, booking || null)}
                    style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', padding: '1rem', borderRadius: '1.5rem', ...calStyle, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: date ? 'pointer' : 'initial', transform: active ? 'scale(1.02)' : 'none', boxShadow: active ? '0 10px 20px rgba(212,175,55,0.1)' : 'none' }}
                  >
                    {date && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: dateColor, fontWeight: 800 }}>{date.getDate()}</span>
                          {active && <span style={{ fontSize: '0.5rem', background: 'var(--gold-600)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>TODAY</span>}
                        </div>
                        {booking && (
                          <div className="animate-fade-in" style={{ background: badgeColor.bg, padding: '0.6rem', borderRadius: '0.75rem', marginTop: 'auto', border: `1px solid ${badgeColor.border}` }}>
                            <p style={{ color: badgeColor.text, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>{badgeColor.label}</p>
                            <p style={{ color: '#d1d5db', fontSize: '0.65rem', margin: '0.2rem 0 0 0', fontWeight: 600 }}>{booking.event_type}</p>
                            {booking.hall_type && (
                              <p style={{ color: 'var(--gold-400)', fontSize: '0.6rem', margin: '0.1rem 0 0 0', fontWeight: 500 }}>
                                {booking.hall_type === 'Both (Main & Mini Hall)' ? '🌟 Both Halls' : booking.hall_type === 'Mini Parish Hall' ? '🏢 Mini Hall' : '🏛️ Main Hall'}
                              </p>
                            )}
                            <p style={{ color: '#9ca3af', fontSize: '0.55rem', margin: '0.1rem 0 0 0' }}>{booking.start_time} - {booking.end_time}</p>
                          </div>
                        )}
                        {!booking && (
                          <div style={{ marginTop: 'auto', opacity: 0 }} className="hover-show">
                            <span style={{ fontSize: '0.65rem', color: 'var(--gold-500)', fontWeight: 600 }}>+ REQUEST</span>
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

      {/* Booking Detail Modal (Privacy Enforced - No Email/Phone) */}
      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setSelectedBooking(null)}>
          <div style={{ background: '#1a1410', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '2rem', padding: '3rem', maxWidth: '500px', width: '100%', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#6b7280', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setSelectedBooking(null)}>✕</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{selectedBooking.status === 'Approved' ? '✅' : selectedBooking.status === 'Declined' ? '❌' : '⏳'}</div>
              <h3 className="font-heading" style={{ fontSize: '2rem', color: 'var(--gold-400)', marginBottom: '1rem' }}>Booking Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', margin: 0 }}>Event Type</p>
                  <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600, margin: '4px 0 0 0' }}>{selectedBooking.event_type}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1rem' }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', margin: 0 }}>Reserved Hall</p>
                    <p style={{ color: '#fff', fontWeight: 600, margin: '4px 0 0 0' }}>{selectedBooking.hall_type || 'Main Parish Hall'}</p>
                  </div>
                  <div style={{ background: STATUS_CONFIG[selectedBooking.status].bg, padding: '1.25rem', borderRadius: '1rem', border: `1px solid ${STATUS_CONFIG[selectedBooking.status].border}` }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', margin: 0 }}>Status</p>
                    <p style={{ color: STATUS_CONFIG[selectedBooking.status].color, fontWeight: 700, margin: '4px 0 0 0' }}>{selectedBooking.status}</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '1rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', margin: 0 }}>Event Date</p>
                  <p style={{ color: '#fff', fontWeight: 600, margin: '4px 0 0 0' }}>
                    {new Date(selectedBooking.booking_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p style={{ color: 'var(--gold-400)', fontSize: '0.75rem', textTransform: 'uppercase', margin: 0 }}>Reserved Timing</p>
                  <p style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 700, margin: '4px 0 0 0' }}>
                    {selectedBooking.start_time && selectedBooking.end_time
                      ? `${selectedBooking.start_time} - ${selectedBooking.end_time}`
                      : selectedBooking.time_slot || 'Full Day'}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="btn-gold" style={{ marginTop: '2.5rem', width: '100%', padding: '1rem' }}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .label-small { display: block; color: #9ca3af; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.6rem; letter-spacing: 0.05em; font-weight: 600; }
        .input-premium { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 1rem; color: #fff; font-size: 0.95rem; box-sizing: border-box; }
        .input-premium:focus { outline: none; border-color: var(--gold-400); box-shadow: 0 0 0 3px rgba(212,175,55,0.15); }
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
