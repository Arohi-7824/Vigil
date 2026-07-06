import { useState, useEffect, useRef } from "react";

export default function UserMenu({ onOpenRisk }) {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ✅ FETCH ALERTS (TOP LEVEL ONLY)
  useEffect(() => {
    fetch("http://localhost:3000/api/risks/alerts")
      .then(res => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  // ✅ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={styles.container}>

      {/* AVATAR */}
      <div style={styles.avatar} onClick={() => setOpen(!open)}>
        {user?.email?.[0]?.toUpperCase() || "U"}

        {/* 🔴 Notification Badge */}
        {alerts.length > 0 && (
          <span style={styles.badge}>
            {alerts.length}
          </span>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div style={styles.dropdown}>

          <p style={styles.email}>{user?.email}</p>

          {/* 🔔 Notifications toggle */}
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            style={styles.notificationHeader}
          >
            🔔 Notifications ({alerts.length})
          </div>

          {/* 📩 Notification List */}
          {showNotifications && (
            <div style={styles.notificationList}>
              {alerts.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>No notifications</p>
              ) : (
                alerts.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      if (a.risk_id && onOpenRisk) {
                        onOpenRisk(a.risk_id);
                        setOpen(false);
                      }
                    }}
                    style={styles.notificationItem}
                  >
                    {a.message}
                  </div>
                ))
              )}
            </div>
          )}

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>

        </div>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: {
    position: "relative"
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e293b, #334155)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    position: "relative"
  },

  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "#ef4444",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "10px"
  },

  dropdown: {
    position: "absolute",
    top: "50px",
    right: "0",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "12px",
    minWidth: "220px",
    zIndex: 1000
  },

  email: {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "10px"
  },

  notificationHeader: {
    cursor: "pointer",
    padding: "8px",
    background: "#1e293b",
    borderRadius: "6px",
    marginBottom: "8px"
  },

  notificationList: {
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "10px"
  },

  notificationItem: {
    padding: "8px",
    marginBottom: "6px",
    background: "#020617",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px"
  },

  logout: {
    width: "100%",
    padding: "10px",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
  }
};