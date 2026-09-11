export const NAV = [
  { id: "dashboard", label: "Home", icon: "⌂" },
  { id: "auction", label: "Auction", icon: "🔨" },
  { id: "venues", label: "Venues", icon: "📍" },
  { id: "schedule", label: "Schedule", icon: "📅" },
  { id: "teams", label: "Teams", icon: "👥" },
  { id: "jersey", label: "Jersey", icon: "👕" },
  { id: "players", label: "Players", icon: "👤" },
  { id: "scorer", label: "Scorer", icon: "🏏" },
  { id: "standings", label: "Standings", icon: "🏆" },
  { id: "overlay", label: "Overlay", icon: "📺" },
  { id: "content", label: "Content", icon: "📰" },
  { id: "commerce", label: "Commerce", icon: "💰" },
  { id: "comms", label: "Comms", icon: "💬" },
];

export const ROLES = [
  { id: "league-owner", label: "League Owner", icon: "👑", description: "Full league control" },
  { id: "franchise", label: "Franchise", icon: "🏆", description: "My team's operations" },
  { id: "captain", label: "Captain", icon: "🧢", description: "Match day & lineup" },
  { id: "player", label: "Player", icon: "👤", description: "My profile & availability" },
  { id: "fan", label: "Fan", icon: "📣", description: "Public scorecard & content" },
  { id: "broadcaster", label: "Broadcaster", icon: "📺", description: "Overlay & stream outputs" },
  { id: "sponsor", label: "Sponsor", icon: "💰", description: "Ads, placements, visibility" },
];

const scopeMap = {
  "league-owner": ["dashboard", "auction", "venues", "schedule", "teams", "jersey", "players", "scorer", "standings", "overlay", "content", "commerce", "comms"],
  "franchise": ["dashboard", "auction", "teams", "jersey", "players", "comms", "commerce", "venues", "schedule", "standings", "content"],
  "captain": ["dashboard", "schedule", "teams", "players", "scorer", "comms", "venues"],
  "player": ["dashboard", "players", "schedule", "comms"],
  "fan": ["dashboard", "standings", "schedule", "content", "commerce"],
  "broadcaster": ["overlay", "content", "dashboard", "schedule"],
  "sponsor": ["dashboard", "commerce"],
};

export const roleModuleScope = Object.fromEntries(
  Object.entries(scopeMap).map(([role, ids]) => [
    role,
    ids.map(id => NAV.find(n => n.id === id)).filter(Boolean)
  ])
);
