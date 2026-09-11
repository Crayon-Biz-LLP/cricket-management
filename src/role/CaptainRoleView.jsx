import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function CaptainRoleView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];
  const matches = leagueStore.matches[league.id] || [];
  const [team, setTeam] = useState(teams[0] || null);
  const [view, setView] = useState("matchday");
  const [commsView, setCommsView] = useState("announcements");

  const lineupPlayers = team?.squad?.filter((p) => p.status === "selected").map((p) => p.name) || [];
  const [lineup, setLineup] = useState({
    openingBatsman: lineupPlayers[0] || "",
    openingBowler: lineupPlayers[4] || "",
    viceCaptain: lineupPlayers[1] || "",
    impactPlayer: lineupPlayers[6] || "",
  });
  const [submitted, setSubmitted] = useState(false);

  const activeMatch = matches.find((m) => m.status !== "completed") || matches[0];

  return (
    <div>
      <div className="page-head fade-up" style={{ marginBottom: 4 }}>
        <span className="kicker">{team?.name || "Captain console"}</span>
        <h2>Captain view</h2>
        <p style={{ marginTop: 4 }}>{team ? `Managing ${team.name} inside ${league.name}` : "Select your team to enter captain mode."}</p>
      </div>

      {!team && (
        <div className="card-elevated fade-up stagger-1" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Select your team</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {teams.map((t) => (
              <div key={t.slug} className="card-ghost" style={{ padding: "12px 14px", cursor: "pointer", border: "1px solid var(--line)", transition: "border-color 0.15s ease, transform 0.15s ease" }} onClick={() => setTeam(t)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
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
              { id: "matchday", label: "Match day" },
              { id: "lineup", label: "Lineup" },
              { id: "availability", label: "Availability" },
              { id: "comms", label: "Comms" },
            ].map((t) => (
              <button key={t.id} className={`tab ${view === t.id ? "active" : ""}`} onClick={() => setView(t.id)} style={{ transition: "background 0.15s ease, color 0.15s ease" }}>
                {t.label}
              </button>
            ))}
          </div>

          {view === "matchday" && (
            <div className="fade-up stagger-2">
              <div className="grid-2">
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 4 }}>Today · {activeMatch?.date || "—"}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{activeMatch?.date}</div>
                      <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 17 }}>
                        {team.name} vs {leagueStore.teams[league.id]?.find((t) => t.slug === activeMatch?.awayTeamId)?.name || "Opponent"}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{leagueStore.venues[league.id]?.find((v) => v.id === activeMatch?.venueId)?.name || "Venue"}</div>
                    </div>
                    <span className={`status ${activeMatch?.status === "live" ? "status-live" : "status-upcoming"}`}>
                      {activeMatch?.status || "Scheduled"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn btn-primary btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>View match</button>
                    <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Prep brief</button>
                    <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Notify team</button>
                  </div>
                </div>

                <div className="card">
                  <div className="section-title" style={{ marginBottom: 4 }}>Quick actions</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      "Submit playing XI",
                      "Share availability",
                      "Check opponent squad",
                      "Review match brief",
                    ].map((a) => (
                      <button key={a} className="btn btn-outline btn-sm" style={{ justifyContent: "flex-start", textAlign: "left", transition: "background 0.15s ease, border-color 0.15s ease" }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-elevated" style={{ marginTop: 18 }}>
                <div className="section-title" style={{ marginBottom: 4 }}>Toss</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Toss winner</div>
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>{team.name}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--ink)" }}>Chose to field</div>
                </div>
              </div>
            </div>
          )}

          {view === "lineup" && (
            <div className="fade-up stagger-2">
              <div className="section-title" style={{ marginBottom: 10 }}>Playing XI · {team.name}</div>
              <div className="card">
                <div className="row" style={{ marginBottom: 14 }}>
                  {Object.entries(lineup).map(([key, val]) => (
                    <div key={key} className="card-ghost" style={{ padding: "12px 14px", transition: "background 0.15s ease, box-shadow 0.15s ease" }}>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <select
                        className="select"
                        value={val}
                        onChange={(e) => setLineup((prev) => ({ ...prev, [key]: e.target.value }))}
                      >
                        {lineupPlayers.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--line)", flexWrap: "wrap", gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => setSubmitted(false)} style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Edit XI</button>
                  <button className={`btn ${submitted ? "btn-outline" : "btn-accent"}`} onClick={() => setSubmitted(true)} style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>
                    {submitted ? "Submitted · Locked" : "Submit playing XI"}
                  </button>
                </div>
              </div>

              <div className="card-elevated" style={{ marginTop: 14 }}>
                <div className="section-title" style={{ marginBottom: 8 }}>Substitutes & impact player</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {lineupPlayers.slice(6).map((p) => (
                    <span key={p} className="pill" style={{ background: "var(--primary-soft)", color: "var(--primary)", transition: "transform 0.15s ease" }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "availability" && (
            <div className="fade-up stagger-2">
              <div className="section-title" style={{ marginBottom: 10 }}>Availability · {team.name}</div>
              <div className="card">
                <div className="field" style={{ marginBottom: 14 }}>
                  <label className="label">Player</label>
                  <select className="select">
                    <option value="">Select a player…</option>
                    {lineupPlayers.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="section-title" style={{ marginTop: 8, marginBottom: 8 }}>Rounds</div>
                <div className="row">
                  {[1, 2, 3, 4].map((n) => (
                    <label key={n} className="toggle" style={{ justifyContent: "flex-start" }}>
                      <div className="toggle-track on" />
                      <div className="toggle-thumb" style={{ transform: "translateX(16px)" }} />
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>Round {n} · available</span>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <div className="text-label" style={{ marginBottom: 8 }}>Individual matches</div>
                  <div className="row">
                    {matches.slice(0, 4).map((m) => (
                      <label key={m.id} className="toggle" style={{ justifyContent: "flex-start", padding: "6px 0" }}>
                        <div className="toggle-track on" />
                        <div className="toggle-thumb" style={{ transform: "translateX(16px)" }} />
                        <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{m.date} · {m.homeTeamId} vs {m.awayTeamId}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "comms" && (
            <div className="fade-up stagger-2">
              <div className="section-title" style={{ marginBottom: 10 }}>Team comms</div>
              <div className="card">
                <div style={{ marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label className="label">Message view</label>
                    <select className="select" value={commsView} onChange={(e) => setCommsView(e.target.value)}>
                      <option value="announcements">Announcements</option>
                      <option value="availability">Availability</option>
                      <option value="matchChat">Match chat</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {commsView === "announcements" && (
                    <>
                      {[
                        { text: "Match day schedule confirmed", time: "2h ago", channel: "Push" },
                        { text: "Availability due by Thursday", time: "1d ago", channel: "WhatsApp" },
                        { text: "Sponsor update for Round 1", time: "2d ago", channel: "Email" },
                      ].map((m, i) => (
                        <div key={i} className="card-ghost" style={{ padding: "11px 14px", borderLeft: "3px solid var(--primary)", transition: "background 0.15s ease, border-left-color 0.15s ease" }}>
                          <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{m.text}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{m.channel} · {m.time}</div>
                        </div>
                      ))}
                    </>
                  )}
                  {commsView === "availability" && (
                    <div className="card-ghost" style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Team availability</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                          { player: lineupPlayers[0], status: "Available", until: "Match day" },
                          { player: lineupPlayers[1], status: "Available", until: "Match day" },
                          { player: lineupPlayers[2], status: "Pending", until: "By Thursday" },
                        ].map((p) => (
                          <div key={p.player} className="card-ghost" style={{ padding: "10px 12px", borderLeft: "3px solid var(--line-strong)" }}>
                            <div style={{ fontWeight: 700, color: "var(--ink)" }}>{p.player}</div>
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{p.status} · {p.until}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {commsView === "matchChat" && (
                    <div className="card-ghost" style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Match chat</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                          { from: "K. Raman", message: "Toss won. We bat first.", time: "12:02" },
                          { from: "V. Mehta", message: "Bowling first works too.", time: "12:03" },
                          { from: "D. Okafor", message: "Cool, I am ready.", time: "12:04" },
                        ].map((c) => (
                          <div key={c.time} className="card-ghost" style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                              <span style={{ fontWeight: 700, color: "var(--ink)" }}>{c.from}</span>
                              <span style={{ fontSize: 11, color: "var(--muted)" }}>{c.time}</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2, paddingLeft: 4 }}>{c.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
