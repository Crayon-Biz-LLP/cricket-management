import React, { useState, useCallback, useEffect } from "react";
import { leagueStore } from "./store/leagueStore";
import { roleStore } from "./store/roleStore";
import TopBar from "./TopBar";
import LeagueSelection from "./LeagueSelection";
import OrgDashboard from "./OrgDashboard";
import AppShell from "./AppShell";
import VenuesView from "./venues/VenuesView";
import ScheduleView from "./schedule/ScheduleView";
import TeamsView from "./teams/TeamsView";
import JerseyView from "./jersey/JerseyView";
import PlayersView from "./players/PlayersView";
import ScorerView from "./scorer/ScorerView";
import StandingsView from "./standings/StandingsView";
import OverlayView from "./overlay/OverlayView";
import ContentView from "./content/ContentView";
import CommerceView from "./commerce/CommerceView";
import CommsView from "./comms/CommsView";
import AuctionView from "./auction/AuctionView";
import FranchiseRoleView from "./role/FranchiseRoleView";
import CaptainRoleView from "./role/CaptainRoleView";
import PlayerRoleView from "./role/PlayerRoleView";
import FanRoleView from "./role/FanRoleView";
import BroadcasterRoleView from "./role/BroadcasterRoleView";
import SponsorRoleView from "./role/SponsorRoleView";
import TourOverlay from "./TourOverlay";

const ROLE_VIEW_MAP = {
  "league-owner": {
    dashboard: <OrgDashboard />,
    auction: <AuctionView />,
    venues: <VenuesView />,
    schedule: <ScheduleView />,
    teams: <TeamsView />,
    jersey: <JerseyView />,
    players: <PlayersView />,
    scorer: <ScorerView />,
    standings: <StandingsView />,
    overlay: <OverlayView />,
    content: <ContentView />,
    commerce: <CommerceView />,
    comms: <CommsView />,
  },
  "franchise": {
    dashboard: <FranchiseRoleView />,
    auction: <AuctionView />,
    teams: <TeamsView />,
    jersey: <JerseyView />,
    players: <PlayersView />,
    comms: <CommsView />,
    commerce: <CommerceView />,
    venues: <VenuesView />,
    schedule: <ScheduleView />,
    standings: <StandingsView />,
    content: <ContentView />,
  },
  "captain": {
    dashboard: <CaptainRoleView />,
    schedule: <ScheduleView />,
    teams: <TeamsView />,
    players: <PlayersView />,
    scorer: <ScorerView />,
    comms: <CommsView />,
    venues: <VenuesView />,
  },
  "player": {
    dashboard: <PlayerRoleView />,
    players: <PlayersView />,
    schedule: <ScheduleView />,
    comms: <CommsView />,
  },
  "fan": {
    dashboard: <FanRoleView />,
    standings: <StandingsView />,
    schedule: <ScheduleView />,
    content: <ContentView />,
    commerce: <CommerceView />,
  },
  "broadcaster": {
    dashboard: <BroadcasterRoleView />,
    overlay: <OverlayView />,
    content: <ContentView />,
    schedule: <ScheduleView />,
  },
  "sponsor": {
    dashboard: <SponsorRoleView />,
    commerce: <CommerceView />,
  },
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [pendingChoice, setPendingChoice] = useState("");
  const [view, setView] = useState("dashboard");
  const [roleView, setRoleView] = useState(null);
  const [tourStep, setTourStep] = useState(-1);
  const [roleVersion, setRoleVersion] = useState(0);
  const [leagueVersion, setLeagueVersion] = useState(0);

  useEffect(() => {
    const handler = () => setLeagueVersion((v) => v + 1);
    window.addEventListener("league-changed", handler);
    return () => window.removeEventListener("league-changed", handler);
  }, []);

  const handleRoleChange = useCallback(() => {
    setRoleVersion((v) => v + 1);
  }, []);

  const handleChooseLeague = useCallback((leagueId) => {
    leagueStore.setActiveLeague(leagueId);
    setPendingChoice(leagueId);
    setReady(true);
  }, []);

  const handleBackToSelection = useCallback(() => {
    setReady(false);
    setPendingChoice("");
    setView("dashboard");
    setRoleView(null);
  }, []);

  const role = roleStore.getRole();
  const scopedNav = {
    "league-owner": ["dashboard", "auction", "venues", "schedule", "teams", "jersey", "players", "scorer", "standings", "overlay", "content", "commerce", "comms"],
    "franchise": ["dashboard", "auction", "teams", "jersey", "players", "comms", "commerce", "venues", "schedule", "standings", "content"],
    "captain": ["dashboard", "schedule", "teams", "players", "scorer", "comms", "venues"],
    "player": ["dashboard", "players", "schedule", "comms"],
    "fan": ["dashboard", "standings", "schedule", "content", "commerce"],
    "broadcaster": ["overlay", "content", "dashboard", "schedule"],
    "sponsor": ["dashboard", "commerce"],
  }[role] || [];
  const firstNavId = scopedNav[0] || "dashboard";
  const viewFromRole = view && scopedNav.includes(view) ? view : firstNavId;

  const isRoleView = ROLE_VIEW_MAP[role] && ROLE_VIEW_MAP[role][viewFromRole];

  const renderModule = () => {
    if (isRoleView) return React.cloneElement(ROLE_VIEW_MAP[role][viewFromRole], { setView });
    switch (view) {
      case "dashboard":
        return <OrgDashboard setView={setView} />;
      case "auction":
        return <AuctionView setView={setView} />;
      case "venues":
        return <VenuesView />;
      case "schedule":
        return <ScheduleView />;
      case "teams":
        return <TeamsView />;
      case "jersey":
        return <JerseyView />;
      case "players":
        return <PlayersView />;
      case "scorer":
        return <ScorerView />;
      case "standings":
        return <StandingsView />;
      case "overlay":
        return <OverlayView />;
      case "content":
        return <ContentView />;
      case "commerce":
        return <CommerceView />;
      case "comms":
        return <CommsView />;
      default:
        return <OrgDashboard />;
    }
  };

  if (!ready) {
    return <LeagueSelection onChooseLeague={handleChooseLeague} pending={pendingChoice} />;
  }

  return (
    <AppShell>
      <TopBar view={viewFromRole} setView={setView} onBackToSelection={handleBackToSelection} onRoleChange={handleRoleChange} />
      <main>
        {renderModule()}
        <div style={{ position: "fixed", bottom: 20, right: 24, display: "flex", gap: 10, zIndex: 10000 }}>
          {tourStep === -1 && (
            <button className="btn btn-primary btn-sm" onClick={() => setTourStep(0)}>
              Start Demo Tour
            </button>
          )}
          {role !== "league-owner" && (
            <button className="btn btn-outline btn-sm" onClick={() => { roleStore.setRole("league-owner"); handleRoleChange(); }}>
              Switch to league owner
            </button>
          )}
        </div>
        {tourStep !== -1 && (
          <TourOverlay
            step={tourStep}
            setStep={setTourStep}
            close={() => setTourStep(-1)}
            setView={setView}
            onRoleChange={handleRoleChange}
          />
        )}
      </main>
    </AppShell>
  );
}
