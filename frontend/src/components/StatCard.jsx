export default function StatCard({ title, value, subtitle, color, onClick, active }) {

  const getAccent = () => {
    switch (color) {
      case "critical": return "#ef4444";
      case "high": return "#f97316";
      case "medium": return "#eab308";
      case "low": return "#22c55e";
      default: return "#3b82f6";
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: "#1e293b",
        border: active ? `2px solid ${getAccent()}` : "1px solid #334155",
        padding: "18px",
        borderRadius: "12px",
        flex: 1,
        boxShadow: active
          ? `0 0 12px ${getAccent()}55`
          : "0 4px 12px rgba(0,0,0,0.25)",
        position: "relative",
        cursor: "pointer",
        transition: "0.2s ease"
      }}
    >
      
      {/* Accent bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "4px",
        width: "100%",
        background: getAccent(),
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px"
      }} />

      <p style={{
        color: "#94a3b8",
        fontSize: "13px",
        marginBottom: "6px"
      }}>
        {title}
      </p>

      <h2 style={{
        margin: 0,
        fontSize: "26px",
        fontWeight: "600"
      }}>
        {value}
      </h2>

      {subtitle && (
        <p style={{
          color: "#64748b",
          fontSize: "12px",
          marginTop: "6px"
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}