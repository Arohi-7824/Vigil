import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Register from "./Register";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("LOGIN CLICKED");

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      console.log("LOGIN SUCCESS:", res.data);

      // ✅ SAVE USER
      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ UPDATE APP STATE
      if (setUser) setUser(res.data);

      // ✅ REDIRECT
      if (res.data.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err) {
        console.error(err);

        alert(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed"
        );
}
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        
        <div style={styles.header}>
  <h1 style={styles.logo}>VIGIL</h1>
  <p style={styles.subtitle}>AI-Powered Risk Monitoring</p>
</div>

        {/* FORM */}
        <div style={styles.form}>

          {/* EMAIL */}
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          {/* PASSWORD */}
          <div style={styles.passwordRow}>
            <label style={styles.label}>Password</label>
            <span style={styles.forgot}>Forgot?</span>
          </div>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {/* BUTTON */}
          <button onClick={handleLogin} style={styles.button}>
            Sign in
            </button>

        </div>

        {/* FOOTER */}
        <p style={styles.footer}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")} style={styles.link}>
            Create one
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(180deg, #020617, #020617)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // fontFamily: "Inter, sans-serif",
    color: "white"
  },

  card: {
    width: "420px",
    background: "#0f172a",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 25px 80px rgba(0,0,0,0.6)"
  },

  header: {
    padding: "40px",
    background: "linear-gradient(180deg, #1e293b, #0f172a)"
  },

  title: {
    fontSize: "28px",
    marginBottom: "6px"
  },

  logo: {
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "600",
  marginBottom: "8px",
  letterSpacing: "0.5px"
},

  subtitle: {
  textAlign: "center",          // 🔥 center it
  color: "#94a3b8",
  fontSize: "18px",
  marginTop: "4px",             // tighten gap under "Vigil"
  marginBottom: "10px",
  letterSpacing: "0.3px"        // subtle polish
},

  form: {
    padding: "30px"
  },

  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "18px",
    color: "#cbd5f5"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
    fontSize: "14px",
    outline: "none"
  },

  passwordRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  forgot: {
    fontSize: "17px",
    color: "#60a5fa",
    cursor: "pointer"
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
    color: "white",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer"
  },

  footer: {
    textAlign: "center",
    padding: "20px",
    borderTop: "1px solid #1e293b",
    fontSize: "14px",
    color: "#94a3b8"
  },

  link: {
    color: "#60a5fa",
    cursor: "pointer",
    fontWeight: "500"
  }
};