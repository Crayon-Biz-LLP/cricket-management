import React from "react";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <div style={{ display: "contents" }}>
        {children}
      </div>
    </div>
  );
}
