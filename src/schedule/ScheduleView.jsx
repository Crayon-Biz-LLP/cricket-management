import React, { useState, useMemo } from "react";
import { leagueStore } from "../store/leagueStore";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function ScheduleView() {
  const league = leagueStore.getActiveLeague();
  const slots = leagueStore.slots[league.id] || [];
  const matches = leagueStore.matches[league.id] || [];
  const venues = leagueStore.venues[league.id] || [];

  const [view, setView] = useState("week");
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().slice(0, 10);
  });

  const [selectedDay, setSelectedDay] = useState(() => new Date().toISOString().slice(0, 10));

  const weekDates = useMemo(() => {
    const dates = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  }, [weekStart]);

  const [quickSlot, setQuickSlot] = useState({ date: weekDates[0], startTime: "09:00", endTime: "12:00", venueId: venues[0]?.id || "" });

  const handleCreateSlot = () => {
    if (!quickSlot.date || !quickSlot.startTime || !quickSlot.endTime || !quickSlot.venueId) return;
    leagueStore.addSlot(league.id, {
      date: quickSlot.date,
      startTime: quickSlot.startTime,
      endTime: quickSlot.endTime,
      venueId: quickSlot.venueId,
      status: "open"
    });
    setQuickSlot({ ...quickSlot, startTime: "13:00", endTime: "16:00" });
  };

  const isToday = (date) => date === new Date().toISOString().slice(0, 10);

  const slotsForDate = (date) => {
    const dayMatches = slots.filter((s) => s.date === date);
    const matchMatches = matches.filter(
      (m) => m.date === date && m.status !== "completed"
    );
    return { slots: dayMatches, matches: matchMatches };
  };

  const venueName = (venueId) => venues.find((v) => v.id === venueId)?.name || "—";

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    const hour = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
    return `${hour}:${m} ${ampm}`;
  };

  const SlotChip = ({ slot, isMatch }) => {
    const timeLabel = slot.startTime ? formatTime(slot.startTime) : "";
    const venueLabel = slot.venueId ? venueName(slot.venueId) : "";
    const statusColor = slot.status === "open" ? "var(--scorer-green)" : slot.status === "booked" ? "var(--accent)" : "var(--muted-2)";

    return (
      <span
        className="calendar-slot-chip"
        style={{
          background: slot.status === "open" ? "white" : slot.status === "booked" ? "var(--accent-soft)" : "var(--surface-3)",
          color: statusColor,
          borderColor: slot.status === "open" ? "var(--line)" : slot.status === "booked" ? "rgba(192,0,32,0.3)" : "var(--line)",
        }}
      >
        {isMatch ? "⚡" : "◈"} {timeLabel} · {venueLabel}
      </span>
    );
  };

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Scheduling</h2>
        <p>Book ground slots first, then assign matches. Week view is the primary surface; day, list, and grid views sit alongside it.</p>
      </div>

      <div className="section-title fade-up stagger-1">Views</div>
      <div className="segmented-control fade-up stagger-2" style={{ marginBottom: 18 }}>
        <button className={`btn ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>Week</button>
        <button className={`btn ${view === "day" ? "active" : ""}`} onClick={() => setView("day")}>Day</button>
        <button className={`btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>List</button>
        <button className={`btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>Grid</button>
      </div>

      <div className={`fade-up stagger-3 ${view === "week" ? "calendar-shell" : ""}`}>
        {view === "week" && (
          <>
            <div className="calendar-week-header">
              <div className="calendar-week-day" />
              {weekDates.map((date, i) => (
                <div key={i} className={`calendar-week-day ${isToday(date) ? "today" : ""}`}>
                  <div className="day-name">{DAYS[i]}</div>
                  <div className="day-number">{new Date(date).getDate()}</div>
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {HOURS.map((time) => (
                <div key={time} className="calendar-row">
                  <div className="calendar-time">{formatTime(time)}</div>
                  {weekDates.map((date, i) => {
                    const { slots: daySlots, matches: dayMatches } = slotsForDate(date);
                    const slotHere = daySlots.find((s) => s.startTime === time);
                    const matchHere = dayMatches.find((m) => {
                      const [h, mm] = m.startTime.split(":");
                      return Math.abs(parseInt(h, 10) - parseInt(time.split(":")[0], 10)) <= 1;
                    });
                    const has = slotHere || matchHere;
                    const isTodayCell = isToday(date);
                    return (
                      <div key={i} className={`calendar-cell ${isTodayCell ? "today" : ""} ${has ? "has-events" : ""}`}>
                        {slotHere && <SlotChip slot={slotHere} />}
                        {matchHere && (
                          <span className="calendar-slot-chip assigned" style={{ fontWeight: 700 }}>
                            ⚡ {matchHere.homeTeamId} vs {matchHere.awayTeamId}
                          </span>
                        )}
                        {!slotHere && !matchHere && (
                          <span className="calendar-slot-chip open" style={{ opacity: 0.55 }}>Open slot</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="calendar-legend">
              <span><span className="chip-mark open" />Open slot</span>
              <span><span className="chip-mark assigned" />Booked / assigned</span>
              <span><span className="chip-mark blocked" />Blocked</span>
              <span style={{ marginLeft: "auto" }}>⚡ = match assigned to slot</span>
            </div>
          </>
        )}

        {view === "day" && selectedDay && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, color: "var(--muted)", letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 700 }}>
                {new Date(selectedDay).toLocaleDateString(undefined, { weekday: "long" })} · {new Date(selectedDay).toLocaleDateString()}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {weekDates.map((d) => (
                  <button
                    key={d}
                    className={`btn ${d === selectedDay ? "btn-primary" : "btn-outline"}`}
                    style={{ fontSize: 12.5, padding: "6px 10px" }}
                    onClick={() => setSelectedDay(d)}
                  >
                    {new Date(d).getDate()}
                  </button>
                ))}
              </div>
            </div>

            <div className="fade-up stagger-4">
              <div className="section-title">Slots · {selectedDay}</div>
              {slotsForDate(selectedDay).slots.length === 0 && (
                <div className="empty-state"><p>No ground slots for this day yet.</p></div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {slotsForDate(selectedDay).slots.map((s) => (
                  <div key={s.id} className="card" style={{ borderLeft: `3px solid ${s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                      <div style={{ fontWeight: 700, color: "var(--ink)" }}>{formatTime(s.startTime)} — {formatTime(s.endTime)}</div>
                      <span className="pill" style={{ background: `${s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)"}18`, color: s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)" }}>
                        {s.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{venueName(s.venueId)}</div>
                    <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {s.status === "open" && (
                        <>
                          <button className="btn btn-primary btn-sm">Assign match</button>
                          <button className="btn btn-ghost btn-sm">Mark blocked</button>
                        </>
                      )}
                      {s.status === "booked" && <button className="btn btn-ghost btn-sm">Release slot</button>}
                      {s.status === "blocked" && <button className="btn btn-outline btn-sm">Unblock</button>}
                    </div>
                  </div>
                ))}
                {slotsForDate(selectedDay).matches.map((m) => {
                  const slot = slotsForDate(selectedDay).slots.find((s) => s.status === "booked");
                  return null;
                })}
              </div>
            </div>
          </>
        )}

        {view === "list" && (
          <div className="fade-up stagger-4">
            <div className="section-title">All slots · {league.name}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {slots.map((s) => (
                <div key={s.id} className="card" style={{ borderLeft: `3px solid ${s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>
                      {s.date} · {formatTime(s.startTime)} — {formatTime(s.endTime)}
                    </div>
                    <span className="pill" style={{ background: `${s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)"}18`, color: s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)" }}>
                      {s.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{venueName(s.venueId)}</div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {s.status === "open" && (
                      <>
                        <button className="btn btn-primary btn-sm">Assign match</button>
                        <button className="btn btn-ghost btn-sm">Mark blocked</button>
                      </>
                    )}
                    {s.status === "booked" && <button className="btn btn-ghost btn-sm">Release slot</button>}
                  </div>
                </div>
              ))}
              {slots.length === 0 && <div className="empty-state"><p>No slots yet. Book ground time first.</p></div>}
            </div>
          </div>
        )}

        {view === "grid" && (
          <div className="fade-up stagger-4">
            <div className="section-title">Grid · {league.name}</div>
            <div className="grid-4">
              {slots.map((s, i) => (
                <div key={s.id} className="card-elevated fade-up stagger-${Math.min(i + 1, 8)}" style={{ borderLeft: `4px solid ${s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)"}` }}>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                  <div style={{ fontWeight: 800, color: "var(--ink)", marginBottom: 2 }}>{formatTime(s.startTime)} — {formatTime(s.endTime)}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{venueName(s.venueId)}</div>
                  <span className="pill" style={{ background: `${s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)"}18`, color: s.status === "open" ? "var(--scorer-green)" : s.status === "booked" ? "var(--accent)" : "var(--muted-2)" }}>
                    {s.status}
                  </span>
                </div>
              ))}
              {slots.length === 0 && <div className="empty-state"><p>No slots yet.</p></div>}
            </div>
          </div>
        )}
      </div>

      {view === "week" && (
        <div className="grid-2 fade-up stagger-4" style={{ marginTop: 18 }}>
          <div className="card">
            <div className="section-title">Quick slot</div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="field">
                <label className="label">Day</label>
                <select className="select" value={quickSlot.date} onChange={(e) => setQuickSlot({...quickSlot, date: e.target.value})}>
                  {weekDates.map((d) => (
                    <option key={d} value={d}>{new Date(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">Start</label>
                <input className="input" value={quickSlot.startTime} onChange={(e) => setQuickSlot({...quickSlot, startTime: e.target.value})} />
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="field">
                <label className="label">End</label>
                <input className="input" value={quickSlot.endTime} onChange={(e) => setQuickSlot({...quickSlot, endTime: e.target.value})} />
              </div>
              <div className="field">
                <label className="label">Venue</label>
                <select className="select" value={quickSlot.venueId} onChange={(e) => setQuickSlot({...quickSlot, venueId: e.target.value})}>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleCreateSlot}>Create open slot</button>
          </div>

          <div className="card">
            <div className="section-title">Today’s slots</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              {slots.filter((s) => s.date === new Date().toISOString().slice(0, 10)).length} ground slots scheduled for today.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
