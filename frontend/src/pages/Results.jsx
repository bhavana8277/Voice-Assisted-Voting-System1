import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/results.css";

function Results() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadResults(isRefresh = false) {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const [resultsResponse, summaryResponse] = await Promise.all([
        api.get("/results"),
        api.get("/results/summary"),
      ]);
      setResults(resultsResponse.data);
      setSummary(summaryResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Result data is unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([api.get("/results"), api.get("/results/summary")])
      .then(([resultsResponse, summaryResponse]) => {
        if (!active) return;
        setResults(resultsResponse.data);
        setSummary(summaryResponse.data);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Result data is unavailable.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalVotes = summary?.ballotsCast ?? 0;
  const rankedResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return results
      .filter((candidate) =>
        [candidate.candidateName, candidate.partyName, candidate.candidateId]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      )
      .sort((left, right) => {
        if (sortBy === "name") return left.candidateName.localeCompare(right.candidateName);
        if (sortBy === "party") return left.partyName.localeCompare(right.partyName);
        return right.votes - left.votes || left.candidateName.localeCompare(right.candidateName);
      });
  }, [results, search, sortBy]);

  const leaders = useMemo(() => {
    if (totalVotes === 0 || results.length === 0) return [];
    const highestVotes = Math.max(...results.map((candidate) => candidate.votes));
    return results.filter((candidate) => candidate.votes === highestVotes);
  }, [results, totalVotes]);

  const voteShare = (votes) => (totalVotes === 0 ? 0 : (votes / totalVotes) * 100);

  const exportCsv = () => {
    const header = ["Rank", "Candidate ID", "Candidate", "Party", "Votes", "Vote share"];
    const lines = [...results]
      .sort((left, right) => right.votes - left.votes)
      .map((candidate, index) => [
        index + 1,
        candidate.candidateId,
        candidate.candidateName,
        candidate.partyName,
        candidate.votes,
        `${voteShare(candidate.votes).toFixed(1)}%`,
      ]);
    const csv = [header, ...lines]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const downloadUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "election-results.csv";
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const generatedAt = summary?.generatedAt
    ? new Date(summary.generatedAt).toLocaleString()
    : "Not available";

  useEffect(() => {
    const printRequested = new URLSearchParams(location.search).get("print") === "1";
    if (!printRequested || loading || error) return undefined;

    const printTimer = window.setTimeout(() => window.print(), 350);
    return () => window.clearTimeout(printTimer);
  }, [error, loading, location.search]);

  return (
    <>
      <Navbar />
      <main className="results-page">
        <section className="results-heading" aria-labelledby="results-title">
          <div>
            <p className="eyebrow">Election reporting</p>
            <h1 id="results-title">Results Console</h1>
            <p className="results-subtitle">Encrypted ballots are counted without exposing voter choices.</p>
          </div>
          <div className="results-actions">
            <button type="button" className="secondary-action" onClick={() => window.print()}>Save as PDF</button>
            <button type="button" className="secondary-action" onClick={exportCsv} disabled={!results.length}>Export CSV</button>
            <button type="button" className="primary-action" onClick={() => loadResults(true)} disabled={refreshing}>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        {error && <div className="results-error" role="alert">{error}</div>}

        <section className="reporting-strip" aria-label="Reporting status">
          <span className={summary?.tallyConsistent ? "status-dot status-ok" : "status-dot status-warn"} />
          <div>
            <strong>{summary?.tallyConsistent ? "Tally records match" : "Tally reconciliation required"}</strong>
            <span>Generated {generatedAt}</span>
          </div>
          <span className="confidential-label">Internal election reporting</span>
        </section>

        <section className="result-metrics" aria-label="Election totals">
          <article className="metric"><span>Registered voters</span><strong>{summary?.registeredVoters ?? "-"}</strong></article>
          <article className="metric"><span>Encrypted ballots cast</span><strong>{totalVotes}</strong></article>
          <article className="metric"><span>Voter turnout</span><strong>{summary ? `${summary.turnoutPercentage}%` : "-"}</strong></article>
          <article className="metric"><span>Candidates on ballot</span><strong>{summary?.candidateCount ?? results.length}</strong></article>
        </section>

        {!loading && totalVotes > 0 && leaders.length > 0 && (
          <section className="lead-panel" aria-label="Current leading candidate">
            <div>
              <p className="eyebrow">Current standing</p>
              <h2>{leaders.length === 1 ? "Leading candidate" : "Tie for lead"}</h2>
              <p>{leaders.map((candidate) => candidate.candidateName).join(" and ")}{leaders.length === 1 && ` (${leaders[0].partyName})`} has {leaders[0].votes} votes.</p>
            </div>
            <strong>{voteShare(leaders[0].votes).toFixed(1)}%</strong>
          </section>
        )}

        <section className="standings-section" aria-labelledby="standings-title">
          <div className="standings-toolbar">
            <div><p className="eyebrow">Candidate count</p><h2 id="standings-title">Standings</h2></div>
            <div className="result-filters">
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate or party" aria-label="Search standings" />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort standings">
                <option value="votes">Sort by votes</option>
                <option value="name">Sort by candidate</option>
                <option value="party">Sort by party</option>
              </select>
            </div>
          </div>

          {loading ? <div className="results-empty">Loading encrypted ballot tally...</div> :
            rankedResults.length === 0 ? <div className="results-empty">No candidates match the current filter.</div> :
              <div className="table-scroll">
                <table className="results-table">
                  <thead><tr><th scope="col">Rank</th><th scope="col">Candidate</th><th scope="col">Party</th><th scope="col">Votes</th><th scope="col">Share</th></tr></thead>
                  <tbody>{rankedResults.map((candidate, index) => {
                    const share = voteShare(candidate.votes);
                    const isLeader = leaders.some((leader) => leader.candidateId === candidate.candidateId);
                    return <tr key={candidate.candidateId} className={isLeader && totalVotes > 0 ? "leader-row" : ""}>
                      <td>{sortBy === "votes" ? index + 1 : "-"}</td>
                      <td><strong>{candidate.candidateName}</strong><span className="candidate-id">{candidate.candidateId}</span></td>
                      <td>{candidate.partyName}</td>
                      <td>{candidate.votes}</td>
                      <td><div className="share-cell"><div className="share-track" aria-hidden="true"><span style={{ width: `${share}%` }} /></div><span>{share.toFixed(1)}%</span></div></td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>}
        </section>
      </main>
    </>
  );
}

export default Results;
