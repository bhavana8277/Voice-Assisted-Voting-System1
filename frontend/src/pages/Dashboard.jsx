import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";

function Dashboard() {
  const officer = JSON.parse(localStorage.getItem("officer"));

  const { text } = useContext(LanguageContext);

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <div className="welcome-card">
          <h1>👋 {text.welcome}</h1>

          <h2>{officer.fullName}</h2>

          <p>{officer.role}</p>
        </div>

        <div className="menu-grid">
          <div className="menu-card" onClick={() => navigate("/candidates")}>
            <div className="menu-icon">👥</div>

            <h3>{text.manageCandidates}</h3>

            <p>Add, Edit & Remove Candidates</p>
          </div>

          <div className="menu-card" onClick={() => navigate("/vote")}>
            <div className="menu-icon">🗳️</div>

            <h3>{text.castVote}</h3>

            <p>Start New Voting Session</p>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <h2>📈 Election Status</h2>

            <p>🟢 System Ready</p>

            <p>🌐 Language : English</p>

            <p>🔒 Officer Logged In</p>
          </div>

          <div className="info-card">
            <h2>📋 Recent Activity</h2>

            <p>✅ Officer Login Successful</p>

            <p>✅ Waiting For Next Voter</p>

            <p>✅ Voice System Ready</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
