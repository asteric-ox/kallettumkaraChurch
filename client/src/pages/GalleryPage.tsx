import PageHero from '../components/PageHero';
export default function GalleryPage() {
  return (
    <>
      <PageHero subtitle="Memories" title="Photo Gallery" desc="Glimpses of our vibrant parish life" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto', textAlign:'center' }}>
          <div className="glass-card" style={{ padding:'4rem', borderRadius:'1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem' }}>
            <div style={{ fontSize:'4rem' }}>📸</div>
            <h3 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff' }}>Gallery Coming Soon</h3>
            <p style={{ color:'#9ca3af', maxWidth:'28rem', lineHeight:1.6 }}>We are curating beautiful memories from our parish events and celebrations. Please check back soon or follow us on social media for the latest updates.</p>
            <div style={{ display:'flex', gap:'1rem' }}>
              <a href="https://www.youtube.com/@infantjesuschurchkallettumkara" target="_blank" rel="noreferrer" className="btn-gold">YouTube Channel</a>
              <a href="https://www.instagram.com/kallettumkara_church" target="_blank" rel="noreferrer" className="btn-outline">Instagram</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}