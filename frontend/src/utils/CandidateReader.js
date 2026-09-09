import SpeechService from "../voice/SpeechService";

export function readCandidates(candidates, language) {

    let message = "Please listen carefully. ";

    candidates.forEach((candidate, index) => {

    message += `Candidate Number ${index + 1}. `;

    message += `${candidate.candidateName}. `;

    message += `Representing ${candidate.partyName}. `;

    message += `Election Symbol ${candidate.symbol}. `;

});

    message += "If you want to hear the candidates again, press the Repeat button.";

    SpeechService.speak(message, language);

}