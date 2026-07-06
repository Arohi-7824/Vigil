import { useEffect, useState } from "react";
import { getRisks } from "../services/api";

export default function AdminDashboard() {
  const [risks, setRisks] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  useEffect(() => {
  if (!selectedRisk) return;

  const fetchAddress = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${selectedRisk.latitude}&lon=${selectedRisk.longitude}&format=json`
      );

      const data = await res.json();

      setAddress(data.display_name || "Unknown location");
    } catch (err) {
      console.error(err);
      setAddress("Unable to fetch location");
    }
  };

  fetchAddress();
}, [selectedRisk]);

  const fetchRisks = async () => {
  try {
    const res = await getRisks();

    console.log("ALL DATA:", res.data); // debug

    // 🔥 FILTER ONLY ACTIVE
    setRisks(res.data); // show ALL

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const updateStatus = async (id, status) => {
  try {
    console.log("Updating:", id, status);

    const res = await fetch(`http://localhost:3000/api/risks/${id}/resolve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status }) // 🔥 THIS IS KEY
    });

    const data = await res.json();
    console.log("Updated:", data);

    await fetchRisks();   // refresh list
    setSelectedRisk(null);

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};
  if (!user) return <div style={{ color: "white" }}>Not logged in</div>;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Control Center</h1>
          <p style={styles.subtitle}>Manage risks & system actions</p>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* GRID */}
      <div style={styles.grid}>

        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
            {/* setRisks(res.data) */}

          {loading ? (
  <p>Loading...</p>
) : risks.length === 0 ? (
  <p style={{ color: "#94a3b8" }}>No risks found</p>
) : (
  risks.map((risk) => (
    <div
      key={risk.id}
      onClick={() => {
        setSelectedRisk(risk);
        setAddress("");
      }}
      style={{
        ...styles.card,
        borderLeft: `5px solid ${getSeverityColor(risk.severity)}`
      }}
    >
      <p>{risk.description}</p>
      <div style={{
  display: "flex",
  gap: "8px",
  marginTop: "8px",
  flexWrap: "wrap"
}}>

  <span style={styles.badge}>
    {risk.severity}
  </span>

  <span style={{
    ...styles.badge,
    color:
      risk.status === "RESOLVED"
        ? "#22c55e"
        : risk.status === "IN_PROGRESS"
        ? "#3b82f6"
        : "#f59e0b"
  }}>
    {risk.status}
  </span>

</div>
    </div>
  ))
)}
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.rightPanel}>
          {!selectedRisk ? (
            <p>Select a risk</p>
          ) : (
            <>
              <h2>{selectedRisk.description}</h2>

              <p>📍 {address || "Loading location..."}</p>

             <p>Status:{" "} <b style={{ color: selectedRisk.status === "RESOLVED" ? "#22c55e" : selectedRisk.status === "IN_PROGRESS" ? "#3b82f6"
          : "#f97316" }}>
  {selectedRisk.status}
</b></p>
              <p>Severity: <b>{selectedRisk.severity}</b></p>

              <hr />

              <h3>AI Summary</h3>
              <p style={{ marginTop: "10px", color: "#93c5fd" }}>
   Assigned Team:{" "}
  <b>{selectedRisk.assigned_team}</b>
</p>

              <h3>Actions</h3>

{/* TEAM INFO */}
<p>
  <b>Suggested Team:</b>{" "}
  <span style={{ color: "#93c5fd" }}>
    {selectedRisk.assigned_team || "Not assigned"}
  </span>
</p>

{/* ASSIGN TEAM */}
{selectedRisk.status === "ACTIVE" && (
  <button
    onClick={async () => {
      try {
        await fetch(
          `http://localhost:3000/api/risks/${selectedRisk.id}/assign`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              assigned_team: selectedRisk.assigned_team
            })
          }
        );

        alert("✅ Team Assigned");

        await fetchRisks();

        setSelectedRisk({
          ...selectedRisk,
          status: "IN_PROGRESS"
        });

      } catch (err) {
        console.error(err);
        alert("Assignment failed");
      }
    }}

    style={{
      marginTop: "10px",
      background: "#3b82f6",
      padding: "10px",
      borderRadius: "6px",
      cursor: "pointer",
      border: "none",
      color: "white"
    }}
  >
    Assign Team
  </button>
)}

{/* RESOLVE */}
{userRole === "ADMIN" && (
  <>
    {selectedRisk.status === "IN_PROGRESS" && (
      <button
        onClick={() =>
          updateStatus(selectedRisk.id, "RESOLVED")
        }

        style={{
          marginTop: "20px",
          marginLeft: "10px",
          background: "#22c55e",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
          border: "none",
          color: "white"
        }}
      >
        Mark Closed
      </button>
    )}

    {selectedRisk.status === "RESOLVED" && (
      <button
        onClick={() =>
          updateStatus(selectedRisk.id, "ACTIVE")
        }

        style={{
          marginTop: "20px",
          background: "#f59e0b",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
          border: "none",
          color: "white"
        }}
      >
        Reopen
      </button>
    )}
  </>
)}
            </>
          )}
        </div>

      </div>
    </div>
  );
}



/* ---------- HELPERS ---------- */

const getSeverityColor = (severity) => {
  switch (severity) {
    case "CRITICAL": return "#ef4444";
    case "HIGH": return "#f97316";
    case "MEDIUM": return "#eab308";
    default: return "#22c55e";
  }
};

/* ---------- STYLES ---------- */

const styles = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
    // fontFamily: "Inter, sans-serif"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    fontSize: "26px"
  },

  subtitle: {
    color: "#94a3b8"
  },

  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },

  leftPanel: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    height: "500px",
    overflowY: "auto"
  },

  rightPanel: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px"
  },

  card: {
    background: "#0f172a",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  badge: {
    fontSize: "12px",
    color: "#94a3b8"
  },

  actions: {
    marginTop: "15px",
    display: "flex",
    gap: "10px"
  },

  successBtn: {
    background: "#22c55e",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  warnBtn: {
    background: "#f59e0b",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  secondaryBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};