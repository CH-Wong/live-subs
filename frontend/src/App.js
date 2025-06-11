import React, { useState } from 'react';
import Controls from './Controls';
import AudioCapture from './AudioCapture';
import SubtitleDisplay from './SubtitleDisplay';


function App() {
  const [subtitle, setSubtitle] = useState("");
  return (
    <div className="App">
      <h1>Live Subtitle Streaming App</h1>
      <Controls />
      <AudioCapture onSubtitle={setSubtitle} />
      <SubtitleDisplay subtitle={subtitle} />
    </div>
  );
}

export default App;

