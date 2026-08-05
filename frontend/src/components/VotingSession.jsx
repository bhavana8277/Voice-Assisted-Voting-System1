import { useEffect } from "react";

import SpeechService from "../voice/SpeechService";

function VotingSession({ language, candidates }) {

    useEffect(() => {

        let welcome = "";

        switch (language) {

            case "kn":
                welcome = "ಮತದಾನ ವ್ಯವಸ್ಥೆಗೆ ಸ್ವಾಗತ";
                break;

            case "hi":
                welcome = "मतदान प्रणाली में आपका स्वागत है";
                break;

            case "te":
                welcome = "ఓటింగ్ వ్యవస్థకు స్వాగతం";
                break;

            case "ta":
                welcome = "வாக்களிப்பு அமைப்பிற்கு வரவேற்கிறோம்";
                break;

            default:
                welcome = "Welcome to Voice Assisted Voting System";
        }

        SpeechService.speak(welcome);

    }, []);

    return null;
}

export default VotingSession;