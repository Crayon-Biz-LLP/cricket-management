import React, { useEffect, useRef } from "react";
import { roleStore } from "./store/roleStore";

const TOUR_STEPS = [
  { role: "league-owner", view: "dashboard", title: "Why Solvstrat?", body: "Current league management tools are fragmented and expensive. Solvstrat is an affordable, all-in-one platform for community leagues. Let's explore." },
  { role: "league-owner", view: "dashboard", title: "One platform for every role", body: "League owners, franchises, captains, players, scorers, streaming, sponsors, and commerce — all in one place. Everyone logs into the same unified hub." },
  { role: "league-owner", view: "schedule", title: "League setup & multi-league control", body: "Configure the season, format, rules, venues, and fixtures. League owners can run multiple leagues from the same platform, each with its own identity." },
  { role: "franchise", view: "auction", title: "Player Draft & Auction Room", body: "A real-time bidding console for franchises to build their squads, tracking base prices and remaining purses." },
  { role: "franchise", view: "dashboard", title: "Eight franchises, one league look", body: "Each franchise gets its own branded presence inside the league theme — logos, squads, sponsors, and merch. Same platform, distinct franchise look." },
  { role: "captain", view: "dashboard", title: "Captain console & match day", body: "Captains submit their playing XI, manage availability, and prep for the match. Fragmented team comms become one clean workflow." },
  { role: "league-owner", view: "scorer", title: "Live scoring on mobile", body: "The core of the platform — a fast, high-contrast mobile scorer optimized for ground conditions. Wicket timelines, dot matrix, and ball-by-ball updates." },
  { role: "league-owner", view: "standings", title: "Automatic points & NRR", body: "As matches end, points tables and NRR are automatically recalculated. No manual spreadsheet updates for league admins." },
  { role: "league-owner", view: "overlay", title: "Broadcast overlay", body: "A browser-source overlay synced to the scorer — drop it into OBS or vMix. Features live animations, ball ticker, and sponsor logos." },
  { role: "league-owner", view: "content", title: "AI Content Studio", body: "After the match, the platform automatically streams an AI summary, match report, highlights reel, and ready-to-post media cards." },
  { role: "fan", view: "dashboard", title: "The Fan Experience", body: "Fans get a live score ticker, standings, content feed, and commerce hub all in one public portal." },
  { role: "sponsor", view: "commerce", title: "Commerce: sponsors, tickets, merch", body: "Sponsor inventory, ticket sales with gate management, and franchise jersey storefronts — the revenue layer is built right in." },
];

export default function TourOverlay({ step, setStep, close, setView, onRoleChange }) {
  const panelRef = useRef(null);
  const current = TOUR_STEPS[step];

  useEffect(() => {
    if (!current) {
      close();
    } else {
      roleStore.setRole(current.role);
      setView(current.view);
      onRoleChange();
    }
  }, [step, current, close, setView, onRoleChange]);

  const goNext = () => {
    if (TOUR_STEPS.length - 1 > step) {
      setStep((s) => s + 1);
    } else {
      close();
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const progress = ((step + 1) / TOUR_STEPS.length) * 100;

  if (!current) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "max(16px, env(safe-area-inset-bottom))",
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 24px)",
      maxWidth: 580,
      maxHeight: "calc(100vh - 32px)",
      overflowY: "auto",
      zIndex: 9999,
      background: "white",
      borderRadius: "var(--radius-xl)",
      boxShadow: "0 30px 80px -20px rgba(10,15,25,0.55)",
      padding: "20px 22px",
      border: "1px solid var(--line)",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1.6px", textTransform: "uppercase", color: "var(--primary)" }}>
            Demo Walkthrough
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
            {step + 1} / {TOUR_STEPS.length}
          </div>
          <div style={{ width: 90, maxWidth: "30vw", height: 5, background: "var(--surface-3)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.02em" }}>
            {current.title}
          </h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>
            {current.body}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
          <button className="btn btn-primary" onClick={goNext} style={{ background: "var(--primary)" }}>
            {step === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
          </button>
             {step > 0 && (
               <button className="btn btn-ghost btn-sm" onClick={goPrev}>
                 Prev
               </button>
             )}
             <button className="btn btn-ghost btn-sm" onClick={close}>
               Exit Tour
             </button>
        </div>
      </div>
    </div>
  );
}
