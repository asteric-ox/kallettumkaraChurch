import { useEffect, useState } from 'react';
import api from '../services/api';

export default function MaintenancePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/settings').then(r => setMessage(r.data.maintenance_message || '')).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--church-bg)' }}>
      <div style={{ textAlign: 'center', maxWidth: '32rem' }}>
        {/* Animated cross */}
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'pulse 2s ease-in-out infinite' }}>⛪</div>

        {/* Gold top strip */}
        <div style={{ width: '3rem', height: '3px', background: 'linear-gradient(90deg, var(--gold-600), var(--gold-400))', borderRadius: '9999px', margin: '0 auto 1.5rem' }} />

        <h1 className="font-heading" style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Under Maintenance
        </h1>

        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1rem' }}>
          {message || 'The website is currently undergoing scheduled maintenance. We will be back shortly. Thank you for your patience.'}
        </p>

        <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', marginBottom: '1.5rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.25rem' }}>For urgent matters, please call:</p>
          <a href="tel:+917909151122" style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
            +91 79091 51122
          </a>
        </div>

        <p style={{ color: '#4b5563', fontSize: '0.75rem' }}>
          Infant Jesus Syro Malabar Church, Kallettumkara
        </p>
      </div>
    </div>
  );
}