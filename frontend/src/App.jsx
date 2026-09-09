import OfficerManagement from "./pages/OfficerManagement";
import AdminDashboard from "./pages/AdminDashboard";
import ElectionOfficerDashboard from "./pages/ElectionOfficerDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuditLogs from "./pages/AuditLogs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import OfficerSetup from "./pages/OfficerSetup";
import VoterManagement from "./pages/VoterManagement";
import RegisterOfficerFace from "./pages/RegisterOfficerFace";
import CandidateManagement from "./pages/CandidateManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/candidates" element={<Candidates />} />
        <Route path="/register-face" element={<RegisterOfficerFace />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/vote" element={<Vote />} />

        <Route path="/results" element={<Results />} />
        <Route path="/candidate-management" element={<CandidateManagement />} />

        <Route
          path="/election-dashboard"
          element={<ElectionOfficerDashboard />}
        />
        <Route path="/officer-setup" element={<OfficerSetup />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/officers" element={<OfficerManagement />} />

        <Route path="/voters" element={<VoterManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
