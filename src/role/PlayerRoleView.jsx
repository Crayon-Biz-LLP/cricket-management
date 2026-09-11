import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function PlayerRoleView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];
  const [team, setTeam] = useState(teams[0] || null);
  const [view, setView] = useState("profile");

  const players = team?.squad || [];

  const player = players[0] || null;

  return (
    <div>
      <div className="page-head fade-up" style={{ marginBottom: 4 }}>
        <span className="kicker">{team?.name || "Player view"}</span>
        <h2>Player view</h2>
        <p style={{ marginTop: 4 }}>{team ? `Your player experience inside ${league.name}` : "Select your team first."}</p>
      </div>

      {!team && (
        <div className="card-elevated fade-up stagger-1" style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Select your team</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {teams.map((t) => (
              <div key={t.slug} className="card-ghost" style={{ padding: "12px 14px", cursor: "pointer", border: "1px solid var(--line)", transition: "border-color 0.15s ease, transform 0.15s ease" }} onClick={() => setTeam(t)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                    <img src={t.logo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--ink)" }}>{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {team && (
        <>
          <div className="tab-list fade-up stagger-1" style={{ marginBottom: 18 }}>
            {[
              { id: "profile", label: "Profile" },
              { id: "registration", label: "Registration" },
              { id: "availability", label: "Availability" },
              { id: "matches", label: "Matches" },
            ].map((t) => (
              <button key={t.id} className={`tab ${view === t.id ? "active" : ""}`} onClick={() => setView(t.id)} style={{ transition: "background 0.15s ease, color 0.15s ease" }}>
                {t.label}
              </button>
            ))}
          </div>

          {view === "profile" && (
            <div className="fade-up stagger-2">
              <div className="grid-2">
                <div className="card">
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--primary)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 24, boxShadow: "var(--shadow-md)" }}>
                      {(player?.name || "PR").split(" ").map((w) => w.charAt(0)).join("").toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 20 }}>{player?.name || "Player"}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>{player?.role || "Batsman"}</div>
                  </div>
                  <div className="field" style={{ marginBottom: 12 }}>
                    <label className="label">Team</label>
                    <div style={{ padding: "9px 12px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)" }}>
                      <span style={{ fontWeight: 700, color: "var(--ink)" }}>{team?.name}</span>
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="label">Jersey number</label>
                    <input className="input" readOnly defaultValue={player?.jerseyNumber || ""} />
                  </div>
                </div>

                <div className="card">
                  <div className="section-title" style={{ marginBottom: 4 }}>Account</div>
                  <div className="row" style={{ marginBottom: 14 }}>
                    <div className="field" style={{ marginBottom: 10 }}>
                      <label className="label">Email</label>
                      <input className="input" placeholder="player@example.com" />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="label">Phone</label>
                      <input className="input" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 12 }}>
                    <label className="label">Governing body ID</label>
                    <input className="input" placeholder="USA Cricket Member ID" />
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 4, transition: "background 0.15s ease, border-color 0.15s ease" }}>Edit profile</button>
                </div>
              </div>

              <div className="card-elevated" style={{ marginTop: 18 }}>
                <div className="section-title" style={{ marginBottom: 4 }}>Registration status</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--primary-soft)", borderRadius: "var(--radius-md)", border: "1px solid rgba(0,32,64,0.18)", transition: "background 0.15s ease", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, color: "var(--ink)" }}>Active · registered</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
                      {player?.status || "approved"} · {league.name}
                    </div>
                  </div>
                  <span className="pill" style={{ background: "var(--scorer-green)", color: "white" }}>Active</span>
                </div>
              </div>
            </div>
          )}

          {view === "registration" && (
            <div className="fade-up stagger-2">
              <div className="section-title" style={{ marginBottom: 10 }}>Registration & waivers</div>
              <div className="card">
                <div className="field" style={{ marginBottom: 14 }}>
                  <label className="label">Full name</label>
                  <input className="input" defaultValue={player?.name || ""} />
                </div>
                <div className="row" style={{ marginBottom: 14 }}>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label className="label">Role</label>
                    <select className="select" defaultValue={player?.role || "Batsman"}>
                      <option>Batsman</option>
                      <option>Bowler</option>
                      <option>All-rounder</option>
                      <option>Wicketkeeper</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="label">Team</label>
                    <select className="select" defaultValue={team?.slug || ""}>
                      {teams.map((t) => (
                        <option key={t.slug} value={t.slug}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field" style={{ marginBottom: 14 }}>
                  <label className="label">Liability waiver</label>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <label className="toggle" style={{ cursor: "pointer", alignSelf: "center" }}>
                      <div className="toggle-track on" />
                      <div className="toggle-thumb" style={{ transform: "translateX(16px)" }} />
                    </label>
                    <span style={{ fontSize: 12.5, color: "var(--muted)" }}>I agree to the liability waiver and code of conduct.</span>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Update registration</button>
              </div>
            </div>
          )}

          {view === "availability" && (
            <div className="fade-up stagger-2">
              <div className="section-title" style={{ marginBottom: 10 }}>Availability · {player?.name || "You"}</div>
              <div className="card">
                <div className="field" style={{ marginBottom: 14 }}>
                  <label className="label">Player</label>
                  <select className="select">
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="section-title" style={{ marginTop: 8, marginBottom: 8 }}>Rounds</div>
                <div className="row-3">
                  {[1, 2, 3, 4].map((n) => (
                    <label key={n} className="toggle" style={{ justifyContent: "flex-start" }}>
                      <div className="toggle-track on" />
                      <div className="toggle-thumb" style={{ transform: "translateX(16px)" }} />
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>Round {n} · available</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "matches" && (
            <div className="fade-up stagger-2">
              <div className="section-title" style={{ marginBottom: 10 }}>My matches</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {leagueStore.matches[league.id]?.map((m, i) => (
                  <div key={m.id} className={`card fade-up stagger-${Math.min(i + 1, 8)}`} style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{m.date}</div>
                        <div style={{ fontWeight: 800, color: "var(--ink)" }}>
                          {leagueStore.teams[league.id]?.find((t) => t.slug === m.homeTeamId)?.name || "Home"} vs {leagueStore.teams[league.id]?.find((t) => t.slug === m.awayTeamId)?.name || "Away"}
                        </div>
                      </div>
                      <span className={`status ${m.status === "live" ? "status-live" : m.status === "completed" ? "chip-completed" : "status-upcoming"}`}>
                        {m.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6, paddingLeft: 2 }}>
                      {leagueStore.venues[league.id]?.find((v) => v.id === m.venueId)?.name || "Venue"}
                    </div>
                  </div>
                ))}
                {leagueStore.matches[league.id]?.length === 0 && <div className="empty-state"><p>No fixtures yet.</p></div>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
