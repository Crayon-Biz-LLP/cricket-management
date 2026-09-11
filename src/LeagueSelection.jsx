import React, { useState } from "react";
import { leagueStore } from "./store/leagueStore";
import { Icon } from "./icons";

export default function LeagueSelection({ onChooseLeague, pending }) {
  const [search, setSearch] = useState("");
  const leagues = leagueStore.leagues;

  const filtered = leagues.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.season.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="league-select-shell" style={{ padding: "clamp(16px, 5vw, 32px) clamp(14px, 4vw, 28px)" }}>
      <div className="league-select-inner" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)" }}>
            <Icon name="Trophy" size={18} style={{ color: "white" }} />
          </div>
          <span className="text-label" style={{ letterSpacing: "1.4px" }}>League Platform</span>
        </div>

        <div style={{ marginBottom: 26, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(26px, 5vw, 34px)", color: "var(--ink)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Select a league
            </h1>
            <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 15, maxWidth: 560 }}>
              Choose the league you want to manage. Each league has its own teams, venues, schedule, standings, and commerce.
            </p>
          </div>
          <span className="chip chip-active" style={{ fontSize: 12 }}>
            {leagues.length} league{leagues.length === 1 ? "" : "s"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
            <Icon name="Search" size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }} />
            <input
              className="input"
              style={{ paddingLeft: 36, background: "var(--surface)" }}
              placeholder="Search leagues or seasons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-auto-lg">
          {filtered.map((league, i) => (
            <div
              key={league.id}
              className={`league-card scale-in stagger-${i + 1}`}
              style={{
                "--card-accent-1": league.branding?.primary || "var(--primary)",
                "--card-accent-2": league.branding?.accent || "var(--accent)",
                outline: pending === league.id ? "2px solid var(--accent)" : "none",
                outlineOffset: 2,
                opacity: pending === league.id ? 0.7 : 1,
              }}
              onClick={() => onChooseLeague(league.id)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                  <img src={league.branding?.logoPath || "/USA.jpg"} alt={league.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span className={`chip ${league.status === "active" ? "chip-active" : league.status === "draft" ? "chip-draft" : "chip-completed"}`}>
                      {league.status}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
                    {league.name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{league.season}</div>
                </div>
              </div>

              <div className="divider" style={{ margin: "0 0 14px" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div className="league-stat-item">
                  <span className="league-stat-icon"><Icon name="Layers" size={13} /></span>
                  <div>
                    <div className="text-label">Format</div>
                    <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{league.format}</div>
                  </div>
                </div>
                <div className="league-stat-item">
                  <span className="league-stat-icon"><Icon name="Timer" size={13} /></span>
                  <div>
                    <div className="text-label">Overs</div>
                    <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{league.oversPerInnings}</div>
                  </div>
                </div>
                <div className="league-stat-item">
                  <span className="league-stat-icon"><Icon name="Users" size={13} /></span>
                  <div>
                    <div className="text-label">Teams</div>
                    <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{leagueStore.teams[league.id]?.length || 0}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name="MapPin" size={14} style={{ color: "var(--muted-2)", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div className="text-label" style={{ marginBottom: 2 }}>Home ground</div>
                    <div style={{ fontSize: 13, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{league.homeGround}</div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ flexShrink: 0, gap: 6 }} onClick={(e) => { e.stopPropagation(); onChooseLeague(league.id); }}>
                  Manage league <Icon name="ChevronRight" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state card-ghost" style={{ marginTop: 20, background: "var(--surface)" }}>
            <div className="empty-icon" style={{ display: "flex", justifyContent: "center" }}>
              <Icon name="Search" size={30} style={{ color: "var(--muted-2)" }} />
            </div>
            <p>No leagues match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
