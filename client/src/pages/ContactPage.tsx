import PageHero from '../components/PageHero';
export default function ContactPage() {
  return (
    <>
      <PageHero subtitle="Get in Touch" title="Contact Us" desc="We'd love to hear from you" />
      <section style={{ padding:'5rem 1rem' }}>
        <div style={{ maxWidth:'72rem', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'2.5rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <div className="glass-card" style={{ padding:'2rem', borderRadius:'1rem' }}>
              <h2 className="font-heading" style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--gold-400)', marginBottom:'1.5rem' }}>Parish Office</h2>
              {[
                { icon:'📍', label:'Address', value:'Infant Jesus Church, Kallettumkara, Thrissur, Kerala – 680683' },
                { icon:'📞', label:'Phone', value:'+91 79091 51122', href:'tel:+917909151122' },
                { icon:'✉️', label:'Email', value:'infantjesuskta72@gmail.com', href:'mailto:infantjesuskta72@gmail.com' },
                { icon:'🕐', label:'Office Hours', value:'Mon–Sat: 9:00 AM – 1:00 PM, 3:00 PM – 5:00 PM' },
              ].map(({ icon, label, value, href }: any) => (
                <div key={label} style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'1.25rem' }}>
                  <div style={{ width:40, height:40, borderRadius:'0.5rem', background:'rgba(212,175,55,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
                  <div>
                    <p style={{ color:'#fff', fontWeight:500, marginBottom:'0.25rem' }}>{label}</p>
                    {href ? <a href={href} style={{ color:'var(--gold-400)', fontSize:'0.875rem', textDecoration:'none' }}>{value}</a> : <p style={{ color:'#9ca3af', fontSize:'0.875rem' }}>{value}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <a href="tel:+917909151122" className="btn-gold" style={{ justifyContent:'center', padding:'1rem' }}>📞 Call Now</a>
              <a href="mailto:infantjesuskta72@gmail.com" className="btn-outline" style={{ justifyContent:'center', padding:'1rem' }}>✉️ Email</a>
              <a href="https://maps.app.goo.gl/EYeMsLxe8CdshGK4A" target="_blank" rel="noreferrer" className="btn-ghost" style={{ gridColumn:'1/-1', justifyContent:'center', padding:'1rem' }}>📍 Get Directions</a>
            </div>
          </div>
          <div className="glass-card" style={{ borderRadius:'1rem', overflow:'hidden', minHeight:400 }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3924.929403958988!2d76.2727198!3d10.34753!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7f8222e91a979%3A0xc9c95de1af6cc454!2sInfant%20Jesus%20Church!5e0!3m2!1sen!2sin!4v1776942911749!5m2!1sen!2sin"
              style={{ width:'100%', height:'100%', minHeight:400, border:0, filter:'grayscale(1) contrast(1.2)', opacity:0.8 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Church Location" />
          </div>
        </div>
      </section>
    </>
  );
}