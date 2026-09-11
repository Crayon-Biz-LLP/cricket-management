import React from "react";

const typeIcon = {
  league: "🏆",
  match: "🏏",
  commerce: "💼",
  venue: "📍",
  team: "👥",
};

const typeLabel = {
  league: "League",
  match: "Match",
  commerce: "Commerce",
  venue: "Venue",
  team: "Team",
};

export default function ActivityFeed({ activity }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {activity.map((a, i) => (
        <div key={a.id} className={`fade-up stagger-${Math.min(i + 4, 8)}`} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)" }}>
          <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>{typeIcon[a.type] || "•"}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.4, fontWeight: 500 }}>
              {a.text}
            </div>
            <div style={{ marginTop: 4, display: "flex", gap: 8, alignItems: "center" }}>
              <span className="pill" style={{ background: "var(--surface-3)", color: "var(--muted-2)" }}>
                {typeLabel[a.type] || a.type}
              </span>
              <span style={{ fontSize: 11.5, color: "var(--muted-2)" }}>{a.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
