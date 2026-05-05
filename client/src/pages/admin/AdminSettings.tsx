import { useEffect, useState } from "react";
import api from "../../services/api";
export default function AdminSettings() {
  const [settings, setSettings] = useState({maintenance_mode:false,maintenance_message:""});
  const [msg, setMsg] = useState("");
  useEffect(()=>{ api.get("/settings").then(r=>setSettings(r.data)); },[]);
  const save = async (e:React.FormEvent) => {
    e.preventDefault();
    await api.put("/settings/maintenance",settings);
    setMsg("Settings saved!"); setTimeout(()=>setMsg(""),3000);
  };
  return (
    <div>
      <h1 className="font-heading" style={{fontSize:"1.75rem",fontWeight:700,color:"#fff",marginBottom:"2rem"}}>Site Settings</h1>
      {msg && <div style={{padding:"0.75rem",borderRadius:"0.75rem",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",color:"#6ee7b7",marginBottom:"1rem",fontSize:"0.875rem"}}>{msg}</div>}
      <form onSubmit={save} className="glass-card" style={{padding:"2rem",borderRadius:"1rem",display:"flex",flexDirection:"column",gap:"1.5rem"}}>
        <h2 className="font-heading" style={{fontSize:"1.25rem",fontWeight:700,color:"var(--gold-400)"}}>Maintenance Mode</h2>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <input type="checkbox" id="maintenance" checked={settings.maintenance_mode} onChange={e=>setSettings({...settings,maintenance_mode:e.target.checked})} style={{width:20,height:20,accentColor:"var(--gold-500)"}}/>
          <label htmlFor="maintenance" style={{color:"#d1d5db",fontSize:"1rem"}}>Enable Maintenance Mode</label>
        </div>
        {settings.maintenance_mode && (
          <div>
            <label style={{fontSize:"0.8125rem",color:"#9ca3af",display:"block",marginBottom:"0.5rem"}}>Maintenance Message</label>
            <textarea className="form-input" rows={3} placeholder="We will be back soon..." value={settings.maintenance_message} onChange={e=>setSettings({...settings,maintenance_message:e.target.value})} style={{resize:"vertical"}}/>
          </div>
        )}
        <button type="submit" className="btn-gold" style={{alignSelf:"flex-start",padding:"0.75rem 2rem"}}>Save Settings</button>
      </form>
    </div>
  );
}