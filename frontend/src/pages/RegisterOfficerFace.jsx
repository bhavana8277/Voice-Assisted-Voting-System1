import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/registerFace.css";

function RegisterOfficerFace() {
  const navigate = useNavigate();

  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [captured] = useState(0); // Update this later if backend sends progress

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      const response = await api.get("/officers");
      setOfficers(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load officers.");
    }
  };

  const startCapture = async () => {
    if (!selectedOfficer) {
      alert("Please select an officer.");
      return;
    }

    try {
      const response = await api.post(
        `/face/register?officerId=${selectedOfficer}`,
      );

      alert(response.data);
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="face-container">
      <button className="back-btn" onClick={() => navigate("/admin")}>
        ← Back
      </button>

      <h1>Register Officer Face</h1>

      <div className="face-card">
        <label>Select Officer</label>

        <select
          value={selectedOfficer}
          onChange={(e) => setSelectedOfficer(e.target.value)}
        >
          <option value="">-- Select Officer --</option>

          {officers.map((officer) => (
            <option key={officer.officerId} value={officer.officerId}>
              {officer.officerId} - {officer.fullName}
            </option>
          ))}
        </select>

        <div className="camera-box">
          <div className="camera-icon">📷</div>

          <h3>External Camera Window</h3>

          <p>
            Clicking <b>Start Capture</b> will open the OpenCV camera.
          </p>

          <p>
            Keep your face inside the green rectangle until all 30 images are
            captured.
          </p>
        </div>

        <div className="progress-title">Captured Images: {captured} / 30</div>

        <div className="progress">
          <div
            className="progress-fill"
            style={{
              width: `${(captured / 30) * 100}%`,
            }}
          ></div>
        </div>

        <div className="status">
          {captured === 30
            ? "✅ Face Registration Completed"
            : "Waiting to start capture..."}
        </div>

        <button className="capture-btn" onClick={startCapture}>
          Start Capture
        </button>
      </div>
    </div>
  );
}

export default RegisterOfficerFace;
