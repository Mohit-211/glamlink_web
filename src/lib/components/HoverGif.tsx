"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

// Global state to track which video is currently playing
let currentlyPlayingId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

function setCurrentlyPlaying(id: string | null) {
  currentlyPlayingId = id;
  listeners.forEach(listener => listener(id));
}

function subscribeToPlayingChanges(listener: (id: string | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export interface HoverGifRef {
  play: () => void;
  pause: () => void;
}

type HoverGifProps = {
  stillSrc: string; // Path to static image (first frame)
  gifSrc: string; // Path to the video (MP4/WebM) or GIF
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  responsive?: boolean; // New prop to control responsive behavior
  onClick?: () => void; // Optional click handler
};

const HoverGif = forwardRef<HoverGifRef, HoverGifProps>(({
  stillSrc,
  gifSrc,
  alt,
  width = 400,
  height = 400,
  className = "",
  responsive = false,
  onClick
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);

  // Generate unique ID for this instance
  const instanceId = useRef(`${gifSrc}-${Date.now()}-${Math.random()}`);

  // Subscribe to global playing state changes
  useEffect(() => {
    const unsubscribe = subscribeToPlayingChanges((playingId: string | null) => {
      const shouldPlay = playingId === instanceId.current;
      setIsCurrentlyPlaying(shouldPlay);

      const videoElement = videoRef.current;
      if (videoElement) {
        if (shouldPlay && videoElement.paused) {
          videoElement.currentTime = 0;
          videoElement.play().catch(console.error);
        } else if (!shouldPlay && !videoElement.paused) {
          videoElement.pause();
          videoElement.currentTime = 0;
        }
      }
    });

    return () => {
      unsubscribe();
      // Clean up: stop playing this video when component unmounts
      if (currentlyPlayingId === instanceId.current) {
        setCurrentlyPlaying(null);
      }
    };
  }, []);

  // External play/pause methods for parent component control
  const play = () => {
    setCurrentlyPlaying(instanceId.current);
  };

  const pause = () => {
    if (currentlyPlayingId === instanceId.current) {
      setCurrentlyPlaying(null);
    }
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    play,
    pause
  }), []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden ${className}`}
      style={responsive ? {} : { width, height }}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={gifSrc}
        poster={stillSrc}
        muted
        playsInline
        preload="metadata"
        loop
        style={{
          display: "block",
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        aria-label={alt}
      />
    </div>
  );
});

HoverGif.displayName = "HoverGif";

export default HoverGif;