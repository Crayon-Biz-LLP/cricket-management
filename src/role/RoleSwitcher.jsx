import React from "react";
import { ROLES } from "../NAV";
import { roleStore } from "../store/roleStore";

export default function RoleSwitcher({ currentView, setView }) {
  const role = roleStore.getRole();

  return (
    <select
      className="select"
      style={{ width: "auto", minWidth: 190 }}
      value={role}
      onChange={(e) => {
        roleStore.setRole(e.target.value);
        const newNav = [
          "league-owner",
          "franchise",
          "captain",
          "player",
          "fan",
          "broadcaster",
          "sponsor",
        ].includes(e.target.value)
          ? e.target.value
          : "league-owner";
      }}
    >
      {ROLES.map((r) => (
        <option key={r.id} value={r.id}>
          {r.icon} {r.label}
        </option>
      ))}
    </select>
  );
}
