import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("POLLING_OFFICER");
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await api.post("/officers/login", {
        officerId,
        password,
        role,
      });

      if (response.data.success) {
        alert("Login Successful");

        localStorage.setItem("officer", JSON.stringify(response.data));

        if (response.data.role === "ADMIN") {
          navigate("/admin");
        } else if (response.data.role === "POLLING_OFFICER") {
          navigate("/dashboard");
        } else if (response.data.role === "ELECTION_OFFICER") {
          navigate("/election-dashboard");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);

      alert("Server Error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🗳️</div>

        <h1 className="login-title">Voice Assisted Voting System</h1>

        <p className="login-subtitle">Secure Election Management System</p>

        <h2 style={{ marginBottom: "20px", color: "#444" }}>Officer Login</h2>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="POLLING_OFFICER">Polling Officer</option>
          <option value="ELECTION_OFFICER">Election Officer</option>
        </select>

        <input
          type="text"
          placeholder="Officer ID"
          value={officerId}
          onChange={(e) => setOfficerId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
