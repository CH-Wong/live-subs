# Message formats for subtitles and audio
from pydantic import BaseModel

class SubtitleMessage(BaseModel):
    timestamp: str
    original_text: str
    translated_text: str
