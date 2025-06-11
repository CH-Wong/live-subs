import React, { useRef, useState } from 'react';
import WebSocketClient from './WebSocketClient';

function AudioCapture({ onSubtitle }) {
  const wsClient = useRef(null);
  const mediaRecorder = useRef(null);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    if (!navigator.mediaDevices) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new window.MediaRecorder(stream, { mimeType: 'audio/webm' });
    wsClient.current = new WebSocketClient('ws://localhost:8000/ws/audio');
    wsClient.current.connect((data) => {
      // Deepgram returns JSON, parse and show interim/final results
      try {
        const msg = JSON.parse(data);
        if (msg.channel && msg.channel.alternatives && msg.channel.alternatives[0]) {
          const transcript = msg.channel.alternatives[0].transcript;
          if (onSubtitle) onSubtitle(transcript);
        }
      } catch (e) {
        // fallback for plain text or errors
        if (onSubtitle) onSubtitle(data);
      }
    });
    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        e.data.arrayBuffer().then((buf) => wsClient.current.sendAudioChunk(buf));
      }
    };
    mediaRecorder.current.start(250); // send every 250ms
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) mediaRecorder.current.stop();
    if (wsClient.current) wsClient.current.close();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop' : 'Start'} Microphone
      </button>
    </div>
  );
}

export default AudioCapture;
