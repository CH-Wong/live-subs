from fastapi import WebSocket
from typing import AsyncGenerator

# Handles incoming audio WebSocket streams for Deepgram
async def stream_audio_chunks(websocket: WebSocket) -> AsyncGenerator[bytes, None]:
    """
    Receives audio chunks from the WebSocket and yields them as bytes.
    """
    while True:
        try:
            data = await websocket.receive_bytes()
            if not data:
                break
            yield data
        except Exception:
            break
