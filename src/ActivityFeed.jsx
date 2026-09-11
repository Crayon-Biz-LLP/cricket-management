import React from "react";
import { Icon } from "./icons";

const typeIcon = {
  league: "Trophy",
  match: "ClipboardList",
  commerce: "Wallet",
  venue: "MapPin",
  team: "Users",
};

const typeColor = {
  league: "#B8860B",
  match: "#C00020",
  commerce: "#1E5BB8",
  venue: "#3FB76E",
  team: "#6B5BD6",
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
            <Icon name={typeIcon[a.type] || "ClipboardList"} size={15} style={{ color: typeColor[a.type] || "var(--muted)" }} />
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
