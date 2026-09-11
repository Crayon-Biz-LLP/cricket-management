import React from "react";
import { leagueStore } from "./store/leagueStore";

export default function OrgLeagueCard({ league }) {
  const standings = leagueStore.getStandings(league.id);
  const top = standings[0];

  return (
    <div
      className="card fade-up"
      style={{ cursor: "pointer", transition: "transform 0.18s var(--ease-out), box-shadow 0.18s ease" }}
      onClick={() => leagueStore.setActiveLeague(league.id)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
          <img src={league.branding?.logoPath || "/USA.jpg"} alt={league.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span className={`chip ${league.status === "active" ? "chip-active" : league.status === "draft" ? "chip-draft" : "chip-completed"}`}>
              {league.status}
            </span>
            <span className="chip" style={{ background: "var(--surface-3)", color: "var(--muted-2)" }}>
              {league.season}
            </span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            {league.name}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{league.format} · {league.oversPerInnings} overs</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <div className="pill" style={{ background: "var(--surface-3)", color: "var(--muted-2)", padding: "4px 9px", fontSize: 11.5 }}>
          {leagueStore.teams[league.id]?.length || 0} teams
        </div>
        <div className="pill" style={{ background: "var(--surface-3)", color: "var(--muted-2)", padding: "4px 9px", fontSize: 11.5 }}>
          {leagueStore.venues[league.id]?.length || 0} venues
        </div>
        <div className="pill" style={{ background: "var(--surface-3)", color: "var(--muted-2)", padding: "4px 9px", fontSize: 11.5 }}>
          {leagueStore.commerce[league.id]?.sponsors?.length || 0} sponsors
        </div>
        <div className="pill" style={{ background: "var(--surface-3)", color: "var(--muted-2)", padding: "4px 9px", fontSize: 11.5 }}>
          {leagueStore.matches[league.id]?.length || 0} fixtures
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
          Top of standings: <strong style={{ color: "var(--ink)" }}>{top?.team}</strong> ({top?.points} pts)
        </div>
        <button className="btn btn-outline btn-sm">Enter league</button>
      </div>
    </div>
  );
}
