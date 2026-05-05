import PageHero from '../components/PageHero';
export default function InstitutionsPage() {
  const institutions = [
    { icon:'🏫', name:'Infant Jesus School', desc:'A premier educational institution providing quality education rooted in Christian values.' },
    { icon:'📚', name:'Parish Library', desc:'A rich library of religious and general literature serving the parish community.' },
    { icon:'🏥', name:'Health Centre', desc:'Parish-supported medical facilities for community healthcare.' },
    { icon:'👶', name:'Balasabha', desc:'Faith formation programs for children of the parish.' },
  ];
  return (
    <>
      <PageHero subtitle="Our Institutions" title="Parish Institutions" desc="Serving the community through education and service" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'1.5rem' }}>
          {institutions.map(inst => (
            <div key={inst.name} className="glass-card" style={{ padding:'2rem', borderRadius:'1rem', textAlign:'center' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>{inst.icon}</div>
              <h3 className="font-heading" style={{ fontSize:'1.25rem', fontWeight:700, color:'#fff', marginBottom:'0.75rem' }}>{inst.name}</h3>
              <p style={{ color:'#9ca3af', fontSize:'0.875rem', lineHeight:1.6 }}>{inst.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}