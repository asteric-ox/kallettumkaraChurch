import { useEffect, useState } from "react";
import api from "../../services/api";
import type { MassTiming } from "../../types";
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const CATS = ["Weekday","Sunday"];
export default function AdminMassTimings() {
  const [timings, setTimings] = useState<MassTiming[]>([]);
  const [form, setForm] = useState({day:"Monday",time:"",description:"",category:"Weekday"});
  const [msg, setMsg] = useState("");
  const load = () => api.get("/mass-timings").then(r=>setTimings(r.data));
  useEffect(()=>{load();},[]);
  const add = async (e:React.FormEvent) => { e.preventDefault(); await api.post("/mass-timings",form); setForm({day:"Monday",time:"",description:"",category:"Weekday"}); setMsg("Added!"); load(); setTimeout(()=>setMsg(""),3000); };
  const del = async (id:string) => { if(confirm("Delete?")) { await api.delete(`/mass-timings/${id}`); load(); }};
  return (
    <div>
      <h1 className="font-heading" style={{fontSize:"1.75rem",fontWeight:700,color:"#fff",marginBottom:"2rem"}}>Mass Timings</h1>
      {msg && <div style={{padding:"0.75rem",borderRadius:"0.75rem",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",color:"#6ee7b7",marginBottom:"1rem",fontSize:"0.875rem"}}>{msg}</div>}
      <form onSubmit={add} className="glass-card" style={{padding:"1.5rem",borderRadius:"1rem",marginBottom:"2rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"1rem",alignItems:"end"}}>
        <div><label style={{fontSize:"0.8125rem",color:"#9ca3af",display:"block",marginBottom:"0.5rem"}}>Day</label><select className="form-input" value={form.day} onChange={e=>setForm({...form,day:e.target.value})}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
        <div><label style={{fontSize:"0.8125rem",color:"#9ca3af",display:"block",marginBottom:"0.5rem"}}>Time</label><input className="form-input" placeholder="06:00 AM" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} required/></div>
        <div><label style={{fontSize:"0.8125rem",color:"#9ca3af",display:"block",marginBottom:"0.5rem"}}>Description</label><input className="form-input" placeholder="Holy Qurbana" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/></div>
        <div><label style={{fontSize:"0.8125rem",color:"#9ca3af",display:"block",marginBottom:"0.5rem"}}>Category</label><select className="form-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
        <button type="submit" className="btn-gold" style={{padding:"0.75rem"}}>Add</button>
      </form>
      <div className="glass-card" style={{borderRadius:"1rem",overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            {["Day","Time","Description","Category",""].map(h=><th key={h} style={{padding:"0.875rem 1rem",textAlign:"left",fontSize:"0.8125rem",color:"#6b7280",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {timings.map(t=>(
              <tr key={t._id} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                <td style={{padding:"0.75rem 1rem",color:"var(--gold-400)",fontSize:"0.875rem",fontWeight:500}}>{t.day}</td>
                <td style={{padding:"0.75rem 1rem",color:"#fff",fontSize:"0.875rem",fontFamily:"var(--font-heading)"}}>{t.time}</td>
                <td style={{padding:"0.75rem 1rem",color:"#d1d5db",fontSize:"0.875rem"}}>{t.description}</td>
                <td style={{padding:"0.75rem 1rem"}}><span style={{fontSize:"0.75rem",padding:"0.25rem 0.75rem",borderRadius:"9999px",background:t.category==="Sunday"?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.05)",color:t.category==="Sunday"?"var(--gold-400)":"#9ca3af"}}>{t.category}</span></td>
                <td style={{padding:"0.75rem 1rem"}}><button onClick={()=>del(t._id)} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#f87171",padding:"0.25rem 0.75rem",borderRadius:"0.375rem",cursor:"pointer",fontSize:"0.75rem"}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}