"use client";

import React, { useState } from 'react';
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import VideoEmbed from './VideoEmbed';

interface MediaItemProps {
  title?: string;
  titleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  description?: string;
  descriptionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };
  caption?: string;
  captionTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
  };

  // New structured media settings
  mediaSettings?: {
    image?: any;
    videoSettings?: {
      videoType?: "none" | "file" | "youtube";
      video?: any;
      videoUrl?: string;
    };
  };

  // Legacy props for backward compatibility
  image?: any;
  videoUrl?: string;
  videoFile?: string;

  className?: string;

  /** Analytics callback for video play */
  onVideoPlay?: () => void;
}



export default function MediaItem({
  title,
  titleTypography,
  description,
  descriptionTypography,
  caption,
  captionTypography,
  mediaSettings,
  // Legacy props for backward compatibility
  image,
  videoUrl,
  videoFile,
  className = "",
  onVideoPlay,
}: MediaItemProps) {
  // State management for video playback
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoHasLoaded, setVideoHasLoaded] = useState(false);
  const [videoTimeout, setVideoTimeout] = useState<NodeJS.Timeout | null>(null);

  // Helper function to get value from either new or legacy props
  const getValue = <T,>(newValue: T | undefined, legacyValue: T | undefined, defaultValue: T): T => {
    if (newValue !== undefined) return newValue;
    if (legacyValue !== undefined) return legacyValue;
    return defaultValue;
  };

  // Extract media settings with backward compatibility
  const extractedImage = getValue(
    mediaSettings?.image,
    image,
    undefined
  );

  const extractedVideoUrl = getValue(
    mediaSettings?.videoSettings?.videoUrl,
    videoUrl,
    ""
  );

  // Handle video file (new structure or legacy)
  const extractedVideoFile = getValue(
    mediaSettings?.videoSettings?.video,
    videoFile,
    undefined
  );

  // Detect what media is available
  const hasImage = !!extractedImage;
  const hasVideo = !!(extractedVideoUrl || extractedVideoFile);

  // Handle play button click
  const handlePlayClick = () => {
    setIsVideoLoading(true);
    setIsVideoPlaying(true);

    // Call analytics callback
    onVideoPlay?.();

    // Clear any existing timeout
    if (videoTimeout) {
      clearTimeout(videoTimeout);
    }

    // Set timeout fallback in case video never loads
    const timeout = setTimeout(() => {
      setIsVideoLoading(false);
      console.warn('Video loading timeout - possible issue with video file or network');
    }, 8000); // 8 second fallback

    setVideoTimeout(timeout);
  };

  // Handle video close
  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
    setIsVideoLoading(false);
    setVideoHasLoaded(false);
    // Clear timeout when closing video
    if (videoTimeout) {
      clearTimeout(videoTimeout);
      setVideoTimeout(null);
    }
  };

  const handleVideoReady = () => {
    setIsVideoLoading(false);
    setVideoHasLoaded(true);
    // Clear timeout since video loaded successfully
    if (videoTimeout) {
      clearTimeout(videoTimeout);
      setVideoTimeout(null);
    }
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setIsVideoPlaying(false);
    setVideoHasLoaded(false);
    // Clear timeout on error
    if (videoTimeout) {
      clearTimeout(videoTimeout);
      setVideoTimeout(null);
    }
    console.error('Video failed to load');
  };

  // Build title classes from typography settings
  const titleClasses = [
    titleTypography?.fontSize || "text-2xl",
    titleTypography?.fontFamily || "font-sans",
    titleTypography?.fontWeight || "font-bold",
    titleTypography?.fontStyle || "",
    titleTypography?.textDecoration || "",
    titleTypography?.color || "text-gray-900",
    titleTypography?.alignment === "left" ? "text-left" :
      titleTypography?.alignment === "right" ? "text-right" :
      titleTypography?.alignment === "center" ? "text-center" : "text-left",
    "mb-4"
  ].filter(Boolean).join(" ");

  // Build description classes from typography settings
  const descriptionClasses = [
    descriptionTypography?.fontSize || "text-base",
    descriptionTypography?.fontFamily || "font-sans",
    descriptionTypography?.fontWeight || "font-normal",
    descriptionTypography?.fontStyle || "",
    descriptionTypography?.textDecoration || "",
    descriptionTypography?.color || "text-gray-700",
    descriptionTypography?.alignment === "left" ? "text-left" :
      descriptionTypography?.alignment === "right" ? "text-right" :
      descriptionTypography?.alignment === "center" ? "text-center" : "text-left",
    "mb-4"
  ].filter(Boolean).join(" ");

  // Build caption classes from typography settings
  const captionClasses = [
    captionTypography?.fontSize || "text-sm",
    captionTypography?.fontFamily || "font-sans",
    captionTypography?.fontWeight || "font-normal",
    captionTypography?.fontStyle || "italic",
    captionTypography?.textDecoration || "",
    captionTypography?.color || "text-gray-600",
    captionTypography?.alignment === "left" ? "text-left" :
      captionTypography?.alignment === "right" ? "text-right" :
      captionTypography?.alignment === "center" ? "text-center" : "text-center",
    "mt-3"
  ].filter(Boolean).join(" ");

  // Helper function to get video URL from video object
  const getVideoUrl = (video: any): string => {
    if (!video) return "";

    // Handle different video object structures
    if (typeof video === "string") return video;
    if (video.url) return video.url;
    if (video.src) return video.src;
    if (video.downloadURL) return video.downloadURL;
    if (video.firebaseUrl) return video.firebaseUrl;
    if (video.path) return video.path; // Firebase Storage path

    return "";
  };

  // Render media with stacked layout approach
  const renderMedia = () => {
    if (!hasImage && !hasVideo) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 text-gray-500">
          No media provided
        </div>
      );
    }

    return (
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-black">
        {hasImage && !isVideoPlaying ? (
          // Image state: show image with play button overlay if video exists
          <div className="relative">
            <img
              src={getImageUrl(extractedImage) || "/images/placeholder.png"}
              alt={title || description || "Media image"}
              className="w-full h-auto"
              style={{
                objectFit: getImageObjectFit(extractedImage) === "cover" ? "cover" : "contain",
                objectPosition: getImageObjectPosition(extractedImage),
              }}
            />

            {/* Play button overlay over image */}
            {hasVideo && !videoHasLoaded && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                aria-label="Play video"
              >
                <div className="bg-white/90 group-hover:bg-white rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-glamlink-teal" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}

            {/* Loading spinner overlay */}
            {isVideoLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-full p-4">
                  <svg className="animate-spin h-8 w-8 text-glamlink-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Video state: show video with proper aspect ratio container
          <div className="aspect-video relative">
            {hasVideo && isVideoPlaying && (
              <div className="opacity-0 transition-opacity duration-300" style={{ opacity: videoHasLoaded ? 1 : 0 }}>
                <VideoEmbed
                  url={extractedVideoUrl}
                  videoFile={getVideoUrl(extractedVideoFile)}
                  videoType={mediaSettings?.videoSettings?.videoType === "file" ? "upload" : mediaSettings?.videoSettings?.videoType as any}
                  autoPlay={true}
                  onVideoReady={handleVideoReady}
                  onVideoError={handleVideoError}
                />
              </div>
            )}

            {/* Loading spinner for video-only case */}
            {isVideoLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-full p-4">
                  <svg className="animate-spin h-8 w-8 text-glamlink-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            )}

            {/* Play button for video-only case */}
            {hasVideo && !isVideoPlaying && !videoHasLoaded && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                aria-label="Play video"
              >
                <div className="bg-white/90 group-hover:bg-white rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-glamlink-teal" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}

            {/* Close button before video loads */}
            {isVideoPlaying && !videoHasLoaded && (
              <button
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Close video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Fallback background when no image and no video */}
            {!hasImage && !isVideoPlaying && !hasVideo && (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-lg p-6 ${className}`}>
      {title && (
        <h2 className={titleClasses}>
          {title}
        </h2>
      )}

      {description && (
        <div className={descriptionClasses}>
          {description}
        </div>
      )}

      {renderMedia()}

      {caption && (
        <div className={captionClasses}>
          {caption}
        </div>
      )}
    </div>
  );
}