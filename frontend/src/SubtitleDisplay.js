import React, { useState, useEffect } from 'react';

function SubtitleDisplay({ subtitle }) {
  // Display the latest subtitle text
  return (
    <div style={{
      marginTop: '2rem',
      fontSize: '1.5rem',
      color: '#222',
      background: '#f1f1f1',
      padding: '1rem',
      borderRadius: '8px',
      minHeight: '2.5em',
      textAlign: 'center',
    }}>
      {subtitle || <span style={{ color: '#aaa' }}>[No subtitles yet]</span>}
    </div>
  );
}

export default SubtitleDisplay;
