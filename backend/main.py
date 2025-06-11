from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from audio_streaming import stream_audio_chunks
import os
import asyncio
from deepgram import DeepgramClient, LiveTranscriptionEvents, LiveOptions

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY", "your_deepgram_api_key_here")

def get_live_options():
    return LiveOptions(
        model="nova-2",
        language="en-US",
        smart_format=True,
        interim_results=True,
        encoding="opus",
        sample_rate=48000,
    )

@app.get("/")
def read_root():
    return {"message": "Live Subs Backend Running"}

@app.websocket("/ws/audio")
async def websocket_audio_endpoint(websocket: WebSocket):
    await websocket.accept()
    dg_client = DeepgramClient(DEEPGRAM_API_KEY)
    options = get_live_options()
    dg_socket = await dg_client.listen.v(
        options
    )

    async def receive_audio():
        async for chunk in stream_audio_chunks(websocket):
            await dg_socket.send(chunk)
        await dg_socket.finish()

    async def send_transcripts():
        async for event in dg_socket:
            if isinstance(event, LiveTranscriptionEvents):
                for result in event.channel.alternatives:
                    transcript = result.transcript
                    if transcript:
                        await websocket.send_text(transcript)

    await asyncio.gather(receive_audio(), send_transcripts())
    await websocket.close()
