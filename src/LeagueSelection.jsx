import React, { useState } from "react";
import { leagueStore } from "./store/leagueStore";

export default function LeagueSelection({ onChooseLeague, pending }) {
  const [search, setSearch] = useState("");
  const leagues = leagueStore.leagues;

  const filtered = leagues.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.season.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, var(--surface-2) 0%, var(--surface-4) 100%)",
      padding: "32px 28px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontWeight: 900, fontSize: 32, color: "var(--ink)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Select a league
          </h1>
          <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 15 }}>
            Choose the league you want to manage. Each league has its own teams, venues, schedule, standings, and commerce.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input
            className="input"
            placeholder="Search leagues or seasons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {filtered.map((league, i) => (
            <div
              key={league.id}
              className={`scale-in stagger-${i + 1}`}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-md)",
                padding: 20,
                cursor: "pointer",
                transition: "transform 0.18s var(--ease-out), box-shadow 0.18s ease, border-color 0.18s ease",
                outline: pending === league.id ? "2px solid var(--accent)" : "none",
                outlineOffset: 2,
                opacity: pending === league.id ? 0.7 : 1,
              }}
              onClick={() => onChooseLeague(league.id)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                  <img src={league.branding?.logoPath || "/USA.jpg"} alt={league.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className={`chip ${league.status === "active" ? "chip-active" : league.status === "draft" ? "chip-draft" : "chip-completed"}`}>
                      {league.status}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    {league.name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{league.season}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                <div>
                  <div className="text-label">Format</div>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{league.format}</div>
                </div>
                <div>
                  <div className="text-label">Overs</div>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{league.oversPerInnings} overs</div>
                </div>
                <div>
                  <div className="text-label">Teams</div>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{leagueStore.teams[league.id]?.length || 0}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1, hugging: "shrink" }}>
                  <div className="text-label" style={{ marginBottom: 4 }}>Home ground</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{league.homeGround}</div>
                </div>
                <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); onChooseLeague(league.id); }}>
                  Manage league
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state" style={{ marginTop: 20 }}>
            <div className="empty-icon">🔍</div>
            <p>No leagues match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
