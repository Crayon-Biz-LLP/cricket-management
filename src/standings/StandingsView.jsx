import React, { useMemo } from "react";
import { leagueStore } from "../store/leagueStore";

export default function StandingsView() {
  const league = leagueStore.getActiveLeague();
  const standings = leagueStore.getStandings(league.id);
  const pointsSystem = { win: 2, tie: 1, noResult: 1, loss: 0 };

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Standings</h2>
        <p>Automatic, real-time recalculation of points, NRR, and qualification scenarios as every ball is logged.</p>
      </div>

      <div className="section-title fade-up stagger-1">Points system</div>
      <div className="card fade-up stagger-2" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Win", value: `${pointsSystem.win} pts` },
            { label: "Tie", value: `${pointsSystem.tie} pts` },
            { label: "No result", value: `${pointsSystem.noResult} pts` },
            { label: "Loss", value: `${pointsSystem.loss} pts` },
          ].map((s, i) => (
            <div key={i} style={{ padding: "8px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 16 }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Tiebreaker: NRR</div>
        </div>
      </div>

      <div className="card-elevated fade-up stagger-3">
        <div className="section-title">Points table · {league.season}</div>
        <div className="section-title" style={{ marginTop: 14, marginBottom: 0 }}>Rankings</div>
        <div style={{ display: "grid", gridTemplateColumns: "40px 1.5fr 40px 40px 40px 40px 60px 80px 80px 80px", gap: 8, padding: "8px 14px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>#</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>Team</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>P</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>W</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>L</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>T</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>Pts</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>For</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>Agst</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>NRR</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
          {standings.map((t, i) => {
            const isPos = t.nrr.startsWith("+");
            const nrrVal = Math.min(Math.abs(parseFloat(t.nrr)), 4) / 4 * 100; // max 4 for scale
            return (
            <div key={`${t.team}-${i}`} style={{ display: "grid", gridTemplateColumns: "40px 1.5fr 40px 40px 40px 40px 60px 80px 80px 80px", gap: 8, padding: "12px 14px", background: i < 2 ? "var(--primary-soft)" : "var(--surface-2)", borderRadius: "var(--radius-md)", border: i < 2 ? "1px solid rgba(0,32,64,0.18)" : "1px solid var(--line)", transition: "background 0.15s ease", alignItems: "center" }}>
              <div style={{ fontWeight: 800, color: i < 2 ? "var(--primary)" : "var(--muted)", textAlign: "center", fontSize: 13 }}>{t.rank}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10, color: "var(--ink)", border: "1px solid var(--line)" }}>
                  {t.slug.substring(0,2)}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{t.team}</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[...Array(5)].map((_, j) => (
                      <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: j < t.won ? "var(--scorer-green)" : j < t.won + t.lost ? "var(--accent)" : "var(--line)" }} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>{t.played}</div>
              <div style={{ textAlign: "center", color: "var(--scorer-green)", fontWeight: 700, fontSize: 12.5 }}>{t.won}</div>
              <div style={{ textAlign: "center", color: "var(--accent)", fontWeight: 700, fontSize: 12.5 }}>{t.lost}</div>
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>{t.tied}</div>
              <div style={{ fontWeight: 800, color: "var(--primary)", fontSize: 15, textAlign: "center" }}>{t.points}</div>
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>{t.runsFor}</div>
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>{t.runsAgainst}</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
                <div style={{ textAlign: "center", fontWeight: 700, color: isPos ? "var(--scorer-green)" : "var(--accent)", fontSize: 12.5 }}>{t.nrr}</div>
                <div style={{ display: "flex", height: 4, background: "var(--line)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: isPos ? "50%" : `${50 - nrrVal/2}%`, background: isPos ? "transparent" : "var(--accent)" }} />
                  <div style={{ width: isPos ? `${nrrVal/2}%` : "50%", background: isPos ? "var(--scorer-green)" : "transparent" }} />
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
