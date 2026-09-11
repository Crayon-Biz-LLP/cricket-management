function createInnings(teamName, squad, target) {
  return {
    team: teamName,
    total: 0,
    wickets: 0,
    overs: 0,
    ballsInOver: 0,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
    striker: squad?.[0] || "Batsman 1",
    nonStriker: squad?.[1] || "Batsman 2",
    bowler: "Bowler 1",
    ballsRemaining: 120,
    target: target || 0,
    runRate: 0,
    requiredRate: 0,
    lastBall: { comment: "" },
    ballLog: [],
  };
}

class LeagueStore {
  constructor() {
    this.leagues = [];
    this.venues = {};
    this.teams = {};
    this.slots = {};
    this.matches = {};
    this.commerce = {};
    this.activity = [];
    this.overlaySettings = {
      layout: "default",
      accentColor: "#C00020",
      bgColor: "#050A11",
      sponsorVisible: true
    };
    this.seed();
    if (this.leagues[0]) {
      this.setActiveLeague(this.leagues[0].id);
    }
  }

  seed() {
    const league1Id = "usa-seniors";
    const league2Id = "west-region-t20";

    this.leagues = [
      {
        id: league1Id,
        name: "USA Seniors Cricket League",
        season: "2026 Senior Championship",
        format: "T20",
        oversPerInnings: 20,
        status: "active",
        branding: { primary: "#002040", accent: "#C00020", secondary: "#1E3A6B" },
        homeGround: "Riverside Sports Complex",
      },
      {
        id: league2Id,
        name: "West Region T20 Cup",
        season: "2026 Regional Season",
        format: "T20",
        oversPerInnings: 20,
        status: "draft",
        branding: { primary: "#1B4D2E", accent: "#B46A1E", secondary: "#2E5D3C" },
        homeGround: "Desert Edge Oval",
      },
    ];

    this.venues = {
      [league1Id]: [
        { id: "v1", name: "Riverside Sports Complex", city: "New Jersey", capacity: 500, surface: "Artificial Turf", status: "open", notes: "Main ground, floodlights available" },
        { id: "v2", name: "Harbor Grounds", city: "New York", capacity: 400, surface: "Clay", status: "open", notes: "Side pitch available for warmups" },
        { id: "v3", name: "Midwest Cricket Park", city: "Illinois", capacity: 620, surface: "Hybrid", status: "maintenance", notes: "Outfield being re-laid" },
      ],
      [league2Id]: [
        { id: "v4", name: "Desert Edge Oval", city: "Texas", capacity: 700, surface: "Grass", status: "open", notes: "Border says it all" },
        { id: "v5", name: "Westside Community Ground", city: "Texas", capacity: 320, surface: "Artificial Turf", status: "open", notes: "Weekend league home ground" },
      ],
    };

    const franchiseData = [
      { slug: "seattle-moose", name: "Seattle Moose", logo: "/IMG_3555.JPG", colors: { primary: "#1E5BB8", accent: "#163A70" } },
      { slug: "ny-xfactor", name: "NY X Factor", logo: "/IMG_3556.JPG", colors: { primary: "#C00020", accent: "#7A0014" } },
      { slug: "washington-eagles", name: "Washington Eagles", logo: "/IMG_3557.JPG", colors: { primary: "#1B4D2E", accent: "#0F3320" } },
      { slug: "austin-hunters", name: "Austin Hunters", logo: "/IMG_3558.JPG", colors: { primary: "#B46A1E", accent: "#7A4412" } },
      { slug: "houston-saints", name: "Houston Saints", logo: "/IMG_3559.JPG", colors: { primary: "#7A1F2B", accent: "#4E121A" } },
      { slug: "chicago-cavaliers", name: "Chicago Cavaliers", logo: "/IMG_3560.JPG", colors: { primary: "#1B2A6B", accent: "#0F1A47" } },
      { slug: "dallas-lions", name: "Dallas Lions", logo: "/IMG_3563.JPG", colors: { primary: "#C99A1F", accent: "#947214" } },
      { slug: "mighty-dallas", name: "Mighty Dallas", logo: "/IMG_3564.JPG", colors: { primary: "#5D1A84", accent: "#3D125A" } },
    ];

    this.teams = {
      [league1Id]: [
        { ...franchiseData[0], homeVenue: "Riverside Sports Complex", owner: "MT Sports Group", founded: 2019 },
        { ...franchiseData[1], homeVenue: "Harbor Grounds", owner: "NY Cricket Capital LLC", founded: 2020 },
        { ...franchiseData[2], homeVenue: "Riverside Sports Complex", owner: "Capital Cricket Partners", founded: 2018 },
        { ...franchiseData[3], homeVenue: "Desert Edge Oval", owner: "Austin Sports Collective", founded: 2021 },
        { ...franchiseData[4], homeVenue: "Westside Community Ground", owner: "Houston Cricket Alliance", founded: 2020 },
        { ...franchiseData[5], homeVenue: "Midwest Cricket Park", owner: "Chicago Cricket Holdings", founded: 2019 },
        { ...franchiseData[6], homeVenue: "Desert Edge Oval", owner: "Lone Star Sports Group", founded: 2022 },
        { ...franchiseData[7], homeVenue: "Westside Community Ground", owner: "Mighty Dallas Sports", founded: 2021 },
      ],
      [league2Id]: [
        { ...franchiseData[6], homeVenue: "Desert Edge Oval", owner: "Lone Star Sports Group", founded: 2022 },
        { ...franchiseData[3], homeVenue: "Westside Community Ground", owner: "Austin Sports Collective", founded: 2021 },
        { ...franchiseData[4], homeVenue: "Desert Edge Oval", owner: "Houston Cricket Alliance", founded: 2020 },
      ],
    };

    const baseSquads = {
      "Seattle Moose": ["K. Raman", "D. Okafor", "P. Soriano", "M. Ellison", "J. Tate", "R. Vance", "S. Goran", "T. Marsh", "L. Barreto", "F. Nwosu", "G. Dunlop", "C. Meadows"],
      "NY X Factor": ["S. Carter", "V. Mehta", "L. Bennett", "A. Rios", "N. Fernando", "O. Dubois", "P. Macy", "R. Salazar", "T. Whitfield", "U. Chan", "V. Ortega", "W. Park"],
      "Washington Eagles": ["B. Foster", "C. Ng", "D. Reilly", "E. Trivedi", "F. Almeida", "G. Kohli", "H. Singh", "I. Marsh", "J. Lemoine", "K. Baruch", "L. Tate", "M. Singh"],
      "Austin Hunters": ["N. Owens", "O. Baker", "P. Chase", "Q. Rowe", "R. Fenn", "S. Nguyen", "T. Wells", "U. Pierce", "V. Haley", "W. Ross", "X. Curry", "Y. Boyd"],
      "Houston Saints": ["A. Cruz", "B. Delgado", "C. Flynn", "D. Grant", "E. Hughes", "F. Ibrahim", "G. Jarrett", "H. Khan", "I. Lawson", "J. Moreno", "K. Nash", "L. Ortiz"],
      "Chicago Cavaliers": ["M. Patel", "N. Quinn", "O. Reyes", "P. Summers", "Q. Tran", "R. Underwood", "S. Villar", "T. Wright", "U. Xu", "V. Yates", "W. Zimmer", "X. Abbas"],
      "Dallas Lions": ["Y. Adams", "Z. Benson", "A. Castillo", "B. Donovan", "C. Ellery", "D. Farah", "E. Greer", "F. Hensley", "G. Ito", "H. Jiang", "I. Kaur", "J. Lomax"],
      "Mighty Dallas": ["K. Montoya", "L. Napier", "M. Osei", "N. Pruitt", "O. Quintero", "P. Ramirez", "Q. Sanders", "R. Tate", "S. Umana", "T. Velez", "U. Wagner", "V. Xiang"],
    };

    this.teams = Object.fromEntries(
      Object.entries(this.teams).map(([leagueId, teams]) => [
        leagueId,
        teams.map((t) => ({
          ...t,
          squad: baseSquads[t.name].map((p, i) => ({
            id: `${t.slug}-${i}`,
            name: p,
            role: ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"][i % 4],
            jerseyNumber: (i % 25) + 1,
            status: i < 10 ? "selected" : "reserve",
          })),
          sponsors: leagueId === league1Id
            ? [{ name: "Spinwide Sports", tier: "lead" }, { name: "American Cricket Gear", tier: "gold" }]
            : [{ name: "Lone Star Replays", tier: "lead" }],
          results: leagueId === league1Id
            ? [
                { opponent: "NY X Factor", result: "Lost by 5 runs", score: "118/4 (19.3)", date: "2026-09-12" },
                { opponent: "Washington Eagles", result: "Won by 12 runs", score: "172/5 (20)", date: "2026-09-05" },
              ]
            : [],
        })),
      ])
    );

    const pointsSystem = {
      win: 2,
      tie: 1,
      noResult: 1,
      loss: 0,
    };

    this.slots = {
      [league1Id]: [
        { id: "s1", date: "2026-09-12",startTime: "09:00", endTime: "12:00", venueId: "v1", status: "booked" },
        { id: "s2", date: "2026-09-12", startTime: "14:00", endTime: "17:00", venueId: "v1", status: "open" },
        { id: "s3", date: "2026-09-12", startTime: "10:00", endTime: "13:00", venueId: "v2", status: "open" },
        { id: "s4", date: "2026-09-13", startTime: "09:30", endTime: "12:30", venueId: "v1", status: "open" },
        { id: "s5", date: "2026-09-13", startTime: "14:30", endTime: "17:30", venueId: "v2", status: "blocked" },
      ],
      [league2Id]: [
        { id: "s6", date: "2026-09-19", startTime: "09:00", endTime: "12:00", venueId: "v4", status: "open" },
        { id: "s7", date: "2026-09-19", startTime: "14:00", endTime: "17:00", venueId: "v5", status: "open" },
        { id: "s8", date: "2026-09-20", startTime: "10:00", endTime: "13:00", venueId: "v4", status: "open" },
      ],
    };

    const findSquad = (name) => {
      for (const teams of Object.values(this.teams)) {
        const t = teams.find((t) => t.name === name);
        if (t) return t.squad.map((p) => p.name);
      }
      return [];
    };

    const home1Name = this.teams[league1Id][0].name;
    const away1Name = this.teams[league1Id][1].name;
    const home2Name = this.teams[league1Id][2].name;
    const away2Name = this.teams[league1Id][3].name;
    const home3Name = this.teams[league1Id][4].name;
    const away3Name = this.teams[league1Id][5].name;
    const home4Name = this.teams[league1Id][6].name;
    const away4Name = this.teams[league1Id][7].name;
    const home5Name = this.teams[league2Id][0].name;
    const away5Name = this.teams[league2Id][1].name;
    const home6Name = this.teams[league2Id][1].name;
    const away6Name = this.teams[league2Id][2].name;

    const m1Innings1 = createInnings(home1Name, findSquad(home1Name));
    m1Innings1.total = 120; m1Innings1.wickets = 4; m1Innings1.overs = 19; m1Innings1.ballsInOver = 3;
    m1Innings1.extras = { wides: 2, noBalls: 1, byes: 3, legByes: 1, total: 7 };
    m1Innings1.ballsRemaining = 0;
    const m1Innings2 = createInnings(away1Name, findSquad(away1Name), 121);
    m1Innings2.total = 118; m1Innings2.wickets = 4; m1Innings2.overs = 19; m1Innings2.ballsInOver = 3;
    m1Innings2.extras = { wides: 1, noBalls: 1, byes: 2, legByes: 1, total: 5 };
    m1Innings2.ballsRemaining = 0;

    this.matches = {
      [league1Id]: [
        { id: "m1", homeTeamId: this.teams[league1Id][0].slug, awayTeamId: this.teams[league1Id][1].slug, venueId: "v1", date: "2026-09-12", startTime: "10:00", status: "completed", result: { winner: "NY X Factor", margin: "5 runs" }, innings1: m1Innings1, innings2: m1Innings2, currentInnings: 2 },
        { id: "m2", homeTeamId: this.teams[league1Id][2].slug, awayTeamId: this.teams[league1Id][3].slug, venueId: "v2", date: "2026-09-12", startTime: "14:00", status: "scheduled", innings1: createInnings(home2Name, findSquad(home2Name)), innings2: null, currentInnings: 1 },
        { id: "m3", homeTeamId: this.teams[league1Id][4].slug, awayTeamId: this.teams[league1Id][5].slug, venueId: "v1", date: "2026-09-13", startTime: "09:30", status: "scheduled", innings1: createInnings(home3Name, findSquad(home3Name)), innings2: null, currentInnings: 1 },
        { id: "m4", homeTeamId: this.teams[league1Id][6].slug, awayTeamId: this.teams[league1Id][7].slug, venueId: "v2", date: "2026-09-13", startTime: "14:30", status: "scheduled", innings1: createInnings(home4Name, findSquad(home4Name)), innings2: null, currentInnings: 1 },
      ],
      [league2Id]: [
        { id: "m5", homeTeamId: this.teams[league2Id][0].slug, awayTeamId: this.teams[league2Id][1].slug, venueId: "v4", date: "2026-09-19", startTime: "10:00", status: "scheduled", innings1: createInnings(home5Name, findSquad(home5Name)), innings2: null, currentInnings: 1 },
        { id: "m6", homeTeamId: this.teams[league2Id][1].slug, awayTeamId: this.teams[league2Id][2].slug, venueId: "v5", date: "2026-09-20", startTime: "10:00", status: "scheduled", innings1: createInnings(home6Name, findSquad(home6Name)), innings2: null, currentInnings: 1 },
      ],
    };

    this.commerce = {
      [league1Id]: {
        sponsors: [
          { id: "sp1", name: "Spinwide Sports", tier: "lead", status: "active", pricing: 2400, placements: ["overlay", "footer", "ticker"], renewalDate: "2027-03-01" },
          { id: "sp2", name: "American Cricket Gear", tier: "gold", status: "active", pricing: 1900, placements: ["team pages", "splash"], renewalDate: "2027-02-15" },
          { id: "sp3", name: "Northwest Replays", tier: "silver", status: "reserved", pricing: 1500, placements: ["stream overlay", "halftime"], renewalDate: "2027-04-01" },
          { id: "sp4", name: "Silverline Apparel", tier: "silver", status: "pending", pricing: 1200, placements: ["storefront", "merch co-brand"], renewalDate: "2027-05-01" },
        ],
        tickets: [
          { id: "t1", matchId: "m2", price: 18, capacity: 500, sold: 186, status: "on-sale" },
          { id: "t2", matchId: "m3", price: 18, capacity: 620, sold: 412, status: "on-sale" },
          { id: "t3", matchId: "m4", price: 22, capacity: 400, sold: 368, status: "low-stock" },
        ],
        merch: [
          { id: "mer1", teamId: "seattle-moose", price: 34, stock: 82, status: "available" },
          { id: "mer2", teamId: "ny-xfactor", price: 34, stock: 54, status: "low-stock" },
          { id: "mer3", teamId: "dallas-lions", price: 38, stock: 0, status: "unavailable" },
        ],
        cart: [],
      },
      [league2Id]: {
        sponsors: [
          { id: "sp5", name: "Lone Star Replays", tier: "lead", status: "active", pricing: 1700, placements: ["overlay", "stream"], renewalDate: "2027-02-28" },
        ],
        tickets: [
          { id: "t4", matchId: "m5", price: 15, capacity: 700, sold: 210, status: "on-sale" },
        ],
        merch: [],
        cart: [],
      },
    };

    this.activity = [
      { id: "a1", leagueId: league1Id, type: "league", text: "USA Seniors Cricket League activated for 2026 Senior Championship", time: "2h ago" },
      { id: "a2", leagueId: league1Id, type: "match", text: "Match 1 completed: NY X Factor beat Seattle Moose by 5 runs", time: "4h ago" },
      { id: "a3", leagueId: league1Id, type: "commerce", text: "Spinwide Sports confirmed as lead sponsor", time: "6h ago" },
      { id: "a4", leagueId: league1Id, type: "venue", text: "Riverside Sports Complex slot booked for Round 1, Match 2", time: "1d ago" },
      { id: "a5", leagueId: league2Id, type: "league", text: "West Region T20 Cup created in draft status", time: "1d ago" },
      { id: "a6", leagueId: league2Id, type: "team", text: "Dallas Lions added to West Region T20 Cup", time: "1d ago" },
    ];

    this.activeLeagueId = league1Id;
  }

  getActiveLeague() {
    return this.leagues.find((l) => l.id === this.activeLeagueId);
  }

  setActiveLeague(id) {
    this.activeLeagueId = id;
  }

  updateOverlaySettings(updates) {
    this.overlaySettings = { ...this.overlaySettings, ...updates };
  }

  addLeague(league) {
    this.leagues.push(league);
    this.venues[league.id] = [];
    this.teams[league.id] = [];
    this.slots[league.id] = [];
    this.matches[league.id] = [];
    this.commerce[league.id] = { sponsors: [], tickets: [], merch: [], cart: [] };
    this.addActivity({ leagueId: league.id, type: "league", text: `${league.name} created in ${league.status} status` });
  }

  addVenue(leagueId, venue) {
    this.venues[leagueId].push({ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10), ...venue, status: venue.status || "open" });
  }

  addTeam(leagueId, team) {
    this.teams[leagueId].push({ ...team, squad: [], sponsors: [], results: [] });
  }

  addSlot(leagueId, slot) {
    this.slots[leagueId].push({ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10), ...slot });
  }

  bookSlot(leagueId, slotId, matchId) {
    const slot = this.slots[leagueId].find((s) => s.id === slotId);
    if (slot) slot.status = "booked";
  }

  blockSlot(leagueId, slotId) {
    const slot = this.slots[leagueId].find((s) => s.id === slotId);
    if (slot) slot.status = "blocked";
  }

  releaseSlot(leagueId, slotId) {
    const slot = this.slots[leagueId].find((s) => s.id === slotId);
    if (slot) slot.status = "open";
  }

  getStandings(leagueId) {
    const teams = this.teams[leagueId] || [];
    const matches = this.matches[leagueId] || [];
    const pointsSystem = { win: 2, tie: 1, noResult: 1, loss: 0 };

    const records = teams.map((t) => ({
      team: t.name,
      slug: t.slug,
      logo: t.logo,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      noResult: 0,
      runsFor: 0,
      oversFaced: 0,
      runsAgainst: 0,
      oversBowled: 0,
      points: 0,
    }));

    matches
      .filter((m) => m.status === "completed")
      .forEach((m) => {
        const home = records.find((r) => r.slug === m.homeTeamId);
        const away = records.find((r) => r.slug === m.awayTeamId);
        if (!home || !away) return;

        const homeScore = m.innings1?.total ?? 120;
        const awayScore = m.innings2?.total ?? 118;
        const homeOvers = (m.innings1?.overs ?? 20) + (m.innings1?.ballsInOver ?? 0) / 6;
        const awayOvers = (m.innings2?.overs ?? 20) + (m.innings2?.ballsInOver ?? 0) / 6;

        home.runsFor += homeScore;
        home.runsAgainst += awayScore;
        home.oversFaced += homeOvers;
        home.oversBowled += awayOvers;

        away.runsFor += awayScore;
        away.runsAgainst += homeScore;
        away.oversFaced += awayOvers;
        away.oversBowled += homeOvers;

        if (m.result?.winner === teams.find((t) => t.slug === m.homeTeamId)?.name) {
          home.won += 1; home.points += pointsSystem.win;
          away.lost += 1;
        } else{
          away.won += 1; away.points += pointsSystem.win;
          home.lost += 1;
        }
      });

    records.forEach((r) => {
      r.played = r.won + r.lost + r.tied + r.noResult;
      const rForAvg = r.oversFaced ? (r.runsFor / r.oversFaced) : 0;
      const rAgstAvg = r.oversBowled ? (r.runsAgainst / r.oversBowled) : 0;
      r.nrr = r.played ? (rForAvg - rAgstAvg).toFixed(3) : "0.000";
      if (!r.nrr.startsWith("-") && r.nrr !== "0.000") r.nrr = "+" + r.nrr;
    });

    records.sort((a, b) => b.points - a.points || parseFloat(b.nrr) - parseFloat(a.nrr));

    return records.map((r, i) => ({ rank: i + 1, ...r }));
  }

  getMatch(leagueId, matchId) {
    return (this.matches[leagueId] || []).find((m) => m.id === matchId);
  }

  getActiveInnings(match) {
    if (!match) return null;
    return match.currentInnings === 1 ? match.innings1 : match.innings2;
  }

  startMatch(leagueId, matchId) {
    const match = this.getMatch(leagueId, matchId);
    if (!match || match.status === "live") return;
    match.status = "live";
    if (!match.innings1) {
      const homeTeam = (this.teams[leagueId] || []).find((t) => t.slug === match.homeTeamId);
      match.innings1 = createInnings(homeTeam?.name || match.homeTeamId, (homeTeam?.squad || []).map((p) => p.name));
    }
    this.addActivity({ leagueId, type: "match", text: `Match started: ${match.homeTeamId} vs ${match.awayTeamId}` });
  }

  recordBall(leagueId, matchId, { runs = 0, kind = "normal", comment = "" }) {
    const match = this.getMatch(leagueId, matchId);
    if (!match || match.status === "completed") return;
    if (match.status !== "live") match.status = "live";

    const innings = this.getActiveInnings(match);
    if (!innings) return;

    const maxOvers = this.leagues.find((l) => l.id === leagueId)?.oversPerInnings || 20;
    const totalBalls = innings.overs * 6 + innings.ballsInOver;
    if (totalBalls >= maxOvers * 6) return;

    innings.ballLog.push({ runs, kind, comment, over: innings.overs, ballInOver: innings.ballsInOver });

    if (kind === "wide") {
      innings.extras.wides += 1;
      innings.extras.total += 1;
      innings.total += 1;
      innings.lastBall = { comment: comment || "Wide — 1 run added." };
    } else if (kind === "noball") {
      innings.extras.noBalls += 1;
      innings.extras.total += 1;
      innings.total += 1;
      innings.lastBall = { comment: comment || "No ball — 1 run added." };
    } else if (kind === "bye") {
      innings.extras.byes += 1;
      innings.extras.total += 1;
      innings.total += 1;
      innings.lastBall = { comment: comment || "Bye — 1 run added." };
    } else if (kind === "legbye") {
      innings.extras.legByes += 1;
      innings.extras.total += 1;
      innings.total += 1;
      innings.lastBall = { comment: comment || "Leg bye — 1 run added." };
    } else if (kind === "wicket") {
      innings.wickets += 1;
      innings.lastBall = { comment: comment || "Wicket!" };
    } else {
      innings.total += runs;
      innings.lastBall = { comment: comment || (runs === 0 ? "Dot ball" : `${runs} run${runs !== 1 ? "s" : ""}`) };
    }

    if (kind !== "wide" && kind !== "noball") {
      if (innings.ballsInOver >= 5) {
        innings.overs += 1;
        innings.ballsInOver = 0;
      } else {
        innings.ballsInOver += 1;
      }
    }

    innings.ballsRemaining = maxOvers * 6 - (innings.overs * 6 + innings.ballsInOver);
    const ballsBowled = innings.overs * 6 + innings.ballsInOver;
    innings.runRate = ballsBowled > 0 ? (innings.total / ballsBowled) * 6 : 0;

    if (innings.target > 0) {
      const needed = innings.target - innings.total;
      innings.requiredRate = innings.ballsRemaining > 0 ? (needed / innings.ballsRemaining) * 6 : 999;
    }

    if (kind !== "wide" && kind !== "noball") {
      if (runs % 2 === 1) {
        const tmp = innings.striker;
        innings.striker = innings.nonStriker;
        innings.nonStriker = tmp;
      }
    }

    if (innings.ballsRemaining <= 0 || innings.wickets >= 10) {
      if (match.currentInnings === 1) {
        match.currentInnings = 2;
        const awayTeam = (this.teams[leagueId] || []).find((t) => t.slug === match.awayTeamId);
        match.innings2 = createInnings(awayTeam?.name || match.awayTeamId, (awayTeam?.squad || []).map((p) => p.name), innings.total + 1);
      } else {
        match.status = "completed";
        const score1 = match.innings1?.total || 0;
        const score2 = match.innings2?.total || 0;
        if (score1 > score2) {
          match.result = { winner: match.innings1?.team, margin: `${score1 - score2} runs` };
        } else if (score2 > score1) {
          match.result = { winner: match.innings2?.team, margin: `by ${10 - (match.innings2?.wickets || 0)} wickets` };
        } else {
          match.result = { winner: "Tie", margin: "Match tied" };
        }
        this.addActivity({ leagueId, type: "match", text: `Match completed: ${match.result.winner} ${match.result.margin}` });
      }
    }

    return innings;
  }

  swapStrike(leagueId, matchId) {
    const match = this.getMatch(leagueId, matchId);
    if (!match) return;
    const innings = this.getActiveInnings(match);
    if (!innings) return;
    const tmp = innings.striker;
    innings.striker = innings.nonStriker;
    innings.nonStriker = tmp;
  }

  endOver(leagueId, matchId, bowlerName) {
    const match = this.getMatch(leagueId, matchId);
    if (!match) return;
    const innings = this.getActiveInnings(match);
    if (!innings) return;
    const tmp = innings.striker;
    innings.striker = innings.nonStriker;
    innings.nonStriker = tmp;
    if (bowlerName) innings.bowler = bowlerName;
  }

  addPlayer(leagueId, teamSlug, player) {
    const teams = this.teams[leagueId] || [];
    const team = teams.find(t => t.slug === teamSlug);
    if (team) {
      team.squad.push({
        id: crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10),
        name: player.name,
        role: player.role,
        jerseyNumber: player.jerseyNumber || Math.floor(Math.random() * 99) + 1,
        status: "selected",
        ...player
      });
      this.addActivity({ leagueId, type: "team", text: `${player.name} registered for ${team.name}` });
    }
  }

  addActivity(entry) {
    this.activity.unshift({ id: Math.random().toString(36).slice(2, 9), ...entry, time: "just now" });
  }

  addToCart(leagueId, item) {
    const c = this.commerce[leagueId];
    if (!c.cart.includes(item)) c.cart.push(item);
  }

  removeFromCart(leagueId, itemId) {
    this.commerce[leagueId].cart = this.commerce[leagueId].cart.filter((i) => i.id !== itemId);
  }
}

export const leagueStore = new LeagueStore();

// Seed once
if (!leagueStore.leagues.length) {
  leagueStore.seed();
}
