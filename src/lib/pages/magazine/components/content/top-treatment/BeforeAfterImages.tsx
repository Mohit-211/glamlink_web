"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import { VideoEmbed } from "../shared";

interface BeforeAfterImagesProps {
  // Main media (video support)
  heroImage?: any;
  heroVideoSettings?: {
    videoType?: "none" | "file" | "youtube";
    video?: string;
    videoUrl?: string;
  };
  // Legacy video props for backward compatibility
  heroVideoType?: "none" | "file" | "youtube";
  heroVideo?: string;
  heroVideoUrl?: string;
  
  // Before/After images
  beforeImage?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  afterImage?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  caption?: string;
  className?: string;
  layout?: "side-by-side" | "slider" | "overlay";
}

export default function BeforeAfterImages({
  heroImage,
  heroVideoSettings,
  heroVideoType,
  heroVideo,
  heroVideoUrl,
  beforeImage,
  afterImage,
  caption,
  className = "",
  layout = "side-by-side"
}: BeforeAfterImagesProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoHasLoaded, setVideoHasLoaded] = useState(false);
  const [videoTimeout, setVideoTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Check if video is configured
  const videoType = heroVideoSettings?.videoType || heroVideoType;
  const hasVideo = videoType && videoType !== "none" && (
    videoType === "youtube" 
      ? heroVideoSettings?.videoUrl || heroVideoUrl 
      : heroVideoSettings?.video || heroVideo
  );
  
  const beforeUrl = beforeImage ? getImageUrl(beforeImage) : "";
  const afterUrl = afterImage ? getImageUrl(afterImage) : "";
  const heroUrl = heroImage ? getImageUrl(heroImage) : "";
  
  const beforeObjectFit = beforeImage ? getImageObjectFit(beforeImage as any) : undefined;
  const beforeObjectPosition = beforeImage ? getImageObjectPosition(beforeImage as any) : undefined;
  const afterObjectFit = afterImage ? getImageObjectFit(afterImage as any) : undefined;
  const afterObjectPosition = afterImage ? getImageObjectPosition(afterImage as any) : undefined;
  
  // If we have hero media, show that with optional before/after
  if (heroUrl) {
    const handlePlayClick = () => {
      setIsVideoLoading(true);
      setIsVideoPlaying(true);

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

    // Helper function to get video URL from video object
    const getVideoUrl = (video: any): string => {
      if (!video) return "";

      // Handle different video object structures
      if (typeof video === "string") return video;
      if (video.url) return video.url;
      if (video.src) return video.src;
      if (video.downloadURL) return video.downloadURL;
      if (video.firebaseUrl) return video.firebaseUrl;

      return "";
    };
    
    return (
      <div className={className}>
        {/* Main Media Section */}
        <div className="mb-6">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-black">
            {/* Hero Image */}
            <Image
              src={heroUrl}
              alt="Treatment showcase"
              fill
              className={`${getImageObjectFit(heroImage) === "cover" ? "object-cover" : "object-contain"} transition-opacity duration-300 ${
                isVideoPlaying && hasVideo ? (videoHasLoaded ? "opacity-0" : "opacity-100") : "opacity-100"
              }`}
              style={{
                objectPosition: getImageObjectPosition(heroImage),
                display: (isVideoPlaying && hasVideo && videoHasLoaded) ? "none" : "block"
              }}
            />
            
            {/* Video layer */}
            {hasVideo && isVideoPlaying && (
              <div className="absolute inset-0 z-10">
                <VideoEmbed
                  url={heroVideoSettings?.videoUrl || heroVideoUrl}
                  videoFile={getVideoUrl(heroVideoSettings?.video || heroVideo)}
                  videoType={videoType === "file" ? "upload" : videoType as any}
                  autoPlay={true}
                  onVideoReady={handleVideoReady}
                  onVideoError={handleVideoError}
                />
              </div>
            )}
            
            {/* Loading spinner */}
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
            
            {/* Play button */}
            {hasVideo && !videoHasLoaded && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 z-5 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                aria-label="Play video"
              >
                <div className="bg-white/90 group-hover:bg-white rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-glamlink-teal" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
            
            {/* Close button */}
            {isVideoPlaying && !videoHasLoaded && (
              <button
                onClick={() => {
                  setIsVideoPlaying(false);
                  setIsVideoLoading(false);
                  setVideoHasLoaded(false);
                  // Clear timeout when closing video
                  if (videoTimeout) {
                    clearTimeout(videoTimeout);
                    setVideoTimeout(null);
                  }
                }}
                className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Close video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Before/After overlay - desktop only */}
            {beforeUrl && afterUrl && !isVideoPlaying && (
              <div className="hidden sm:block absolute bottom-4 right-4 z-15 bg-white rounded-lg shadow-lg p-1">
                <div className="flex gap-1">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24">
                    <Image
                      src={beforeUrl}
                      alt="Before"
                      fill
                      className={`${beforeObjectFit === 'cover' ? 'object-cover' : 'object-contain'} rounded`}
                      style={{
                        objectPosition: beforeObjectPosition
                      }}
                    />
                    <span className="absolute bottom-0.5 left-0.5 text-xs bg-black/70 text-white px-1 py-0.5 rounded text-[10px]">
                      Before
                    </span>
                  </div>
                  <div className="relative w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24">
                    <Image
                      src={afterUrl}
                      alt="After"
                      fill
                      className={`${afterObjectFit === 'cover' ? 'object-cover' : 'object-contain'} rounded`}
                      style={{
                        objectPosition: afterObjectPosition
                      }}
                    />
                    <span className="absolute bottom-0.5 left-0.5 text-xs bg-black/70 text-white px-1 py-0.5 rounded text-[10px]">
                      After
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Before/After Images below - mobile only */}
        {beforeUrl && afterUrl && (
          <div className="sm:hidden mt-4">
            <div className="flex gap-2 sm:gap-4">
              <div className="relative flex-1 aspect-square sm:aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={beforeUrl}
                  alt="Before"
                  fill
                  className={`${beforeObjectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                  style={{
                    objectPosition: beforeObjectPosition
                  }}
                />
                <span className="absolute bottom-2 left-2 text-sm bg-black/70 text-white px-2 py-1 rounded">
                  Before
                </span>
              </div>
              <div className="relative flex-1 aspect-square sm:aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={afterUrl}
                  alt="After"
                  fill
                  className={`${afterObjectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                  style={{
                    objectPosition: afterObjectPosition
                  }}
                />
                <span className="absolute bottom-2 left-2 text-sm bg-black/70 text-white px-2 py-1 rounded">
                  After
                </span>
              </div>
            </div>
          </div>
        )}
        
        {caption && (
          <p className="text-sm text-gray-600 text-center mt-3">{caption}</p>
        )}
      </div>
    );
  }
  
  // Legacy: If no hero media, fall back to original before/after only behavior
  if (!beforeUrl || !afterUrl) return null;
  
  if (layout === "side-by-side") {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={beforeUrl}
                alt="Before"
                fill
                className="object-center"
                style={{ 
                  objectFit: beforeObjectFit as any,
                  objectPosition: beforeObjectPosition
                }}
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                Before
              </div>
            </div>
          </div>
          
          <div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={afterUrl}
                alt="After"
                fill
                className="object-center"
                style={{ 
                  objectFit: afterObjectFit as any,
                  objectPosition: afterObjectPosition
                }}
              />
              <div className="absolute top-2 left-2 bg-glamlink-purple text-white px-2 py-1 rounded text-sm font-medium">
                After
              </div>
            </div>
          </div>
        </div>
        
        {caption && (
          <p className="text-sm text-gray-600 text-center mt-3">{caption}</p>
        )}
      </div>
    );
  }
  
  return null;
}