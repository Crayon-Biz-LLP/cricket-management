export const NAV = [
  { id: "dashboard", label: "Home", icon: "Home" },
  { id: "auction", label: "Auction", icon: "Gavel" },
  { id: "venues", label: "Venues", icon: "MapPin" },
  { id: "schedule", label: "Schedule", icon: "CalendarDays" },
  { id: "teams", label: "Teams", icon: "Users" },
  { id: "jersey", label: "Jersey", icon: "Shirt" },
  { id: "players", label: "Players", icon: "User" },
  { id: "scorer", label: "Scorer", icon: "ClipboardList" },
  { id: "standings", label: "Standings", icon: "Trophy" },
  { id: "overlay", label: "Overlay", icon: "MonitorPlay" },
  { id: "content", label: "Content", icon: "Newspaper" },
  { id: "commerce", label: "Commerce", icon: "Wallet" },
  { id: "comms", label: "Comms", icon: "MessageCircle" },
];

export const ROLES = [
  { id: "league-owner", label: "League Owner", icon: "Crown", description: "Full league control" },
  { id: "franchise", label: "Franchise", icon: "Trophy", description: "My team's operations" },
  { id: "captain", label: "Captain", icon: "Shield", description: "Match day & lineup" },
  { id: "player", label: "Player", icon: "User", description: "My profile & availability" },
  { id: "fan", label: "Fan", icon: "Megaphone", description: "Public scorecard & content" },
  { id: "broadcaster", label: "Broadcaster", icon: "Radio", description: "Overlay & stream outputs" },
  { id: "sponsor", label: "Sponsor", icon: "Handshake", description: "Ads, placements, visibility" },
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
