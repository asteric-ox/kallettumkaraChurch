import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home', key: 'nav.home' },
  { to: '/catechism', label: 'Catechism', key: 'nav.catechism' },
  { to: '/history', label: 'History', key: 'nav.history' },
  { to: '/family-units', label: 'Family Units', key: 'nav.family_units' },
  { to: '/associations', label: 'Pious Associations', key: 'nav.associations' },
  { to: '/bulletin', label: 'Bulletin', key: 'nav.bulletin' },
  { to: '/gallery', label: 'Gallery', key: 'nav.gallery' },
  { to: '/contact', label: 'Contact', key: 'nav.contact' },
];

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Lazy initializer: reads sessionStorage synchronously on first render,
  // so preloaderVisible is TRUE before React paints anything — no flash.
  const [preloaderVisible, setPreloaderVisible] = useState<boolean>(
    () => !sessionStorage.getItem('intro_shown')
  );
  const [fadingOut, setFadingOut] = useState(false);
  const location = useLocation();

  // useLayoutEffect fires synchronously before the browser paints,
  // locking scroll the instant the component mounts.
  useLayoutEffect(() => {
    if (preloaderVisible) {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (!preloaderVisible) return; // already shown before, skip timers

    // Start fade-out after 2s
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2000);

    // Fully remove after fade (2s + 0.8s)
    const removeTimer = setTimeout(() => {
      setPreloaderVisible(false);
      setFadingOut(false);
      document.body.style.overflow = '';
      sessionStorage.setItem('intro_shown', 'true');
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Preloader — covers entire viewport, fades out before unmounting */}
      {preloaderVisible && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,10,7,0.97)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            opacity: fadingOut ? 0 : 1,
            transition: 'opacity 0.8s ease',
            pointerEvents: fadingOut ? 'none' : 'all',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
              <div
                className="animate-zoom-in"
                style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 50px rgba(212,175,55,0.2)' }}
              >
                <img src="/uploads/Infant.png" alt="Infant Jesus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div className="animate-fade-in-up-delay">
              <h1 className="font-heading" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Infant Jesus Church</h1>
              <p className="font-heading" style={{ fontSize: 'clamp(1.25rem,3vw,2rem)', color: 'var(--gold-500)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Kallettumkara</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        id="main-nav"
        className={scrolled ? 'nav-scrolled' : 'nav-transparent'}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.5s' }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem' }}>
            {/* Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.3s' }}>
                <img src="/uploads/Infant.png" alt="Infant Jesus Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="hidden-mobile">
                <p className="font-heading" style={{ color: 'var(--gold-400)', fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.2 }}>Infant Jesus Church</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(176,138,24,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kallettumkara</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end={to === '/'}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              style={{ padding: '0.5rem', color: 'var(--gold-400)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ background: 'rgba(15,10,7,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
            <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} end={to === '/'}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--church-card)', borderTop: '1px solid rgba(212,175,55,0.1)', position: 'relative' }}>
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--gold-600), transparent)' }} />
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
            <div>
              <p className="font-heading" style={{ color: 'var(--gold-400)', fontWeight: 600, marginBottom: '0.75rem' }}>Infant Jesus Church</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.6 }}>Kallettumkara, Thrissur, Kerala – 680683</p>
            </div>
            <div>
              <h4 className="font-heading" style={{ color: 'var(--gold-400)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[['/', 'Home'], ['/history', 'History'], ['/spiritual-life', 'Spiritual Life'], ['/about', 'About Us']].map(([to, label]) => (
                  <li key={to}><Link to={to} style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--gold-400)'} onMouseLeave={e => (e.target as HTMLElement).style.color = '#9ca3af'}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading" style={{ color: 'var(--gold-400)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h4>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                <a href="tel:+917909151122" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>+91 79091 51122</a>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                <a href="mailto:infantjesuskta72@gmail.com" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>infantjesuskta72@gmail.com</a>
              </p>
              <a href="tel:+917909151122" className="btn-gold" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Contact Office</a>
            </div>
          </div>
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(212,175,55,0.1)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>© 2026 Infant Jesus Church, Kallettumkara. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .hidden-mobile { display: block; }
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 1279px) {
          .hidden-mobile { display: none !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
