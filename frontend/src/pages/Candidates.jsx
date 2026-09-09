import "../styles/candidates.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
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

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      candidate.partyName.toLowerCase().includes(search.toLowerCase()) ||
      candidate.candidateId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Navbar />

      <div className="candidates-container">
        <div className="page-header">
          <h1>🗳 Official Candidate List</h1>
          <p>
            The following candidates are officially approved by the Election
            Commission for the current election.
          </p>
        </div>

        <div className="candidate-table-card">
          <div className="table-header">
            <h2>Election Candidates</h2>

            <input
              className="search-box"
              type="text"
              placeholder="🔍 Search Candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="candidate-table">
            <thead>
              <tr>
                <th>Candidate ID</th>
                <th>Candidate Name</th>
                <th>Political Party</th>
                <th>Election Symbol</th>
                <th>Status</th>
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
                    <span className="active-badge">
                      {candidate.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Candidates;
