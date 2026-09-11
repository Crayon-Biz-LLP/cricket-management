import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function CommsView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];

  const [tab, setTab] = useState("announcements");
  
  const [msg, setMsg] = useState({ subject: "", channel: "Push notification", body: "" });
  const [history, setHistory] = useState([
    { text: "Round 1 schedule confirmed for Sep 12–13", time: "1d ago", channel: "Push · Email" },
    { text: "Rain delay notice · Riverside Sports Complex", time: "2d ago", channel: "SMS · WhatsApp" },
    { text: "Sponsor lineup updated for 2026 season", time: "3d ago", channel: "Email" },
  ]);

  const handleSend = () => {
    if (!msg.subject || !msg.body) return;
    setHistory([{ text: msg.subject, time: "just now", channel: msg.channel }, ...history]);
    setMsg({ subject: "", channel: "Push notification", body: "" });
    alert("Message queued for delivery via " + msg.channel);
  };

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Communications</h2>
        <p>Availability, announcements, and multi-channel outreach for league operations.</p>
      </div>

      <div className="tab-list fade-up stagger-1">
        {["announcements", "availability", "broadcast"].map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "announcements" ? "Announcements" : t === "availability" ? "Availability" : "Broadcast"}
          </button>
        ))}
      </div>

      {tab === "announcements" && (
        <div className="fade-up stagger-2">
          <div className="section-title">Send announcement</div>
          <div className="card-elevated" style={{ maxWidth: 680, margin: "0 auto" }}>
            <div className="row" style={{ marginBottom: 12 }}>
              <div className="field" style={{ flex: 2 }}>
                <label className="label">Subject</label>
                <input className="input" placeholder="Schedule update · Round 1" value={msg.subject} onChange={e => setMsg({...msg, subject: e.target.value})} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label className="label">Channel</label>
                <select className="select" value={msg.channel} onChange={e => setMsg({...msg, channel: e.target.value})}>
                  <option>Push notification</option>
                  <option>SMS</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                </select>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Message</label>
              <textarea className="input textarea" placeholder="Hi teams, Round 1 has been moved to Saturday 10:00 AM at Riverside Sports Complex." style={{ minHeight: 110 }} value={msg.body} onChange={e => setMsg({...msg, body: e.target.value})} />
            </div>
            <div className="field" style={{ marginBottom: 14 }}>
              <label className="label">Send to</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["League admins", "Team captains", "All players", "Sponsors"].map((g) => (
                  <label key={g} className="toggle" style={{ cursor: "pointer", justifyContent: "flex-start" }}>
                    <div className="toggle-track on" />
                    <div className="toggle-thumb" style={{ transform: "translateX(16px)" }} />
                    <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{g}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-sm" onClick={handleSend}>Send now</button>
              <button className="btn btn-outline btn-sm">Schedule</button>
            </div>
          </div>

          <div className="section-title" style={{ marginTop: 20 }}>Recent announcements</div>
          <div className="card" style={{ marginTop: 14, maxHeight: 360, overflowY: "auto" }}>
            {history.map((a, i) => (
              <div key={i} className="card-ghost" style={{ padding: "12px 14px", marginBottom: 6, borderLeft: `3px solid var(--primary)` }}>
                <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{a.text}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  <span style={{ marginRight: 6 }}>{a.channel}</span>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "availability" && (
        <div className="fade-up stagger-2">
          <div className="section-title">Captain availability</div>
          <div className="card-elevated">
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Team</label>
              <select className="select">
                <option value="">Select a team…</option>
                {teams.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div className="text-label" style={{ marginBottom: 8 }}>Round availability</div>
              <div className="grid-2" style={{ gap: 8 }}>
                {[1, 2, 3, 4].map((n) => (
                  <label key={n} className="toggle" style={{ justifyContent: "flex-start" }}>
                    <div className="toggle-track on" />
                    <div className="toggle-thumb" style={{ transform: "translateX(16px)" }} />
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>Round {n} · available</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="label">Notes</label>
              <textarea className="input textarea" placeholder="Any availability notes…" />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-sm">Save availability</button>
              <button className="btn btn-outline btn-sm">Reset</button>
            </div>
          </div>
        </div>
      )}

      {tab === "broadcast" && (
        <div className="fade-up stagger-2">
          <div className="section-title">Broadcast messaging</div>
          <div className="card-elevated">
            <div className="field">
              <label className="label">Quick message</label>
              <textarea className="input textarea" placeholder="Live update, delay notice, sponsor message…" style={{ minHeight: 90 }} />
            </div>
            <div className="section-title" style={{ marginTop: 12, marginBottom: 8 }}>Channels</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Push", "SMS", "WhatsApp", "Email", "Overlay ticker"].map((c) => (
                <label key={c} className="toggle" style={{ cursor: "pointer", justifyContent: "flex-start" }}>
                  <div className="toggle-track on" />
                  <div className="toggle-thumb" style={{ transform: "translateX(16px)" }} />
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{c}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-sm">Send broadcast</button>
              <button className="btn btn-outline btn-sm">Save draft</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
