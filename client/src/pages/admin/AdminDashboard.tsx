import { useEffect, useState } from "react";
import api from "../../services/api";
export default function AdminDashboard() {
  const [stats, setStats] = useState({ masses:0, announcements:0, council:0, prayers:0 });
  const [prayers, setPrayers] = useState<any[]>([]);
  useEffect(() => {
    Promise.all([
      api.get("/mass-timings").then(r=>r.data.length),
      api.get("/announcements/all").then(r=>r.data.length),
      api.get("/parish-council").then(r=>r.data.length),
      api.get("/prayer-requests").then(r=>r.data)
    ]).then(([masses,announcements,council,prayerData]) => {
      setStats({masses,announcements,council,prayers:prayerData.length});
      setPrayers(prayerData.slice(0,5));
    });
  },[]);
  const cards = [
    {label:"Mass Timings",val:stats.masses,icon:"⛪",color:"var(--gold-500)"},
    {label:"Announcements",val:stats.announcements,icon:"📢",color:"#60a5fa"},
    {label:"Parish Council",val:stats.council,icon:"👨‍⚖️",color:"#34d399"},
    {label:"Prayer Requests",val:stats.prayers,icon:"🙏",color:"#f472b6"},
  ];
  return (
    <div>
      <h1 className="font-heading" style={{fontSize:"1.75rem",fontWeight:700,color:"#fff",marginBottom:"0.5rem"}}>Dashboard</h1>
      <p style={{color:"#6b7280",fontSize:"0.875rem",marginBottom:"2rem"}}>Welcome to the Infant Jesus Church admin panel.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem",marginBottom:"2rem"}}>
        {cards.map(c=>(
          <div key={c.label} className="glass-card" style={{padding:"1.5rem",borderRadius:"1rem",textAlign:"center"}}>
            <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>{c.icon}</div>
            <div className="font-heading" style={{fontSize:"2rem",fontWeight:700,color:c.color,marginBottom:"0.25rem"}}>{c.val}</div>
            <div style={{fontSize:"0.8125rem",color:"#6b7280"}}>{c.label}</div>
          </div>
        ))}
      </div>
      {prayers.length>0 && (
        <div className="glass-card" style={{padding:"1.5rem",borderRadius:"1rem"}}>
          <h2 className="font-heading" style={{fontSize:"1.125rem",fontWeight:700,color:"#fff",marginBottom:"1rem"}}>Recent Prayer Requests</h2>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            {prayers.map((p:any)=>(
              <div key={p._id} style={{padding:"0.75rem",borderRadius:"0.5rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                <p style={{fontWeight:500,color:"#fff",fontSize:"0.875rem"}}>{p.name} <span style={{color:"#6b7280",fontWeight:400}}>• {p.email}</span></p>
                <p style={{color:"#9ca3af",fontSize:"0.8125rem",marginTop:"0.25rem"}}>{p.intention}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}