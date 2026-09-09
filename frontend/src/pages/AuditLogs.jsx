import "../styles/audit.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AuditLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await api.get("/audit");
      setLogs(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load audit logs.");
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.officerId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="audit-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back
        </button>

        <h1>Audit Logs</h1>
      </div>

      <div className="audit-card">
        <div className="table-header">
          <h2>System Activity</h2>

          <input
            className="search-box"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="audit-table">
          <thead>
            <tr>
              <th>Officer ID</th>
              <th>Action</th>
              <th>Description</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.officerId}</td>

                <td>{log.action}</td>

                <td>{log.description}</td>

                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;
