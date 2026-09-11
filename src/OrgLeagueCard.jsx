import React from "react";
import { leagueStore } from "./store/leagueStore";
import { Icon } from "./icons";

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default function OrgLeagueCard({ league }) {
  const standings = leagueStore.getStandings(league.id);
  const top = standings[0];

  const stats = [
    { icon: "Users", label: plural(leagueStore.teams[league.id]?.length || 0, "team") },
    { icon: "MapPin", label: plural(leagueStore.venues[league.id]?.length || 0, "venue") },
    { icon: "Handshake", label: plural(leagueStore.commerce[league.id]?.sponsors?.length || 0, "sponsor") },
    { icon: "CalendarDays", label: plural(leagueStore.matches[league.id]?.length || 0, "fixture") },
  ];

  return (
    <div
      className="card interactive-card fade-up"
      onClick={() => leagueStore.setActiveLeague(league.id)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
          <img src={league.branding?.logoPath || "/USA.jpg"} alt={league.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
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

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {stats.map((s) => (
          <div key={s.label} className="pill" style={{ background: "var(--surface-3)", color: "var(--muted-2)" }}>
            <Icon name={s.icon} size={11.5} />
            {s.label}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
          Top of standings: <strong style={{ color: "var(--ink)" }}>{top?.team}</strong> ({top?.points} pts)
        </div>
        <button className="btn btn-outline btn-sm" style={{ gap: 5 }} onClick={(e) => e.stopPropagation()}>
          Enter league <Icon name="ChevronRight" size={13} />
        </button>
      </div>
    </div>
  );
}
