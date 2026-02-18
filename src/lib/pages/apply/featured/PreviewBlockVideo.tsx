"use client";

import { Maximize2 } from "lucide-react";
import HoverGif from "@/lib/components/HoverGif";
import { useVideoInteractions } from "./hooks/useVideoInteractions";

interface PreviewBlockVideoProps {
  setFullscreenVideo?: (videoSrc: string | null) => void;
}

export default function PreviewBlockVideo({
  setFullscreenVideo
}: PreviewBlockVideoProps) {
  const { videoRef, sectionRef, handleMouseEnter, handleMouseLeave } = useVideoInteractions({
    videoSrc: "/videos/GlamlinkAppPreview.mp4",
    sectionId: "preview-block-video",
    enableMobileScroll: true, // Enable mobile scroll-based autoplay
    isMultiSection: false
  });

  return (
    <div
      ref={sectionRef}
      data-section-id="preview-block-video"
      className="text-center mb-12"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      {/* Video/GIF Preview */}
      <div className="flex justify-center relative mb-8 min-h-[880px]">
        <div className="relative max-h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-br from-glamlink-teal/20 to-glamlink-pink/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white rounded-2xl p-4 shadow-lg group max-h-[880px] mb-4">
            <div className="relative">
              <div>
                <HoverGif
                  ref={videoRef}
                  stillSrc="/images/GlamlinkAppPreview.png"
                  gifSrc="/videos/GlamlinkAppPreview.mp4"
                  alt="Glamlink app preview"
                  responsive={false}
                  height={800}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
              {/* Black Overlay on Hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
              {/* Fullscreen Icon - Always Visible */}
              {setFullscreenVideo && (
                <button
                  onClick={() => setFullscreenVideo("/videos/GlamlinkAppPreview.mp4")}
                  className="absolute bottom-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg z-10"
                  aria-label="View fullscreen"
                >
                  <Maximize2 className="w-6 h-6 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}