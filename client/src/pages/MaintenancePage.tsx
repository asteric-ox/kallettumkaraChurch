export default function MaintenancePage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'var(--church-bg)' }}>
      <div style={{ textAlign:'center', maxWidth:'32rem' }}>
        <div style={{ fontSize:'5rem', marginBottom:'1.5rem' }}>⛪</div>
        <h1 className="font-heading" style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:700, color:'#fff', marginBottom:'1rem' }}>Under Maintenance</h1>
        <p style={{ color:'#9ca3af', lineHeight:1.6, marginBottom:'2rem' }}>The website is currently undergoing scheduled maintenance. We will be back shortly. Thank you for your patience.</p>
        <p style={{ color:'var(--gold-400)', fontSize:'0.875rem' }}>For urgent matters, please call: <a href="tel:+917909151122" style={{ color:'var(--gold-400)' }}>+91 79091 51122</a></p>
      </div>
    </div>
  );
}