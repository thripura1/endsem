import React from "react";
import StudentSearch from "./StudentSearch";

export default function App() {
  return (
    <div className="app">
      <header style={{ padding: 20 }}>
        <h1 style={{ margin: 0 }}>Live Student Search</h1>
        <p style={{ marginTop: 6, color: "#555" }}>
          Search by name or roll number (case-insensitive, updates in real time)
        </p>
      </header>

      <main style={{ padding: 20 }}>
        <StudentSearch />
      </main>
    </div>
  );
}