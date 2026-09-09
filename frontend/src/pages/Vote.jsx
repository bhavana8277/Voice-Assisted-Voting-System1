import "../styles/vote.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import SpeechService from "../voice/SpeechService";
import { readCandidates } from "../utils/CandidateReader";
import VoiceRecognition from "../voice/VoiceRecognition";

function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [voterId, setVoterId] = useState("");
  const [sessionMapping, setSessionMapping] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);
  const shuffleCandidates = (candidateList) => {
    const shuffled = [...candidateList];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };
  const loadCandidates = async () => {
    try {
      const response = await api.get("/candidates");

      const randomizedCandidates = shuffleCandidates(response.data);

      setCandidates(randomizedCandidates);

      const mapping = randomizedCandidates.map((candidate, index) => ({
        ballotNumber: index + 1,

        candidateId: candidate.candidateId,

        candidateName: candidate.candidateName,

        partyName: candidate.partyName,

        symbol: candidate.symbol,
      }));

      setSessionMapping(mapping);

      console.log(mapping);
    } catch (error) {
      console.log(error);
    }
  };

  const startVoiceVoting = () => {
    if (candidates.length === 0) {
      alert("No candidates available.");
      return;
    }

    const language = localStorage.getItem("language") || "en";

    SpeechService.speak("Welcome to the Voice Assisted Voting System.");

    setTimeout(() => {
      readCandidates(candidates, language);
    }, 3000);
  };
  const listenForVote = () => {
    const language = localStorage.getItem("language") || "en";

    VoiceRecognition.start((command) => {
      console.log("Recognized:", command);
      alert("You said: " + command);
      command = command
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "");
      // Normalize common Whisper mistakes
      const normalizedMap = {
        won: "one",
        one: "one",

        to: "two",
        too: "two",
        two: "two",
        doo: "two",
        tu: "two",

        tree: "three",
        three: "three",
        free: "three",

        for: "four",
        four: "four",
        fore: "four",

        five: "five",
      };

      command = normalizedMap[command] || command;

      let index = -1;

      if (
        command === "one" ||
        command === "one." ||
        command === "1" ||
        command === "first"
      ) {
        index = 0;
      } else if (
        command === "two" ||
        command === "two." ||
        command === "2" ||
        command === "second"
      ) {
        index = 1;
      } else if (
        command === "three" ||
        command === "three." ||
        command === "3" ||
        command === "third"
      ) {
        index = 2;
      } else if (
        command === "four" ||
        command === "four." ||
        command === "4" ||
        command === "fourth"
      ) {
        index = 3;
      } else if (
        command === "five" ||
        command === "five." ||
        command === "5" ||
        command === "fifth"
      ) {
        index = 4;
      } else if (command === "repeat") {
        readCandidates(candidates, language);
        return;
      }

      if (index === -1 || index >= candidates.length) {
        SpeechService.speak("Invalid candidate number. Please try again.");

        return;
      }

      const selectedCandidate = sessionMapping[index];

      setCandidateId(selectedCandidate.candidateId);

      SpeechService.speak(
        `You selected ${selectedCandidate.candidateName}. Say YES to confirm or NO to choose again.`,
      );

      setTimeout(() => {
        listenForConfirmation(selectedCandidate);
      }, 4000);
    });
  };
  const listenForConfirmation = (selectedCandidate) => {
    const language = localStorage.getItem("language") || "en";

    VoiceRecognition.start((command) => {
      if (command.includes("yes")) {
        castVote(selectedCandidate.candidateId);
      } else if (command.includes("no")) {
        SpeechService.speak("Reading the candidate list again.");

        setTimeout(() => {
          readCandidates(candidates, language);
        }, 2000);

        setTimeout(() => {
          listenForVote();
        }, 12000);
      } else {
        SpeechService.speak("Please say YES or NO.");

        setTimeout(() => {
          listenForConfirmation(selectedCandidate);
        }, 2500);
      }
    });
  };
  const castVote = async (selectedCandidateId = candidateId) => {
    if (!voterId) {
      alert("Please enter Voter ID.");

      return;
    }

    if (!selectedCandidateId) {
      alert("Please select a candidate.");

      return;
    }

    try {
      const response = await api.post("/votes", {
        voterId: voterId,

        candidateId: selectedCandidateId,
      });

      alert(response.data);

      SpeechService.speak(
        "Your vote has been recorded successfully. Thank you for voting.",
      );

      setVoterId("");

      setCandidateId("");

      localStorage.removeItem("officer");

      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    } catch (error) {
      console.log(error);

      alert("Unable to cast vote.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="vote-container">
        <div className="vote-header">
          <h1>🗳 Voice Assisted Voting System</h1>
          <p>
            Secure Voice Guided Election System for Visually Impaired Voters
          </p>
        </div>

        <div className="vote-grid">
          {/* Left Panel */}
          <div className="vote-card">
            <h2>Current Voter</h2>

            <input
              className="vote-input"
              type="text"
              placeholder="Enter Voter ID"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
            />

            <div className="status">🟢 Ready For Voting</div>

            <div className="button-group">
              <button className="voice-btn" onClick={startVoiceVoting}>
                ▶ Start Voting Session
              </button>

              <button
                className="voice-btn secondary-btn"
                onClick={() => {
                  const language = localStorage.getItem("language") || "en";

                  readCandidates(candidates, language);
                }}
              >
                🔁 Hear Candidates Again
              </button>

              <button className="voice-btn warning-btn" onClick={listenForVote}>
                🎤 Speak Candidate Number
              </button>

              <button className="voice-btn danger-btn" onClick={castVote}>
                ✅ Confirm Vote
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="vote-card">
            <h2>🎧 Voice Assistant</h2>

            <div className="instructions">
              <p>✔ Enter the Voter ID.</p>

              <p>
                ✔ Click <b>Start Voting Session</b>.
              </p>

              <p>✔ Listen carefully to every candidate.</p>

              <p>✔ Speak the ballot number.</p>

              <p>
                ✔ Say <b>YES</b> to confirm.
              </p>

              <p>
                ✔ Say <b>NO</b> to hear the list again.
              </p>
            </div>

            <br />

            <h3>Current Session</h3>

            <p>🎧 Voice Guidance : Active</p>

            <p>🎤 Voice Recognition : Ready</p>

            <p>🔒 Secure Vote Recording : Enabled</p>

            <p>🎲 Candidate Order : Randomized</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Vote;
