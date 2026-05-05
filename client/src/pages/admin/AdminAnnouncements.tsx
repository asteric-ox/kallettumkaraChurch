import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Announcement } from "../../types";
export default function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({title:"",content:"",expiry:"",pdf_url:""});
  const [msg, setMsg] = useState("");
  const load = () => api.get("/announcements/all").then(r=>setItems(r.data));
  useEffect(()=>{load();},[]);
  const add = async (e:React.FormEvent) => { e.preventDefault(); await api.post("/announcements",form); setForm({title:"",content:"",expiry:"",pdf_url:""}); setMsg("Published!"); load(); setTimeout(()=>setMsg(""),3000); };
  const del = async (id:string) => { if(confirm("Delete?")) { await api.delete(`/announcements/${id}`); load(); }};
  return (
    <div>
      <h1 className="font-heading" style={{fontSize:"1.75rem",fontWeight:700,color:"#fff",marginBottom:"2rem"}}>Announcements</h1>
      {msg && <div style={{padding:"0.75rem",borderRadius:"0.75rem",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",color:"#6ee7b7",marginBottom:"1rem",fontSize:"0.875rem"}}>{msg}</div>}
      <form onSubmit={add} className="glass-card" style={{padding:"1.5rem",borderRadius:"1rem",marginBottom:"2rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
        <h3 className="font-heading" style={{color:"var(--gold-400)",fontWeight:600}}>New Announcement</h3>
        <input className="form-input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
        <textarea className="form-input" placeholder="Content" rows={3} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required style={{resize:"vertical"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
          <div><label style={{fontSize:"0.8125rem",color:"#9ca3af",display:"block",marginBottom:"0.5rem"}}>Expiry Date</label><input className="form-input" type="date" value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})} required/></div>
          <div><label style={{fontSize:"0.8125rem",color:"#9ca3af",display:"block",marginBottom:"0.5rem"}}>PDF URL (optional)</label><input className="form-input" placeholder="https://..." value={form.pdf_url} onChange={e=>setForm({...form,pdf_url:e.target.value})}/></div>
        </div>
        <button type="submit" className="btn-gold" style={{alignSelf:"flex-start",padding:"0.75rem 2rem"}}>Publish</button>
      </form>
      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        {items.map(a=>(
          <div key={a._id} className="glass-card" style={{padding:"1.25rem",borderRadius:"1rem",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem"}}>
            <div style={{flex:1}}>
              <h3 className="font-heading" style={{fontSize:"1rem",fontWeight:600,color:"#fff",marginBottom:"0.25rem"}}>{a.title}</h3>
              <p style={{fontSize:"0.8125rem",color:"#9ca3af",marginBottom:"0.5rem"}}>{a.content}</p>
              <span style={{fontSize:"0.75rem",color:"#6b7280"}}>Expires: {new Date(a.expiry).toLocaleDateString()}</span>
            </div>
            <button onClick={()=>del(a._id)} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#f87171",padding:"0.375rem 0.875rem",borderRadius:"0.5rem",cursor:"pointer",fontSize:"0.8125rem",flexShrink:0}}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}