import React from "react";
import { leagueStore } from "../store/leagueStore";

function getTeamName(leagueId, slug) {
  const teams = leagueStore.teams[leagueId] || [];
  const t = teams.find((t) => t.slug === slug);
  return t?.name || slug;
}

export default function OverlayView() {
  const league = leagueStore.getActiveLeague();
  const sponsor = leagueStore.commerce[league?.id]?.sponsors?.[0] || { name: "League Sponsor" };
  const matches = leagueStore.matches[league?.id] || [];
  const settings = leagueStore.overlaySettings || { layout: "default", accentColor: "#C00020", bgColor: "#050A11", sponsorVisible: true };
  
  // Find a live match, or fallback to the last completed one, or just the first one
  const match = matches.find(m => m.status === "live") || matches.find(m => m.status === "completed") || matches[0];
  const innings = leagueStore.getActiveInnings(match);

  if (!league || !match || !innings) {
    return (
      <div className="overlay-shell" style={{ background: settings.bgColor }}>
        <div style={{ padding: 40, textAlign: "center", color: "var(--scorer-muted)" }}>
          No live match data available. Start a match in the Scorer to view overlay.
        </div>
      </div>
    );
  }

  const homeName = getTeamName(league.id, match.homeTeamId);
  const awayName = getTeamName(league.id, match.awayTeamId);
  const battingTeam = innings.team || (match.currentInnings === 1 ? homeName : awayName);
  const bowlingTeam = match.currentInnings === 1 ? awayName : homeName;
  const isChase = match.currentInnings === 2;

  const SponsorTag = () => (
    settings.sponsorVisible && (
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <div className="overlay-chip">Sponsored by</div>
        <div style={{ background: "white", padding: "4px 8px", borderRadius: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={settings.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 13, letterSpacing: "-0.01em" }}>{sponsor.name}</span>
        </div>
      </div>
    )
  );

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: settings.bgColor, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", overflow: "hidden" }}>
      {/* Top Left Branding */}
      <div style={{ position: "absolute", top: 20, left: 24, display: "flex", gap: 12, alignItems: "center", zIndex: 10, maxWidth: "56vw" }}>
        <div style={{ width: 50, height: 50, flexShrink: 0, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 18px -8px rgba(0,0,0,0.6)", background: "white" }}>
          <img src={league.branding?.logoPath || "/USA.jpg"} alt={league.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "1.6px", textTransform: "uppercase", color: settings.accentColor, textShadow: "0 2px 4px rgba(0,0,0,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {league.name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {league.homeGround}
          </div>
        </div>
      </div>

      {/* Top Right Match Info & Sponsor */}
      <div style={{ position: "absolute", top: 20, right: 24, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, zIndex: 10, maxWidth: "42vw" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <div className="overlay-chip-accent" style={{ display: "flex", alignItems: "center", gap: 6, borderColor: settings.accentColor, color: "#fff" }}>
            {match.status === "live" && <span className="live-dot" style={{ background: settings.accentColor }} />}
            {match.status.toUpperCase()}
          </div>
          <div className="overlay-chip">{league.format}</div>
        </div>
        <SponsorTag />
      </div>

      {/* --- DEFAULT LAYOUT (Full Scorecard) --- */}
      {settings.layout === "default" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "2.6px", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
            {league.format} · {isChase ? "Chase" : "First Innings"}
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "clamp(16px, 4vw, 32px)", marginBottom: 24, flexWrap: "wrap", maxWidth: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 700 }}>{battingTeam}</div>
              <div className="overlay-score" key={`${innings.total}-${innings.wickets}`} style={{ fontSize: "clamp(40px, 12vw, 76px)", color: "#FFFFFF", marginTop: 4, animation: "score-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                {innings.total}<span style={{ fontSize: "clamp(20px, 6vw, 36px)", color: "rgba(255,255,255,0.4)", marginLeft: 6 }}>/{innings.wickets}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "var(--scorer-green)", fontWeight: 700, letterSpacing: "0.3px" }}>RR {innings.runRate.toFixed(2)}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6px 20px", borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="overlay-score" style={{ fontSize: "clamp(36px, 10vw, 70px)", color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.03em" }}>
                {innings.overs}<span style={{ fontSize: "clamp(18px, 5vw, 34px)", color: "rgba(255,255,255,0.35)", marginLeft: 3 }}>.{innings.ballsInOver}</span>
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginTop: 6, letterSpacing: "1.6px", textTransform: "uppercase", fontWeight: 700 }}>
                Overs
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 700 }}>{bowlingTeam}</div>
              <div style={{ fontWeight: 800, fontSize: "clamp(22px, 6vw, 38px)", color: "rgba(255,255,255,0.5)", marginTop: 2, lineHeight: 1 }}>
                {isChase && match.innings1 ? match.innings1.total : "-"}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: settings.accentColor, fontWeight: 700, letterSpacing: "0.3px" }}>
                {isChase ? `Ask ${innings.requiredRate.toFixed(2)}/over` : "Bowling"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "clamp(16px, 4vw, 40px)", justifyContent: "center", marginBottom: 30, padding: "14px 26px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-xl)", border: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap", maxWidth: "94%" }}>
            {[
              { label: "On Strike", value: innings.striker || "-", accent: false },
              { label: "Non Striker", value: innings.nonStriker || "-", accent: false },
              { label: "Bowler", value: innings.bowler || "-", accent: false },
              { label: "Balls Left", value: innings.ballsRemaining, accent: true },
            ].map((row) => (
              <div key={row.label} style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)", letterSpacing: "1.6px", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{row.label}</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: row.accent ? settings.accentColor : "rgba(255,255,255,0.85)" }}>{row.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.6px", marginTop: 26 }}>
            Live browser-source overlay · drop into OBS / vMix
          </div>
        </div>
      )}

      {/* --- MINIMAL LAYOUT (Lower-Third) --- */}
      {settings.layout === "minimal" && (
        <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: 900, background: "rgba(10,15,25,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ width: 8, flexShrink: 0, background: settings.accentColor }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "1px", textTransform: "uppercase", maxWidth: 140 }}>{battingTeam}</div>
              <div className="overlay-score" key={`${innings.total}-${innings.wickets}`} style={{ fontSize: "clamp(28px, 8vw, 42px)", fontWeight: 800, color: "#fff", lineHeight: 1, animation: "score-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                {innings.total}<span style={{ fontSize: "clamp(16px, 5vw, 24px)", color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>/{innings.wickets}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px, 3vw, 30px)", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px", marginBottom: 2 }}>Overs</div>
                <div style={{ fontSize: "clamp(16px, 5vw, 22px)", fontWeight: 800, color: "white" }}>{innings.overs}.{innings.ballsInOver}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px", marginBottom: 2 }}>Run Rate</div>
                <div style={{ fontSize: "clamp(16px, 5vw, 22px)", fontWeight: 800, color: "var(--scorer-green)" }}>{innings.runRate.toFixed(2)}</div>
              </div>
              {isChase && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px", marginBottom: 2 }}>Target</div>
                  <div style={{ fontSize: "clamp(16px, 5vw, 22px)", fontWeight: 800, color: settings.accentColor }}>{match.innings1?.total}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MILESTONE LAYOUT --- */}
      {settings.layout === "milestone" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ animation: "scale-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards", textAlign: "center" }}>
            <div style={{ background: settings.accentColor, color: "white", display: "inline-block", padding: "6px 20px", fontSize: 16, fontWeight: 800, letterSpacing: "4px", textTransform: "uppercase", transform: "skewX(-15deg)", marginBottom: -10, position: "relative", zIndex: 2, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
              <div style={{ transform: "skewX(15deg)" }}>Half Century</div>
            </div>
            <div style={{ background: "rgba(10,15,25,0.9)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "clamp(22px, 6vw, 40px) clamp(20px, 8vw, 80px)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", maxWidth: "92vw" }}>
              <div style={{ fontSize: "clamp(28px, 8vw, 52px)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: 8, textTransform: "uppercase", textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                {innings.striker || "S. Carter"}
              </div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, marginBottom: 24 }}>
                {battingTeam}
              </div>
              <div style={{ display: "flex", gap: "clamp(14px, 4vw, 30px)", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "clamp(26px, 7vw, 42px)", fontWeight: 800, color: settings.accentColor, lineHeight: 1 }}>52</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginTop: 4 }}>Runs</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "clamp(26px, 7vw, 42px)", fontWeight: 800, color: "white", lineHeight: 1 }}>34</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginTop: 4 }}>Balls</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "clamp(26px, 7vw, 42px)", fontWeight: 800, color: "white", lineHeight: 1 }}>6</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginTop: 4 }}>Fours</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "clamp(26px, 7vw, 42px)", fontWeight: 800, color: "var(--scorer-green)", lineHeight: 1 }}>2</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginTop: 4 }}>Sixes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Ticker */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", zIndex: 10 }}>
        <div style={{ background: settings.accentColor, color: "white", padding: "0 16px", height: "100%", display: "flex", alignItems: "center", fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: "1px", zIndex: 2 }}>
          LATEST
        </div>
        <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", paddingLeft: 20, animation: "ticker-scroll 25s linear infinite", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
          {innings?.ballLog?.slice().reverse().slice(0, 10).map((b, i) => (
            <span key={i} style={{ marginRight: 30 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 6 }}>{b.over}.{b.ballInOver + 1}</span>
              <span style={{ color: b.kind === "W" ? settings.accentColor : b.runs >= 4 ? "var(--scorer-green)" : "white", fontWeight: b.runs >= 4 || b.kind === "W" ? 700 : 500 }}>{b.comment}</span>
            </span>
          ))}
          {(!innings?.ballLog || innings.ballLog.length === 0) && <span>Waiting for first ball...</span>}
        </div>
      </div>
    </div>
  );
}
