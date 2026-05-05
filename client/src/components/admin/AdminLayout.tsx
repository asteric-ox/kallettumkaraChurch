import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/mass-timings', label: 'Mass Timings', icon: '⛪' },
  { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { to: '/admin/parish-council', label: 'Parish Council', icon: '👨‍⚖️' },
  { to: '/admin/trustees', label: 'Trustees', icon: '🏛️' },
  { to: '/admin/family-units', label: 'Family Units', icon: '👨‍👩‍👧‍👦' },
  { to: '/admin/hall-bookings', label: 'Hall Bookings', icon: '📅' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout() {
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/admin/login'); };
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--church-bg)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width:256, flexShrink:0, position:'sticky', top:0, height:'100vh', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'1.5rem', borderBottom:'1px solid rgba(212,175,55,0.08)' }}>
          <p className="font-heading" style={{ color:'var(--gold-400)', fontWeight:700, fontSize:'1rem', marginBottom:'0.25rem' }}>Admin Panel</p>
          <p style={{ fontSize:'0.75rem', color:'#6b7280' }}>Infant Jesus Church</p>
        </div>
        <nav style={{ padding:'1rem', flex:1, display:'flex', flexDirection:'column', gap:'0.25rem' }}>
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
              <span>{icon}</span><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ padding:'1rem', borderTop:'1px solid rgba(212,175,55,0.08)' }}>
          <div style={{ marginBottom:'0.75rem', padding:'0.75rem', borderRadius:'0.75rem', background:'rgba(212,175,55,0.05)' }}>
            <p style={{ fontSize:'0.75rem', color:'#6b7280' }}>Logged in as</p>
            <p style={{ fontSize:'0.875rem', color:'var(--gold-400)', fontWeight:600 }}>{username}</p>
          </div>
          <button onClick={handleLogout} className="admin-nav-link" style={{ color:'#ef4444', width:'100%' }}>
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main */}
      <main style={{ flex:1, overflow:'auto', padding:'2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
