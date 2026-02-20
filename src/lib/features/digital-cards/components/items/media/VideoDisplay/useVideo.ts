"use client";

import { useState } from "react";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

// =============================================================================
// VIDEO DETECTION UTILITY
// =============================================================================

/**
 * Check if a URL is a video URL (YouTube, Vimeo, or direct video file)
 */
export function isVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.ogg')
  );
}

/**
 * Check if a gallery item is a video
 * Checks both the type property and URL patterns
 */
export function isVideoItem(item: GalleryItem | undefined | null): boolean {
  if (!item) return false;
  if (item.type === 'video') return true;
  const url = item.url || item.src;
  return isVideoUrl(url);
}

// =============================================================================
// USE VIDEO HOOK
// =============================================================================

export interface UseVideoReturn {
  // State
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  isFullscreen: boolean;

  // Video type detection
  videoType: 'youtube' | 'vimeo' | 'direct';
  videoUrl: string;

  // URL processors
  getYouTubeVideoId: (url: string) => string | null;
  getVimeoVideoId: (url: string) => string | null;
  getYouTubeEmbedUrl: (url: string) => string | null;
  getVimeoEmbedUrl: (url: string) => string | null;

  // Event handlers
  handlePlayPause: () => void;
  handleMuteToggle: () => void;
  handleFullscreen: () => void;
  handleError: () => void;
  setIsLoading: (loading: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
}

export function useVideo(
  video: GalleryItem,
  autoplay: boolean,
  muted: boolean,
  controls: boolean,
  loop: boolean
): UseVideoReturn {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoUrl = video.url || video.src || "";

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract video ID from Vimeo URL
  const getVimeoVideoId = (url: string) => {
    const regExp = /^.*(vimeo\.com\/)(\d+).*/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  };

  // Check if video is from YouTube
  const isYouTubeVideo = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Check if video is from Vimeo
  const isVimeoVideo = (url: string) => {
    return url.includes("vimeo.com");
  };

  // Generate embed URL for YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: loop ? "1" : "0",
      controls: controls ? "1" : "0",
      rel: "0",
      modestbranding: "1",
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Generate embed URL for Vimeo
  const getVimeoEmbedUrl = (url: string) => {
    const videoId = getVimeoVideoId(url);
    if (!videoId) return null;

    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      muted: muted ? "1" : "0",
      loop: loop ? "1" : "0",
      controls: controls ? "1" : "0",
    });

    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  };

  // Determine video type
  let videoType: 'youtube' | 'vimeo' | 'direct';
  if (isYouTubeVideo(videoUrl)) {
    videoType = 'youtube';
  } else if (isVimeoVideo(videoUrl)) {
    videoType = 'vimeo';
  } else {
    videoType = 'direct';
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.getElementById(`video-${video.id}`);
      if (elem?.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleError = () => {
    setError("Failed to load video");
    setIsLoading(false);
  };

  return {
    isPlaying,
    isMuted,
    isLoading,
    error,
    isFullscreen,
    videoType,
    videoUrl,
    getYouTubeVideoId,
    getVimeoVideoId,
    getYouTubeEmbedUrl,
    getVimeoEmbedUrl,
    handlePlayPause,
    handleMuteToggle,
    handleFullscreen,
    handleError,
    setIsLoading,
    setIsPlaying,
  };
}
