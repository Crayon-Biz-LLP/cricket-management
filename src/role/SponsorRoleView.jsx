import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function SponsorRoleView() {
  const league = leagueStore.getActiveLeague();
  const commerce = leagueStore.commerce[league.id] || {};
  const [tab, setTab] = useState("placements");
  const [search, setSearch] = useState("");

  const filtered = (commerce.sponsors || []).filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-head fade-up" style={{ marginBottom: 4 }}>
        <span className="kicker accent">Sponsor portal</span>
        <h2>My sponsorships</h2>
        <p style={{ marginTop: 4, color: "var(--muted)" }}>Placements, visibility, and reporting across {league.name}.</p>
      </div>

      <div className="tab-list fade-up stagger-1" style={{ marginBottom: 18 }}>
        {[
          { id: "placements", label: "Placements" },
          { id: "inventory", label: "Inventory" },
          { id: "reporting", label: "Reporting" },
          { id: "settings", label: "Settings" },
        ].map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} style={{ transition: "background 0.15s ease, color 0.15s ease" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="section-title fade-up stagger-1" style={{ marginBottom: 10 }}>Search sponsors</div>
      <input className="input fade-up stagger-2" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your sponsorships…" style={{ maxWidth: 320, marginBottom: 16 }} />

      {tab === "placements" && (
        <div className="fade-up stagger-2">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((s, i) => (
              <div key={s.id} className="card fade-up stagger-${Math.min(i + 1, 8)}" style={{ padding: "15px 18px", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>{s.placements?.join(" · ") || "—"}</div>
                  </div>
                  <span className={`chip ${s.status === "active" ? "chip-active" : s.status === "reserved" ? "chip-live" : "chip-pending"}`}>{s.status}</span>
                </div>
                <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>${s.pricing?.toLocaleString() || 0} / season</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Tier: {s.tier}</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Renewal: {s.renewalDate || "—"}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="empty-state"><p>No sponsorships found.</p></div>}
          </div>
        </div>
      )}

      {tab === "inventory" && (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 12 }}>Ad inventory</div>
          <div className="card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { name: "Overlay", status: "active", price: "$2,400 / season" },
                { name: "Footer", status: "active", price: "$1,200 / season" },
                { name: "Ticker", status: "active", price: "$900 / season" },
                { name: "Stream overlay", status: "reserved", price: "$1,500 / season" },
                { name: "Team pages", status: "active", price: "$1,900 / season" },
                { name: "Storefront", status: "pending", price: "$1,200 / season" },
              ].map((item, i) => (
                <div key={i} className="card-ghost" style={{ padding: "13px 15px", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--ink)" }}>{item.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>{item.price}</div>
                    </div>
                    <span className={`chip ${item.status === "active" ? "chip-active" : item.status === "reserved" ? "chip-live" : "chip-pending"}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "reporting" && (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 12 }}>Visibility & reporting</div>
          <div className="card-elevated" style={{ padding: "18px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Overlay impressions", value: "12.4k", sub: "this season" },
                { label: "Footer views", value: "8.2k", sub: "this season" },
                { label: "Sponsored content", value: "14", sub: "posts" },
                { label: "Team page placements", value: "6", sub: "active" },
              ].map((r, i) => (
                <div key={i} style={{ padding: "13px 10px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", textAlign: "center", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
                  <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 20 }}>{r.value}</div>
                  <div style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 3 }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{r.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Export report</button>
              <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Request review</button>
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 12 }}>Partner settings</div>
          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="row" style={{ marginBottom: 16 }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label className="label">Sponsor name</label>
                <input className="input" defaultValue={filtered[0]?.name || ""} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">Tier</label>
                <select className="select" defaultValue={filtered[0]?.tier || "silver"}>
                  <option value="lead">Lead</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                </select>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 14 }}>
              <label className="label">Logo</label>
              <input className="input" placeholder="Upload sponsor logo" />
            </div>
            <div className="field" style={{ marginBottom: 14 }}>
              <label className="label">Contact email</label>
              <input className="input" placeholder="sponsor@example.com" />
            </div>
            <div className="field" style={{ marginBottom: 4 }}>
              <label className="label">Notes</label>
              <textarea className="input textarea" placeholder="Sponsor notes…" />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn btn-primary btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Save</button>
              <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
