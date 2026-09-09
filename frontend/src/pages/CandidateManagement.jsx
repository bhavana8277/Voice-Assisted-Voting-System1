import "../styles/candidateManagement.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CandidateManagement() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [partyName, setPartyName] = useState("");
  const [symbol, setSymbol] = useState("");

  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await api.get("/candidates");
      setCandidates(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load candidates.");
    }
  };

  const clearForm = () => {
    setCandidateId("");
    setCandidateName("");
    setPartyName("");
    setSymbol("");
    setEditing(false);
  };

  const addCandidate = async () => {
    try {
      await api.post("/candidates", {
        candidateId,
        candidateName,
        partyName,
        symbol,
        active: true,
      });

      alert("Candidate Added Successfully");

      clearForm();
      loadCandidates();
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);

        alert(
          error.response.data.message || JSON.stringify(error.response.data),
        );
      } else {
        alert(error.message);
      }
    }
  };

  const editCandidate = (candidate) => {
    setCandidateId(candidate.candidateId);
    setCandidateName(candidate.candidateName);
    setPartyName(candidate.partyName);
    setSymbol(candidate.symbol);

    setEditing(true);
  };

  const updateCandidate = async () => {
    try {
      await api.put(`/candidates/${candidateId}`, {
        candidateName,
        partyName,
        symbol,
        active: true,
      });

      alert("Candidate Updated Successfully");

      clearForm();
      loadCandidates();
    } catch (error) {
      console.log(error);
      alert("Unable to update candidate.");
    }
  };

  const changeStatus = async (candidate) => {
    try {
      await api.put(
        `/candidates/${candidate.candidateId}/status?active=${!candidate.active}`,
      );

      loadCandidates();
    } catch (error) {
      console.log(error);
      alert("Unable to update status.");
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      candidate.partyName.toLowerCase().includes(search.toLowerCase()) ||
      candidate.candidateId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="candidate-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back
        </button>

        <h1>Candidate Management</h1>
      </div>

      <div className="candidate-form">
        <h2>{editing ? "Update Candidate" : "Add Candidate"}</h2>

        <input
          type="text"
          placeholder="Candidate ID"
          value={candidateId}
          disabled={editing}
          onChange={(e) => setCandidateId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Political Party"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Election Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />

        {editing ? (
          <button onClick={updateCandidate}>Update Candidate</button>
        ) : (
          <button onClick={addCandidate}>Add Candidate</button>
        )}
      </div>

      <div className="candidate-table-card">
        <div className="table-header">
          <h2>Registered Candidates</h2>

          <input
            className="search-box"
            placeholder="Search Candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="candidate-table">
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Name</th>
              <th>Party</th>
              <th>Symbol</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.candidateId}>
                <td>{candidate.candidateId}</td>

                <td>{candidate.candidateName}</td>

                <td>{candidate.partyName}</td>

                <td>{candidate.symbol}</td>

                <td>
                  <span className={candidate.active ? "active" : "inactive"}>
                    {candidate.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editCandidate(candidate)}
                  >
                    Edit
                  </button>

                  <button
                    className="status-btn"
                    onClick={() => changeStatus(candidate)}
                  >
                    {candidate.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CandidateManagement;
