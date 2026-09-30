import { useState, useEffect } from 'react';
import api from '../../services/api';

type HallType = 'Main Parish Hall' | 'Mini Parish Hall' | 'Both (Main & Mini Hall)';

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
  hall_type?: HallType;
  amount?: number;
  status: 'Pending' | 'Approved' | 'Declined';
  additional_info?: string;
  admin_remarks?: string;
  email_sent?: boolean;
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
  const [hallFilter, setHallFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [resending, setResending] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Action Dialog State (for Remarks on Approve / Decline)
  const [dialogBooking, setDialogBooking] = useState<{
    booking: Booking;
    action: 'Approved' | 'Declined';
  } | null>(null);
  const [dialogRemarks, setDialogRemarks] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 6000);
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/hall-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings');
      showToast('error', 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const openActionDialog = (booking: Booking, action: 'Approved' | 'Declined') => {
    setDialogBooking({ booking, action });
    if (action === 'Declined') {
      setDialogRemarks('The hall is unavailable due to pre-scheduled church services, liturgical feast preparations, or prior reservations on this date.');
    } else {
      setDialogRemarks('');
    }
  };

  const confirmStatusUpdate = async () => {
    if (!dialogBooking) return;
    const { booking, action } = dialogBooking;
    setUpdating(booking._id);
    setDialogBooking(null);

    try {
      const res = await api.patch(`/hall-bookings/${booking._id}/status`, {
        status: action,
        admin_remarks: dialogRemarks.trim() || undefined,
      });

      const updatedBooking = res.data.booking;
      setBookings(prev => prev.map(b => b._id === booking._id ? updatedBooking : b));

      if (res.data.emailSent) {
        showToast(
          'success',
          `✅ Status updated to ${action}! Notification email successfully sent to ${booking.email} (${updatedBooking.hall_type || 'Hall'} • ₹${updatedBooking.amount?.toLocaleString('en-IN') || '10,000'}).`
        );
      } else {
        showToast(
          'success',
          `Booking updated to ${action}, but email could not be delivered. Please check recipient address.`
        );
      }
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setUpdating(null);
    }
  };

  const resendEmail = async (booking: Booking) => {
    setResending(booking._id);
    try {
      const res = await api.post(`/hall-bookings/${booking._id}/resend-email`);
      showToast('success', `✉️ ${res.data.message}`);
      setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, email_sent: true } : b));
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to resend email.');
    } finally {
      setResending(null);
    }
  };

  // Filtered & Searched bookings
  const filtered = bookings.filter(b => {
    // Status filter
    if (filter !== 'All' && b.status !== filter) return false;
    // Hall filter
    if (hallFilter !== 'All') {
      const bHall = b.hall_type || 'Main Parish Hall';
      if (bHall !== hallFilter) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name?.toLowerCase().includes(q);
      const matchPhone = b.phone?.includes(q);
      const matchEmail = b.email?.toLowerCase().includes(q);
      const matchEvent = b.event_type?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchEvent) return false;
    }
    return true;
  });

  const counts = {
    All: bookings.length,
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Approved: bookings.filter(b => b.status === 'Approved').length,
    Declined: bookings.filter(b => b.status === 'Declined').length,
  };

  if (loading) return <div style={{ color: 'var(--gold-400)', padding: '2rem' }}>Loading bookings...</div>;

  return (
    <div>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          background: toast.type === 'success' ? '#14532d' : '#7f1d1d',
          color: '#fff',
          border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          maxWidth: '450px',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.75rem', color: '#fff', margin: 0 }}>
            Parish Hall Bookings & Email Management
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
            Review booking requests, view applicant emails (admin only), and dispatch approval/rejection emails with hall pricing.
          </p>
        </div>
        <button
          onClick={fetchBookings}
          style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-400)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0.75rem', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          🔄 Refresh Bookings
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {(['Pending', 'Approved', 'Declined'] as const).map(s => (
          <div
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              background: STATUS_STYLE[s].bg,
              border: `1px solid ${STATUS_STYLE[s].border}`,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
          >
            <p style={{ fontSize: '2rem', fontWeight: 800, color: STATUS_STYLE[s].color, margin: 0 }}>{counts[s]}</p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', margin: '0.3rem 0 0 0', fontWeight: 600 }}>
              {STATUS_STYLE[s].icon} {s} Requests
            </p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Row 1: Search & Hall Filter */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="🔍 Search applicant name, email, phone, or event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                color: '#fff',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Hall Filter Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Hall:</span>
            <select
              value={hallFilter}
              onChange={e => setHallFilter(e.target.value)}
              style={{
                background: '#1a1410',
                color: 'var(--gold-400)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '0.75rem',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Halls</option>
              <option value="Main Parish Hall">🏛️ Main Parish Hall (₹10,000)</option>
              <option value="Mini Parish Hall">🏢 Mini Parish Hall (₹5,000)</option>
              <option value="Both (Main & Mini Hall)">🌟 Both Halls Combined (₹15,000)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem', marginRight: '0.5rem' }}>Status:</span>
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
      </div>

      {/* Booking Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(255,255,255,0.01)', borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#9ca3af', fontSize: '1rem', margin: 0 }}>No booking requests found matching your filter criteria.</p>
          </div>
        ) : (
          filtered.map(booking => {
            const st = STATUS_STYLE[booking.status];
            const hallName = booking.hall_type || 'Main Parish Hall';
            const hallFee = booking.amount || (hallName === 'Mini Parish Hall' ? 5000 : hallName === 'Both (Main & Mini Hall)' ? 15000 : 10000);

            return (
              <div
                key={booking._id}
                style={{
                  padding: '1.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '1.25rem',
                  border: `1px solid ${booking.status === 'Pending' ? 'rgba(245,158,11,0.25)' : 'rgba(212,175,55,0.15)'}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'border-color 0.3s',
                }}
              >
                {/* Header row: Applicant name, Status, Date & Timing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>{booking.name}</h3>
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontWeight: 700 }}>
                        {st.icon} {booking.status}
                      </span>
                      {booking.email_sent && (
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', fontWeight: 600 }}>
                          ✉️ Email Dispatched
                        </span>
                      )}
                    </div>

                    {/* Contact row with explicit Private Email for Admin */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      <a href={`tel:${booking.phone}`} style={{ fontSize: '0.85rem', color: '#9ca3af', textDecoration: 'none' }}>
                        📞 <strong>{booking.phone}</strong>
                      </a>
                      
                      {booking.email ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>🔒 Admin-Only Email:</span>
                          <a href={`mailto:${booking.email}`} style={{ fontSize: '0.85rem', color: 'var(--gold-300)', textDecoration: 'none', fontWeight: 600 }}>
                            {booking.email}
                          </a>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>⚠️ No email provided</span>
                      )}
                    </div>
                  </div>

                  {/* Right side: Event Date and Timing */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>
                      {new Date(booking.booking_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>
                      {booking.start_time} – {booking.end_time} ({booking.time_slot})
                    </p>
                    {booking.created_at && (
                      <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                        Submitted on {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details Banner: Selected Hall, Amount, Event Type */}
                <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.25)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reserved Hall</span>
                    <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: '2px 0 0 0' }}>
                      {hallName === 'Both (Main & Mini Hall)' ? '🌟 Both Halls Combined' : hallName === 'Mini Parish Hall' ? '🏢 Mini Parish Hall' : '🏛️ Main Parish Hall'}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hall Rent (In Email)</span>
                    <p style={{ color: 'var(--gold-400)', fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0 0' }}>
                      ₹{hallFee.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Type</span>
                    <p style={{ color: '#e5e7eb', fontSize: '0.9rem', fontWeight: 600, margin: '2px 0 0 0' }}>{booking.event_type}</p>
                  </div>
                </div>

                {/* User Notes */}
                {booking.additional_info && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', borderLeft: '3px solid rgba(212,175,55,0.3)' }}>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>
                      <strong style={{ color: '#d1d5db' }}>User Notes:</strong> {booking.additional_info}
                    </p>
                  </div>
                )}

                {/* Admin Remarks (if any) */}
                {booking.admin_remarks && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: booking.status === 'Approved' ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', borderRadius: '0.5rem', borderLeft: `3px solid ${booking.status === 'Approved' ? '#22c55e' : '#ef4444'}` }}>
                    <p style={{ fontSize: '0.8rem', color: '#d1d5db', margin: 0 }}>
                      <strong style={{ color: booking.status === 'Approved' ? '#4ade80' : '#f87171' }}>Admin Remarks / Reason:</strong> {booking.admin_remarks}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {booking.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => openActionDialog(booking, 'Approved')}
                        disabled={updating === booking._id}
                        className="btn-gold"
                        style={{ flex: 1, minWidth: '150px', padding: '0.75rem', fontWeight: 700, fontSize: '0.875rem' }}
                      >
                        {updating === booking._id ? 'Sending Confirmation Email...' : `✅ Approve & Send Email (₹${hallFee.toLocaleString('en-IN')})`}
                      </button>
                      <button
                        onClick={() => openActionDialog(booking, 'Declined')}
                        disabled={updating === booking._id}
                        style={{
                          flex: 1,
                          minWidth: '150px',
                          padding: '0.75rem',
                          background: 'rgba(239,68,68,0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239,68,68,0.35)',
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}
                      >
                        {updating === booking._id ? 'Processing...' : '❌ Decline with Reason'}
                      </button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{st.icon}</span>
                        <span style={{ color: st.color, fontSize: '0.85rem', fontWeight: 600 }}>
                          Booking has been {booking.status.toLowerCase()}.
                        </span>
                      </div>

                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => resendEmail(booking)}
                          disabled={resending === booking._id}
                          style={{
                            background: 'rgba(212,175,55,0.1)',
                            border: '1px solid rgba(212,175,55,0.3)',
                            color: 'var(--gold-400)',
                            borderRadius: '0.5rem',
                            padding: '0.4rem 0.8rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {resending === booking._id ? 'Sending...' : '✉️ Resend Email'}
                        </button>
                        <button
                          onClick={() => openActionDialog(booking, booking.status === 'Approved' ? 'Declined' : 'Approved')}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${st.border}`,
                            color: st.color,
                            borderRadius: '0.5rem',
                            padding: '0.4rem 0.8rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Change to {booking.status === 'Approved' ? 'Declined' : 'Approved'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Action Dialog (Remarks / Reason Modal) */}
      {dialogBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
          onClick={() => setDialogBooking(null)}
        >
          <div
            style={{
              background: '#1a1410',
              border: `1px solid ${dialogBooking.action === 'Approved' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
              borderRadius: '1.5rem',
              padding: '2.5rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>
                {dialogBooking.action === 'Approved' ? '✅' : '❌'}
              </span>
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                  {dialogBooking.action === 'Approved' ? 'Approve Booking & Send Email' : 'Decline Booking Request'}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                  Applicant: <strong>{dialogBooking.booking.name}</strong> ({dialogBooking.booking.email})
                </p>
              </div>
            </div>

            {/* Email Preview Notice */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', margin: 0, lineHeight: 1.5 }}>
                An automated email will be dispatched to <strong>{dialogBooking.booking.email}</strong> stating the hall fee of{' '}
                <strong style={{ color: 'var(--gold-400)' }}>
                  ₹{(dialogBooking.booking.amount || (dialogBooking.booking.hall_type === 'Mini Parish Hall' ? 5000 : dialogBooking.booking.hall_type === 'Both (Main & Mini Hall)' ? 15000 : 10000)).toLocaleString('en-IN')}
                </strong>{' '}
                for <strong>{dialogBooking.booking.hall_type || 'Main Parish Hall'}</strong>.
              </p>
            </div>

            {/* Admin Remarks Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#d1d5db', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {dialogBooking.action === 'Approved'
                  ? 'Office Instructions / Notes (Optional - included in email):'
                  : 'Reason for Declining (Included in email to applicant):'}
              </label>
              <textarea
                rows={3}
                value={dialogRemarks}
                onChange={e => setDialogRemarks(e.target.value)}
                placeholder={dialogBooking.action === 'Approved' ? 'E.g. Please submit advance payment at church office within 3 days.' : 'State the reason for declining...'}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDialogBooking(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#9ca3af',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 1.25rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusUpdate}
                style={{
                  background: dialogBooking.action === 'Approved' ? 'var(--gold-600)' : '#ef4444',
                  color: dialogBooking.action === 'Approved' ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 1.5rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
