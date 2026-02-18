"use client";

import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Loader2 } from "lucide-react";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

interface VideoDisplayProps {
  video: GalleryItem;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export default function VideoDisplay({
  video,
  className = "",
  autoplay = false,
  controls = true,
  muted = true,
  loop = false,
}: VideoDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Check if video is from Firebase Storage
  const isFirebaseVideo = (url: string) => {
    return url.includes("firebasestorage.googleapis.com");
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

  const renderVideoContent = () => {
    const videoUrl = video.url || video.src;

    // YouTube Video
    if (videoUrl && isYouTubeVideo(videoUrl)) {
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      if (!embedUrl) {
        return (
          <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-red-500 mb-2">Invalid YouTube URL</p>
              <p className="text-sm text-gray-600">{videoUrl}</p>
            </div>
          </div>
        );
      }

      return (
        <div className="relative bg-black rounded-lg overflow-hidden max-h-[800px]">
          <iframe
            src={embedUrl}
            className="w-full border-0 max-h-[800px]"
            title={video.title || "Video"}
            style={{ aspectRatio: '16/9' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={handleError}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      );
    }

    // Vimeo Video
    if (videoUrl && isVimeoVideo(videoUrl)) {
      const embedUrl = getVimeoEmbedUrl(videoUrl);
      if (!embedUrl) {
        return (
          <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-red-500 mb-2">Invalid Vimeo URL</p>
              <p className="text-sm text-gray-600">{videoUrl}</p>
            </div>
          </div>
        );
      }

      return (
        <div className="relative bg-black rounded-lg overflow-hidden max-h-[800px]">
          <iframe
            src={embedUrl}
            className="w-full border-0 max-h-[800px]"
            title={video.title || "Video"}
            style={{ aspectRatio: '16/9' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={handleError}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      );
    }

    // Direct Video URL (Firebase Storage or other)
    return (
      <div className="relative bg-black rounded-lg overflow-hidden max-h-[800px]" id={`video-${video.id}`}>
        <video
          src={videoUrl}
          className="max-h-[800px] w-auto h-auto object-contain"
          autoPlay={autoplay}
          controls={controls}
          muted={isMuted}
          loop={loop}
          playsInline
          onLoadedData={() => setIsLoading(false)}
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

        {/* Custom Controls (for direct video) */}
        {!controls && videoUrl && !isYouTubeVideo(videoUrl) && !isVimeoVideo(videoUrl) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlayPause}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleMuteToggle}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleFullscreen}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`video-display ${className}`}>
      {/* Video Title and Metadata */}
      {video.title && (
        <div className="mb-3 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{video.title}</h3>
          {video.duration && (
            <p className="text-xs text-gray-500 mt-1">Duration: {video.duration}</p>
          )}
        </div>
      )}

      {/* Video Content - full width, max height 500px */}
      <div className="w-full flex justify-center">
        {renderVideoContent()}
      </div>

      {/* Video Tags */}
      {video.tags && video.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {video.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal-dark text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}