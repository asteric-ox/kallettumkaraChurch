function PageHero({ subtitle, title, desc }: { subtitle: string; title: string; desc?: string }) {
  return (
    <section style={{ position:'relative', paddingTop:'8rem', paddingBottom:'5rem', padding:'8rem 1rem 5rem', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(128,0,0,0.4),var(--church-bg))' }} />
      <div style={{ position:'relative', zIndex:10, maxWidth:'56rem', margin:'0 auto', textAlign:'center' }}>
        <p style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.75rem' }}>{subtitle}</p>
        <h1 className="font-heading" style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, color:'#fff', marginBottom:'1rem' }}>{title}</h1>
        {desc && <p style={{ fontSize:'1.125rem', color:'#d1d5db', fontWeight:300 }}>{desc}</p>}
      </div>
    </section>
  );
}
export default PageHero;
