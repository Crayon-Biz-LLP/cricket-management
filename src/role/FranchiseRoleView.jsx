import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

const FranchiseRoleView = () => {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league?.id] || [];
  const [selected, setSelected] = useState(() => teams[0] || null);
  const [view, setView] = useState("dashboard");
  if (!league || teams.length === 0) {
    return (
      <div className="page-head fade-up" style={{ marginBottom: 22 }}>
        <span className="kicker accent">Franchise</span>
        <h2>Franchise</h2>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>
          {!league ? "No league active." : "No franchise teams for this league."}
        </p>
        <p style={{ color: "var(--muted-2)", fontSize: 12.5, marginTop: 6, fontFamily: "Menlo, monospace" }}>
          storeActiveLeagueId={leagueStore.activeLeagueId} storeTeamsByActiveLeague={leagueStore.teams[leagueStore.activeLeagueId] ? leagueStore.teams[leagueStore.activeLeagueId].length : 0}
        </p>
      </div>
    );
  }

  const resultRows = selected?.results || [];

  const initial = (name) => (name || "?").split(" ").map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase();

  const renderContent = () => {
    if (view === "dashboard") {
      return selected ? (
        <div className="grid-2 fade-up stagger-2">
          <div className="card">
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 58, height: 58, borderRadius: 13, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                <img src={selected.logo} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 22, letterSpacing: "-0.02em" }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{selected.owner} · {selected.homeVenue}</div>
              </div>
            </div>

            <div className="section-title" style={{ marginTop: 18, marginBottom: 10 }}>Key stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { label: "Squad", value: selected.squad?.length || 0 },
                { label: "Sponsors", value: selected.sponsors?.length || 0 },
                { label: "Results", value: resultRows.length || 0 },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "11px 8px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
                  <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 20 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 4 }}>Next actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Review squad", sub: "Confirm playing XI" },
                { label: "Check upcoming fixtures", sub: "1 fixture this week" },
                { label: "Manage sponsors", sub: "1 active sponsor" },
                { label: "Jersey orders", sub: "3 pending" },
              ].map((a) => (
                <button key={a.label} className="btn btn-outline btn-sm" style={{ justifyContent: "flex-start", textAlign: "left", padding: "9px 14px", transition: "background 0.15s ease, border-color 0.15s ease" }}>
                  {a.label}
                  <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--muted)" }}>{a.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card-elevated">
          <div className="section-title">Select your franchise</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {teams.map((t) => (
              <div key={t.slug} className="card-ghost" style={{ padding: "12px 14px", cursor: "pointer", border: "1px solid var(--line)", transition: "border-color 0.15s ease" }} onClick={() => setSelected(t)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                    <img src={t.logo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--ink)" }}>{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (view === "squad" && selected) {
      return (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 10 }}>Squad · {selected.name}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Add player</button>
            <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Lock roster</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {(selected.squad || []).map((p) => (
              <div key={p.id} className="card-ghost" style={{ padding: "11px 8px", textAlign: "center", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, margin: "0 auto 7px" }}>
                  {initial(p.name)}
                </div>
                <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 12.5 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.role} · #{p.jerseyNumber}</div>
                <div style={{ marginTop: 5 }}>
                  <span className={`pill ${p.status === "selected" ? "chip-active" : "chip-draft"}`} style={{ fontSize: 10 }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (view === "branding" && selected) {
      return (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 10 }}>Franchise branding</div>
          <div className="card-elevated">
            <div className="field" style={{ marginBottom: 14 }}>
              <label className="label">Team logo</label>
              <input className="input" value={selected.logo} readOnly />
            </div>
            <div className="row" style={{ marginBottom: 16 }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label className="label">Primary kit</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", background: selected.colors.primary, border: "1px solid var(--line)", transition: "box-shadow 0.15s ease" }} />
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{selected.colors.primary}</span>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">Accent</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", background: selected.colors.accent, border: "1px solid var(--line)", transition: "box-shadow 0.15s ease" }} />
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{selected.colors.accent}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Edit colors</button>
              <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Upload logo</button>
              <button className="btn btn-ghost btn-sm" style={{ transition: "background 0.15s ease" }}>Preview microsite</button>
            </div>
          </div>
        </div>
      );
    }

    if (view === "sponsors" && selected) {
      return (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 10 }}>Franchise sponsors</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(selected.sponsors || []).map((s) => (
              <div key={s.id} className="card-ghost" style={{ padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s ease, border-color 0.15s ease" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "var(--ink)" }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Tier: {s.tier}</div>
                </div>
                <span className="pill" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>active</span>
              </div>
            ))}
            {selected.sponsors.length === 0 && (
              <div className="empty-state">
                <p>No sponsors yet.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (view === "merch" && selected) {
      return (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 10 }}>{selected.name} merchandise</div>
          <div className="card-elevated" style={{ maxWidth: 480, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 74, height: 74, borderRadius: 14, overflow: "hidden", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line)", flexShrink: 0 }}>
                <img src={selected.logo} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "white" }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 18 }}>{selected.name} Jersey</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>Custom name + number · $34</div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 6 }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label className="label">Name</label>
                <input className="input" defaultValue="RAMAN" />
              </div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label className="label">Number</label>
                <input className="input" defaultValue="7" />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="label">Size</label>
                <select className="select" defaultValue="M">
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
            </div>
            <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", marginTop: 4, transition: "background 0.15s ease, border-color 0.15s ease" }}>Add to cart</button>
          </div>
        </div>
      );
    }

    if (view === "results" && selected) {
      return (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 10 }}>Recent results · {selected.name}</div>
          {resultRows.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {resultRows.map((r) => (
                <div key={r.date} className="card" style={{ borderLeft: `3px solid ${r.result.includes("Won") ? "var(--scorer-green)" : "var(--accent)"}`, transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--ink)" }}>vs {r.opponent}</div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{r.score} · {r.date}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: r.result.includes("Won") ? "var(--scorer-green)" : "var(--accent)" }}>{r.result}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No results yet.</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="page-head fade-up" style={{ marginBottom: 4 }}>
        <span className="kicker accent">{selected?.name || "Franchise dashboard"}</span>
        <h2>{fieldLabel(view)}</h2>
        <p style={{ marginTop: 4 }}>{viewDescription(view, selected, league)}</p>
      </div>

      <div className="tab-list fade-up stagger-1" style={{ marginBottom: 18 }}>
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "squad", label: "Squad" },
          { id: "branding", label: "Branding" },
          { id: "sponsors", label: "Sponsors" },
          { id: "merch", label: "Merchandise" },
          { id: "results", label: "Results" },
        ].map((t) => (
          <button key={t.id} className={`tab ${view === t.id ? "active" : ""}`} onClick={() => setView(t.id)} style={{ transition: "background 0.15s ease, color 0.15s ease" }}>
            {t.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}

function fieldLabel(view) {
  const map = {
    dashboard: "Franchise dashboard",
    squad: "Squad management",
    branding: "Branding & kit",
    sponsors: "Sponsors",
    merch: "Merchandise",
    results: "Results",
  };
  return map[view] || "Franchise";
}  function viewDescription(view, selected, league) {
    if (!selected) return `Select your franchise to manage it inside ${league.name}.`;
    const map = {
      dashboard: "Your franchise operations hub.",
      squad: "Players, roles, and roster status.",
      branding: "Kit colors, logo, and team microsite.",
      sponsors: "Sponsors linked to your franchise.",
      merch: "Franchise storefront and jersey orders.",
      results: "Recent match results.",
    };
    return map[view] || "";
}

export default FranchiseRoleView;