import React, { useState, useEffect } from "react";
import { leagueStore } from "../store/leagueStore";
import { roleStore } from "../store/roleStore";

const MOCK_PLAYERS = [
  { id: "p1", name: "S. Dhawan", role: "Batsman", basePrice: 500, status: "unsold" },
  { id: "p2", name: "R. Sharma", role: "Batsman", basePrice: 1000, status: "unsold" },
  { id: "p3", name: "B. Kumar", role: "Bowler", basePrice: 400, status: "unsold" },
  { id: "p4", name: "M. Ali", role: "All-rounder", basePrice: 800, status: "unsold" },
  { id: "p5", name: "J. Buttler", role: "Wicketkeeper", basePrice: 1200, status: "unsold" },
];

export default function AuctionView() {
  const league = leagueStore.getActiveLeague();
  const teams = leagueStore.teams[league.id] || [];
  const role = roleStore.getRole();

  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [bidHistory, setBidHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [soldAnim, setSoldAnim] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(t);
  }, [currentPlayerIdx]);

  const currentPlayer = players[currentPlayerIdx];

  const handleBid = (teamId, amount) => {
    if (amount > currentBid) {
      setCurrentBid(amount);
      setHighestBidder(teamId);
      setTimeLeft(45); // reset timer
      setBidHistory([{ team: teamId, amount, time: new Date().toLocaleTimeString() }, ...bidHistory]);
    }
  };

  const handleSell = () => {
    if (!highestBidder) return;
    setSoldAnim(true);
    setTimeout(() => {
      const newPlayers = [...players];
      newPlayers[currentPlayerIdx].status = "sold";
      newPlayers[currentPlayerIdx].soldTo = highestBidder;
      newPlayers[currentPlayerIdx].soldPrice = currentBid;
      setPlayers(newPlayers);
      
      if (currentPlayerIdx < players.length - 1) {
        setCurrentPlayerIdx(currentPlayerIdx + 1);
        setCurrentBid(0);
        setHighestBidder("");
        setBidHistory([]);
        setTimeLeft(45);
        setSoldAnim(false);
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
      setCurrentBid(0);
      setHighestBidder("");
      setBidHistory([]);
      setTimeLeft(45);
    }
  };

  if (!currentPlayer) return <div className="empty-state"><p>Auction completed.</p></div>;

  const isOwner = role === "league-owner";
  
  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Live Auction War Room</h2>
        <p>Real-time player bidding, purse tracking, and squad composition.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }} className="fade-up stagger-1">
        {/* Left Col: Current Player */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card-elevated" style={{ position: "relative", textAlign: "center", padding: "40px 20px", overflow: "hidden", perspective: 1000 }}>
            <div style={{ transform: soldAnim ? "rotateY(90deg)" : "rotateY(0)", transition: "transform 0.4s ease-in" }}>
              <div style={{ fontSize: 14, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: 12 }}>On The Block</div>
              <div className="avatar" style={{ margin: "0 auto 16px", width: 80, height: 80, fontSize: 24, background: "var(--primary)", color: "white" }}>
                {currentPlayer.name.split(" ").map((w) => w.charAt(0)).join("").slice(0, 2)}
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>{currentPlayer.name}</h3>
              <div style={{ fontSize: 16, color: "var(--muted)", marginBottom: 16 }}>{currentPlayer.role} · Base Price: ${currentPlayer.basePrice}</div>
              
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
                <div style={{ padding: "8px 12px", background: "var(--surface-3)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>Bat Avg</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{Math.floor(Math.random()*20 + 20)}.4</div>
                </div>
                <div style={{ padding: "8px 12px", background: "var(--surface-3)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>Strike Rate</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{Math.floor(Math.random()*40 + 110)}.2</div>
                </div>
                <div style={{ padding: "8px 12px", background: "var(--surface-3)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>Economy</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{Math.floor(Math.random()*3 + 6)}.5</div>
                </div>
              </div>

              <div style={{ background: "var(--surface-2)", padding: 20, borderRadius: "var(--radius-lg)", border: "1px solid var(--line)", marginBottom: 24, position: "relative" }}>
                <div style={{ position: "absolute", top: 10, right: 10, fontWeight: 700, color: timeLeft < 10 ? "var(--accent)" : "var(--muted)" }}>0:{timeLeft.toString().padStart(2, "0")}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Current Bid</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: "var(--primary)" }}>
                  ${currentBid || currentPlayer.basePrice}
                </div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 8 }}>
                  {highestBidder ? `Bid by ${teams.find(t => t.slug === highestBidder)?.name}` : "Awaiting bids..."}
                </div>
              </div>

              {isOwner ? (
                 <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                   <button className="btn btn-primary" onClick={handleSell} disabled={!highestBidder}>
                     Sell Player
                   </button>
                   <button className="btn btn-outline" onClick={handleNext}>
                     Unsold (Next)
                   </button>
                 </div>
              ) : (
                 <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                   <button className="btn btn-primary" onClick={() => handleBid(teams[0]?.slug, (currentBid || currentPlayer.basePrice) + 100)}>
                     Bid +$100
                   </button>
                   <button className="btn btn-outline" onClick={() => handleBid(teams[0]?.slug, (currentBid || currentPlayer.basePrice) + 500)}>
                     Bid +$500
                   </button>
                 </div>
              )}
            </div>

            {soldAnim && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotateY(0deg)", animation: "flip-in 0.4s ease-out forwards" }}>
                <div style={{ border: "8px solid var(--accent)", color: "var(--accent)", padding: "20px 40px", fontSize: 48, fontWeight: 900, transform: "rotate(-15deg)", textTransform: "uppercase", letterSpacing: "4px", borderRadius: 16 }}>
                  SOLD!
                </div>
              </div>
            )}
          </div>
          
          {/* Bid History */}
          <div className="card">
            <div className="section-title">Bid History</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 150, overflowY: "auto" }}>
              {bidHistory.length === 0 && <div style={{ fontSize: 13, color: "var(--muted)" }}>No bids yet.</div>}
              {bidHistory.map((b, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: i < bidHistory.length - 1 ? "1px solid var(--line)" : "none" }}>
                  <div><span style={{ color: "var(--muted)" }}>{b.time}</span> · {teams.find(t => t.slug === b.team)?.name}</div>
                  <div style={{ fontWeight: 700 }}>${b.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Auction Queue & Teams */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="section-title">Up Next</div>
            {players.slice(currentPlayerIdx + 1, currentPlayerIdx + 4).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.role}</div>
                </div>
                <div style={{ fontWeight: 600, color: "var(--muted)" }}>${p.basePrice}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-title">Sold Players</div>
            {players.filter(p => p.status === "sold").map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--primary)" }}>To: {teams.find(t => t.slug === p.soldTo)?.name}</div>
                </div>
                <div style={{ fontWeight: 800, color: "var(--ink)" }}>${p.soldPrice}</div>
              </div>
            ))}
            {players.filter(p => p.status === "sold").length === 0 && (
              <div style={{ fontSize: 13, color: "var(--muted)" }}>No players sold yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}