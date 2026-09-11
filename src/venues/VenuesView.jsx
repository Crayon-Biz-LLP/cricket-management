import React, { useState } from "react";
import { leagueStore } from "../store/leagueStore";

export default function VenuesView() {
  const league = leagueStore.getActiveLeague();
  const venues = [...(leagueStore.venues[league.id] || [])];
  const [selected, setSelected] = useState(venues[0] || null);
  const [view, setView] = useState("list");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({});

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (editing) {
      const idx = venues.findIndex((v) => v.id === editing.id);
      if (idx >= 0) venues[idx] = { ...venues[idx], ...form };
      leagueStore.venues[league.id] = venues;
      setEditing(null);
    } else {
      leagueStore.addVenue(league.id, form);
      setShowAdd(false);
      setForm({});
    }
    setSelected(venues.find((v) => v.id === (editing?.id || form?.id)));
  };

  const openEdit = (v) => {
    setForm({ id: v.id, name: v.name, city: v.city, capacity: v.capacity, surface: v.surface, status: v.status, notes: v.notes });
    setEditing(v);
  };

  const statusColor = (s) => {
    if (s === "open") return "var(--scorer-green)";
    if (s === "booked") return "var(--accent)";
    if (s === "maintenance") return "var(--scorer-amber)";
    return "var(--muted-2)";
  };

  return (
    <div>
      <div className="page-head fade-up">
        <span className="kicker">{league.name}</span>
        <h2>Venues & Grounds</h2>
        <p>Manage grounds, availability, slot rules, and venue notes for {league.season}.</p>
      </div>

      <div className="section-title fade-up stagger-1">Tools</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }} className="fade-up stagger-2">
        <button className="btn btn-outline btn-sm" onClick={() => setView("list")}>List</button>
        <button className="btn btn-outline btn-sm" onClick={() => setView("grid")}>Grid</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={() => { setForm({ name: "", city: "", capacity: "", surface: "", notes: "", status: "open" }); setEditing(null); setShowAdd(true); }}>
          Add venue
        </button>
      </div>

      <div className="fade-up stagger-3">
        {view === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {venues.map((v, i) => (
              <div
                key={v.id}
                className="card"
                style={{ cursor: "pointer", transition: "border-color 0.16s ease", outline: selected?.id === v.id ? "2px solid var(--primary)" : "none", outlineOffset: 2 }}
                onClick={() => setSelected(v)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={statusColor(v.status)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>{v.name}</div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{v.city}</div>
                    </div>
                  </div>
                  <span className="pill" style={{ background: `${statusColor(v.status)}18`, color: statusColor(v.status), padding: "4px 9px" }}>
                    {v.status}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Capacity: <strong style={{ color: "var(--ink)" }}>{v.capacity}</strong></span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Surface: <strong style={{ color: "var(--ink)" }}>{v.surface}</strong></span>
                  {v.notes && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{v.notes}</span>}
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(v); }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); alert("Please block specific slots from the Schedule view."); }}>Block</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "grid" && (
          <div className="grid-3">
            {venues.map((v, i) => (
              <div key={v.id} className="card-elevated fade-up stagger-${i + 1}" style={{ cursor: "pointer" }} onClick={() => setSelected(v)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>{v.name}</div>
                  <span className="pill" style={{ background: `${statusColor(v.status)}18`, color: statusColor(v.status) }}>{v.status}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10 }}>{v.city}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span className="text-label">Capacity</span>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>{v.capacity}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <span className="text-label">Surface</span>
                  <span style={{ fontWeight: 600, color: "var(--ink-3)" }}>{v.surface}</span>
                </div>
                {v.notes && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>{v.notes}</div>}
                <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(v); }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); alert("Please block specific slots from the Schedule view."); }}>Block</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="card-elevated fade-up stagger-4" style={{ marginTop: 18 }}>
          <div className="section-title">{selected.name} — detail</div>
          <div className="row">
            <div className="field">
              <label className="label">Name</label>
              <input className="input" value={selected.name} readOnly />
            </div>
            <div className="field">
              <label className="label">City</label>
              <input className="input" value={selected.city} readOnly />
            </div>
            <div className="field">
              <label className="label">Capacity</label>
              <input className="input" value={selected.capacity} readOnly />
            </div>
            <div className="field">
              <label className="label">Surface</label>
              <input className="input" value={selected.surface} readOnly />
            </div>
            <div className="field">
              <label className="label">Status</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["open", "booked", "maintenance"].map((s) => (
                  <span key={s} className="pill" style={{ background: s === selected.status ? `${statusColor(s)}22` : "var(--surface-3)", color: s === selected.status ? statusColor(s) : "var(--muted-2)", cursor: "pointer", transition: "background 0.15s ease" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="label">Notes</label>
              <input className="input" value={selected.notes || ""} readOnly />
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm" onClick={() => openEdit(selected)}>Edit venue</button>
            <button className="btn btn-outline btn-sm">Manage slots</button>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add venue</h3>
              <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="label">Venue name</label>
                <input className="input" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Riverside Sports Complex" />
              </div>
              <div className="row">
                <div className="field">
                  <label className="label">City</label>
                  <input className="input" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="New Jersey" />
                </div>
                <div className="field">
                  <label className="label">Surface</label>
                  <select className="select" value={form.surface} onChange={(e) => updateField("surface", e.target.value)}>
                    <option value="">Select…</option>
                    <option value="Grass">Grass</option>
                    <option value="Artificial Turf">Artificial Turf</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Clay">Clay</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <label className="label">Capacity</label>
                  <input className="input" value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} placeholder="500" />
                </div>
                <div className="field">
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                    <option value="open">Open</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label">Notes</label>
                <textarea className="input textarea" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Floodlights available, side pitch for warmups" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Add venue</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit venue</h3>
              <button className="modal-close" onClick={() => setEditing(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="label">Venue name</label>
                <input className="input" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div className="row">
                <div className="field">
                  <label className="label">City</label>
                  <input className="input" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Surface</label>
                  <select className="select" value={form.surface} onChange={(e) => updateField("surface", e.target.value)}>
                    <option value="Grass">Grass</option>
                    <option value="Artificial Turf">Artificial Turf</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Clay">Clay</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <label className="label">Capacity</label>
                  <input className="input" value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                    <option value="open">Open</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label">Notes</label>
                <textarea className="input textarea" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
