"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getImageUrl, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import TypographyWrapper from "../utils/TypographyWrapper";
import VideoEmbed from "./VideoEmbed";

interface BusinessProfileProps {
  // New structured media settings
  businessMediaSettings?: {
    image?: any;
    videoSettings?: {
      video?: any;
      videoUrl?: string;
    };
  };

  // Legacy props for backward compatibility
  businessImage?: any;

  businessName: string;
  businessNameTypography?: any;
  businessTitle?: string;
  businessTitleTypography?: any;
  businessTitle2?: string;
  businessTitle2Typography?: any;
  bio?: string;
  bioTitle?: string;
  bioTitleTypography?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    alignment?: string;
    tag?: string;
  };
  quote?: string;
  quoteTypography?: any;
  quoteAuthor?: string;
  quoteAuthorTypography?: any;
  quoteOverImage?: boolean;
  quoteBgClassName?: string;
  quoteBgStyle?: any;
  bioBgClassName?: string;
  bioBgStyle?: any;
  /** Analytics callback for video play */
  onVideoPlay?: () => void;
}

export default function BusinessProfile({
  businessMediaSettings,
  // Legacy props for backward compatibility
  businessImage,
  businessName,
  businessNameTypography,
  businessTitle,
  businessTitleTypography,
  businessTitle2,
  businessTitle2Typography,
  bio,
  bioTitle = "About",
  bioTitleTypography,
  quote,
  quoteTypography,
  quoteAuthor,
  quoteAuthorTypography,
  quoteOverImage,
  quoteBgClassName = "bg-gray-100/95",
  quoteBgStyle,
  bioBgClassName = "bg-white",
  bioBgStyle,
  onVideoPlay,
}: BusinessProfileProps) {
  // Helper function to check if HTML content has meaningful text
  const hasContent = (htmlString?: string): boolean => {
    if (!htmlString || typeof htmlString !== "string") return false;

    // Remove HTML tags and check if there's actual text
    const textContent = htmlString
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
      .trim(); // Remove whitespace

    return textContent.length > 0;
  };

  // Helper to check if a field has meaningful content
  const hasTextContent = (text?: string): boolean => {
    return !!(text && text.trim().length > 0);
  };

  // Get tag from typography settings
  const bioTitleTag = bioTitleTypography?.tag || "h3";

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
  const extractedImage = getValue(businessMediaSettings?.image, businessImage, undefined);

  const extractedVideoUrl = getValue(businessMediaSettings?.videoSettings?.videoUrl, undefined, "");

  const extractedVideoFile = getValue(businessMediaSettings?.videoSettings?.video, undefined, undefined);

  // Detect what media is available
  const hasImage = !!extractedImage;
  const hasVideo = !!(extractedVideoUrl || extractedVideoFile);

  // Auto-detect video type
  const detectedVideoType = extractedVideoFile ? "upload" : extractedVideoUrl ? "youtube" : "none";

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
      console.warn("Video loading timeout - possible issue with video file or network");
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
    console.error("Video failed to load");
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
    if (video.path) return video.path; // Firebase Storage path

    return "";
  };

  // Extract the quote color for the quote marks
  const quoteColor = quoteTypography?.color || "text-gray-800";
  const quoteMarkClasses = `absolute text-4xl ${quoteColor} opacity-50`;

  // Render media with stacked layout approach
  const renderMedia = () => {
    if (!hasImage && !hasVideo) {
      return <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg text-gray-500">No media provided</div>;
    }

    if (hasImage && !isVideoPlaying) {
      // Image state: show image with play button overlay if video exists
      return (
        <>
          <Image
            src={getImageUrl(extractedImage) || "/images/placeholder.png"}
            alt={businessName || "Business image"}
            fill
            className="object-cover"
            style={{
              objectPosition: getImageObjectPosition(extractedImage),
            }}
          />

          {/* Play button overlay over image */}
          {hasVideo && (
            <button onClick={handlePlayClick} className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group" aria-label="Play video">
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
        </>
      );
    }

    // Video state: show video with proper aspect ratio container
    return (
      <>
        {hasVideo && (
          <div className="opacity-0 transition-opacity duration-300" style={{ opacity: videoHasLoaded ? 1 : 0 }}>
            <VideoEmbed url={extractedVideoUrl} videoFile={getVideoUrl(extractedVideoFile)} videoType={detectedVideoType as any} autoPlay={true} onVideoReady={handleVideoReady} onVideoError={handleVideoError} />
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
          <button onClick={handlePlayClick} className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group" aria-label="Play video">
            <div className="bg-white/90 group-hover:bg-white rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-glamlink-teal" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}

        {/* Close button before video loads */}
        {isVideoPlaying && !videoHasLoaded && (
          <button onClick={handleCloseVideo} className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors" aria-label="Close video">
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
      </>
    );
  };

  // Render bio title with dynamic heading tag
  const renderBioTitle = () => {
    if (!hasTextContent(bioTitle)) return null;

    // Use type assertion to ensure TypeScript compatibility
    const headingElement = bioTitleTag as React.ElementType;

    return (
      <TypographyWrapper
        as={headingElement}
        settings={bioTitleTypography}
        className="mb-3 relative z-10"
        defaultSettings={{
          fontSize: "text-2xl",
          fontFamily: "font-sans",
          fontWeight: "font-semibold",
          color: "text-gray-900",
        }}
      >
        {bioTitle}
      </TypographyWrapper>
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        {/* Business Name and Title - Above Everything */}
        <div className="mb-8 text-center">
          <TypographyWrapper
            as="h1"
            settings={businessNameTypography}
            defaultSettings={{
              fontSize: "text-4xl lg:text-5xl",
              fontFamily: "font-sans",
              fontWeight: "font-bold",
              color: "text-glamlink-purple",
            }}
          >
            {businessName}
          </TypographyWrapper>
          {businessTitle && (
            <TypographyWrapper
              as="p"
              settings={businessTitleTypography}
              className="mt-4"
              defaultSettings={{
                fontSize: "text-xl",
                fontFamily: "font-sans",
                fontWeight: "font-normal",
                color: "text-gray-600",
              }}
            >
              {businessTitle}
            </TypographyWrapper>
          )}
          {businessTitle2 && (
            <TypographyWrapper
              as="p"
              settings={businessTitle2Typography}
              className="mt-2"
              defaultSettings={{
                fontSize: "text-2xl",
                fontFamily: "font-sans",
                fontWeight: "font-medium",
                color: "text-gray-900",
              }}
            >
              {businessTitle2}
            </TypographyWrapper>
          )}
        </div>

        {quoteOverImage && quote && (hasImage || hasVideo) ? (
          // Full-width media with quote card overlay layout
          <>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl aspect-[3/2]">
                {renderMedia()}

                {/* Quote Card Overlay - positioned at bottom */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center p-8">
                  <div
                    className={`rounded-xl p-6 relative max-w-md shadow-2xl backdrop-blur-sm ${quoteBgClassName?.startsWith("#") || quoteBgClassName === "transparent" || !quoteBgClassName || quoteBgClassName.trim() === "" ? "" : quoteBgClassName}`}
                    style={{
                      ...quoteBgStyle,
                      ...(quoteBgClassName?.startsWith("#") ? { background: quoteBgClassName } : {}),
                      ...(quoteBgClassName === "transparent" ? { background: "transparent" } : {}),
                    }}
                  >
                    <div className={`${quoteMarkClasses} top-2 left-2`}>"</div>
                    <TypographyWrapper
                      as="blockquote"
                      settings={quoteTypography}
                      className="pl-2 sm:pl-6 md:pl-8 pr-2 sm:pr-4"
                      defaultSettings={{
                        fontSize: "text-lg",
                        fontFamily: "font-serif",
                        fontWeight: "font-normal",
                        fontStyle: "italic",
                        color: "text-gray-800",
                      }}
                    >
                      {quote}
                    </TypographyWrapper>
                    {quoteAuthor && (
                      <TypographyWrapper
                        as="p"
                        settings={quoteAuthorTypography}
                        className="mt-3"
                        defaultSettings={{
                          fontSize: "text-base",
                          fontFamily: "font-sans",
                          fontWeight: "font-normal",
                          color: "text-gray-600",
                          alignment: "left",
                        }}
                      >
                        — {quoteAuthor}
                      </TypographyWrapper>
                    )}
                    <div className={`${quoteMarkClasses} bottom-2 right-2`}>"</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Card below the image if it exists */}
            {(hasContent(bio) || hasTextContent(bioTitle)) && (
              <div className="mt-8 max-w-3xl mx-auto">
                <div
                  className={`${bioBgClassName?.startsWith("#") || bioBgClassName === "transparent" || !bioBgClassName || bioBgClassName.trim() === "" ? "" : "rounded-xl shadow-lg p-6 relative overflow-hidden "}${bioBgClassName || ""}`}
                  style={{
                    ...bioBgStyle,
                    ...(bioBgClassName?.startsWith("#") ? { background: bioBgClassName } : {}),
                    ...(bioBgClassName === "transparent" ? { background: "transparent" } : {}),
                  }}
                >
                  <div className="absolute top-0 right-0 text-gray-100 text-8xl opacity-50">◆</div>
                  {renderBioTitle()}
                  {hasContent(bio) && bio && <div className="rich-content text-gray-700 leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: bio }} />}
                </div>
              </div>
            )}
          </>
        ) : (
          // Original two-column layout
          <div className={`grid gap-8 items-center ${hasContent(bio) || quote ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
            {/* Left side - Media only */}
            <div className="relative">{(hasImage || hasVideo) && <div className={`relative rounded-lg overflow-hidden shadow-xl ${!isVideoPlaying ? "aspect-[4/3]" : ""} ${!hasContent(bio) && !quote ? "max-w-2xl mx-auto" : ""}`}>{renderMedia()}</div>}</div>

            {/* Right side - Bio and Quote (only show if at least one has content) */}
            {(hasContent(bio) || quote) && (
              <div className="space-y-6">
                {/* Bio Card - only show if bio or bioTitle exists */}
                {(hasContent(bio) || hasTextContent(bioTitle)) && (
                  <div
                    className={`${bioBgClassName?.startsWith("#") || bioBgClassName === "transparent" || !bioBgClassName || bioBgClassName.trim() === "" ? "" : "rounded-xl shadow-lg p-6 relative overflow-hidden "}${bioBgClassName || ""}`}
                    style={{
                      ...bioBgStyle,
                      ...(bioBgClassName?.startsWith("#") ? { background: bioBgClassName } : {}),
                      ...(bioBgClassName === "transparent" ? { background: "transparent" } : {}),
                    }}
                  >
                    <div className="absolute top-0 right-0 text-gray-100 text-8xl opacity-50">◆</div>
                    {renderBioTitle()}
                    {hasContent(bio) && bio && <div className="text-gray-700 leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: bio }} />}
                  </div>
                )}

                {/* Quote Box - only show if quote exists and not overlaid on image */}
                {quote && !quoteOverImage && (
                  <div
                    className={`rounded-xl p-6 relative ${quoteBgClassName?.startsWith("#") || quoteBgClassName === "transparent" || !quoteBgClassName || quoteBgClassName.trim() === "" ? "" : quoteBgClassName}`}
                    style={{
                      ...quoteBgStyle,
                      ...(quoteBgClassName?.startsWith("#") ? { background: quoteBgClassName } : {}),
                      ...(quoteBgClassName === "transparent" ? { background: "transparent" } : {}),
                    }}
                  >
                    <div className={`${quoteMarkClasses} top-2 left-2`}>"</div>
                    <TypographyWrapper
                      as="blockquote"
                      settings={quoteTypography}
                      className="pl-2 sm:pl-6 md:pl-8 pr-2 sm:pr-4"
                      defaultSettings={{
                        fontSize: "text-lg",
                        fontFamily: "font-serif",
                        fontWeight: "font-normal",
                        fontStyle: "italic",
                        color: "text-gray-800",
                      }}
                    >
                      {quote}
                    </TypographyWrapper>
                    {quoteAuthor && (
                      <TypographyWrapper
                        as="p"
                        settings={quoteAuthorTypography}
                        className="mt-3"
                        defaultSettings={{
                          fontSize: "text-base",
                          fontFamily: "font-sans",
                          fontWeight: "font-normal",
                          color: "text-gray-600",
                          alignment: "left",
                        }}
                      >
                        — {quoteAuthor}
                      </TypographyWrapper>
                    )}
                    <div className={`${quoteMarkClasses} bottom-2 right-2`}>"</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
