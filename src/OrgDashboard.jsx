import React, { useState } from "react";
import { leagueStore } from "./store/leagueStore";
import OrgLeagueCard from "./OrgLeagueCard";
import ActivityFeed from "./ActivityFeed";
import { Icon } from "./icons";

export default function OrgDashboard({ setView }) {
  const active = leagueStore.getActiveLeague();
  const leagues = leagueStore.leagues;
  const standings = leagueStore.getStandings(active?.id);
  const [showAddLeague, setShowAddLeague] = useState(false);
  const [newLeague, setNewLeague] = useState({ name: "", season: "2026", format: "T20" });

  const handleCreateLeague = () => {
    if (!newLeague.name) return;
    leagueStore.addLeague({
      ...newLeague,
      id: "l-" + Math.random().toString(36).slice(2, 8),
      status: "draft",
      branding: { primary: "#002040", accent: "#C00020", secondary: "#1E3A6B", logoPath: "/USA.jpg" }
    });
    setShowAddLeague(false);
    setNewLeague({ name: "", season: "2026", format: "T20" });
    if (window.dispatchEvent) {
      window.dispatchEvent(new Event("league-changed"));
    }
  };

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">Organization</span>
        <h2>League overview</h2>
        <p>One platform, many leagues. Each league has its own identity, teams, schedule, standings, and commerce.</p>
      </div>

      <div className="grid-2 fade-up stagger-1">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Active leagues</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddLeague(true)}>
              <Icon name="Plus" size={14} /> New league
            </button>
          </div>
          
          {showAddLeague && (
            <div className="card" style={{ marginBottom: 12, padding: "16px" }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Create new league</div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label className="label">League name</label>
                <input className="input" placeholder="e.g. Winter T10 Cup" value={newLeague.name} onChange={e => setNewLeague({...newLeague, name: e.target.value})} autoFocus />
              </div>
              <div className="row" style={{ marginBottom: 14 }}>
                <div className="field">
                  <label className="label">Season</label>
                  <input className="input" value={newLeague.season} onChange={e => setNewLeague({...newLeague, season: e.target.value})} />
                </div>
                <div className="field">
                  <label className="label">Format</label>
                  <select className="select" value={newLeague.format} onChange={e => setNewLeague({...newLeague, format: e.target.value})}>
                    <option>T20</option>
                    <option>T10</option>
                    <option>40-Over</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleCreateLeague}>Create</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowAddLeague(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {leagues.map((league) => (
              <OrgLeagueCard key={league.id} league={league} />
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">At a glance · {active?.name}</div>
          <div className="card-elevated">
            <div className="stat-grid stat-grid-tight" style={{ marginBottom: 16 }}>
              {[
                { label: "Format", value: active?.format || "—", sub: active?.oversPerInnings ? `${active.oversPerInnings} overs` : null },
                { label: "Teams", value: leagueStore.teams[active?.id]?.length || 0 },
                { label: "Standings", value: standings[0]?.team || "—", sub: standings[0]?.points ? `${standings[0].points} pts` : null },
                { label: "Sponsors", value: leagueStore.commerce[active?.id]?.sponsors?.length || 0, sub: "active" },
              ].map((stat, i) => (
                <div key={i} className="stat-tile">
                  <div className="text-label" style={{ marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 17, letterSpacing: "-0.01em", marginBottom: stat.sub ? 2 : 0 }}>{stat.value}</div>
                  {stat.sub && <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{stat.sub}</div>}
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="row">
              <button className="btn btn-primary" style={{ whiteSpace: "nowrap" }} onClick={() => setView?.("schedule")}>
                <Icon name="CalendarDays" size={14} /> Quick schedule
              </button>
              <button className="btn btn-outline" style={{ whiteSpace: "nowrap" }} onClick={() => setView?.("commerce")}>
                <Icon name="Wallet" size={14} /> Commerce
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-elevated fade-up stagger-3" style={{ marginTop: 18 }}>
        <div className="section-title">Recent activity</div>
        <ActivityFeed activity={leagueStore.activity.filter((a) => a.leagueId === active?.id || a.leagueId === leagues[0]?.id)} />
      </div>
    </div>
  );
}
