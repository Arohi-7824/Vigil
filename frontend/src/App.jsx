import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import SubmitRisk from "./pages/SubmitRisk";

export default function App() {
  const [user, setUser] = useState(null);

  // 🔥 keep user in sync with localStorage
  useEffect(() => {
    const syncUser = () => {
      const stored = JSON.parse(localStorage.getItem("user"));
      setUser(stored);
    };

    syncUser();

    // 🔥 listen for changes (important)
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !user ? <Login setUser={setUser} /> :
            user.role === "ADMIN" ? <Navigate to="/admin" /> :
            <Navigate to="/dashboard" />
          }
        />

        <Route path="/register" element={<Register />} />

        <Route path="/submit-risk" element={<SubmitRisk />} />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            user
              ? user.role === "ADMIN"
                ? <Navigate to="/admin" />
                : <Dashboard />
              : <Navigate to="/login" />
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            user
              ? user.role === "ADMIN"
                ? <AdminDashboard />
                : <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}