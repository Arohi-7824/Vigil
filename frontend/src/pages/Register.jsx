import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Account created successfully!");
      navigate("/login");

    } catch (err) {
      console.error(err);

      console.log(err.response?.data);

      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.logo}>Vigil</h1>
          <p style={styles.subtitle}>Create your account</p>
        </div>

        {/* FORM */}
        <div style={styles.form}>

          {/* NAME */}
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

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
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {/* CONFIRM PASSWORD */}
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />

          {/* BUTTON */}
          <button onClick={handleRegister} style={styles.button}>
            Create Account
          </button>

        </div>

        {/* FOOTER */}
        <p style={styles.footer}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  page: {
    background: "#020617",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
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
    padding: "30px",
    background: "linear-gradient(180deg, #1e293b, #0f172a)"
  },

  logo: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "8px"
  },

  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px"
  },

  form: {
    padding: "30px"
  },

  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
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