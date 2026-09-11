import React, { useState } from "react";

export default function AdminView({ league, franchises, sponsors, venues, upcomingFixtures, standings }) {
  const [activeTab, setActiveTab] = useState("setup");
  const [seasons, setSeasons] = useState(["2026 Senior Championship", "2025 Fall Series", "2025 Spring Knockout"]);
  const [newLeagueName, setNewLeagueName] = useState("");

  return (
    <div>
      <div className="page-head fade-up">
        <span className="pill">League Owner</span>
        <h2 style={{ marginTop: 10 }}>League administration</h2>
        <p>Configure the season, venues, fixtures, and league-wide governance for {league.name}.</p>
      </div>

      <div className="tab-list">
        {["setup", "venues", "fixtures", "standings"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "setup" ? "Season Setup" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === "setup" && (
          <div className="fade-up">
            <div className="section-title">Season Configuration</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
              <div className="card-ghost" style={{ padding: 16, textAlign: "center" }}>
                <div className="pill" style={{ marginBottom: 8 }}>Format</div>
                <div style={{ fontWeight: 800, fontSize: 28, color: "var(--ink)", letterSpacing: "-0.03em" }}>{league.format}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{league.oversPerInnings} overs per innings</div>
              </div>
              <div className="card-ghost" style={{ padding: 16, textAlign: "center" }}>
                <div className="pill" style={{ marginBottom: 8 }}>Season</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: "var(--ink)", letterSpacing: "-0.02em" }}>{league.season}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>Round-robin · Playoffs</div>
              </div>
              <div className="card-ghost" style={{ padding: 16, textAlign: "center" }}>
                <div className="pill" style={{ marginBottom: 8 }}>Tiebreaker</div>
                <div style={{ fontWeight: 800, fontSize: 28, color: "var(--ink)", letterSpacing: "-0.03em" }}>NRR</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>Net run rate decides tied positions</div>
              </div>
            </div>

            <div className="section-title">Active Seasons</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {seasons.map((s) => (
                <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", transition: "background 0.15s ease" }}>
                  <div style={{ fontWeight: 700, color: "var(--ink)" }}>{s}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Season config · T20</div>
                </div>
              ))}
            </div>

            <div className="section-title">Create New League</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <input
                style={{ flex: 1, padding: "11px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", fontSize: 14, outline: "none", background: "var(--surface)", color: "var(--ink)", transition: "border-color 0.16s ease, box-shadow 0.16s ease" }}
                placeholder="League name, e.g. West Region T20 Cup"
                value={newLeagueName}
                onChange={(e) => setNewLeagueName(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(0,32,64,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--line)"; e.target.style.boxShadow = "none"; }}
              />
              <button className="btn btn-primary" onClick={() => { if (newLeagueName.trim()) { setSeasons((prev) => [...prev, newLeagueName.trim()]); setNewLeagueName(""); } }}>
                Create League
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              League owners can run multiple leagues from the same platform, each with its own branding, teams, and rules.
            </p>
          </div>
        )}

        {activeTab === "venues" && (
          <div className="fade-up">
            <div className="section-title">Grounds & Resource Scheduling</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {venues.map((v) => (
                <div key={v.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", transition: "background 0.15s ease" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{v.name}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{v.city}</div>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: 12.5, padding: "8px 12px" }}>Manage Slots</button>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>
              Slot mapping, double-booking prevention, and automated fixture generation live here.
            </p>
          </div>
        )}

        {activeTab === "fixtures" && (
          <div className="fade-up">
            <div className="section-title">Fixtures · Round 1</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingFixtures.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", transition: "background 0.15s ease" }}>
                  <div>
                    <div className="pill" style={{ marginBottom: 6 }}>{m.stage}</div>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 16, letterSpacing: "-0.01em" }}>
                      {m.home} <span style={{ color: "var(--muted)", margin: "0 8px" }}>vs</span> <span style={{ fontWeight: 800, color: "var(--ink)" }}>{m.away}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>{m.date}</div>
                  </div>
                  <span className={`status ${m.status === "live" ? "status-live" : "status-upcoming"}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "standings" && (
          <div className="fade-up">
            <div className="section-title">Standings</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 4 }}>
              {standings.slice(0, 4).map((t, i) => (
                <div key={t.team} className={`card-ghost fade-up stagger-${i + 1}`} style={{ padding: 16, textAlign: "center", background: i < 2 ? "var(--primary-tint)" : "var(--surface-2)", borderColor: i < 2 ? "rgba(0,32,64,0.18)" : "var(--line)" }}>
                  <div style={{ fontSize: 11, color: i < 2 ? "var(--primary)" : "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>#{t.rank}</div>
                  <div style={{ fontWeight: 800, color: "var(--ink)", marginTop: 6, fontSize: 15, letterSpacing: "-0.01em" }}>{t.team}</div>
                  <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: 22, color: i < 2 ? "var(--primary)" : "var(--ink)" }}>{t.points}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>pts</span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontWeight: 700, color: t.nrr.startsWith("+") ? "var(--scorer-green)" : "var(--accent)" }}>{t.nrr}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{t.won}W · {t.lost}L</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              {standings.slice(4, 8).map((t, i) => (
                <div key={t.team} style={{ textAlign: "center", padding: "6px 4px" }} className={`fade-up stagger-${i + 5}`}>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>#{t.rank}</div>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15, marginTop: 3 }}>{t.team}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{t.points} pts</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
