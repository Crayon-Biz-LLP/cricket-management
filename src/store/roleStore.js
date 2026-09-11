class RoleStore {
  constructor() {
    this.role = "league-owner";
  }

  setRole(role) {
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  getScoredNav(roleId) {
    const all = [
      { id: "dashboard", label: "Home", icon: "⌂" },
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

    const map = {
      "league-owner": all,
      "franchise": all.filter((n) => ["dashboard", "teams", "jersey", "players", "comms", "commerce"].includes(n.id)),
      "captain": all.filter((n) => ["dashboard", "schedule", "teams", "players", "scorer", "comms"].includes(n.id)),
      "player": all.filter((n) => ["dashboard", "players", "schedule", "comms"].includes(n.id)),
      "fan": all.filter((n) => ["dashboard", "standings", "schedule", "content", "commerce"].includes(n.id)),
      "broadcaster": all.filter((n) => ["overlay", "content", "dashboard"].includes(n.id)),
      "sponsor": all.filter((n) => ["dashboard", "commerce"].includes(n.id)),
    };

    return map[roleId] || all;
  }
}

export const roleStore = new RoleStore();
