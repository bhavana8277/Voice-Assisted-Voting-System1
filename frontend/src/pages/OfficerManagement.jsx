import "../styles/officer.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OfficerManagement() {
  const navigate = useNavigate();

  const [officers, setOfficers] = useState([]);

  const [officerId, setOfficerId] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("POLLING_OFFICER");

  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      const response = await api.get("/officers");
      setOfficers(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load officers.");
    }
  };

  const clearForm = () => {
    setOfficerId("");
    setFullName("");
    setPassword("");
    setRole("POLLING_OFFICER");
    setEditing(false);
  };

  const addOfficer = async () => {
    try {
      await api.post("/officers", {
        officerId,
        fullName,
        password,
        role,
        active: true,
      });

      alert("Officer Added Successfully");

      clearForm();

      loadOfficers();
    } catch (error) {
      console.log(error);

      if (error.response) {
        console.log(error.response.data);
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message);
      }
    }
  };

  const editOfficer = (officer) => {
    setOfficerId(officer.officerId);
    setFullName(officer.fullName);
    setPassword("");
    setRole(officer.role);
    setEditing(true);
  };

  const updateOfficer = async () => {
    try {
      await api.put(`/officers/${officerId}`, {
        fullName,
        password,
        role,
        active: true,
      });

      alert("Officer Updated Successfully");

      clearForm();

      loadOfficers();
    } catch (error) {
      console.log(error);
      alert("Unable to update officer.");
    }
  };

  const changeStatus = async (officer) => {
    try {
      await api.put(
        `/officers/${officer.officerId}/status?active=${!officer.active}`,
      );

      loadOfficers();
    } catch (error) {
      console.log(error);

      if (
        error.response &&
        error.response.data &&
        JSON.stringify(error.response.data).includes("UNIQUE constraint")
      ) {
        alert("Officer ID already exists.");
      } else {
        alert("Unable to add officer.");
      }
    }
  };

  const filteredOfficers = officers.filter((officer) =>
    officer.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="officer-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back
        </button>

        <h1>Officer Management</h1>
      </div>

      <div className="officer-form">
        <h2>{editing ? "Update Officer" : "Add Officer"}</h2>

        <input
          type="text"
          placeholder="Officer ID"
          value={officerId}
          disabled={editing}
          onChange={(e) => setOfficerId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="password"
          placeholder={editing ? "New password (leave blank to keep current)" : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="POLLING_OFFICER">Polling Officer</option>
          <option value="ELECTION_OFFICER">Election Officer</option>
        </select>

        {editing ? (
          <button onClick={updateOfficer}>Update Officer</button>
        ) : (
          <button onClick={addOfficer}>Add Officer</button>
        )}
      </div>

      <div className="officer-table-card">
        <div className="table-header">
          <h2>Registered Officers</h2>

          <input
            className="search-box"
            placeholder="Search Officer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="officer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOfficers.map((officer) => (
              <tr key={officer.officerId}>
                <td>{officer.officerId}</td>

                <td>{officer.fullName}</td>

                <td>
                  {officer.role === "ADMIN" && (
                    <span className="admin-role">Admin</span>
                  )}

                  {officer.role === "POLLING_OFFICER" && (
                    <span className="polling-role">Polling Officer</span>
                  )}

                  {officer.role === "ELECTION_OFFICER" && (
                    <span className="election-role">Election Officer</span>
                  )}
                </td>

                <td>
                  <span className={officer.active ? "active" : "inactive"}>
                    {officer.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editOfficer(officer)}
                  >
                    Edit
                  </button>

                  <button
                    className="status-btn"
                    onClick={() => changeStatus(officer)}
                  >
                    {officer.active ? "Deactivate" : "Activate"}
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

export default OfficerManagement;
