"use client";

import { useEffect, useRef } from "react";

interface VideoEmbedProps {
  url?: string;
  videoFile?: string;
  videoType?: "youtube" | "upload" | "none";
  className?: string;
  maxHeight?: string;
  onVideoReady?: () => void;
  onVideoError?: () => void;
  autoPlay?: boolean;
  /** Analytics callback for video play */
  onVideoPlay?: () => void;
}

function getYouTubeEmbedUrl(url: string, autoPlay: boolean = false): string {
  if (!url) return "";

  let videoId = "";

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) videoId = shortMatch[1];

  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) videoId = embedMatch[1];

  if (videoId) {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    return autoPlay ? `${baseUrl}?autoplay=1&mute=1` : baseUrl;
  }
  if (url.includes("youtube.com/embed/")) {
    return autoPlay ? `${url}?autoplay=1&mute=1` : url;
  }

  return "";
}

export default function VideoEmbed({
  url,
  videoFile,
  videoType = "none",
  className = "",
  maxHeight = "500px",
  onVideoReady,
  onVideoError,
  autoPlay = false,
  onVideoPlay,
}: VideoEmbedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle video events
  useEffect(() => {
    if (videoType === "upload" && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedData = () => {
        onVideoReady?.();
        // Auto-play when ready if autoPlay is enabled
        if (autoPlay) {
          video.play().catch(error => {
            console.log('Auto-play failed:', error);
          });
        }
        // Call analytics callback on video ready
        onVideoPlay?.();
      };

      const handleError = () => {
        onVideoError?.();
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoType, videoFile, onVideoReady, onVideoError, autoPlay, onVideoPlay]);

  // Handle iframe events (YouTube)
  useEffect(() => {
    if (videoType === "youtube" && iframeRef.current) {
      const iframe = iframeRef.current;

      const handleLoad = () => {
        // YouTube iframe loaded successfully
        setTimeout(() => {
          onVideoReady?.();
          // Call analytics callback for YouTube
          onVideoPlay?.();
        }, 1000); // Give YouTube player time to initialize
      };

      const handleError = () => {
        onVideoError?.();
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, [videoType, url, onVideoReady, onVideoError, onVideoPlay]);

  if (videoType === "none" || (!url && !videoFile)) return null;

  if (videoType === "youtube" && url) {
    const embedUrl = getYouTubeEmbedUrl(url, autoPlay);
    if (!embedUrl) {
      onVideoError?.();
      return null;
    }

    return (
      <div className={`relative w-full ${className}`} style={{ paddingBottom: "56.25%" }}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (videoType === "upload" && videoFile) {
    return (
      <video
        ref={videoRef}
        src={videoFile}
        controls
        autoPlay={autoPlay}
        muted={autoPlay} // Muted is required for auto-play in most browsers
        className={`w-full rounded-lg shadow-lg ${className}`}
        style={{ maxHeight }}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
}