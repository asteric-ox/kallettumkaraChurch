import PageHero from '../components/PageHero';
export default function CatechismPage() {
  return (
    <>
      <PageHero subtitle="Faith Formation" title="Catechism" desc="Nurturing the faith of the next generation" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'56rem', margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div className="glass-card" style={{ padding:'2.5rem', borderRadius:'1rem' }}>
            <h2 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--gold-400)', marginBottom:'1rem' }}>Sunday School (Catechism)</h2>
            <p style={{ color:'#d1d5db', lineHeight:1.8, marginBottom:'1rem' }}>The Catechism program at Infant Jesus Church provides comprehensive religious education to children and youth of the parish. Classes are conducted every Sunday after the morning Mass.</p>
            <p style={{ color:'#d1d5db', lineHeight:1.8 }}>Our dedicated teachers guide students through the teachings of the Syro-Malabar Catholic Church, the Scriptures, and the rich liturgical traditions of our faith.</p>
          </div>
          {[
            { title:'Classes', items:['Pre-Primary through Class 10','Every Sunday after 7:00 AM Mass','Experienced and dedicated teachers','Annual examinations and certificates'] },
            { title:'Admissions', items:['New admissions open every April','Registration at the Parish Office','Children aged 4 years and above eligible','Contact: infantjesuskta72@gmail.com'] },
          ].map(section => (
            <div key={section.title} className="glass-card" style={{ padding:'2.5rem', borderRadius:'1rem' }}>
              <h3 className="font-heading" style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--gold-400)', marginBottom:'1rem' }}>{section.title}</h3>
              <ul style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {section.items.map(item => (
                  <li key={item} style={{ display:'flex', alignItems:'center', gap:'0.75rem', color:'#d1d5db', fontSize:'0.875rem' }}>
                    <span style={{ color:'var(--gold-500)' }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}