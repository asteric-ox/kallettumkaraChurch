import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import type { FamilyUnit } from "../../types";
export default function AdminFamilyUnits() {
  const [units, setUnits] = useState<FamilyUnit[]>([]);
  useEffect(()=>{ api.get("/family-units").then(r=>setUnits(r.data)); },[]);
  return (
    <div>
      <h1 className="font-heading" style={{fontSize:"1.75rem",fontWeight:700,color:"#fff",marginBottom:"2rem"}}>Family Units</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1rem"}}>
        {units.map(u=>(
          <Link key={u._id} to={`/admin/family-units/${u._id}`} style={{textDecoration:"none"}}>
            <div className="glass-card" style={{padding:"1.25rem",borderRadius:"1rem",transition:"all 0.2s",cursor:"pointer"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,175,55,0.25)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,175,55,0.08)";}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold-500),var(--gold-700))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.875rem",fontWeight:700,color:"var(--maroon-950)",flexShrink:0}}>{u.unit_number}</div>
                <div>
                  <p className="font-heading" style={{fontSize:"0.9375rem",fontWeight:600,color:"#fff",marginBottom:"0.125rem"}}>{u.name}</p>
                  <p style={{fontSize:"0.75rem",color:"#6b7280"}}>{u.families.length} families</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}