'use client';

import React, { useRef, useState } from 'react';

export function VideoCurtain() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.log('Autoplay play error:', err));
      setIsPlaying(true);
    }
  };

  return (
    <div className="video-curtain-section">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src="/videos/automation-schema.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="curtain-video"
        />
        
        {/* Play/Pause Button Overlay (GitHub style) */}
        <button
          onClick={togglePlay}
          className="video-control-btn"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          title={isPlaying ? 'Pause' : 'Lire'}
        >
          {isPlaying ? (
            /* Pause Icon */
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="4" width="4" height="16" rx="1" />
              <rect x="15" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play Icon */
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: 'translateX(1px)' }}
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
