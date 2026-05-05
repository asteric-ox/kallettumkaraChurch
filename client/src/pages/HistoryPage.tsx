import PageHero from '../components/PageHero';
export default function HistoryPage() {
  const events = [
    { year:'~1850', title:'Parish Establishment', desc:'The Infant Jesus Church, Kallettumkara was established as a dedicated parish serving the Syro-Malabar Catholic faithful of the region.' },
    { year:'Early 1900s', title:'Church Construction', desc:'The first permanent church structure was built, providing a sacred space for the growing parish community.' },
    { year:'Mid 1900s', title:'Community Growth', desc:'The parish witnessed significant growth with the establishment of various pious associations and community organizations.' },
    { year:'1990s', title:'Renovation & Expansion', desc:'Major renovation works were carried out to accommodate the growing congregation and modernize the facilities.' },
    { year:'2000s', title:'Family Units Formation', desc:'The parish organized its 800+ families into 25 family units for better pastoral care and community building.' },
    { year:'Present', title:'A Living Community', desc:'Today, Infant Jesus Church stands as a vibrant center of Syro-Malabar Catholic faith, worship, and community life.' },
  ];
  return (
    <>
      <PageHero subtitle="Our Story" title="Parish History" desc="A journey of faith through the centuries" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'56rem', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:2, background:'linear-gradient(to bottom,var(--gold-600),transparent)', transform:'translateX(-50%)' }} />
          <div style={{ display:'flex', flexDirection:'column', gap:'3rem' }}>
            {events.map((e,i) => (
              <div key={i} className="timeline-entry" style={{ display:'flex', gap:'2rem', alignItems:'flex-start', flexDirection: i%2===0 ? 'row' : 'row-reverse' }}>
                <div style={{ flex:1, textAlign: i%2===0 ? 'right' : 'left' }}>
                  <div className="glass-card" style={{ padding:'1.5rem', borderRadius:'1rem', display:'inline-block', maxWidth:'100%' }}>
                    <span style={{ color:'var(--gold-500)', fontSize:'0.875rem', fontWeight:700, display:'block', marginBottom:'0.5rem' }}>{e.year}</span>
                    <h3 className="font-heading" style={{ fontSize:'1.25rem', fontWeight:700, color:'#fff', marginBottom:'0.5rem' }}>{e.title}</h3>
                    <p style={{ color:'#9ca3af', fontSize:'0.875rem', lineHeight:1.6 }}>{e.desc}</p>
                  </div>
                </div>
                <div style={{ flexShrink:0, width:16, height:16, borderRadius:'50%', background:'var(--gold-500)', border:'4px solid var(--church-bg)', zIndex:1, marginTop:'1.5rem' }} />
                <div style={{ flex:1 }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}