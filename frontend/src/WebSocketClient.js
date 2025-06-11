// Handles WebSocket connection for audio and subtitles
// To be implemented: connect, send audio, receive subtitles

class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
  }

  connect(onMessage) {
    this.ws = new window.WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onmessage = (event) => {
      if (onMessage) onMessage(event.data);
    };
  }

  sendAudioChunk(chunk) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(chunk);
    }
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

export default WebSocketClient;
