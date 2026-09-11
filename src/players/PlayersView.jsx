import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function PlayersView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("register");
  
  const [regForm, setRegForm] = useState({ name: "", role: "Batsman", email: "", phone: "", teamId: "", govId: "", waiver: false });

  const allPlayers = teams.flatMap((t) => (t.squad || []).map((p) => ({ ...p, team: t.name, teamId: t.slug })));
  const filtered = allPlayers.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleRegister = () => {
    if (!regForm.name || !regForm.teamId || !regForm.waiver) {
      alert("Name, team, and liability waiver are required.");
      return;
    }
    leagueStore.addPlayer(league.id, regForm.teamId, { name: regForm.name, role: regForm.role, email: regForm.email, phone: regForm.phone, govId: regForm.govId });
    setRegForm({ name: "", role: "Batsman", email: "", phone: "", teamId: "", govId: "", waiver: false });
    setTab("list");
  };

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Players & Registration</h2>
        <p>Player profiles, registration flow, availability, and roster linkage for {league.season}.</p>
      </div>

      <div className="section-title fade-up stagger-1">Actions</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }} className="fade-up stagger-2">
        <button className="btn btn-outline btn-sm" onClick={() => setTab("register")}>Registration</button>
        <button className="btn btn-outline btn-sm" onClick={() => setTab("list")}>Player list</button>
        <button className="btn btn-outline btn-sm" onClick={() => setTab("availability")}>Availability</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={() => {}}>Register player</button>
      </div>

      {tab === "register" && (
        <div className="card-elevated fade-up stagger-3">
          <div className="section-title">Registration form</div>
          <div className="row" style={{ marginBottom: 12 }}>
            <div className="field">
              <label className="label">Full name</label>
              <input className="input" placeholder="K. Raman" value={regForm.name} onChange={(e) => setRegForm({...regForm, name: e.target.value})} />
            </div>
            <div className="field">
              <label className="label">Role</label>
              <select className="select" value={regForm.role} onChange={(e) => setRegForm({...regForm, role: e.target.value})}>
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-rounder</option>
                <option>Wicketkeeper</option>
              </select>
            </div>
          </div>
          <div className="row" style={{ marginBottom: 12 }}>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" placeholder="player@example.com" value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} />
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <input className="input" placeholder="+1 (555) 000-0000" value={regForm.phone} onChange={(e) => setRegForm({...regForm, phone: e.target.value})} />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="label">Team / franchise</label>
            <select className="select" value={regForm.teamId} onChange={(e) => setRegForm({...regForm, teamId: e.target.value})}>
              <option value="">Select a team…</option>
              {teams.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="label">Governing body ID</label>
            <input className="input" placeholder="USA Cricket Member ID (optional)" value={regForm.govId} onChange={(e) => setRegForm({...regForm, govId: e.target.value})} />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="label">Liability waiver</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label className="toggle" style={{ cursor: "pointer" }} onClick={() => setRegForm({...regForm, waiver: !regForm.waiver})}>
                <div className={`toggle-track ${regForm.waiver ? 'on' : ''}`} />
                <div className="toggle-thumb" style={regForm.waiver ? { transform: "translateX(16px)" } : {}} />
              </label>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>I agree to the liability waiver and code of conduct.</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleRegister}>Submit registration</button>
        </div>
      )}

      {tab === "list" && (
        <div className="fade-up stagger-3">
          <div className="section-title">Players · {league.name}</div>
          <div className="row" style={{ marginBottom: 14 }}>
            <div className="field" style={{ flex: 2 }}>
              <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search players…" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <select className="select">
                <option>All teams</option>
                {teams.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filtered.map((p, i) => (
              <div key={p.id} className="card fade-up stagger-${Math.min(i + 1, 8)}" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="avatar avatar-sm" style={{ background: "var(--primary)", color: "white", fontSize: 11 }}>
                    {p.name.split(" ").map((w) => w.charAt(0)).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.team} · {p.role}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="pill" style={{ background: "var(--surface-3)", color: "var(--muted-2)" }}>#{p.jerseyNumber}</span>
                  <span className="pill" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>{p.status}</span>
                  <button className="btn btn-outline btn-sm">View</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="empty-state"><p>No players match your search.</p></div>}
          </div>
        </div>
      )}

      {tab === "availability" && (
        <div className="fade-up stagger-3">
          <div className="section-title">Captain availability</div>
          <div className="card-elevated">
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Team</label>
              <select className="select">
                <option value="">Select a team…</option>
                {teams.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div className="text-label" style={{ marginBottom: 8 }}>Round availability</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[1, 2, 3, 4].map((n) => (
                  <label key={n} className="toggle" style={{ justifyContent: "flex-start" }}>
                    <div className="toggle-track on" />
                    <div className="toggle-thumb" />
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>Round {n} · available</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="label">Notes</label>
              <textarea className="input textarea" placeholder="Any availability notes…" />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm">Save availability</button>
              <button className="btn btn-outline btn-sm">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
