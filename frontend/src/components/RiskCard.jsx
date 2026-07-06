export default function RiskCard({ risk, onSelect }) {

  const getColor = () => {
    switch (risk.severity) {
      case "CRITICAL": return "#ef4444";
      case "HIGH": return "#f97316";
      case "MEDIUM": return "#eab308";
      default: return "#22c55e";
    }
  };

  const getStatusColor = () => {
    switch (risk.status) {
      case "IN_PROGRESS": return "#3b82f6";
      case "RESOLVED": return "#22c55e";
      default: return "#ef4444";
    }
  };

  return (
    <div
      onClick={() => onSelect(risk)}
      style={{
        background: "#1e293b",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "10px",
        cursor: "pointer",
        border: "1px solid #334155",
        transition: "0.2s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#334155"}
      onMouseLeave={(e) => e.currentTarget.style.background = "#1e293b"}
    >

      {/* IMAGE */}
      {risk.image && (
        <img
          src={`http://localhost:3000/${risk.image}`}
          alt="risk"
          style={{
            width: "100%",
            borderRadius: "8px",
            marginBottom: "10px",
            maxHeight: "200px",
            objectFit: "cover"
          }}
        />
      )}

      {/* TITLE */}
      <h4 style={{ marginBottom: "10px" }}>
        {risk.description}
      </h4>

      {/* BADGES */}
      <div style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "10px"
      }}>

        {/* Severity */}
        <span style={{
          background: getColor(),
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          color: "white"
        }}>
          {risk.severity}
        </span>

        {/* Status */}
        <span style={{
          background: getStatusColor(),
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          color: "white"
        }}>
          {risk.status || "ACTIVE"}
        </span>

      </div>

      {/* SCORE */}
      <p>
        Score: <b>{risk.risk_score}</b>
      </p>

      {/* TEAM */}
      {risk.assigned_team && (
        <p style={{
          marginTop: "6px",
          color: "#93c5fd",
          fontWeight: "500"
        }}>
          👷 Team: {risk.assigned_team}
        </p>
      )}

      {/* AI SUMMARY */}
      <p style={{
        color: "#94a3b8",
        fontSize: "0.9rem",
        marginTop: "6px"
      }}>
        {risk.ai_summary?.slice(0, 100)}...
      </p>

      {/* LOCATION */}
      <p style={{
        fontSize: "0.8rem",
        color: "#64748b",
        marginTop: "6px"
      }}>
        📍 {risk.latitude}, {risk.longitude}
      </p>

    </div>
  );
}