import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function OfficerSetup() {

    const navigate = useNavigate();

    const [voterId, setVoterId] = useState("");
    const [language, setLanguage] = useState("en");

    const startVoting = () => {

        if (!voterId) {
            alert("Please enter Voter ID");
            return;
        }

        localStorage.setItem("voterId", voterId);
        localStorage.setItem("language", language);

        navigate("/vote");
    };

    return (

        <>

            <Navbar />

            <div
                style={{
                    maxWidth: "500px",
                    margin: "40px auto",
                    padding: "30px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
                }}
            >

                <h2>Voting Session Setup</h2>

                <br />

                <label>Voter ID</label>

                <input
                    type="text"
                    placeholder="Enter Voter ID"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "8px"
                    }}
                />

                <br /><br />

                <label>Select Language</label>

                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "8px"
                    }}
                >

                    <option value="en">English</option>
                    <option value="kn">Kannada</option>
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                    <option value="ta">Tamil</option>

                </select>

                <br /><br />

                <label>

                    <input
                        type="checkbox"
                        checked
                        readOnly
                    />

                    {" "}Headphones Connected

                </label>

                <br /><br /><br />

                <button
                    onClick={startVoting}
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "18px",
                        cursor: "pointer"
                    }}
                >

                    START VOTING

                </button>

            </div>

        </>

    );

}

export default OfficerSetup;