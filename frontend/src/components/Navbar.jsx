import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import "../styles/navbar.css";
import { LanguageContext } from "../context/LanguageContext";
import LanguageSelector from "./LanguageSelector";

function Navbar() {
  const navigate = useNavigate();

  const { text } = useContext(LanguageContext);

  const officer = JSON.parse(localStorage.getItem("officer"));

  const logout = () => {
    localStorage.removeItem("officer");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="logo">🗳️</div>

        <div>
          <h2>Voice Assisted Voting System</h2>
          <p>Election Commission Portal</p>
        </div>
      </div>

      <div className="nav-center">
        {/* Dashboard */}
        <Link
          to={
            officer?.role === "ELECTION_OFFICER"
              ? "/election-dashboard"
              : "/dashboard"
          }
        >
          {text.dashboard}
        </Link>

        {/* Polling Officer Only */}
        {officer?.role === "POLLING_OFFICER" && (
          <>
            <Link to="/candidates">{text.candidates}</Link>

            <Link to="/vote">{text.vote}</Link>
          </>
        )}

        {/* Election Officer Only */}
        {officer?.role === "ELECTION_OFFICER" && (
          <Link to="/results">{text.results}</Link>
        )}
      </div>

      <div className="nav-right">
        <LanguageSelector />

        <span className="officer-name">👤 {officer?.fullName}</span>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
