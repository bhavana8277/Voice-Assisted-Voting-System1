import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [auditCount, setAuditCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [voterCount, setVoterCount] = useState(0);
  const [officerCount, setOfficerCount] = useState(0);
  const [resettingElection, setResettingElection] = useState(false);
  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const officer = await api.get("/officers/count");
      const voter = await api.get("/voters/count");

      const candidate = await api.get("/candidates/count");
      const audit = await api.get("/audit/count");
      setAuditCount(audit.data);
      setCandidateCount(candidate.data);

      setOfficerCount(officer.data);
      setVoterCount(voter.data);

      // We'll add these after creating the APIs
      // const candidate = await api.get("/candidates/count");
      // const audit = await api.get("/audit/count");
      // setCandidateCount(candidate.data);
      // setAuditCount(audit.data);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("officer");
    navigate("/");
  };

  const resetElection = async () => {
    const confirmed = window.confirm(
      "Back up database/voting.db first. This permanently deletes all votes and encrypted ballots, then resets every voter for a fresh voting session. Continue?",
    );
    if (!confirmed) return;

    setResettingElection(true);
    try {
      const response = await api.post("/admin/election/reset");
      alert(
        `Fresh session ready. Removed ${response.data.removedVotes} vote records and ${response.data.removedBallots} encrypted ballots.`,
      );
      loadCounts();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to reset the election.");
    } finally {
      setResettingElection(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1>🛡 Admin Dashboard</h1>
          <p>Voice Assisted Voting System Administration Panel</p>
          <button type="button" onClick={resetElection} disabled={resettingElection}>
            {resettingElection ? "Resetting election..." : "Start fresh voting session"}
          </button>
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="stat-card">
          <h2>{officerCount}</h2>
          <p>👮 Officers</p>
        </div>

        <div className="stat-card">
          <h2>{voterCount}</h2>
          <p>🧑 Registered Voters</p>
        </div>

        <div className="stat-card">
          <h2>{candidateCount}</h2>
          <p>🗳 Candidates</p>
        </div>

        <div className="stat-card">
          <h2>{auditCount}</h2>
          <p>📋 Audit Logs</p>
        </div>
      </div>

      {/* Menu Cards */}

      <div className="admin-grid">
        <div className="admin-card blue" onClick={() => navigate("/officers")}>
          <div className="admin-icon">👮</div>

          <h2>Officer Management</h2>

          <p>Add, Edit & Manage Officers</p>
        </div>

        <div className="admin-card green" onClick={() => navigate("/voters")}>
          <div className="admin-icon">👥</div>

          <h2>Voter Management</h2>

          <p>Register & Manage Voters</p>
        </div>

        <div
          className="admin-card orange"
          onClick={() => navigate("/candidate-management")}
        >
          <div className="admin-icon">🗳</div>

          <h2>Candidate Management</h2>

          <p>Add, Edit & Remove Candidates</p>
        </div>

        <div className="admin-card purple" onClick={() => navigate("/audit")}>
          <div className="admin-icon">📋</div>

          <h2>Audit Logs</h2>

          <p>View Complete System Activity</p>
        </div>

        <div
          className="admin-card pink"
          onClick={() => navigate("/register-face")}
        >
          <div className="admin-icon">📷</div>

          <h2>Register Officer Face</h2>

          <p>Register Facial Authentication</p>
        </div>

        <div className="admin-card logout-card" onClick={logout}>
          <div className="admin-icon">🚪</div>

          <h2>Logout</h2>

          <p>Securely Logout</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
