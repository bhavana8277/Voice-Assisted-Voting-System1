import { useNavigate } from "react-router-dom";
import "../styles/ElectionOfficerDashboard.css";
import Navbar from "../components/Navbar";

function ElectionOfficerDashboard() {
  const navigate = useNavigate();

  const officer = JSON.parse(localStorage.getItem("officer"));

  const logout = () => {
    localStorage.removeItem("officer");
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* Welcome Card */}
        <div className="welcome-card">
          <h1>👮 Election Officer Dashboard</h1>

          <h2>{officer?.fullName}</h2>

          <p>{officer?.role}</p>
        </div>

        {/* Menu */}
        <div className="menu-grid">
          {/* Result Announcement */}
          <div className="menu-card" onClick={() => navigate("/results")}>
            <div className="menu-icon">🏆</div>

            <h3>Result Announcement</h3>

            <p>View the final election results and winner.</p>
          </div>

          {/* Download Result */}
          <div
            className="menu-card"
            onClick={() => alert("PDF Download Coming Soon")}
          >
            <div className="menu-icon">📄</div>

            <h3>Download Report</h3>

            <p>Download official election result report.</p>
          </div>

          {/* Print */}
          <div className="menu-card" onClick={() => window.print()}>
            <div className="menu-icon">🖨️</div>

            <h3>Print Results</h3>

            <p>Print the election result summary.</p>
          </div>

          {/* Logout */}
          <div className="menu-card" onClick={logout}>
            <div className="menu-icon">🚪</div>

            <h3>Logout</h3>

            <p>Securely logout from the system.</p>
          </div>
        </div>

        {/* Information */}
        <div className="info-grid">
          <div className="info-card">
            <h2>🗳 Election Status</h2>

            <p>✅ Election Completed</p>

            <p>📢 Results Declared</p>

            <p>🔒 Voting Closed</p>
          </div>

          <div className="info-card">
            <h2>📋 Officer Activity</h2>

            <p>✅ Officer Logged In</p>

            <p>✅ Ready to View Results</p>

            <p>✅ Report Available</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ElectionOfficerDashboard;
