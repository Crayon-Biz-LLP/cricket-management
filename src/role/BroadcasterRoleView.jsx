import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";
import OverlayView from "../overlay/OverlayView"; // We can reuse the actual component for perfect preview

export default function BroadcasterRoleView() {
  const league = leagueStore.getActiveLeague();
  const [activeTab, setActiveTab] = useState("overlay");

  // Read settings from store
  const settings = leagueStore.overlaySettings;

  const updateSetting = (key, value) => {
    leagueStore.updateOverlaySettings({ [key]: value });
    // Force re-render locally for responsiveness (optional but good practice)
    setForceRender(f => f + 1);
  };
  const [forceRender, setForceRender] = useState(0);

  return (
    <div>
      <div className="page-head fade-up" style={{ marginBottom: 4 }}>
        <span className="kicker accent">Broadcast</span>
        <h2>Overlay & stream outputs</h2>
        <p style={{ marginTop: 4, color: "var(--muted)" }}>The broadcaster’s workspace: live overlay, placements, and stream handoff.</p>
      </div>

      <div className="tab-list fade-up stagger-1" style={{ marginBottom: 18 }}>
        {[
          { id: "overlay", label: "Overlay" },
          { id: "settings", label: "Settings" },
          { id: "outputs", label: "Outputs" },
          { id: "content", label: "Content handoff" },
        ].map((t) => (
          <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)} style={{ transition: "background 0.15s ease, color 0.15s ease" }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overlay" && (
        <div className="fade-up stagger-2">
          <div className="card-elevated" style={{ padding: 0, overflow: "hidden", background: settings.bgColor, position: "relative" }}>
            <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Preview ({settings.layout} layout)</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["default", "minimal", "milestone"].map(l => (
                  <button key={l} className="btn btn-ghost btn-sm" onClick={() => updateSetting("layout", l)} style={{ padding: "4px 8px", fontSize: 11, background: settings.layout === l ? settings.accentColor : "rgba(255,255,255,0.1)", color: "white" }}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ position: "relative", width: "100%", height: 550, overflow: "hidden", borderRadius: 12 }}>
              <OverlayView />
            </div>

            <div style={{ position: "absolute", bottom: 16, left: 16, color: "rgba(255,255,255,0.25)", fontSize: 10.5, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>
              OBS / vMix browser source
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 12 }}>Overlay settings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field" style={{ marginBottom: 4 }}>
              <label className="label">Layout Style</label>
              <select className="select" value={settings.layout} onChange={(e) => updateSetting("layout", e.target.value)} style={{ maxWidth: 300 }}>
                <option value="default">Full Scorecard (Standard)</option>
                <option value="minimal">Lower-Third Bar (Minimal)</option>
                <option value="milestone">Player Milestone Graphic</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: 4 }}>
              <label className="label">Accent color</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={settings.accentColor} onChange={(e) => updateSetting("accentColor", e.target.value)} style={{ width: 44, height: 38, padding: 0, border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", cursor: "pointer" }} />
                <span style={{ fontWeight: 700, color: "var(--ink)", fontFamily: "monospace" }}>{settings.accentColor}</span>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 4 }}>
              <label className="label">Background color</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={settings.bgColor} onChange={(e) => updateSetting("bgColor", e.target.value)} style={{ width: 44, height: 38, padding: 0, border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", cursor: "pointer" }} />
                <span style={{ fontWeight: 700, color: "var(--ink)", fontFamily: "monospace" }}>{settings.bgColor}</span>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Sponsor visibility</label>
              <label className="toggle" style={{ justifyContent: "flex-start", cursor: "pointer", padding: "4px 0" }} onClick={() => updateSetting("sponsorVisible", !settings.sponsorVisible)}>
                <div className={`toggle-track ${settings.sponsorVisible ? "on" : ""}`} />
                <div className={`toggle-thumb ${settings.sponsorVisible ? "" : ""}`} style={{ transform: settings.sponsorVisible ? "translateX(16px)" : "translateX(2px)" }} />
                <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 10 }}>Show sponsor in overlay</span>
              </label>
            </div>
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease", background: settings.accentColor, borderColor: settings.accentColor }}>Update overlay</button>
            <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }} onClick={() => leagueStore.updateOverlaySettings({ layout: "default", accentColor: "#C00020", bgColor: "#050A11", sponsorVisible: true })}>Reset defaults</button>
          </div>
        </div>
      )}

      {activeTab === "outputs" && (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 12 }}>Outputs</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="card" style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
              <div className="section-title" style={{ marginBottom: 10 }}>Browser source</div>
              <div style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)" }}>
                <div style={{ fontFamily: "monospace", fontSize: 12.5, color: "var(--muted)" }}>/overlay</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center", transition: "background 0.15s ease, border-color 0.15s ease" }}>Copy overlay URL</button>
              </div>
            </div>
            <div className="card" style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
              <div className="section-title" style={{ marginBottom: 10 }}>Public scorecard</div>
              <div style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)" }}>
                <div style={{ fontFamily: "monospace", fontSize: 12.5, color: "var(--muted)" }}>/scorecard</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center", transition: "background 0.15s ease, border-color 0.15s ease" }}>Copy scorecard link</button>
              </div>
            </div>
            <div className="card" style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
              <div className="section-title" style={{ marginBottom: 10 }}>Stream handoff</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>OBS · vMix · third-party production</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>RTMP setup</button>
                <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Mux</button>
              </div>
            </div>
            <div className="card" style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
              <div className="section-title" style={{ marginBottom: 10 }}>Content exports</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>Post-match assets</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Highlights</button>
                <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Reel</button>
                <button className="btn btn-outline btn-sm" style={{ transition: "background 0.15s ease, border-color 0.15s ease" }}>Summary</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "content" && (
        <div className="fade-up stagger-2">
          <div className="section-title" style={{ marginBottom: 12 }}>Content handoff</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { title: "AI match summary ready", tag: "AI", color: "var(--primary)" },
              { title: "Match report drafted", tag: "Report", color: "var(--primary)" },
              { title: "Highlights list exported", tag: "Highlights", color: "var(--accent)" },
              { title: "Reel generated for social", tag: "Reel", color: "var(--accent)" },
            ].map((c, i) => (
              <div key={i} className="card-ghost" style={{ padding: "13px 16px", borderLeft: `3px solid ${c.color}`, transition: "background 0.15s ease, border-left-color 0.15s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11.5, color: "white", background: c.color, padding: "3px 9px", borderRadius: "var(--radius-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginRight: 10 }}>
                      {c.tag}
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--ink)", marginLeft: 6 }}>{c.title}</span>
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>ready to publish</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
