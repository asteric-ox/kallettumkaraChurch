import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import type { FamilyUnit } from '../../types';
import { getAdminPath } from '../../utils/adminPath';

type LeaderKey = 'president' | 'secretary' | 'treasurer';
const LEADER_ROLES: { key: LeaderKey; label: string; icon: string }[] = [
  { key: 'president', label: 'President', icon: '👑' },
  { key: 'secretary', label: 'Secretary', icon: '📋' },
  { key: 'treasurer', label: 'Treasurer', icon: '💰' },
];

interface LeaderForm { name: string; phone: string; address: string; }
const emptyLeader = (): LeaderForm => ({ name: '', phone: '', address: '' });

export default function AdminFamilyUnitEdit() {
  const { id } = useParams();
  const [unit, setUnit] = useState<FamilyUnit | null>(null);
  const [tab, setTab] = useState<'leadership' | 'families'>('leadership');

  const [leaders, setLeaders] = useState<Record<LeaderKey, LeaderForm>>({
    president: emptyLeader(), secretary: emptyLeader(), treasurer: emptyLeader(),
  });
  const [addForm, setAddForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!id) return;
    api.get(`/family-units/${id}`).then(r => {
      const u: FamilyUnit = r.data;
      setUnit(u);
      setLeaders({
        president: { name: u.president?.name !== '—' ? u.president?.name || '' : '', phone: u.president?.phone !== '—' ? u.president?.phone || '' : '', address: u.president?.address !== '—' ? u.president?.address || '' : '' },
        secretary: { name: u.secretary?.name !== '—' ? u.secretary?.name || '' : '', phone: u.secretary?.phone !== '—' ? u.secretary?.phone || '' : '', address: u.secretary?.address !== '—' ? u.secretary?.address || '' : '' },
        treasurer: { name: u.treasurer?.name !== '—' ? u.treasurer?.name || '' : '', phone: u.treasurer?.phone !== '—' ? u.treasurer?.phone || '' : '', address: u.treasurer?.address !== '—' ? u.treasurer?.address || '' : '' },
      });
    });
  };

  useEffect(() => { load(); }, [id]);

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const saveLeadership = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, string> = {};
      LEADER_ROLES.forEach(({ key }) => {
        body[`${key}_name`]    = leaders[key].name    || '—';
        body[`${key}_phone`]   = leaders[key].phone   || '—';
        body[`${key}_address`] = leaders[key].address || '—';
      });
      await api.put(`/family-units/${id}/leadership`, body);
      notify('✅ Leadership saved successfully!');
      load();
    } catch {
      notify('❌ Failed to save leadership.');
    } finally {
      setSaving(false);
    }
  };

  const togglePhoto  = async () => { await api.patch(`/family-units/${id}/toggle-photo`); load(); notify('Photo visibility toggled!'); };
  const addFamily    = async (e: React.FormEvent) => { e.preventDefault(); await api.post(`/family-units/${id}/families`, addForm); setAddForm({ name: '', phone: '', address: '', email: '' }); load(); notify('✅ Family added!'); };
  const toggleFamily = async (idx: number) => { await api.patch(`/family-units/${id}/families/${idx}/toggle`); load(); };
  const delFamily    = async (idx: number) => { if (confirm('Remove this family?')) { await api.delete(`/family-units/${id}/families/${idx}`); load(); notify('Family removed.'); } };

  if (!unit) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(212,175,55,0.2)', borderTop: '3px solid var(--gold-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div>
      {/* ── Top Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <Link to={getAdminPath("/family-units")} style={{ color: 'var(--gold-400)', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back
        </Link>
        <div style={{ flex: 1 }}>
          <h1 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            {unit.name}
            <span style={{ fontSize: '0.9rem', color: 'var(--gold-500)', marginLeft: '0.6rem', fontWeight: 400 }}>Unit #{unit.unit_number}</span>
          </h1>
        </div>
        <button onClick={togglePhoto} style={{ padding: '0.4rem 1rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: unit.show_photo ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', color: unit.show_photo ? '#4ade80' : '#6b7280', border: `1px solid ${unit.show_photo ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s' }}>
          {unit.show_photo ? '📸 Photos: ON' : '🚫 Photos: OFF'}
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Families', value: unit.families.length, color: 'var(--gold-400)' },
          { label: 'Visible', value: unit.families.filter(f => f.visible).length, color: '#4ade80' },
          { label: 'Hidden', value: unit.families.filter(f => !f.visible).length, color: '#6b7280' },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.5rem 1.1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.8rem' }}>
            <span style={{ color: '#6b7280' }}>{s.label}: </span>
            <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── Message ── */}
      {msg && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.startsWith('✅') ? '#6ee7b7' : '#f87171', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {msg}
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
        {[
          { key: 'leadership' as const, label: '👑 Unit Leadership' },
          { key: 'families'   as const, label: `Families (${unit.families.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', background: tab === t.key ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)', color: tab === t.key ? 'var(--gold-400)' : '#6b7280', border: tab === t.key ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ LEADERSHIP TAB ══ */}
      {tab === 'leadership' && (
        <form onSubmit={saveLeadership}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {LEADER_ROLES.map(({ key, label, icon }) => (
              <div key={key} className="glass-card" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid rgba(212,175,55,0.1)' }}>
                {/* Role Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                  <h3 className="font-heading" style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1.1rem' }}>{label}</h3>
                </div>

                {/* Fields only — no photo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
                    <input className="form-input" placeholder={`${label}'s name`} value={leaders[key].name} onChange={e => setLeaders(p => ({ ...p, [key]: { ...p[key], name: e.target.value } }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Phone</label>
                    <input className="form-input" placeholder="Phone number" value={leaders[key].phone} onChange={e => setLeaders(p => ({ ...p, [key]: { ...p[key], phone: e.target.value } }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Address / House Name</label>
                    <input className="form-input" placeholder="Address / House name" value={leaders[key].address} onChange={e => setLeaders(p => ({ ...p, [key]: { ...p[key], address: e.target.value } }))} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-gold" disabled={saving} style={{ marginTop: '1.5rem', padding: '0.875rem 2.5rem', fontSize: '0.95rem' }}>
            {saving ? 'Saving…' : '💾 Save Leadership'}
          </button>
        </form>
      )}

      {/* ══ FAMILIES TAB ══ */}
      {tab === "families" && (
        <>
          {/* Add Family Form */}
          <form onSubmit={addFamily} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 className="font-heading" style={{ color: 'var(--gold-400)', fontWeight: 700, marginBottom: '1.25rem' }}>➕ Add Family</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {[['name', 'Family / House Name', true], ['phone', 'Phone'], ['address', 'Address'], ['email', 'Email']].map(([k, l, r]: any) => (
                <div key={k}>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>{l}{r ? ' *' : ''}</label>
                  <input className="form-input" placeholder={l} value={(addForm as any)[k]} onChange={e => setAddForm({ ...addForm, [k]: e.target.value })} required={!!r} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '0.6rem 1.5rem' }}>Add Family</button>
          </form>

          {/* Families Table */}
          <div className="glass-card" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-heading" style={{ color: '#fff', fontWeight: 700 }}>
                Families <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '0.9rem' }}>({unit.families.length})</span>
              </h3>
            </div>

            {unit.families.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👨‍👩‍👧</div>
                <p>No families added yet. Use the form above to add one.</p>
              </div>
            ) : (
              unit.families.map((f, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'var(--gold-400)', flexShrink: 0 }}>
                    {f.name[0]?.toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: f.visible ? '#fff' : '#6b7280', fontSize: '0.9rem', marginBottom: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {[f.phone, f.address].filter(Boolean).join(' · ')}
                    </p>
                  </div>

                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: f.visible ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', color: f.visible ? '#4ade80' : '#6b7280', border: `1px solid ${f.visible ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`, flexShrink: 0 }}>
                    {f.visible ? 'Visible' : 'Hidden'}
                  </span>

                  <button onClick={() => toggleFamily(i)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-400)', borderRadius: '0.5rem', cursor: 'pointer', flexShrink: 0 }}>
                    {f.visible ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => delFamily(i)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '0.5rem', cursor: 'pointer', flexShrink: 0 }}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
