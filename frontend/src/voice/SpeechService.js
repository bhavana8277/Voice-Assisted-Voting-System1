class SpeechService {

    speak(text, language = "en-US") {

        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = language;

        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;

        window.speechSynthesis.speak(speech);
    }

    stop() {
        window.speechSynthesis.cancel();
    }

}

export default new SpeechService();