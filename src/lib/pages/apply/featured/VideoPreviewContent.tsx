"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface VideoPreviewContentProps {
  fullscreenVideo: string | null;
  setFullscreenVideo: (video: string | null) => void;
  contentSections: Array<{
    gifData: {
      gifSrc: string;
      alt: string;
    };
    title?: string;
    subtitle?: string | null;
  }>;
}

export default function VideoPreviewContent({
  fullscreenVideo,
  setFullscreenVideo,
  contentSections
}: VideoPreviewContentProps) {
  // ESC key to close dialog
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenVideo) {
        setFullscreenVideo(null);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [fullscreenVideo, setFullscreenVideo]);

  if (!fullscreenVideo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setFullscreenVideo(null)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Centered Dialog Content */}
      <div
        className="relative z-10 w-full h-full max-w-6xl max-h-[85vh] bg-black rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setFullscreenVideo(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
          aria-label="Close fullscreen video"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Container - Full Size */}
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            src={fullscreenVideo}
            autoPlay
            loop
            controls
            playsInline
            className="w-full h-full object-contain"
            style={{ maxHeight: '85vh' }}
            aria-label={contentSections.find(s => s.gifData.gifSrc === fullscreenVideo)?.gifData.alt || "Fullscreen video preview"}
          />
        </div>
      </div>
    </div>
  );
}