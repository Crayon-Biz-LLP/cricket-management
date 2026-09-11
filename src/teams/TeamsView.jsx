import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function TeamsView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];
  const [selected, setSelected] = useState(teams[0] || null);
  const [view, setView] = useState("list");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    leagueStore.addTeam(league.id, form);
    setShowAdd(false);
    setForm({});
    setSelected(leagueStore.teams[league.id]?.[0] || null);
  };

  const initial = (name) => (name || "?").split(" ").map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase();

  const resultRows = selected?.results || [];

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Teams & Franchises</h2>
        <p>Franchise profiles, squads, branding, sponsors, and recent results for {league.season}.</p>
      </div>

      <div className="section-title fade-up stagger-1">Views</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }} className="fade-up stagger-2">
        <button className={`btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>List</button>
        <button className={`btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>Grid</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={() => { setForm({ name: "", logo: "", owner: "", homeVenue: "", founded: "", sponsors: [] }); setShowAdd(true); }}>
          Add team
        </button>
      </div>

      {view === "list" && (
        <div className="fade-up stagger-3">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {teams.map((t, i) => (
              <div
                key={t.slug}
                className="card"
                style={{ cursor: "pointer", transition: "border-color 0.16s ease", outline: selected?.slug === t.slug ? "2px solid var(--primary)" : "none", outlineOffset: 2 }}
                onClick={() => setSelected(t)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                    <img src={t.logo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15, letterSpacing: "-0.02em" }}>{t.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.owner} · est. {t.founded}</div>
                  </div>
                  <div className="pill" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>{t.squad?.length || 0} players</div>
                </div>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Home: <strong style={{ color: "var(--ink)" }}>{t.homeVenue}</strong></span>
                  {t.sponsors.length > 0 && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Sponsors: <strong style={{ color: "var(--ink)" }}>{t.sponsors[0].name}</strong></span>}
                  {resultRows.length > 0 && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Last: <strong style={{ color: "var(--ink)" }}>{resultRows[0].result}</strong></span>}
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button className="btn btn-outline btn-sm">Squad</button>
                  <button className="btn btn-outline btn-sm">Branding</button>
                  <button className="btn btn-ghost btn-sm">Results</button>
                </div>
              </div>
            ))}
            {teams.length === 0 && <div className="empty-state"><p>No teams yet.</p></div>}
          </div>
        </div>
      )}

      {view === "grid" && (
        <div className="fade-up stagger-3">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {teams.map((t, i) => (
              <div key={t.slug} className="card-elevated" style={{ cursor: "pointer", outline: selected?.slug === t.slug ? "2px solid var(--primary)" : "none", outlineOffset: 2 }} onClick={() => setSelected(t)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                    <img src={t.logo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>{t.name}</div>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10 }}>{t.owner}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {t.sponsors.slice(0, 2).map((s) => (
                    <span key={s.id} style={{ fontSize: 11, color: "var(--muted-2)", background: "var(--surface-2)", padding: "3px 7px", borderRadius: "var(--radius-sm)" }}>{s.name}</span>
                  ))}
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                  <button className="btn btn-outline btn-sm">Squad</button>
                  <button className="btn btn-ghost btn-sm">Branding</button>
                </div>
              </div>
            ))}
            {teams.length === 0 && <div className="empty-state"><p>No teams yet.</p></div>}
          </div>
        </div>
      )}

      {selected && (
        <div style={{ marginTop: 18 }} className="fade-up stagger-4">
          <div className="card-elevated">
            <div className="section-title">{selected.name} — profile</div>
            <div className="flex-2">
              <div>
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 14, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                    <img src={selected.logo} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 20, letterSpacing: "-0.02em" }}>{selected.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>Franchise · {league.season}</div>
                  </div>
                </div>

                <div className="row" style={{ marginBottom: 10 }}>
                  <div className="field">
                    <label className="label">Owner</label>
                    <input className="input" value={selected.owner || ""} readOnly />
                  </div>
                  <div className="field">
                    <label className="label">Founded</label>
                    <input className="input" value={selected.founded || ""} readOnly />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Home venue</label>
                  <input className="input" value={selected.homeVenue || ""} readOnly />
                </div>
              </div>

              <div className="section-title" style={{ marginTop: 18 }}>Squad · {selected.squad?.length || 0} players</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                {(selected.squad || []).slice(0, 8).map((p) => (
                  <div key={p.id} className="card-ghost" style={{ padding: 10, textAlign: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, margin: "0 auto 6px" }}>
                      {initial(p.name)}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>{p.name}</div>
                    <div style={{ fontSize: 10.5, color: "var(--muted)" }}>{p.role} · #{p.jerseyNumber}</div>
                  </div>
                ))}
              </div>

              <div className="section-title" style={{ marginTop: 6 }}>Sponsors</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {(selected.sponsors || []).map((s) => (
                  <span key={s.id} className="pill" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>{s.name} · {s.tier}</span>
                ))}
              </div>

              {(selected.results || []).length > 0 && (
                <>
                  <div className="section-title" style={{ marginTop: 6 }}>Recent results</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(selected.results || []).slice(0, 4).map((r) => (
                      <div key={r.date} className="card-ghost" style={{ padding: "10px 14px", borderLeft: `3px solid ${r.result.includes("Won") ? "var(--scorer-green)" : "var(--accent)"}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--ink)" }}>vs {r.opponent}</div>
                            <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.date}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13 }}>{r.result}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button className="btn btn-primary btn-sm">Edit team</button>
              <button className="btn btn-outline btn-sm">Squad management</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add team</h3>
              <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="label">Team name</label>
                <input className="input" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Seattle Moose" />
              </div>
              <div className="field">
                <label className="label">Logo</label>
                <input className="input" value={form.logo || ""} onChange={(e) => updateField("logo", e.target.value)} placeholder="/IMG_3555.JPG" />
              </div>
              <div className="row">
                <div className="field">
                  <label className="label">Owner</label>
                  <input className="input" value={form.owner} onChange={(e) => updateField("owner", e.target.value)} placeholder="MT Sports Group" />
                </div>
                <div className="field">
                  <label className="label">Founded</label>
                  <input className="input" value={form.founded} onChange={(e) => updateField("founded", e.target.value)} placeholder="2019" />
                </div>
              </div>
              <div className="field">
                <label className="label">Home venue</label>
                <select className="select" value={form.homeVenue} onChange={(e) => updateField("homeVenue", e.target.value)}>
                  <option value="">Select a venue…</option>
                  {leagueStore.venues[league.id]?.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Add team</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
