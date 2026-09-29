import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";
import type { FamilyUnit } from "../../types";

export default function AdminFamilyUnits() {
  const [units, setUnits] = useState<FamilyUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/family-units").then(r => setUnits(r.data)).finally(() => setLoading(false));
  }, []);

  const totalFamilies = units.reduce((acc, u) => acc + u.families.length, 0);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(212,175,55,0.2)", borderTop: "3px solid var(--gold-500)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="font-heading" style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff" }}>Family Units</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ padding: "0.5rem 1.25rem", borderRadius: "9999px", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", fontSize: "0.85rem" }}>
            <span style={{ color: "#9ca3af" }}>Units: </span><span style={{ color: "var(--gold-400)", fontWeight: 700 }}>{units.length}</span>
            <span style={{ color: "#4b5563", margin: "0 0.5rem" }}>|</span>
            <span style={{ color: "#9ca3af" }}>Families: </span><span style={{ color: "var(--gold-400)", fontWeight: 700 }}>{totalFamilies}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
        {units.map(u => {
          const hasLeadership = u.president?.name && u.president.name !== "—";
          return (
            <Link key={u._id} to={`/admin/family-units/${u._id}`} style={{ textDecoration: "none" }}>
              <div
                className="glass-card"
                style={{ padding: "1.5rem", borderRadius: "1.25rem", transition: "all 0.25s", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
              >
                {/* Unit Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-500), var(--gold-700))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "var(--maroon-950)", flexShrink: 0 }}>
                    {u.unit_number}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-heading" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "0.125rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{u.families.length} {u.families.length === 1 ? "family" : "families"}</p>
                  </div>
                </div>

                {/* Leadership Preview */}
                {hasLeadership ? (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[{ role: "President", data: u.president }, { role: "Secretary", data: u.secretary }, { role: "Treasurer", data: u.treasurer }].map(({ role, data }) => (
                      data?.name && data.name !== "—" ? (
                        <div key={role} style={{ flex: 1, padding: "0.5rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center", minWidth: 0 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-600), var(--gold-800))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.3rem", overflow: "hidden", fontSize: "0.75rem", fontWeight: 700, color: "#1a1410" }}>
                            {data.image_url
                              ? <img src={getImageUrl(data.image_url)} alt={data.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : data.name[0]}
                          </div>
                          <p style={{ fontSize: "0.6rem", color: "var(--gold-500)", fontWeight: 700, textTransform: "uppercase" }}>{role.slice(0, 3)}</p>
                        </div>
                      ) : null
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "0.6rem", borderRadius: "0.75rem", background: "rgba(245,158,11,0.07)", border: "1px dashed rgba(245,158,11,0.25)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#f59e0b" }}>⚠️ No leadership set</p>
                  </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: u.show_photo ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)", color: u.show_photo ? "#4ade80" : "#6b7280", border: `1px solid ${u.show_photo ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)"}` }}>
                    {u.show_photo ? "📸 Photos On" : "Photos Off"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--gold-500)", fontWeight: 600 }}>Edit →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}