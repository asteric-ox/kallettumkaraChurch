import PageHero from '../components/PageHero';
export default function BulletinPage() {
  return (
    <>
      <PageHero subtitle="Parish Updates" title="Parish Bulletin" desc="Stay up-to-date with all parish news and events" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'48rem', margin:'0 auto' }}>
          <div className="glass-card" style={{ padding:'3rem', borderRadius:'1rem', textAlign:'center' }}>
            <div style={{ fontSize:'4rem', marginBottom:'1.5rem' }}>📋</div>
            <h3 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff', marginBottom:'1rem' }}>Weekly Bulletin</h3>
            <p style={{ color:'#9ca3af', lineHeight:1.6, marginBottom:'2rem' }}>The parish bulletin is distributed every Sunday after Mass. It contains important announcements, prayer requests, and upcoming events. Contact the parish office for a copy.</p>
            <a href="tel:+917909151122" className="btn-gold">Contact Parish Office</a>
          </div>
        </div>
      </section>
    </>
  );
}