import React, { useState, useEffect, useRef, useCallback } from "react";
import { leagueStore } from "../store/leagueStore";

const SCORE_KEYS = [
  { runs: 1, label: "1" },
  { runs: 2, label: "2" },
  { runs: 3, label: "3" },
  { runs: 4, label: "4", boundary: true },
  { runs: 6, label: "6", boundary: true },
];

const SPECIAL_KEYS = [
  { kind: "wide", label: "Wide", color: "#F5A623" },
  { kind: "noball", label: "No Ball", color: "#3FB76E" },
  { kind: "bye", label: "Bye", color: "#6E86A2" },
  { kind: "legbye", label: "Leg Bye", color: "#6E86A2" },
];

function getTeamName(leagueId, slug) {
  const teams = leagueStore.teams[leagueId] || [];
  const t = teams.find((t) => t.slug === slug);
  return t?.name || slug;
}

function getSquad(leagueId, slug) {
  const teams = leagueStore.teams[leagueId] || [];
  const t = teams.find((t) => t.slug === slug);
  return (t?.squad || []).map((p) => p.name);
}

export default function ScorerView() {
  const league = leagueStore.getActiveLeague();
  const leagueId = league?.id;
  const matches = leagueStore.matches[leagueId] || [];

  const [selectedMatchId, setSelectedMatchId] = useState(() => {
    const inProgress = matches.find((m) => m.status === "live");
    const scheduled = matches.find((m) => m.status === "scheduled");
    return inProgress?.id || scheduled?.id || matches[0]?.id || "";
  });

  const match = matches.find((m) => m.id === selectedMatchId);
  const innings = leagueStore.getActiveInnings(match);
  const maxOvers = league?.oversPerInnings || 20;

  const [comment, setComment] = useState(innings?.lastBall?.comment || "Select a match and start scoring.");
  const [flash, setFlash] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (innings) setComment(innings.lastBall?.comment || "Ready to score.");
  }, [selectedMatchId, innings?.ballLog?.length]);

  useEffect(() => {
    if (flash) {
      const t = setTimeout(() => setFlash(null), 1600);
      return () => clearTimeout(t);
    }
  }, [flash]);

  const record = useCallback((runs, kind, label) => {
    if (!leagueId || !match) return;
    const result = leagueStore.recordBall(leagueId, match.id, { runs, kind, comment: label || "" });
    setTick((t) => t + 1);
    if (kind === "wicket") {
      setFlash({ kind: "wicket", text: label || "Wicket!" });
    } else if (kind === "wide") {
      setFlash({ kind: "wide", text: "Wide" });
    } else if (kind === "noball") {
      setFlash({ kind: "noball", text: "No Ball" });
    } else if (runs === 4 || runs === 6) {
      setFlash({ kind: "boundary", text: runs === 4 ? "Four!" : "Six!" });
    } else {
      setFlash({ kind: "runs", text: `${runs} run${runs !== 1 ? "s" : ""}` });
    }
    setComment(result?.lastBall?.comment || `${runs} run${runs !== 1 ? "s" : ""}`);
  }, [leagueId, match]);

  const handleStartMatch = () => {
    if (!leagueId || !match) return;
    leagueStore.startMatch(leagueId, match.id);
    setTick((t) => t + 1);
    setComment("Match started! Start scoring.");
    setFlash({ kind: "runs", text: "Match started" });
  };

  const handleSwapStrike = () => {
    if (!leagueId || !match) return;
    leagueStore.swapStrike(leagueId, match.id);
    setTick((t) => t + 1);
  };

  const handleEndOver = () => {
    if (!leagueId || !match) return;
    leagueStore.endOver(leagueId, match.id);
    setTick((t) => t + 1);
    setComment("Over complete. Strike rotated.");
    setFlash({ kind: "over", text: "Over complete" });
  };

  if (!league || !match) {
    return (
      <div className="scorer-shell">
        <div style={{ padding: 40, textAlign: "center", color: "var(--scorer-muted)" }}>
          No matches available. Create a league with matches first.
        </div>
      </div>
    );
  }

  const oversDecimal = innings ? innings.overs + innings.ballsInOver / 6 : 0;
  const ballsFaced = innings ? innings.total - innings.extras.total : 0;
  const homeName = getTeamName(leagueId, match.homeTeamId);
  const awayName = getTeamName(leagueId, match.awayTeamId);
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const battingTeam = innings?.team || (match.currentInnings === 1 ? homeName : awayName);

  return (
    <div className="scorer-shell">
      {/* Match Selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Select Match</div>
        <select
          className="select"
          style={{ width: "100%", padding: "10px 14px", fontSize: 14, fontWeight: 600 }}
          value={selectedMatchId}
          onChange={(e) => {
            setSelectedMatchId(e.target.value);
            setFlash(null);
          }}
        >
          {matches.map((m) => {
            const h = getTeamName(leagueId, m.homeTeamId);
            const a = getTeamName(leagueId, m.awayTeamId);
            const statusLabel = m.status === "live" ? "● LIVE" : m.status === "completed" ? "✓ Done" : "Scheduled";
            return (
              <option key={m.id} value={m.id}>
                {h} vs {a} — {m.date} ({statusLabel})
              </option>
            );
          })}
        </select>
      </div>

      {/* Boundary / Wicket Full Screen Flash */}
      {flash && (flash.kind === "boundary" || flash.kind === "wicket") && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 9999,
          background: flash.kind === "boundary" ? "radial-gradient(circle at center, rgba(63,183,110,0.15) 0%, transparent 70%)" : "radial-gradient(circle at center, rgba(192,0,32,0.15) 0%, transparent 70%)",
          animation: "score-pop 1.5s ease-out forwards"
        }} />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--scorer-muted)", letterSpacing: "1.4px", textTransform: "uppercase", fontWeight: 700 }}>
            {league.name} · {match.date} {match.startTime}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--scorer-text)", marginTop: 2 }}>
            {homeName} vs {awayName}
          </div>
          <div style={{ fontSize: 12, color: isLive ? "var(--scorer-green)" : isCompleted ? "var(--scorer-muted)" : "var(--scorer-amber)", marginTop: 2, fontWeight: 600 }}>
            {isLive ? `● Live — Innings ${match.currentInnings}` : isCompleted ? `✓ ${match.result?.winner || "Completed"}` : "Scheduled"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!isLive && !isCompleted && (
            <button className="btn" style={{ background: "var(--scorer-green)", color: "white", padding: "8px 14px", borderRadius: "var(--radius-sm)", fontWeight: 700, border: "none" }} onClick={handleStartMatch}>
              Start Match
            </button>
          )}
          {isLive && (
            <>
              <button className="btn" style={{ background: "var(--scorer-card)", color: "var(--scorer-text)", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 12px", borderRadius: "var(--radius-sm)" }} onClick={handleSwapStrike}>
                Swap Strike
              </button>
              <button className="btn" style={{ background: "var(--scorer-card)", color: "var(--scorer-text)", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 12px", borderRadius: "var(--radius-sm)" }} onClick={handleEndOver}>
                End Over
              </button>
            </>
          )}
        </div>
      </div>

      {/* Target / Balls Left */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 11, color: "var(--scorer-muted)", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 700 }}>Target</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "var(--scorer-accent)", letterSpacing: "-0.02em", marginTop: 2 }}>{innings?.target || "—"}</div>
          <div style={{ fontSize: 12, color: "var(--scorer-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600 }}>{battingTeam} chasing</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--scorer-muted)", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 700 }}>Balls Left</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "var(--scorer-text)", letterSpacing: "-0.02em", marginTop: 2 }}>{innings?.ballsRemaining ?? "—"}</div>
        </div>
      </div>

      {/* Score Blocks */}
      <div className="scorer-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 22 }}>
        {[
          { label: "Score", value: `${innings?.total ?? 0}/${innings?.wickets ?? 0}`, sub: "wickets" },
          { label: "Overs", value: oversDecimal.toFixed(1), sub: `${innings?.overs || 0}.${innings?.ballsInOver || 0}` },
          { label: "RR", value: (innings?.runRate || 0).toFixed(2), sub: "per over", color: "var(--scorer-green)" },
          { label: "RRR", value: (innings?.requiredRate || 0).toFixed(2), sub: "needed", color: "var(--scorer-accent)" },
          { label: "Extras", value: innings?.extras?.total ?? 0, sub: "total", color: "var(--scorer-accent)" },
          { label: "Faced", value: ballsFaced, sub: "balls" },
        ].map((k, i) => (
          <div key={i} className="score-block" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{k.label}</div>
            <div className="key-number" style={{ fontSize: 32, color: k.color || "var(--scorer-text)" }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--scorer-muted)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Fall of Wickets Timeline */}
      <div className="score-block" style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Fall of Wickets</div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {innings?.ballLog?.filter(b => b.kind === "W").map((b, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 40 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--scorer-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>W</div>
              <div style={{ fontSize: 11, color: "var(--scorer-muted)", marginTop: 4 }}>{b.over}.{b.ballInOver + 1}</div>
            </div>
          ))}
          {(!innings?.ballLog || innings.ballLog.filter(b => b.kind === "W").length === 0) && (
            <div style={{ fontSize: 12, color: "var(--scorer-muted)", fontStyle: "italic", alignSelf: "center" }}>No wickets fallen</div>
          )}
        </div>
      </div>

      {/* Players */}
      <div className="scorer-players-row" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
        <div className="score-block">
          <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Bowler</div>
          <div style={{ fontWeight: 700, color: "var(--scorer-text)", fontSize: 17 }}>{innings?.bowler || "—"}</div>
          <div style={{ fontSize: 12, color: "var(--scorer-muted)", marginTop: 2 }}>Over {(innings?.overs || 0) + 1}</div>
        </div>
        <div className="score-block">
          <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>On Strike</div>
          <div style={{ fontWeight: 700, color: "var(--scorer-text)", fontSize: 18 }}>{innings?.striker || "—"}</div>
        </div>
        <div className="score-block">
          <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Non Striker</div>
          <div style={{ fontWeight: 700, color: "var(--scorer-muted)", fontSize: 16 }}>{innings?.nonStriker || "—"}</div>
        </div>
        <div className="score-block">
          <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Balls Left</div>
          <div style={{ fontWeight: 700, color: "var(--scorer-accent)", fontSize: 18 }}>{innings?.ballsRemaining ?? "—"}</div>
        </div>
      </div>

      {/* This Over (Dot Matrix) */}
      <div className="score-block" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>This Over</div>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {innings?.ballLog?.filter(b => b.over === (innings.ballsInOver === 0 && innings.ballLog.length > 0 && innings.ballLog[innings.ballLog.length-1].ballInOver >= 5 ? innings.overs - 1 : innings.overs)).map((b, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 14,
              background: b.kind === "W" ? "var(--scorer-accent)" : b.runs === 4 ? "var(--scorer-green)" : b.runs === 6 ? "var(--primary)" : "var(--scorer-card-2)",
              color: (b.runs === 4 || b.runs === 6 || b.kind === "W") ? "white" : "var(--scorer-text)",
              border: (b.runs === 4 || b.runs === 6 || b.kind === "W") ? "none" : "1px solid var(--scorer-line)"
            }}>
              {b.kind === "W" ? "W" : b.runs === 0 ? "●" : b.runs}
            </div>
          ))}
          {(!innings?.ballLog || innings.ballLog.filter(b => b.over === (innings.ballsInOver === 0 && innings.ballLog.length > 0 && innings.ballLog[innings.ballLog.length-1].ballInOver >= 5 ? innings.overs - 1 : innings.overs)).length === 0) && (
            <div style={{ fontSize: 12, color: "var(--scorer-muted)", fontStyle: "italic", alignSelf: "center" }}>No balls yet in this over</div>
          )}
        </div>
      </div>

      {/* Extras Breakdown */}
      <div className="score-block" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Extras Breakdown</div>
        <div className="scorer-extras-row" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {["wides", "noBalls", "byes", "legByes", "total"].map((k) => (
            <div key={k} className="score-block" style={{ textAlign: "center", padding: "8px 4px", background: "var(--scorer-card-2)" }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: k === "total" ? "var(--scorer-accent)" : "var(--scorer-text)" }}>{innings?.extras?.[k] ?? 0}</div>
              <div style={{ fontSize: 9.5, color: "var(--scorer-muted)", textTransform: "uppercase", marginTop: 3 }}>{k.replace(/([A-Z])/g, " $1").trim()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Buttons */}
      <div className="score-block" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Runs & Boundaries</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {SCORE_KEYS.map((k) => (
            <button
              key={k.runs}
              className={`score-btn ${k.boundary ? "boundary" : ""}`}
              onClick={() => record(k.runs, "normal", `${k.runs === 4 ? "Four" : k.runs === 6 ? "Six" : k.runs} run${k.runs !== 1 ? "s" : ""}`)}
              disabled={isCompleted || !isLive}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extras & Wicket */}
      <div className="score-block" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Extras & Wicket</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {SPECIAL_KEYS.map((k) => (
            <button
              key={k.kind}
              className="score-btn extras"
              style={{ color: k.color, borderColor: k.color + "55" }}
              onClick={() => record(1, k.kind, `${k.label} — 1 run`)}
              disabled={isCompleted || !isLive}
            >
              {k.label}
            </button>
          ))}
          <button
            className="score-btn"
            style={{ color: "var(--scorer-accent)", borderColor: "rgba(192,0,32,0.4)" }}
            onClick={() => record(0, "wicket", "Wicket!")}
            disabled={isCompleted || !isLive}
          >
            Wicket
          </button>
        </div>
      </div>

      {/* On Air Comment */}
      <div className="score-block" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "var(--scorer-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>On Air Comment</div>
        <div style={{ fontSize: 14.5, color: "var(--scorer-text)", lineHeight: 1.45, fontWeight: 500 }}>
          {comment || "Tap a run value or extras key to start scoring."}
        </div>
        {flash && (
          <div style={{
            marginTop: 10,
            padding: "9px 12px",
            borderRadius: "var(--radius-sm)",
            background: flash.kind === "wicket" ? "rgba(192,0,32,0.25)" : flash.kind === "boundary" ? "rgba(63,183,110,0.22)" : flash.kind === "wide" ? "rgba(245,166,35,0.22)" : flash.kind === "over" ? "rgba(79,140,247,0.22)" : "rgba(255,255,255,0.05)",
            border: flash.kind === "wicket" ? "1px solid rgba(192,0,32,0.4)" : flash.kind === "boundary" ? "1px solid rgba(63,183,110,0.4)" : "1px solid rgba(255,255,255,0.08)",
            color: flash.kind === "wicket" ? "var(--scorer-accent)" : flash.kind === "boundary" ? "var(--scorer-green)" : flash.kind === "wide" ? "var(--scorer-amber)" : flash.kind === "over" ? "var(--scorer-blue)" : "var(--scorer-text)",
            fontWeight: 700,
            fontSize: 12.5,
          }}>
            {flash.text}
          </div>
        )}
      </div>

      <div style={{ color: "var(--scorer-muted)", fontSize: 11.5, textAlign: "center", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        Scores persist to league standings · auto-advances to next innings when a wicket falls or overs complete
      </div>
    </div>
  );
}
