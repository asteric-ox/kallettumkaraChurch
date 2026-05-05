import { useState } from 'react';
import api from '../services/api';

export default function PrayerForm() {
  const [form, setForm] = useState({ name: '', email: '', intention: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/prayer-requests', form);
      setMsg('Your prayer intention has been received. God bless you! 🙏');
      setForm({ name: '', email: '', intention: '' });
    } catch { setMsg('Failed to submit. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:'40rem', margin:'0 auto', textAlign:'center' }}>
      <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Reach Out</p>
      <h2 className="font-heading" style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'#fff', marginBottom:'2rem' }}>Prayer Intentions</h2>
      {msg && <div style={{ padding:'1rem', borderRadius:'0.75rem', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', color:'#6ee7b7', marginBottom:'1.5rem', fontSize:'0.875rem' }}>{msg}</div>}
      <form onSubmit={submit} className="glass-card" style={{ borderRadius:'1.5rem', padding:'2rem', display:'flex', flexDirection:'column', gap:'1rem', textAlign:'left' }}>
        <input className="form-input" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input className="form-input" type="email" placeholder="Email (optional)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <textarea className="form-input" placeholder="Your prayer intention..." rows={4} value={form.intention} onChange={e => setForm({...form, intention: e.target.value})} required style={{ resize:'vertical' }} />
        <button type="submit" className="btn-gold" disabled={loading} style={{ width:'100%', padding:'0.875rem' }}>
          {loading ? 'Submitting...' : '🙏 Submit Prayer Intention'}
        </button>
      </form>
    </div>
  );
}
