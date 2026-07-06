import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 10, background: "#111", color: "#fff" }}>
      <Link to="/" style={{ marginRight: 15, color: "#fff" }}>
        Dashboard
      </Link>
      <Link to="/submit" style={{ color: "#fff" }}>
        Report Risk
      </Link>
    </nav>
  );
}