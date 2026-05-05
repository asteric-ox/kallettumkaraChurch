import PageHero from '../components/PageHero';
export default function AssociationsPage() {
  const assocs = [
    { icon:'🙏', name:'Mathrusangham', desc:"Mothers' association fostering spiritual growth and charitable works among parish women." },
    { icon:'⚡', name:'KCYM', desc:'Kerala Catholic Youth Movement – nurturing faith-based leadership among the youth.' },
    { icon:'📖', name:'Catechism Association', desc:'Supporting the faith formation and religious education of parish children.' },
    { icon:'👨‍👩‍👧‍👦', name:'Family Units', desc:'25 family units providing pastoral care and community bonding for all parish families.' },
    { icon:'✝', name:'Legion of Mary', desc:'Lay apostolate organisation dedicated to Marian devotion and active service.' },
    { icon:'🎵', name:'Parish Choir', desc:'A dedicated choir enriching the Holy Qurbana and special liturgical celebrations.' },
  ];
  return (
    <>
      <PageHero subtitle="Community" title="Pious Associations" desc="Organizations that strengthen our parish community" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.5rem' }}>
          {assocs.map(a => (
            <div key={a.name} className="glass-card" style={{ padding:'2rem', borderRadius:'1rem' }}>
              <div style={{ width:56, height:56, borderRadius:'0.75rem', background:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.75rem', marginBottom:'1rem' }}>{a.icon}</div>
              <h3 className="font-heading" style={{ fontSize:'1.125rem', fontWeight:700, color:'#fff', marginBottom:'0.5rem' }}>{a.name}</h3>
              <p style={{ color:'#9ca3af', fontSize:'0.875rem', lineHeight:1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}