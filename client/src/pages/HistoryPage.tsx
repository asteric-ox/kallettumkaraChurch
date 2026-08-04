import PageHero from '../components/PageHero';
export default function HistoryPage() {
  const events = [
    { year:'1874', title:'Historical Traces', desc:'Historical text registries and church land history trace the earliest roots of the parish back to 1874.' },
    { year:'Late 19th Century', title:'Parish Establishment', desc:'The Infant Jesus Church formally established its roots as a prominent Syro-Malabar Catholic parish in the Thrissur district under the Diocese of Irinjalakuda.' },
    { year:'2011', title:'125th Anniversary', desc:'The parish joyously celebrated its 125th anniversary, a historic milestone marking its vibrant community and grand church festival celebrations.' },
    { year:'Present', title:'A Vital Hub', desc:'Today, the parish stands as a vital hub for the Congregation of the Holy Family (CHF), running nearby charitable and educational institutions associated with the legacy of St. Mariam Thresia.' },
  ];
  return (
    <>
      <PageHero subtitle="Our Story" title="Parish History" desc="A journey of faith through the centuries" />
      
      <section style={{ padding:'5rem 1rem 2rem', maxWidth:'52rem', margin:'0 auto', textAlign:'center' }}>
        <h2 className="font-heading" style={{ fontSize:'2.25rem', fontWeight:700, color:'#fff', marginBottom:'1.5rem' }}>History at a Glance</h2>
        <p style={{ color:'#d1d5db', fontSize:'1.05rem', lineHeight:1.8, marginBottom:'1.5rem' }}>
          The <strong>Infant Jesus Church in Kallettumkara</strong> is a prominent Syro-Malabar Catholic parish in the Thrissur district under the administration of the Syro-Malabar Catholic Diocese of Irinjalakuda. Tracing its roots back to the late 19th century, the parish celebrated its 125th anniversary in 2011, marking it for its vibrant community and grand church festival celebrations.
        </p>
        <p style={{ color:'#d1d5db', fontSize:'1.05rem', lineHeight:1.8 }}>
          The parish is renowned for its spiritual and cultural festivals, notably the grand <em>'Perunnal'</em> (feast), which is highlighted by well-lit night displays, community gatherings, and spectacular celebrations. Today, Kallettumkara showcases as a vital hub for the Congregation of the Holy Family (CHF), which runs nearby charitable and educational institutions associated with the legacy of St. Mariam Thresia.
        </p>
      </section>

      <section style={{ padding:'3rem 1rem 5rem' }}>
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