import React from "react";
import { leagueStore } from "../store/leagueStore";

export default function FanRoleView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];
  const standings = leagueStore.getStandings(league.id);
  const matches = leagueStore.matches[league.id] || [];
  const commerce = leagueStore.commerce[league.id] || {};
  const top = standings[0];
  const liveMatch = matches.find(m => m.status === "live");
  const liveInnings = liveMatch ? leagueStore.getActiveInnings(liveMatch) : null;

  return (
    <div>
      {liveMatch && liveInnings && (
        <div className="fade-up" style={{ display: "flex", alignItems: "center", background: "var(--scorer-card-2)", padding: "10px 16px", borderRadius: "var(--radius-md)", marginBottom: 16, border: "1px solid var(--scorer-accent-glow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--scorer-accent)", animation: "blink 1.5s infinite" }} />
            <span style={{ fontWeight: 800, color: "var(--scorer-accent)", fontSize: 13, textTransform: "uppercase", letterSpacing: "1px" }}>LIVE</span>
          </div>
          <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>
            {teams.find(t => t.slug === (liveMatch.innings1.isComplete ? liveMatch.awayTeamId : liveMatch.homeTeamId))?.name}: 
            <span style={{ color: "var(--primary)", fontWeight: 900, marginLeft: 8 }}>{liveInnings.total}/{liveInnings.wickets}</span>
            <span style={{ color: "var(--muted)", marginLeft: 6, fontSize: 13 }}>({liveInnings.overs}.{liveInnings.ballsInOver} ov)</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>CRR: {liveInnings.runRate.toFixed(2)}</div>
        </div>
      )}
      <div className="page-head fade-up" style={{ marginBottom: 6 }}>
        <span className="kicker">{league.name}</span>
        <h2>Public hub</h2>
        <p style={{ marginTop: 4, color: "var(--muted)" }}>Live scorecard, standings, match center, content, and commerce.</p>
      </div>

      <div className="grid-2 fade-up stagger-1" style={{ marginBottom: 18 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Standings</div>
            <span className="chip" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>{league.season}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {standings.slice(0, 4).map((t, i) => (
              <div key={t.team} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: i < 2 ? "var(--primary-soft)" : "var(--surface-2)", borderRadius: "var(--radius-sm)", border: i < 2 ? "1px solid rgba(0,32,64,0.18)" : "1px solid var(--line)", transition: "transform 0.15s ease, background 0.15s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 800, color: i < 2 ? "var(--primary)" : "var(--muted)", width: 20, textAlign: "center" }}>{t.rank}</span>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{t.team}</span>
                </div>
                <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: 13 }}>{t.points} pts</span>
              </div>
            ))}
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 10, width: "100%", justifyContent: "center", transition: "background 0.15s ease, border-color 0.15s ease" }}>Full standings</button>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 4 }}>Next match</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 11, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
              <img src={teams[0]?.logo} alt={teams[0]?.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{matches[1]?.date || "—"}</div>
              <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>
                {teams[0]?.name || "Home"} vs {teams[1]?.name || "Away"}
              </div>
            </div>
          </div>
          <div className="pill" style={{ marginBottom: 12 }}>{matches[1]?.status || "Scheduled"}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Watch match</button>
            <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Buy tickets</button>
          </div>
        </div>
      </div>

      <div className="card-elevated fade-up stagger-2" style={{ marginTop: 4, padding: "20px 22px" }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Match center · {matches[1]?.homeTeamId || "Home"} vs {matches[1]?.awayTeamId || "Away"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card-ghost" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{matches[1]?.date}</div>
            <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15, marginBottom: 6 }}>
              {leagueStore.teams[league.id]?.find((t) => t.slug === matches[1]?.homeTeamId)?.name || "Home"}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontWeight: 800, color: "var(--ink)" }}>vs</span>
              <span style={{ fontWeight: 800, color: "var(--ink)" }}>{leagueStore.teams[league.id]?.find((t) => t.slug === matches[1]?.awayTeamId)?.name || "Away"}</span>
            </div>
          </div>
          <div className="card-ghost" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Venue</div>
            <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>
              {leagueStore.venues[league.id]?.find((v) => v.id === matches[1]?.venueId)?.name || "Riverside Sports Complex"}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
              {leagueStore.venues[league.id]?.find((v) => v.id === matches[1]?.venueId)?.city || "New Jersey"}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button className="btn btn-primary btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Live stream</button>
          <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Replay</button>
          <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Get tickets</button>
        </div>
      </div>

      <div className="fade-up stagger-3" style={{ marginTop: 18 }}>
        <div className="section-title" style={{ marginBottom: 10 }}>Latest content</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "NY X Factor take opener by 5 runs", tag: "Match", color: "var(--accent)" },
            { title: "Player of the match: S. Carter", tag: "Player", color: "var(--primary)" },
            { title: "Round 1 schedule confirmed", tag: "League", color: "var(--primary)" },
          ].map((c, i) => (
            <div key={i} className="card-ghost" style={{ padding: "12px 14px", borderLeft: `3px solid ${c.color}`, transition: "background 0.15s ease, border-left-color 0.15s ease" }}>
              <div style={{ fontSize: 11.5, color: "white", background: c.color, padding: "3px 8px", borderRadius: "var(--radius-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", display: "inline-block", marginBottom: 6 }}>
                {c.tag}
              </div>
              <div style={{ fontWeight: 800, color: "var(--ink)" }}>{c.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>2h ago · {league.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-3 fade-up stagger-4" style={{ marginTop: 18 }}>
        <div className="card" style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
          <div className="section-title" style={{ marginBottom: 6 }}>Tickets</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>Round 1 · Match 2</div>
          <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 24 }}>$18</div>
          <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 8, transition: "background 0.15s ease, border-color 0.15s ease" }}>Get tickets</button>
        </div>
        <div className="card" style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
          <div className="section-title" style={{ marginBottom: 6 }}>Merchandise</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>Team jerseys</div>
          <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 24 }}>From $34</div>
          <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 8, transition: "background 0.15s ease, border-color 0.15s ease" }}>Shop</button>
        </div>
        <div className="card" style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
          <div className="section-title" style={{ marginBottom: 6 }}>Sponsor</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>S</div>
            <div>
              <div style={{ fontWeight: 800, color: "var(--ink)" }}>Spinwide Sports</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Lead partner</div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 4, transition: "background 0.15s ease, border-color 0.15s ease" }}>Learn more</button>
        </div>
      </div>
    </div>
  );
}
