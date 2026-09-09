import "../styles/voter.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function VoterManagement() {
  const navigate = useNavigate();

  const [voters, setVoters] = useState([]);

  const [voterId, setVoterId] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVoters();
  }, []);

  const loadVoters = async () => {
    try {
      const response = await api.get("/voters");
      setVoters(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load voters.");
    }
  };

  const clearForm = () => {
    setVoterId("");
    setFullName("");
    setAge("");
    setGender("");
    setAddress("");
    setPreferredLanguage("en");
    setEditing(false);
  };

  const addVoter = async () => {
    try {
      await api.post("/voters", {
        voterId,
        fullName,
        age,
        gender,
        address,
        preferredLanguage,
        active: true,
        hasVoted: false,
      });

      alert("Voter Added Successfully");

      clearForm();
      loadVoters();
    } catch (error) {
      console.log(error);
      alert("Unable to add voter.");
    }
  };

  const editVoter = (voter) => {
    setVoterId(voter.voterId);
    setFullName(voter.fullName);
    setAge(voter.age);
    setGender(voter.gender);
    setAddress(voter.address);
    setPreferredLanguage(voter.preferredLanguage);

    setEditing(true);
  };

  const updateVoter = async () => {
    try {
      await api.put(`/voters/${voterId}`, {
        fullName,
        age,
        gender,
        address,
        preferredLanguage,
        active: true,
      });

      alert("Voter Updated Successfully");

      clearForm();
      loadVoters();
    } catch (error) {
      console.log(error);
      alert("Unable to update voter.");
    }
  };

  const changeStatus = async (voter) => {
    try {
      await api.put(`/voters/${voter.voterId}/status?active=${!voter.active}`);

      loadVoters();
    } catch (error) {
      console.log(error);
      alert("Unable to update status.");
    }
  };

  const filteredVoters = voters.filter((voter) =>
    voter.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="voter-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back
        </button>

        <h1>Voter Management</h1>
      </div>

      <div className="voter-form">
        <h2>{editing ? "Update Voter" : "Add Voter"}</h2>

        <input
          type="text"
          placeholder="Voter ID"
          value={voterId}
          disabled={editing}
          onChange={(e) => setVoterId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <select
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="kn">Kannada</option>
          <option value="hi">Hindi</option>
        </select>

        {editing ? (
          <button onClick={updateVoter}>Update Voter</button>
        ) : (
          <button onClick={addVoter}>Add Voter</button>
        )}
      </div>

      <div className="voter-table-card">
        <div className="table-header">
          <h2>Registered Voters</h2>

          <input
            className="search-box"
            placeholder="Search Voter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="voter-table">
          <thead>
            <tr>
              <th>Voter ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Language</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredVoters.map((voter) => (
              <tr key={voter.voterId}>
                <td>{voter.voterId}</td>

                <td>{voter.fullName}</td>

                <td>{voter.age}</td>

                <td>{voter.gender}</td>

                <td>
                  {voter.preferredLanguage === "en"
                    ? "English"
                    : voter.preferredLanguage === "kn"
                      ? "Kannada"
                      : "Hindi"}
                </td>

                <td>
                  <span className={voter.active ? "active" : "inactive"}>
                    {voter.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button className="edit-btn" onClick={() => editVoter(voter)}>
                    Edit
                  </button>

                  <button
                    className="status-btn"
                    onClick={() => changeStatus(voter)}
                  >
                    {voter.active ? "Deactivate" : "Activate"}
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

export default VoterManagement;
