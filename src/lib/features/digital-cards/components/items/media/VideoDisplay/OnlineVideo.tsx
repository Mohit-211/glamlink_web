"use client";

import { Loader2 } from "lucide-react";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

interface OnlineVideoProps {
  video: GalleryItem;
  videoType: 'youtube' | 'vimeo';
  embedUrl: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  handleError: () => void;
  className?: string;
}

export default function OnlineVideo({
  video,
  videoType,
  embedUrl,
  isLoading,
  setIsLoading,
  handleError,
  className = "",
}: OnlineVideoProps) {
  const videoUrl = video.url || video.src;

  // Render error state if invalid URL
  if (!embedUrl) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">
            Invalid {videoType === 'youtube' ? 'YouTube' : 'Vimeo'} URL
          </p>
          <p className="text-sm text-gray-600">{videoUrl}</p>
        </div>
      </div>
    );
  }

  // Render iframe with loading overlay
  return (
    <div className={`relative bg-black rounded-lg overflow-hidden max-h-[800px] ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full border-0 max-h-[800px]"
        title={video.title || "Video"}
        style={{ aspectRatio: '16/9' }}
        allow={
          videoType === 'youtube'
            ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            : "autoplay; fullscreen; picture-in-picture"
        }
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
