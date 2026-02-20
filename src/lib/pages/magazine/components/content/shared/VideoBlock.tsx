"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play } from "lucide-react";

interface VideoBlockProps {
  /** YouTube URL or direct video URL */
  videoUrl?: string;
  /** Uploaded video file URL */
  videoFile?: string;
  /** Custom thumbnail image URL */
  thumbnail?: string;
  /** Source of the thumbnail */
  thumbnailSource?: "video" | "upload";
  /** Frame time in seconds for video-extracted thumbnail */
  thumbnailFrameTime?: number;
  /** Container width - percentage string like "100%", "75%", "50%" */
  containerWidth?: string;
  /** Show play button overlay on thumbnail */
  showPlayButton?: boolean;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Title above the video */
  title?: string;
  /** Title typography settings */
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    alignment?: string;
  };
  /** Caption below the video */
  caption?: string;
  /** Caption typography settings */
  captionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    alignment?: string;
  };
  /** Analytics callback for video play */
  onVideoPlay?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// Get YouTube embed URL from various YouTube URL formats
function getYouTubeEmbedUrl(url: string, autoPlay: boolean = false): string | null {
  if (!url) return null;

  let videoId = "";

  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];

  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) videoId = shortMatch[1];

  // Handle youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) videoId = embedMatch[1];

  if (videoId) {
    const params = new URLSearchParams();
    if (autoPlay) {
      params.set("autoplay", "1");
      params.set("mute", "1");
    }
    const paramStr = params.toString();
    return `https://www.youtube.com/embed/${videoId}${paramStr ? "?" + paramStr : ""}`;
  }

  return null;
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;

  let videoId = "";
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) videoId = shortMatch[1];
  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) videoId = embedMatch[1];

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
}

// Check if URL is a YouTube URL
function isYouTubeUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// Get container width styles - now supports percentage strings
function getContainerStyles(width?: string): React.CSSProperties {
  const styles: React.CSSProperties = {};

  // If it's a percentage value like "50%", "75%", etc.
  if (width && width.includes('%')) {
    styles.width = width;
    styles.margin = '0 auto';
  } else {
    styles.width = '100%';
  }

  return styles;
}

export default function VideoBlock({
  videoUrl,
  videoFile,
  thumbnail,
  thumbnailSource = "video",
  thumbnailFrameTime,
  containerWidth = "100%",
  showPlayButton = true,
  borderRadius = 8,
  title,
  titleTypography,
  caption,
  captionTypography,
  onVideoPlay,
  className = "",
}: VideoBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [extractedThumbnail, setExtractedThumbnail] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine the video source
  const isYouTube = isYouTubeUrl(videoUrl);
  const videoSrc = videoFile || videoUrl;

  // Get the thumbnail to display
  const displayThumbnail = (() => {
    // If custom thumbnail is provided via upload
    if (thumbnailSource === "upload" && thumbnail) {
      return thumbnail;
    }
    // If video-extracted thumbnail
    if (thumbnail && thumbnailSource === "video") {
      return thumbnail;
    }
    // If we extracted a thumbnail from the video
    if (extractedThumbnail) {
      return extractedThumbnail;
    }
    // For YouTube, use YouTube thumbnail
    if (isYouTube && videoUrl) {
      return getYouTubeThumbnail(videoUrl);
    }
    return null;
  })();

  // Extract thumbnail from uploaded video at specified frame time
  useEffect(() => {
    if (
      videoFile &&
      !isYouTube &&
      thumbnailSource === "video" &&
      !thumbnail &&
      thumbnailFrameTime !== undefined
    ) {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = videoFile;
      video.muted = true;
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const seekTime = Math.min(thumbnailFrameTime, video.duration - 0.1);
        video.currentTime = Math.max(0.1, seekTime);
      };

      video.onseeked = () => {
        try {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
              setExtractedThumbnail(dataUrl);
            }
          }
        } catch (e) {
          console.warn("Failed to extract video thumbnail:", e);
        }
      };

      video.onerror = () => {
        console.warn("Failed to load video for thumbnail extraction");
      };

      video.load();

      return () => {
        video.src = "";
        video.load();
      };
    }
  }, [videoFile, isYouTube, thumbnailSource, thumbnail, thumbnailFrameTime]);

  // Handle play button click - always starts muted
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onVideoPlay?.();
  }, [onVideoPlay]);

  // Handle video element play - always muted on initial play
  useEffect(() => {
    if (isPlaying && videoRef.current && !isYouTube) {
      videoRef.current.muted = true; // Always start muted
      videoRef.current.play().catch(console.warn);
    }
  }, [isPlaying, isYouTube]);

  // No video source provided
  if (!videoSrc) {
    return (
      <div className={`video-block ${className}`} style={getContainerStyles(containerWidth)}>
        <div
          className="bg-gray-100 flex items-center justify-center text-gray-400 py-20"
          style={{
            borderRadius: `${borderRadius}px`,
          }}
        >
          <span>No video source provided</span>
        </div>
      </div>
    );
  }

  const containerStyles = getContainerStyles(containerWidth);

  // Build typography classes for title
  const titleClasses = [
    titleTypography?.fontSize || "text-lg",
    titleTypography?.fontFamily || "font-sans",
    titleTypography?.fontWeight || "font-semibold",
    titleTypography?.color || "text-gray-900",
    titleTypography?.alignment ? `text-${titleTypography.alignment}` : "text-left",
  ].filter(Boolean).join(" ");

  // Build typography classes for caption
  const captionClasses = [
    captionTypography?.fontSize || "text-sm",
    captionTypography?.fontFamily || "font-sans",
    captionTypography?.fontWeight || "font-normal",
    captionTypography?.color || "text-gray-600",
    captionTypography?.alignment ? `text-${captionTypography.alignment}` : "text-center",
  ].filter(Boolean).join(" ");

  return (
    <div className={`video-block ${className}`} style={containerStyles}>
      {/* Title */}
      {title && (
        <h3 className={`mb-3 ${titleClasses}`}>{title}</h3>
      )}

      {/* Video Container - height scales automatically */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: `${borderRadius}px`,
        }}
      >
        {/* Show thumbnail with play button when not playing */}
        {!isPlaying && displayThumbnail && !thumbnailError && (
          <div
            className="cursor-pointer group relative"
            onClick={handlePlay}
          >
            <img
              src={displayThumbnail}
              alt="Video thumbnail"
              className="w-full h-auto object-contain"
              onError={() => setThumbnailError(true)}
            />
            {showPlayButton && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* YouTube embed */}
        {isYouTube && (isPlaying || !displayThumbnail || thumbnailError) && (
          <iframe
            src={getYouTubeEmbedUrl(videoUrl!, isPlaying) || undefined}
            className="w-full"
            style={{ aspectRatio: "16/9" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Direct video embed - always starts muted */}
        {!isYouTube && (isPlaying || !displayThumbnail || thumbnailError) && (
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay={isPlaying}
            muted
            className="w-full h-auto"
            onPlay={() => onVideoPlay?.()}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p className={`mt-2 ${captionClasses}`}>{caption}</p>
      )}
    </div>
  );
}
