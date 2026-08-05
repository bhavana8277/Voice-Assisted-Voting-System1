import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/results.css";

function Results() {
  const [results, setResults] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isTie, setIsTie] = useState(false);
  const [highestVotes, setHighestVotes] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await api.get("/results");
      const data = response.data;

      setResults(data);

      if (data.length > 0) {
        const total = data.reduce((sum, c) => sum + c.votes, 0);
        setTotalVotes(total);

        const maxVotes = Math.max(...data.map((c) => c.votes));
        setHighestVotes(maxVotes);

        const topCandidates = data.filter(
          (candidate) => candidate.votes === maxVotes,
        );

        setWinners(topCandidates);
        setIsTie(topCandidates.length > 1);
      }
    } catch (err) {
      console.log(err);
      alert("Unable to load results.");
    }
  };

  const votePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <>
      <Navbar />

      <div className="results-page">
        {/* Header */}

        <div className="page-header">
          <h1>Election Results</h1>
          <p>Live vote tally and winner declaration</p>
        </div>

        {/* Statistics */}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon">👥</div>

            <div>
              <span>Total Candidates</span>
              <h2>{results.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">🗳</div>

            <div>
              <span>Total Votes Cast</span>
              <h2>{totalVotes}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon">📈</div>

            <div>
              <span>Highest Vote Count</span>
              <h2>{highestVotes}</h2>
            </div>
          </div>
        </div>

        {/* Winner Section */}

        {winners.length > 0 && (
          <div className="winner-banner">
            {isTie ? (
              <>
                <h2>⚠ Election Tie</h2>

                <p>
                  {winners.length} candidates tied with{" "}
                  <strong>{highestVotes}</strong> votes each
                </p>

                <div className="winner-list">
                  {winners.map((winner) => (
                    <div key={winner.candidateId} className="winner-box">
                      <h3>{winner.candidateName}</h3>

                      <p>{winner.partyName}</p>

                      <small>{winner.votes} Votes</small>
                    </div>
                  ))}
                </div>

                <button className="lottery-btn">
                  🎲 Lottery Required to Declare Winner
                </button>
              </>
            ) : (
              <>
                <h2>🏆 Election Winner</h2>

                <div className="single-winner">
                  <h1>{winners[0].candidateName}</h1>

                  <h4>{winners[0].partyName}</h4>

                  <p>
                    Total Votes : <strong>{winners[0].votes}</strong>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Vote Breakdown */}

        <div className="table-card">
          <div className="table-header">
            <h2>Vote Breakdown</h2>
          </div>

          <table className="results-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Party</th>
                <th>Votes</th>
                <th>Share</th>
              </tr>
            </thead>

            <tbody>
              {[...results]
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => {
                  const percent = votePercentage(candidate.votes);

                  const winner = winners.some(
                    (w) => w.candidateId === candidate.candidateId,
                  );

                  return (
                    <tr
                      key={candidate.candidateId}
                      className={winner ? "winner-row" : ""}
                    >
                      <td>#{index + 1}</td>

                      <td>
                        <div className="candidate-name">
                          {candidate.candidateName}

                          {winner && (
                            <span className="winner-badge">Winner</span>
                          )}
                        </div>
                      </td>

                      <td>{candidate.partyName}</td>

                      <td>{candidate.votes}</td>

                      <td>
                        <div className="progress-wrapper">
                          <div className="progress">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${percent}%`,
                              }}
                            ></div>
                          </div>

                          <span>{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Results;
