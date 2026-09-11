import React, { useState } from "react";
import { leagueStore } from "./store/leagueStore";
import { roleStore } from "./store/roleStore";
import { roleModuleScope, ROLES } from "./NAV";
import { Icon } from "./icons";

export default function TopBar({ view, setView, onBackToSelection, onRoleChange }) {
  const active = leagueStore.getActiveLeague();
  const leagues = leagueStore.leagues;
  const role = roleStore.getRole();
  const nav = roleModuleScope[role] || [];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--line)",
      marginBottom: 22,
      overflow: "hidden",
    }}>
      {/* Row 1: League info + Role + League selectors */}
      <div className="topbar-identity-row" style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 55%, #061B33 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.12)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {active?.branding?.logoPath ? (
              <img src={active.branding.logoPath} alt={active.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Icon name="Trophy" size={18} style={{ color: "white" }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "white", letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {active?.name || "League Platform"}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>
              {active?.season || "Select a league"}
            </div>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm topbar-menu-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.25)", color: "white" }}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={15} />
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className={`topbar-controls${menuOpen ? " open" : ""}`}>
          <div className="topbar-switcher">
            <label className="topbar-switcher-seg">
              <span className="seg-text">
                <span className="seg-label">Role</span>
                <select
                  value={role}
                  onChange={(e) => {
                    roleStore.setRole(e.target.value);
                    const newNav = roleModuleScope[e.target.value] || [];
                    const first = newNav[0];
                    setView(first?.id || "dashboard");
                    onRoleChange();
                    setMenuOpen(false);
                  }}
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </span>
              <Icon name="ChevronDown" size={13} className="seg-chevron" />
            </label>

            <label className="topbar-switcher-seg">
              <span className="seg-text">
                <span className="seg-label">League</span>
                <select
                  value={leagueStore.activeLeagueId}
                  onChange={(e) => {
                    leagueStore.setActiveLeague(e.target.value);
                    if (window.dispatchEvent) {
                      window.dispatchEvent(new Event("league-changed"));
                    }
                    setMenuOpen(false);
                  }}
                >
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </span>
              <Icon name="ChevronDown" size={13} className="seg-chevron" />
            </label>
          </div>

          <button className="topbar-icon-btn" onClick={onBackToSelection} title="Change league">
            <Icon name="ArrowLeftRight" size={15} />
            <span>Change league</span>
          </button>
        </div>
      </div>

      {/* Row 2: Nav items */}
      <div className="topbar-nav-row">
        {nav.map((item) => {
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`topbar-nav-btn${isActive ? " active" : ""}`}
            >
              <Icon name={item.icon} size={15} strokeWidth={isActive ? 2.25 : 2} />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
