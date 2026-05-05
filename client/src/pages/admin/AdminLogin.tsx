import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.username);
      navigate('/admin');
    } catch { setError('Invalid credentials. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--church-bg)', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:'24rem' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', overflow:'hidden', margin:'0 auto 1rem', border:'2px solid rgba(212,175,55,0.3)' }}>
            <img src="/uploads/Infant.png" alt="Logo" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
          <h1 className="font-heading" style={{ fontSize:'1.75rem', fontWeight:700, color:'#fff', marginBottom:'0.25rem' }}>Admin Login</h1>
          <p style={{ color:'#6b7280', fontSize:'0.875rem' }}>Infant Jesus Church, Kallettumkara</p>
        </div>
        {error && <div style={{ padding:'0.75rem 1rem', borderRadius:'0.75rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#fca5a5', fontSize:'0.875rem', marginBottom:'1rem', textAlign:'center' }}>{error}</div>}
        <form onSubmit={submit} className="glass-card" style={{ padding:'2rem', borderRadius:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ fontSize:'0.8125rem', color:'#9ca3af', fontWeight:500, display:'block', marginBottom:'0.5rem' }}>Username</label>
            <input id="username" className="form-input" placeholder="admin" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required autoComplete="username" />
          </div>
          <div>
            <label style={{ fontSize:'0.8125rem', color:'#9ca3af', fontWeight:500, display:'block', marginBottom:'0.5rem' }}>Password</label>
            <input id="password" className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-gold" disabled={loading} style={{ width:'100%', padding:'0.875rem', marginTop:'0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
