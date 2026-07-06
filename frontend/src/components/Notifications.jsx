import { useEffect, useState } from "react";

export default function Notifications({onOpenRisk}) {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/alerts")
      .then(res => res.json())
      .then(setAlerts);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      
      {/* 🔔 Bell Icon */}
      <button onClick={() => setOpen(!open)}>
        🔔 ({alerts.length})
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          background: "#1e293b",
          padding: "10px",
          width: "300px",
          borderRadius: "8px"
        }}>
          {alerts.length === 0 ? (
  <p>No notifications</p>
) : (
  alerts.map(a => (
    <div
      key={a.id}
      onClick={() => {
  if (a.risk_id) {
    onOpenRisk(a.risk_id);
  } else {
    alert("No linked risk for this notification");
  }
}} // ✅ CLICK HANDLER HERE
      style={{
        marginBottom: "10px",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "6px",
        background: "#0f172a"
      }}
    >
      <p>{a.message}</p>
    </div>
  ))
)}
        </div>
      )}
    </div>
  );
}