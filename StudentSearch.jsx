import React, { useState, useMemo, useEffect } from "react";

// Debounce hook
function useDebouncedValue(value, ms = 150) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), ms);
    return () => clearTimeout(t);
  }, [value]);
  return deb;
}

// Highlight matching text
function Highlight({ text, query }) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </>
  );
}

// Initial dummy data
const INITIAL_STUDENTS = [
  { id: 1, name: "Amit Kumar", roll: "CSE1201", branch: "CSE" },
  { id: 2, name: "Sneha Patel", roll: "CSE1202", branch: "CSE" },
  { id: 3, name: "Ravi Sharma", roll: "ECE1101", branch: "ECE" },
  { id: 4, name: "Priya Singh", roll: "ME1301", branch: "ME" },
];

export default function StudentSearch() {

  // ===============================
  // States
  // ===============================
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [query, setQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  const [newName, setNewName] = useState("");
  const [newRoll, setNewRoll] = useState("");
  const [newBranch, setNewBranch] = useState("CSE");

  const debounced = useDebouncedValue(query, 120);

  // ===============================
  // Filtering
  // ===============================
  const filtered = useMemo(() => {
    const q = debounced.toLowerCase();

    return students.filter((s) => {
      if (branchFilter !== "all" && s.branch !== branchFilter) return false;
      return (
        s.name.toLowerCase().includes(q) ||
        s.roll.toLowerCase().includes(q)
      );
    });
  }, [debounced, students, branchFilter]);

  // ===============================
  // Add Student Handler
  // ===============================
  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!newName.trim() || !newRoll.trim()) {
      alert("Name and Roll Number are required");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: newName.trim(),
      roll: newRoll.trim(),
      branch: newBranch
    };

    setStudents([newStudent, ...students]);

    // Reset form
    setNewName("");
    setNewRoll("");
    setNewBranch("CSE");
  };

  // ===============================
  // UI Rendering
  // ===============================
  return (
    <div>

      {/* Search + Filter */}
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search name or roll..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="dropdown"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="all">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
        </select>
      </div>

      {/* ===============================
          Add Student Form
      ================================ */}
      <form
        onSubmit={handleAddStudent}
        style={{
          marginBottom: 25,
          padding: 20,
          background: "white",
          borderRadius: 14,
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: 15, fontSize: 20 }}>Add New Student</h2>

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <input
            className="search-input"
            style={{ flex: 2 }}
            placeholder="Enter Name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            className="search-input"
            style={{ flex: 1 }}
            placeholder="Roll No..."
            value={newRoll}
            onChange={(e) => setNewRoll(e.target.value)}
          />

          <select
            className="dropdown"
            style={{ flex: 1 }}
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
          >
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#005bea",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Add Student
        </button>
      </form>

      {/* Result Count */}
      <p style={{ marginBottom: 10, fontSize: 15 }}>
        Showing <strong>{filtered.length}</strong> of {students.length} students
      </p>

      {/* List */}
      <div className="student-list">
        {filtered.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#777" }}>
            No matching students found
          </div>
        ) : (
          filtered.map((s) => (
            <div className="student-card" key={s.id}>
              <div>
                <div className="student-name">
                  <Highlight text={s.name} query={debounced} />
                </div>
                <div className="student-roll">
                  Roll: <Highlight text={s.roll} query={debounced} />
                </div>
              </div>
              <div className="branch-tag">{s.branch}</div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}