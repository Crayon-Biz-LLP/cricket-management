import React, { useState, useEffect } from "react";
import { leagueStore } from "../store/leagueStore";

export default function ContentView() {
  const league = leagueStore.getActiveLeague();
  const [tab, setTab] = useState("summary");
  const [regenerate, setRegenerate] = useState(false);

  const summary =
    "NY X Factor posted 162/4 in a blazing 20 overs, powered by S. Carter’s 46 off 32, before Seattle Moose fell five runs short in a thriller at Riverside Sports Complex. The fightback was led by K. Raman, who held the crease under pressure with a calm 28 off 21 as the required run rate climbed. Two sixes in one over during the 14th over chase kept the contest alive until the final gap closed.";

  const [typedSummary, setTypedSummary] = useState(summary);
  useEffect(() => {
    if (regenerate) {
      setTypedSummary("");
      let i = 0;
      const interval = setInterval(() => {
        setTypedSummary(summary.slice(0, i));
        i += 3;
        if (i > summary.length) {
          setTypedSummary(summary);
          clearInterval(interval);
          setTimeout(() => setRegenerate(false), 300);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [regenerate, summary]);

  const highlights = [
    "S. Carter 46 (32) — five fours, two sixes",
    "J. Tate 3-0-22-1 for Seattle Moose",
    "Last-over stand of 17 between K. Raman and D. Okafor",
    "Two sixes in one over during the 14th over chase",
  ];

  const posts = [
    { title: "Final over thriller in the books!", body: "NY X Factor took the opener by 5 runs. S. Carter with a blistering 46. Recap and stats on the live scorecard.", tag: "Match", color: "var(--accent)" },
    { title: "Player of the Match: S. Carter", body: "46 off 32, five fours, two sixes — the knock that set the tone.", tag: "Player", color: "var(--primary)" },
    { title: "Sponsor spot: Spinwide Sports", body: "Catch Spinwide Sports across overlays, team pages, and the live stream ticker.", tag: "Sponsor", color: "var(--primary)" },
  ];

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker accent">Content Studio</span>
        <h2>Match content & media</h2>
        <p>AI-generated summary, match report, highlights, and ready-to-post media — with sponsor placement built in.</p>
      </div>

      <div className="tab-list fade-up stagger-1">
        {["summary", "report", "highlights", "posts"].map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "summary" ? "AI Summary" : t === "report" ? "Match Report" : t === "highlights" ? "Highlights" : "Media Posts"}
          </button>
        ))}
      </div>

      <div className="card fade-up stagger-2">
        {tab === "summary" && (
          <div>
            <div className="section-title">AI Match Summary</div>
            <div style={{ background: "var(--surface-2)", borderRadius: "var(--radius-md)", padding: "20px 22px", border: "1px solid var(--line)", marginBottom: 16, fontFamily: "'Georgia', 'Times New Roman', serif", lineHeight: 1.6, color: "var(--ink)", minHeight: 120 }}>
              {typedSummary}
              {regenerate && <span style={{ display: "inline-block", width: 8, height: 16, background: "var(--accent)", marginLeft: 4, animation: "blink 1s step-end infinite" }} />}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[
                { label: "Result", value: "NY X Factor won by 5 runs", color: "var(--accent)" },
                { label: "Player of the Match", value: "S. Carter — NY X Factor", color: "var(--primary)" },
                { label: "Top Bowler", value: "J. Tate — Seattle Moose", color: "var(--scorer-blue)" },
              ].map((r) => (
                <div key={r.label} className="card-ghost" style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>{r.label}</div>
                  <div style={{ fontWeight: 800, color: r.color, fontSize: 14.5, letterSpacing: "-0.01em" }}>{r.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setRegenerate(true)} disabled={regenerate}>
                {regenerate ? "Generating…" : "Regenerate"}
              </button>
            </div>
          </div>
        )}

        {tab === "report" && (
          <div>
            <div className="section-title">Match Report</div>
            <div style={{ background: "var(--surface-2)", borderRadius: "var(--radius-md)", padding: "20px 22px", border: "1px solid var(--line)", marginBottom: 16, fontFamily: "'Georgia', 'Times New Roman', serif", lineHeight: 1.6, color: "var(--ink)" }}>
              {summary}
              <span style={{ display: "block", marginTop: 12 }}>
                The fightback was led by K. Raman, who held the crease under pressure with a calm 28 off 21 as the required run rate climbed. NY X Factor's earlier 162/4 had set a stiff standard, but the chase carried the crowd through every over until the final gap closed.
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Status</div>
                <div style={{ fontWeight: 700, color: "var(--ink)" }}>Published · Ready to syndicate</div>
              </div>
              <button className="btn btn-accent">Publish report</button>
            </div>
          </div>
        )}

        {tab === "highlights" && (
          <div>
            <div className="section-title">Highlights & Key Moments</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
              {highlights.map((h, i) => (
                <div key={i} className="card-ghost" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 120, background: "var(--surface-3)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div style={{ width: 40, height: 40, background: "rgba(0,0,0,0.6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>▶</div>
                    <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.8)", color: "white", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>0:1{i+2}</div>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{h}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-outline" style={{ fontSize: 13 }}>Export clip list</button>
              <button className="btn btn-outline" style={{ fontSize: 13 }}>Generate reel</button>
              <button className="btn btn-primary" style={{ fontSize: 13 }}>Open highlights editor</button>
            </div>
          </div>
        )}

        {tab === "posts" && (
          <div>
            <div className="section-title">Media Posts · Ready to Broadcast</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {posts.map((p, i) => (
                <div key={i} className="card-ghost" style={{ borderLeft: `3px solid ${p.color}` }}>
                  <div style={{ padding: "9px 14px", background: p.color, color: "white", fontWeight: 700, fontSize: 11.5, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                    {p.tag}
                  </div>
                  <div style={{ padding: "13px 15px" }}>
                    <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5, letterSpacing: "-0.01em", marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{p.body}</div>
                    <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button className="btn btn-outline" style={{ fontSize: 12, padding: "6px 11px" }}>Edit</button>
                      <button className="btn btn-accent" style={{ fontSize: 12, padding: "6px 11px" }}>Post</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
