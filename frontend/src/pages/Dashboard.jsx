import { useEffect, useState } from "react";
import { getRisks } from "../services/api";
import RiskCard from "../components/RiskCard";
import MapView from "../components/MapView";
import StatCard from "../components/StatCard";
import UserMenu from "../components/UserMenu";
import jsPDF from "jspdf";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [risks, setRisks] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("CRITICAL");

  const navigate = useNavigate();

  // ✅ get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

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

  useEffect(() => {
    fetchRisks();
  }, []);

  const openRiskFromAlert = (riskId) => {
  const risk = risks.find(r => r.id === riskId);

  if (risk) {
    setSelectedRisk(risk);
  } else {
    alert("Risk not found");
  }
};

 const filteredRisks =
    filter === "ALL"
      ? risks
      : risks.filter(r => r.severity === filter);

  const fetchRisks = async () => {
  try {
    const res = await getRisks();

    // ✅ STEP 1: filter ACTIVE only
    const activeRisks = res.data.filter(r =>
  ["ACTIVE", "IN_PROGRESS"].includes(r.status)
);

    // ✅ STEP 2: sort
    const sorted = [...activeRisks].sort((a, b) => {
      const severityOrder = {
        CRITICAL: 4,
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1
      };

      if (severityOrder[b.severity] !== severityOrder[a.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }

      return (b.risk_score || 0) - (a.risk_score || 0);
    });

    setRisks(sorted);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const avgScore =
    risks.length > 0
      ? Math.round(
          risks.reduce((acc, r) => acc + (r.risk_score || 0), 0) /
            risks.length
        )
      : 0;


        const downloadReport = () => {
  if (!selectedRisk) return;

  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.text("Risk Report", 10, y);

  y += 10;
  doc.setFontSize(12);

  doc.text(`Description: ${selectedRisk.description}`, 10, y);
  y += 8;

  doc.text(`Location: ${address}`, 10, y);
  y += 8;

  doc.text(`Severity: ${selectedRisk.severity}`, 10, y);
  y += 8;

  doc.text(`Risk Score: ${selectedRisk.risk_score}`, 10, y);
  y += 10;

  doc.text("AI Summary:", 10, y);
  y += 8;

  const summaryLines = doc.splitTextToSize(
  selectedRisk.ai_summary || "N/A",
  180
);
doc.text(summaryLines, 10, y);
y += summaryLines.length * 6 + 5;

  doc.text("Recommendations:", 10, y);
  y += 8;

  let recs = selectedRisk.recommendations;

  if (typeof recs === "string") {
    try {
      recs = JSON.parse(recs);
    } catch {}
  }

  if (Array.isArray(recs)) {
  recs.forEach((r) => {
    const lines = doc.splitTextToSize(`- ${r}`, 180);
    doc.text(lines, 10, y);
    y += lines.length * 6;
  });
} else {
  doc.text("No recommendations available", 10, y);
}

  doc.save(`risk-${selectedRisk.id}.pdf`);
};
  // 🔥 FULL SCREEN VIEW
  if (selectedRisk) {
    return (
      <div style={{ background: "#0f172a", minHeight: "100vh", color: "white", padding: "20px" }}>
        
        <button
  onClick={() => {
    setSelectedRisk(null);
    setAddress(""); // 🔥 clear old address
  }}
>
  ← Back
</button>

        <div style={{ background: "#1e293b", padding: "25px", marginTop: "20px" }}>
          <h1>{selectedRisk.description}</h1>

          <p>📍 {address || "Loading location..."}</p>

          <p><b>Severity:</b> {selectedRisk.severity}</p>
          <p><b>Score:</b> {selectedRisk.risk_score}</p>

          <hr />

          <h3>AI Analysis</h3>
          <p>{selectedRisk.ai_summary}</p>

   <h3>Recommendations</h3>

{(() => {
  let recs = selectedRisk.recommendations;

  try {
    if (typeof recs === "string") {
      recs = JSON.parse(recs);
    }
  } catch (e) {
    console.error(e);
  }

  if (Array.isArray(recs)) {
    return (
      <ul>
        {recs.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    );
  }

  return <p>{recs || "No recommendations available"}</p>;
})()}

<button
  onClick={downloadReport}
  style={{
    marginTop: "15px",
    background: "#3b82f6",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  📄 Download Report
</button>



          {/* ✅ ADMIN ONLY */}
          {userRole === "ADMIN" && (
  <button
    onClick={async () => {
      try {
        setUpdating(true);

        await fetch(
          `http://localhost:3000/api/risks/${selectedRisk.id}/resolve`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "RESOLVED" })
          }
        );

        await fetchRisks();
        setSelectedRisk(null);

      } catch (err) {
        console.error(err);
      } finally {
        setUpdating(false);
      }
    }}

    disabled={updating}

    style={{
      marginTop: "20px",
      background: updating ? "#94a3b8" : "#22c55e",
      padding: "10px",
      borderRadius: "6px",
      cursor: updating ? "not-allowed" : "pointer"
    }}
  >
    {updating ? "Updating..." : "Mark as Closed"}
  </button>
)}

        </div>
      </div>
    );
  }

  // 🔥 NORMAL VIEW
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>

        <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
}}>
  {/* LEFT SIDE */}
  <div>
    <h1>Risk Control Center</h1>
    <p style={{ color: "#94a3b8" }}>Real-time monitoring</p>
  </div>

  {/* RIGHT SIDE */}
  {/* <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    
    {/* REPORT RISK BUTTON */}
    {/* <Notifications onOpenRisk={openRiskFromAlert} />
    <button
      onClick={() => navigate("/submit-risk")}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer"
      }}
    >
      + Report Risk
    </button>

    {/* USER MENU */}
    {/* <UserMenu onOpenRisk={openRiskFromAlert} />
  </div>  */}
  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
  
  <button
    onClick={() => navigate("/submit-risk")}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer"
    }}
  >
    + Report Risk
  </button>

  <UserMenu onOpenRisk={openRiskFromAlert} />
</div>
</div>

          

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
  
  <StatCard 
    title="Critical" 
    value={risks.filter(r => r.severity === "CRITICAL").length}
    color="critical"
    active={filter === "CRITICAL"}
    onClick={() => setFilter("CRITICAL")}
  />

  <StatCard 
    title="High" 
    value={risks.filter(r => r.severity === "HIGH").length}
    color="high"
    active={filter === "HIGH"}
    onClick={() => setFilter("HIGH")}
  />

  <StatCard 
    title="Medium" 
    value={risks.filter(r => r.severity === "MEDIUM").length}
    color="medium"
    active={filter === "MEDIUM"}
    onClick={() => setFilter("MEDIUM")}
  />

  <StatCard 
    title="Low" 
    value={risks.filter(r => r.severity === "LOW").length}
    color="low"
    active={filter === "LOW"}
    onClick={() => setFilter("LOW")}
  />

  <StatCard 
    title="Avg Score" 
    value={avgScore}
    color="default"
    active={filter === "ALL"}
    onClick={() => setFilter("ALL")}
  />

  {/* {filteredRisks.map(r => (
        <RiskCard key={r.id} risk={r} />
      ))} */}

</div>


        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px", marginTop: "20px" }}>
          <MapView
  risks={filteredRisks}/>
  {/* onSelect={(data) => {
    if (data.lat && data.lng) {
      // clicked on map
      navigate("/submit-risk", {
        state: {
          latitude: data.lat,
          longitude: data.lng
        }
      });
    } else {
      // clicked marker
      setSelectedRisk(data);
    }
  }}
/> */}

          <div>
            <h3>Active Incidents</h3>

{loading ? (
  <p>Loading...</p>
) : filteredRisks.length === 0 ? (
  <p style={{ color: "#94a3b8" }}>
    No {filter === "ALL" ? "" : filter} risks
  </p>
) : (
  filteredRisks.map((risk) => (
    <RiskCard
      key={risk.id}
      risk={risk}
      onSelect={(risk) => {
        setSelectedRisk(risk);
        setAddress("");
      }}
    />
  ))
)}
          </div>
        </div>

      </div>
    </div>
  );
}