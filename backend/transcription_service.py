import tempfile
import numpy as np
import whisper

# Load Whisper model once at module level
model = whisper.load_model("base")

def transcribe_audio_chunk(audio_bytes: bytes, sample_rate: int = 16000) -> str:
    """
    Transcribes a chunk of audio bytes using Whisper.
    Assumes audio_bytes is in WebM/Opus or WAV PCM format.
    """
    # Save bytes to a temporary file
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=True) as tmp:
        tmp.write(audio_bytes)
        tmp.flush()
        # Whisper can transcribe directly from file
        result = model.transcribe(tmp.name, fp16=False, language=None)
        return result.get("text", "")
