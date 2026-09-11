import React from "react";
import { leagueStore } from "./store/leagueStore";
import { roleStore } from "./store/roleStore";
import { roleModuleScope } from "./NAV";

export default function TopBar({ view, setView, onBackToSelection, onRoleChange }) {
  const active = leagueStore.getActiveLeague();
  const leagues = leagueStore.leagues;
  const role = roleStore.getRole();
  const nav = roleModuleScope[role] || [];

  return (
    <header style={{
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--line)",
      marginBottom: 22,
      overflow: "hidden",
    }}>
      {/* Row 1: League info + Role + League selectors */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {active?.branding?.logoPath && (
            <div style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)" }}>
              <img src={active.branding.logoPath} alt={active.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              {active?.name || "League Platform"}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>
              {active?.season || "Select a league"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", background: "var(--surface-2)", borderRadius: "var(--radius-full)", border: "1px solid var(--line)" }}>
            <label style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase", padding: "5px 4px 5px 6px" }}>Role</label>
            <select
              className="select"
              style={{ width: "auto", minWidth: 160, padding: "5px 24px 5px 10px" }}
              value={role}
              onChange={(e) => {
                roleStore.setRole(e.target.value);
                const newNav = roleModuleScope[e.target.value] || [];
                const first = newNav[0];
                setView(first?.id || "dashboard");
                onRoleChange();
              }}
            >
              {[
                { id: "league-owner", label: "Owner", icon: "👑" },
                { id: "franchise", label: "Franchise", icon: "🏆" },
                { id: "captain", label: "Captain", icon: "🧢" },
                { id: "player", label: "Player", icon: "👤" },
                { id: "fan", label: "Fan", icon: "📣" },
                { id: "broadcaster", label: "Stream", icon: "📺" },
                { id: "sponsor", label: "Sponsor", icon: "💰" },
              ].map((r) => (
                <option key={r.id} value={r.id}>
                  <span>{r.icon} {r.label}</span>
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", background: "var(--surface-2)", borderRadius: "var(--radius-full)", border: "1px solid var(--line)" }}>
            <select
              className="select"
              style={{ width: "auto", minWidth: 160, padding: "5px 24px 5px 10px" }}
              value={leagueStore.activeLeagueId}
              onChange={(e) => {
                leagueStore.setActiveLeague(e.target.value);
                if (window.dispatchEvent) {
                  window.dispatchEvent(new Event("league-changed"));
                }
              }}
            >
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>{l.name} · {l.season}</option>
              ))}
            </select>

            <button className="btn btn-ghost btn-sm" onClick={onBackToSelection} style={{ padding: "5px 10px" }}>
              Change league
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Nav items */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "8px 16px 12px",
        borderTop: "1px solid var(--line)",
        flexWrap: "wrap",
      }}>
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 600,
              padding: "7px 11px",
              borderRadius: "var(--radius-sm)",
              background: view === item.id ? "var(--primary)" : "transparent",
              color: view === item.id ? "white" : "var(--muted)",
              border: view === item.id ? "1px solid var(--primary)" : "1px solid transparent",
              cursor: "pointer",
              transition: "background 0.16s ease, color 0.16s ease, border-color 0.16s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
