import sys
from faster_whisper import WhisperModel

if len(sys.argv) != 2:
    print("")
    sys.exit(1)

audio_file = sys.argv[1]

# Load Whisper model
model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    audio_file,
    language="en",                  # Change to None for auto-detection if needed
    beam_size=1,
    vad_filter=True,
    condition_on_previous_text=False,
    no_speech_threshold=0.6,
    compression_ratio_threshold=2.4
)

# Combine all recognized text into one string
text = " ".join(segment.text.strip() for segment in segments)

# Return only the transcript to Spring Boot
print(text.strip())