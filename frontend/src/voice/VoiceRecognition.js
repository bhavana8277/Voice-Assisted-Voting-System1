import RecordRTC from "recordrtc";
import api from "../services/api";

class VoiceRecognition {

    async start(callback) {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            const recorder = new RecordRTC(stream, {
                type: "audio",
                mimeType: "audio/webm"
            });

            recorder.startRecording();

            // Record for 4 seconds
            setTimeout(async () => {

                recorder.stopRecording(async () => {

                    const blob = recorder.getBlob();

                    const formData = new FormData();

                    formData.append(
                        "audio",
                        blob,
                        "audio.webm"
                    );

                    const response = await api.post(
                        "/speech/transcribe",
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data"
                            }
                        }
                    );

                    callback(
                        response.data.trim().toLowerCase()
                    );

                    stream
                        .getTracks()
                        .forEach(track => track.stop());

                });

            }, 4000);

        } catch (e) {

            console.error(e);

            alert("Microphone Error");

        }

    }

}

export default new VoiceRecognition();