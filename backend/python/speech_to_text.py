import sys
from faster_whisper import WhisperModel

if len(sys.argv) != 2:
    sys.exit(1)

audio_file = sys.argv[1]

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    audio_file,
    language="en",
    beam_size=5,
    initial_prompt="The speaker will only say ballot numbers such as one, two, three, four, five or yes and no.",
    vad_filter=True,
    condition_on_previous_text=False,
    no_speech_threshold=0.6,
    compression_ratio_threshold=2.4
)

text = " ".join(segment.text.strip() for segment in segments)

print(text.strip())