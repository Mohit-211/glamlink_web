"use client";

import { useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Loader2 } from "lucide-react";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

interface DirectURLVideoProps {
  video: GalleryItem;
  videoUrl: string;
  autoplay: boolean;
  controls: boolean;
  muted: boolean;
  isMuted: boolean;
  loop: boolean;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  startTime?: number; // Initial time to seek to when video loads
  isActive?: boolean; // Whether this video is currently selected/visible - controls pause/play
  handlePlayPause: () => void;
  handleMuteToggle: () => void;
  handleFullscreen: () => void;
  handleError: () => void;
  setIsLoading: (loading: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  className?: string;
}

export default function DirectURLVideo({
  video,
  videoUrl,
  autoplay,
  controls,
  muted,
  isMuted,
  loop,
  isLoading,
  error,
  isPlaying,
  startTime,
  isActive = true,
  handlePlayPause,
  handleMuteToggle,
  handleFullscreen,
  handleError,
  setIsLoading,
  setIsPlaying,
  className = "",
}: DirectURLVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasInitializedRef = useRef(false);
  // Track if user has manually started playing (to resume on re-select)
  const wasPlayingBeforePauseRef = useRef(false);

  // Handle loading state - check if video already has data on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If video already has metadata loaded (readyState >= 1), hide loading
    if (video.readyState >= 1) {
      setIsLoading(false);
    }

    // Fallback timeout - hide loading after 5 seconds max
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [setIsLoading, isLoading]);

  // Seek to startTime when video metadata is loaded (only once)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasInitializedRef.current) return;
    if (startTime === undefined || startTime <= 0) return;

    const handleLoadedMetadata = () => {
      if (!hasInitializedRef.current && video.duration > 0) {
        // Clamp startTime to valid range
        const seekTime = Math.min(startTime, video.duration - 0.1);
        video.currentTime = Math.max(0, seekTime);
        hasInitializedRef.current = true;
      }
    };

    // If metadata is already loaded, seek immediately
    if (video.readyState >= 1 && video.duration > 0) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [startTime]);

  // Pause video when not active (switching to another thumbnail), resume when active again
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      // Switching away - pause and remember if it was playing
      wasPlayingBeforePauseRef.current = !video.paused;
      if (!video.paused) {
        video.pause();
      }
    } else {
      // Switching back - resume if it was playing before
      if (wasPlayingBeforePauseRef.current && video.paused) {
        video.play().catch(() => {
          // Autoplay might be blocked, that's ok
        });
      }
    }
  }, [isActive]);

  // Handler to hide loading - used by multiple events
  const hideLoading = () => setIsLoading(false);

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden max-h-[800px] ${className}`} id={`video-${video.id}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="max-h-[800px] w-auto h-auto object-contain"
        autoPlay={autoplay}
        controls={controls}
        muted={isMuted}
        loop={loop}
        playsInline
        onLoadedMetadata={hideLoading}
        onLoadedData={hideLoading}
        onCanPlay={hideLoading}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75">
          <div className="text-center p-4">
            <p className="text-white mb-2">Video unavailable</p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

    </div>
  );
}
