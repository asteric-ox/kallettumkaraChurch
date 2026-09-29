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
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>No announcements yet.</p>
        ) : (
          items.map(a => (
            <div
              key={a._id}
              className="glass-card"
              style={{
                padding: "1.25rem 1.5rem",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                borderLeft: a.is_special_mass ? "3px solid var(--gold-400)" : "1px solid rgba(255,255,255,0.06)",
                background: a.is_special_mass ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                  <h3 className="font-heading" style={{ fontSize: "1.05rem", fontWeight: 600, color: "#fff" }}>
                    {a.title}
                  </h3>
                  {a.is_special_mass && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.6rem",
                        borderRadius: "9999px",
                        background: "rgba(212,175,55,0.15)",
                        color: "var(--gold-400)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        fontWeight: 600,
                      }}
                    >
                      ✨ Special Mass
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#d1d5db", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                  {a.content}
                </p>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", fontSize: "0.75rem", color: "#9ca3af" }}>
                  <span>📅 Published: {new Date(a.date).toLocaleDateString()}</span>
                  <span>⏳ Visible until: {new Date(a.expiry).toLocaleDateString()}</span>
                  {a.pdf_url && (
                    <a href={a.pdf_url} target="_blank" rel="noreferrer" style={{ color: "var(--gold-400)", textDecoration: "underline" }}>
                      📄 PDF
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => del(a._id)}
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}