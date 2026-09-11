import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function JerseyView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];
  const [selected, setSelected] = useState(teams[0] || null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("7");
  const [layout, setLayout] = useState("home");
  const [size, setSize] = useState("M");
  const [inCart, setInCart] = useState(false);

  const kitColors = selected?.colors || { primary: "#002040", accent: "#C00020" };

  const addToCart = () => {
    leagueStore.addToCart(league.id, {
      id: `${selected.slug}-${name}-${number}`,
      teamId: selected.slug,
      name,
      number,
      layout,
      size,
      price: 34,
    });
    setInCart(true);
  };

  const cart = leagueStore.commerce[league.id]?.cart || [];

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker accent">Jersey Studio</span>
        <h2>Custom jerseys</h2>
        <p>Design a custom jersey for {league.name} with kit colors, names, numbers, and layout.</p>
      </div>

      <div className="grid-2 fade-up stagger-1">
        <div className="card">
          <div className="section-title">Select team</div>
          <div className="section-title" style={{ marginTop: 14 }}>Customization</div>

          <div className="field">
            <label className="label">Name on jersey</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))} placeholder="RAMAN" />
          </div>
          <div className="row">
            <div className="field">
              <label className="label">Number</label>
              <input className="input" value={number} onChange={(e) => setNumber(e.target.value.slice(0, 3))} placeholder="7" />
            </div>
            <div className="field">
              <label className="label">Size</label>
              <select className="select" value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          <div className="section-title" style={{ marginTop: 14 }}>Layout</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["home", "away", "limited"].map((l) => (
              <button
                key={l}
                className="btn"
                style={{
                  background: layout === l ? "var(--surface)" : "var(--surface-2)",
                  color: layout === l ? "var(--ink)" : "var(--muted)",
                  border: layout === l ? "1px solid var(--line-strong)" : "1px solid var(--line)",
                  padding: "8px 12px",
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
                onClick={() => setLayout(l)}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 14 }}>Kit colors</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div className="label">Primary</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: kitColors.primary, border: "1px solid var(--line)", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{kitColors.primary}</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div className="label">Accent</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: kitColors.accent, border: "1px solid var(--line)", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{kitColors.accent}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Price</div>
              <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 20 }}>$34</div>
            </div>
            <button
              className={`btn ${inCart ? "btn-outline" : "btn-accent"}`}
              onClick={addToCart}
            >
              {inCart ? "Added to cart" : "Add to cart"}
            </button>
          </div>
        </div>

        <div className="card-elevated">
          <div className="section-title" style={{ marginBottom: 14 }}>Preview · {selected?.name}</div>
          <div style={{ background: "var(--surface-2)", borderRadius: "var(--radius-lg)", padding: 20, textAlign: "center" }}>
            <div style={{ width: "100%", maxWidth: 220, height: 260, margin: "0 auto", position: "relative", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.2))", transition: "transform 0.3s ease" }}>
              <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%" }}>
                <path d="M 60 10 Q 100 30 140 10 L 190 50 L 170 90 L 160 80 L 160 230 L 40 230 L 40 80 L 30 90 L 10 50 Z" fill={kitColors.primary} />
                <path d="M 60 10 Q 100 30 140 10 L 140 25 Q 100 45 60 25 Z" fill={kitColors.accent} />
                <path d="M 40 230 L 160 230 L 160 220 L 40 220 Z" fill={kitColors.accent} />
                <text x="100" y="80" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" letterSpacing="1px" opacity="0.9">{name || "PLAYER"}</text>
                <text x="100" y="160" textAnchor="middle" fill="white" fontSize="72" fontWeight="900" opacity="0.95">{number}</text>
                <text x="100" y="210" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" letterSpacing="2px" textTransform="uppercase">{layout} · {size}</text>
              </svg>
            </div>
            <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--muted)" }}>
              Custom jersey preview · {selected?.name}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="section-title">Cart</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 120, overflow: "auto" }}>
              {cart.length === 0 && <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Your jersey cart is empty.</div>}
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", flexWrap: "wrap", gap: 6 }}>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 13 }}>
                    {item.teamId === selected?.slug ? selected?.name : "Jersey"} · #{item.number} {item.name && "/ " + item.name}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontWeight: 800, color: "var(--accent)", fontSize: 13 }}>$34</span>
                    <button className="btn btn-ghost btn-sm" style={{ padding: "2px 6px", color: "var(--accent)" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
