import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function CommerceView() {
  const league = leagueStore.getActiveLeague();
  const commerce = leagueStore.commerce[league.id] || { sponsors: [], tickets: [], merch: [], cart: [] };
  const [tab, setTab] = useState("sponsors");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sponsorFiltered = commerce.sponsors.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const merchGrid = commerce.merch.length ? commerce.merch.map(m => {
    const t = leagueStore.teams[league.id]?.find(team => team.slug === m.teamId);
    return {
      ...m,
      teamName: t?.name || m.teamId,
      colors: t?.colors || { primary: "#1E5BB8", accent: "#163A70" }
    };
  }) : [
    { id: "mer1", teamId: "seattlemoose", teamName: "Seattle Moose", price: 34, stock: 82, status: "available", colors: { primary: "#1E5BB8", accent: "#163A70" } },
    { id: "mer2", teamId: "ny-xfactor", teamName: "NY X Factor", price: 34, stock: 54, status: "low-stock", colors: { primary: "#C00020", accent: "#7A0014" } },
    { id: "mer3", teamId: "dallas-lions", teamName: "Dallas Lions", price: 38, stock: 0, status: "unavailable", colors: { primary: "#C99A1F", accent: "#947214" } },
    { id: "mer4", teamId: "washingtoneagles", teamName: "Washington Eagles", price: 36, stock: 94, status: "available", colors: { primary: "#1B4D2E", accent: "#0F3320" } },
  ];

  const teamLogo = (teamId) => {
    const t = leagueStore.teams[league.id]?.find((t) => t.slug === teamId);
    return t?.logo || "/USA.jpg";
  };

  const handleAddSponsor = () => {
    leagueStore.commerce[league.id].sponsors.push({ id: Math.random().toString(36).slice(2, 9), ...form, status: "pending", pricing: parseInt(form.pricing, 10) || 0 });
    setAdding(false);
    setForm({});
  };

  const addToCart = (item) => {
    if (item.status === "unavailable") return;
    leagueStore.addToCart(league.id, { ...item, size: "M", name: "", number: "" });
  };

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Commerce</h2>
        <p>Sponsors, ad inventory, tickets, and merchandise — the revenue layer for {league.season}.</p>
      </div>

      <div className="tab-list fade-up stagger-1">
        {[
          { id: "sponsors", label: "Sponsors & Ads", count: commerce.sponsors.length },
          { id: "tickets", label: "Tickets", count: commerce.tickets.length },
          { id: "merch", label: "Merchandise", count: merchGrid.length },
        ].map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label} {t.count > 0 ? <span style={{ marginLeft: 4, background: "var(--primary-soft)", color: "var(--primary)", padding: "1px 6px", borderRadius: "var(--radius-full)", fontSize: 11 }}>{t.count}</span> : null}
          </button>
        ))}
      </div>

      {/* Revenue Dashboard */}
      <div className="fade-up stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24, marginTop: 12 }}>
        {[
          { label: "Total Revenue", value: "$18,450", color: "var(--scorer-green)" },
          { label: "Sponsors Active", value: commerce.sponsors.length, color: "var(--ink)" },
          { label: "Tickets Sold", value: commerce.tickets.reduce((sum, t) => sum + t.sold, 0), color: "var(--ink)" },
          { label: "Merch Orders", value: 34, color: "var(--ink)" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "16px 14px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontWeight: 800, color: s.color, fontSize: 24, letterSpacing: "-0.02em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {tab === "sponsors" && (
        <div className="fade-up stagger-2">
          <div className="section-title">Sponsor inventory</div>
          <div className="row" style={{ marginBottom: 14 }}>
            <div className="field" style={{ flex: 2 }}>
              <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sponsors…" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <button className="btn btn-primary btn-sm" onClick={() => { setForm({ name: "", tier: "silver", status: "pending", pricing: 0, placements: [] }); setAdding(true); }}>Add sponsor</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sponsorFiltered.map((s, i) => (
              <div key={s.id} className="card fade-up stagger-${Math.min(i + 1, 8)}" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 1 }}>{s.placements?.join(" · ") || "—"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>${s.pricing?.toLocaleString()} / season</span>
                  <span className={`pill ${s.status === "active" ? "chip-active" : s.status === "reserved" ? "chip-live" : "chip-draft"}`}>{s.status}</span>
                  <button className="btn btn-outline btn-sm">Edit</button>
                </div>
              </div>
            ))}
            {sponsorFiltered.length === 0 && <div className="empty-state"><p>No sponsors found.</p></div>}
          </div>

          {adding && (
            <div className="modal-overlay" onClick={() => setAdding(false)}>
              <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add sponsor</h3>
                  <button className="modal-close" onClick={() => setAdding(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="field">
                    <label className="label">Sponsor name</label>
                    <input className="input" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Spinwide Sports" />
                  </div>
                  <div className="row">
                    <div className="field">
                      <label className="label">Tier</label>
                      <select className="select" value={form.tier} onChange={(e) => updateField("tier", e.target.value)}>
                        <option value="lead">Lead</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Pricing</label>
                      <input className="input" value={form.pricing} onChange={(e) => updateField("pricing", e.target.value)} placeholder="1200" />
                    </div>
                  </div>
                  <div className="section-title" style={{ marginTop: 6, marginBottom: 8 }}>Placements</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["overlay", "footer", "ticker", "team pages", "splash", "stream overlay", "halftime", "storefront"].map((p) => (
                      <label key={p} className="toggle" style={{ cursor: "pointer", justifyContent: "flex-start" }}>
                        <div className={`toggle-track ${form.placements?.includes(p) ? "on" : ""}`} />
                        <div className="toggle-thumb" />
                        <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={() => setAdding(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddSponsor}>Add sponsor</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "tickets" && (
        <div className="fade-up stagger-2">
          <div className="section-title">Tickets · {league.season}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
            {commerce.tickets.map((t, i) => {
              const pct = Math.round((t.sold / t.capacity) * 100);
              return (
                <div key={t.id} className="card-elevated fade-up stagger-${Math.min(i + 1, 8)}">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>
                      {leagueStore.matches[league.id]?.find((m) => m.id === t.matchId)?.homeTeamId || "Seattle Moose"} vs {leagueStore.matches[league.id]?.find((m) => m.id === t.matchId)?.awayTeamId || "NY X Factor"}
                    </div>
                    <span className={`pill ${t.status === "on-sale" ? "chip-active" : t.status === "low-stock" ? "chip-live" : "chip-draft"}`}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 4 }}>
                    {leagueStore.venues[league.id]?.find((v) => v.id === "v1")?.name || "Riverside Sports Complex"} · {t.capacity} capacity
                  </div>
                  <div style={{ height: 6, background: "var(--surface-3)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: 8 }}>
                    <div className="progress-bar accent" style={{ width: `${pct}%` }} />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                    {t.sold} sold · {pct}% full
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 17 }}>${t.price}</div>
                    <button className="btn btn-primary btn-sm">Get tickets</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline">All fixtures</button>
            <button className="btn btn-outline">Gate management</button>
          </div>
        </div>
      )}

      {tab === "merch" && (
        <div className="fade-up stagger-2">
          <div className="section-title">Merchandise & Jersey Storefronts</div>
          <div className="section-title" style={{ marginTop: 14, marginBottom: 0 }}>All merch</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {merchGrid.map((item, i) => (
              <div key={item.id} className={`card-elevated fade-up stagger-${Math.min(i + 1, 8)}`}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                  <div style={{ width: 120, height: 140, position: "relative", filter: "drop-shadow(0 15px 20px rgba(0,0,0,0.15))" }}>
                    <svg viewBox="0 0 200 220" style={{ width: "100%", height: "100%" }}>
                      <path d="M 60 10 Q 100 30 140 10 L 190 40 L 170 80 L 160 70 L 160 210 L 40 210 L 40 70 L 30 80 L 10 40 Z" fill={item.colors.primary} />
                      <path d="M 60 10 Q 100 30 140 10 L 140 25 Q 100 45 60 25 Z" fill={item.colors.accent} />
                      <path d="M 40 210 L 160 210 L 160 200 L 40 200 Z" fill={item.colors.accent} />
                      <text x="100" y="90" textAnchor="middle" fill="white" fontSize="24" fontWeight="800" letterSpacing="-1px" opacity="0.9">{item.teamName === "Seattle Moose" ? "RAMAN" : item.teamName === "NY X Factor" ? "CARTER" : item.teamName === "Dallas Lions" ? "ADAMS" : "NAME"}</text>
                      <text x="100" y="160" textAnchor="middle" fill="white" fontSize="64" fontWeight="900" opacity="0.95">7</text>
                    </svg>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15, letterSpacing: "-0.01em" }}>{item.teamName} Jersey</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Custom name + number</div>
                </div>
                <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 17, marginBottom: 8 }}>${item.price}</div>
                <button
                  className={`btn ${item.status === "unavailable" ? "btn-ghost" : "btn-accent"}`}
                  onClick={() => addToCart(item)}
                  disabled={item.status === "unavailable"}
                  style={{ width: "100%", justifyContent: "center", fontSize: 12.5 }}
                >
                  {item.status === "unavailable" ? "Sold out" : item.status === "low-stock" ? "Add to cart" : "Add to cart"}
                </button>
              </div>
            ))}
          </div>
          <div className="section-title" style={{ marginTop: 4 }}>Cart</div>
          <div className="card">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {commerce.cart.length === 0 && <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Your cart is empty.</div>}
              {commerce.cart.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)" }}>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13 }}>
                    {item.teamName} Jersey · #{item.number} {item.name ? "/" + item.name : ""}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 800, color: "var(--accent)", fontSize: 13 }}>$34</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => leagueStore.removeFromCart(league.id, item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
