import type { ParishCouncilMember } from '../types';

interface Props { priest: ParishCouncilMember; onClose: () => void; }

export default function PriestModal({ priest, onClose }: Props) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:70, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', width:'100%', maxWidth:'28rem', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,0.5)', background:'linear-gradient(145deg,rgba(26,20,16,0.98),rgba(15,10,7,0.98))', border:'1px solid rgba(212,175,55,0.15)' }}>
        <div style={{ height:4, background:'linear-gradient(to right,transparent,var(--gold-500),transparent)' }} />
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af', cursor:'pointer' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div style={{ padding:'2.5rem 2rem', textAlign:'center' }}>
          <div style={{ position:'relative', width:144, height:144, margin:'0 auto 1.5rem' }}>
            <div style={{ position:'absolute', inset:-4, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', opacity:0.3 }} />
            <div style={{ width:144, height:144, borderRadius:'50%', overflow:'hidden', position:'relative', zIndex:1, background:'linear-gradient(135deg,var(--gold-500),var(--gold-700))', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {priest.image_url
                ? <img src={priest.image_url} alt={priest.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <span className="font-heading" style={{ fontSize:'3.5rem', color:'var(--maroon-950)', fontWeight:700 }}>{priest.name[0]}</span>
              }
            </div>
          </div>
          <h3 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff', marginBottom:'0.25rem' }}>{priest.name}</h3>
          <p style={{ color:'var(--gold-500)', fontWeight:600, fontSize:'0.875rem', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1.5rem' }}>{priest.role}</p>
          <div style={{ width:64, height:2, margin:'0 auto 1.5rem', background:'linear-gradient(to right,transparent,var(--gold-600),transparent)' }} />
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', textAlign:'left' }}>
            {[
              { icon:'✝', label:'Designation', value:priest.role },
              priest.dob && { icon:'🎂', label:'Date of Birth', value:priest.dob },
              priest.feast_day && { icon:'🌟', label:'Feast Day', value:priest.feast_day },
              priest.phone && { icon:'📞', label:'Contact', value:priest.phone },
            ].filter(Boolean).map((item: any, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(212,175,55,0.05)' }}>
                <div style={{ width:40, height:40, borderRadius:'0.5rem', background:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.125rem', flexShrink:0 }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize:'0.75rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>{item.label}</p>
                  <p style={{ color:'#fff', fontSize:'0.875rem', fontWeight:500, marginTop:2 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'2rem', display:'flex', gap:'0.75rem' }}>
            {priest.phone && <a href={`tel:${priest.phone}`} className="btn-gold" style={{ flex:1, gap:'0.5rem' }}>📞 Call Now</a>}
            <button onClick={onClose} className="btn-ghost" style={{ flex:1 }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
