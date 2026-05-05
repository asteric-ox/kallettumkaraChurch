import type { Trustee } from '../types';

interface Props { trustee: Trustee; onClose: () => void; }

export default function TrusteeModal({ trustee, onClose }: Props) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:70, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)' }} onClick={onClose} />
      <div style={{ position:'relative', width:'100%', maxWidth:'36rem', borderRadius:'2.5rem', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,0.5)', background:'#1a1410', border:'1px solid rgba(212,175,55,0.2)' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:128, background:'linear-gradient(to bottom,rgba(212,175,55,0.1),transparent)' }} />
        <button onClick={onClose} style={{ position:'absolute', top:24, right:24, width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af', cursor:'pointer', zIndex:10 }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div style={{ position:'relative', padding:'2.5rem' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2rem' }}>
            <div style={{ width:160, height:160, borderRadius:'1.5rem', overflow:'hidden', background:'var(--church-accent)', display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(3deg)', boxShadow:'0 20px 40px rgba(0,0,0,0.4)' }}>
              {trustee.image_url
                ? <img src={trustee.image_url} alt={trustee.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <span className="font-heading" style={{ fontSize:'4rem', color:'var(--gold-400)', fontWeight:700 }}>{trustee.name[0]}</span>
              }
            </div>
            <div style={{ textAlign:'center' }}>
              <h3 className="font-heading" style={{ fontSize:'1.875rem', fontWeight:700, color:'#fff', marginBottom:'0.25rem' }}>{trustee.name}</h3>
              <p style={{ color:'var(--gold-500)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', fontSize:'0.875rem', marginBottom:'1.5rem' }}>{trustee.role}</p>
              {trustee.phone && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>📞</div>
                  <a href={`tel:${trustee.phone}`} style={{ color:'#d1d5db', fontWeight:500, textDecoration:'none' }}>{trustee.phone}</a>
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop:'2.5rem', paddingTop:'2rem', borderTop:'1px solid rgba(212,175,55,0.1)', display:'flex', justifyContent:'center', gap:'1rem' }}>
            {trustee.phone && <a href={`tel:${trustee.phone}`} style={{ padding:'0.75rem 2rem', background:'var(--gold-500)', color:'var(--maroon-950)', borderRadius:'9999px', fontWeight:700, textDecoration:'none', boxShadow:'0 8px 20px rgba(212,175,55,0.2)' }}>Call Trustee</a>}
            <button onClick={onClose} style={{ padding:'0.75rem 2rem', background:'rgba(255,255,255,0.05)', color:'#9ca3af', borderRadius:'9999px', fontWeight:600, border:'none', cursor:'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
