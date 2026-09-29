import { useEffect, useState } from "react";
import TimeInput from "../../components/TimeInput";
import api from "../../services/api";
import type { MassTiming } from "../../types";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

type Tab = "regular" | "special";

export default function AdminMassTimings() {
  const [tab, setTab] = useState<Tab>("regular");

  // Regular mass state
  const [timings, setTimings] = useState<MassTiming[]>([]);
  const [form, setForm] = useState({ day: "Monday", time: "", description: "", category: "Weekday" });

  // Special mass state
  const [specials, setSpecials] = useState<MassTiming[]>([]);
  const [spForm, setSpForm] = useState({
    special_occasion: "",
    time: "",
    special_date: "",
    special_expiry: "",
    description: "",
  });

  const [msg, setMsg] = useState("");

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const loadRegular  = () => api.get("/mass-timings").then(r => setTimings(r.data));
  const loadSpecials = () => api.get("/mass-timings/special/all").then(r => setSpecials(r.data));

  useEffect(() => { loadRegular(); loadSpecials(); }, []);

  // Add regular mass
  const addRegular = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/mass-timings", { ...form, is_special: false });
    setForm({ day: "Monday", time: "", description: "", category: "Weekday" });
    flash("Mass timing added!");
    loadRegular();
  };

  // Add special mass
  const addSpecial = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      day: new Date(spForm.special_date).toLocaleDateString("en-US", { weekday: "long" }),
      time: spForm.time,
      description: spForm.description || spForm.special_occasion,
      category: "Special",
      is_special: true,
      special_date: spForm.special_date,
      special_occasion: spForm.special_occasion,
      special_expiry: spForm.special_expiry || spForm.special_date,
    };
    await api.post("/mass-timings", payload);
    setSpForm({ special_occasion: "", time: "", special_date: "", special_expiry: "", description: "" });
    flash("Special Mass published! It will appear in Announcements.");
    loadSpecials();
  };

  const del = async (id: string, isSpecial = false) => {
    if (!confirm("Delete this mass timing?")) return;
    await api.delete(`/mass-timings/${id}`);
    isSpecial ? loadSpecials() : loadRegular();
  };

  const isActive = (expiry?: string, massDate?: string) => {
    const d = expiry || massDate;
    if (!d) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(d);
    exp.setHours(23, 59, 59, 999);
    return exp >= today;
  };

  return (
    <div>
      <h1 className="font-heading" style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", marginBottom: "2rem" }}>
        Mass Timings
      </h1>

      {msg && (
        <div style={{ padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          ✅ {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        {[
          { key: "regular" as Tab, label: "⛪ Regular Masses", count: timings.length },
          { key: "special" as Tab, label: "✨ Special Masses", count: specials.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "9999px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
              background: tab === t.key ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
              color: tab === t.key ? "var(--gold-400)" : "#6b7280",
              border: tab === t.key ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.2s",
            }}
          >
            {t.label}
            <span style={{ marginLeft: "0.5rem", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", padding: "0 6px", fontSize: "0.75rem" }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ─── REGULAR MASSES ─── */}
      {tab === "regular" && (
        <>
          <form onSubmit={addRegular} className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem", marginBottom: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Day</label>
              <select className="form-input" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Time</label>
              <TimeInput className="form-input" value={form.time} onChange={v => setForm({ ...form, time: v })} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Description</label>
              <input className="form-input" placeholder="Holy Qurbana" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Category</label>
              <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>Weekday</option>
                <option>Sunday</option>
              </select>
            </div>
            <button type="submit" className="btn-gold" style={{ padding: "0.75rem" }}>Add</button>
          </form>

          <div className="glass-card" style={{ borderRadius: "1rem", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Day", "Time", "Description", "Category", ""].map(h => (
                    <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.8125rem", color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timings.map(t => (
                  <tr key={t._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--gold-400)", fontSize: "0.875rem", fontWeight: 500 }}>{t.day}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#fff", fontSize: "0.875rem" }}>{t.time}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#d1d5db", fontSize: "0.875rem" }}>{t.description}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", background: t.category === "Sunday" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)", color: t.category === "Sunday" ? "var(--gold-400)" : "#9ca3af" }}>{t.category}</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <button onClick={() => del(t._id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "0.25rem 0.75rem", borderRadius: "0.375rem", cursor: "pointer", fontSize: "0.75rem" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ─── SPECIAL MASSES ─── */}
      {tab === "special" && (
        <>
          <div style={{ padding: "1rem", borderRadius: "1rem", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#d1d5db" }}>
            ✨ Special masses will automatically appear as announcements on the website until the expiry date.
          </div>

          <form onSubmit={addSpecial} className="glass-card" style={{ padding: "1.5rem", borderRadius: "1rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 className="font-heading" style={{ color: "var(--gold-400)", fontWeight: 600 }}>Add Special Mass</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Occasion / Feast Name</label>
                <input className="form-input" placeholder="e.g. Feast of Infant Jesus" value={spForm.special_occasion} onChange={e => setSpForm({ ...spForm, special_occasion: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Mass Time</label>
                <TimeInput className="form-input" value={spForm.time} onChange={v => setSpForm({ ...spForm, time: v })} required />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Date of Mass</label>
                <input className="form-input" type="date" value={spForm.special_date} onChange={e => setSpForm({ ...spForm, special_date: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Show Until (Expiry)</label>
                <input className="form-input" type="date" value={spForm.special_expiry} onChange={e => setSpForm({ ...spForm, special_expiry: e.target.value })} />
                <p style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "0.3rem" }}>Defaults to mass date if left empty</p>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8125rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" }}>Additional Details (optional)</label>
              <textarea className="form-input" rows={2} placeholder="e.g. Officiated by Fr. Thomas. All are welcome." value={spForm.description} onChange={e => setSpForm({ ...spForm, description: e.target.value })} style={{ resize: "vertical" }} />
            </div>
            <button type="submit" className="btn-gold" style={{ alignSelf: "flex-start", padding: "0.75rem 2rem" }}>✨ Publish Special Mass</button>
          </form>

          {/* Special Mass Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {specials.length === 0 ? (
              <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>No special masses added yet.</p>
            ) : (
              specials.map(s => {
                const active = isActive(s.special_expiry, s.special_date);
                return (
                  <div key={s._id} style={{ padding: "1.25rem", borderRadius: "1rem", background: active ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${active ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.06)"}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "1.25rem" }}>✨</span>
                        <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "1rem" }}>{s.special_occasion}</h3>
                        <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.6rem", borderRadius: "9999px", background: active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: active ? "#4ade80" : "#f87171", border: `1px solid ${active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                          {active ? "Live" : "Expired"}
                        </span>
                      </div>
                      <p style={{ color: "var(--gold-400)", fontSize: "0.85rem", fontWeight: 600 }}>
                        🕐 {s.time} &nbsp;|&nbsp; 📅 {s.special_date ? new Date(s.special_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : s.day}
                      </p>
                      {s.description && s.description !== s.special_occasion && (
                        <p style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: "0.3rem" }}>{s.description}</p>
                      )}
                      {s.special_expiry && (
                        <p style={{ color: "#6b7280", fontSize: "0.7rem", marginTop: "0.3rem" }}>
                          Visible until: {new Date(s.special_expiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    <button onClick={() => del(s._id, true)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "0.375rem 0.875rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.8125rem", flexShrink: 0 }}>Delete</button>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}