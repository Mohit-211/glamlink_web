"use client";

import { useState, useEffect } from "react";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

// =============================================================================
// THUMBNAIL CACHE - Persists across re-renders to prevent repeated video loads
// =============================================================================

// Global cache for video thumbnails - keyed by video URL + frame time
const thumbnailCache = new Map<string, string>();

/**
 * Get cache key for a video thumbnail
 */
function getThumbnailCacheKey(url: string, frameTime: number): string {
  return `${url}:${frameTime}`;
}

/**
 * Get proxied URL for Firebase Storage videos to bypass CORS for canvas capture
 */
function getProxiedVideoUrl(url: string): string {
  if (url.includes('firebasestorage.googleapis.com')) {
    return `/api/magazine/video-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// =============================================================================
// COMPONENT
// =============================================================================

export interface ThumbnailWithPlayButtonProps {
  item: GalleryItem;
  hideCaption?: boolean;
  capturedVideoFrame?: number; // -1 = use existing thumbnail, 0+ = capture at this second
  displayFullWidth?: boolean;
  onPlay?: () => void;
}

/**
 * Displays a thumbnail (video first frame or image) with a centered play button overlay.
 * Captures video frames at the specified time for use as thumbnails.
 */
export default function ThumbnailWithPlayButton({
  item,
  hideCaption = false,
  capturedVideoFrame = 1,
  displayFullWidth = false,
  onPlay
}: ThumbnailWithPlayButtonProps) {
  // Stable references for effect dependencies
  const itemUrl = item.url || '';
  const itemType = item.type;
  const itemThumbnail = item.thumbnail;

  // Check cache for existing thumbnail - use as initial state
  const cacheKey = getThumbnailCacheKey(itemUrl, capturedVideoFrame);
  const cachedThumbnail = thumbnailCache.get(cacheKey);

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(cachedThumbnail || null);
  const [isLoading, setIsLoading] = useState(!cachedThumbnail);

  // Check if this gallery item has a user-selected thumbnail (from VideoThumbnailSelector)
  // thumbnailFrameTime >= 0 means video frame selection, -2 means custom uploaded image
  const thumbnailFrameTime = (item as any).thumbnailFrameTime;
  const hasUserSelectedThumbnail = !!(itemThumbnail && thumbnailFrameTime !== undefined && thumbnailFrameTime !== null);

  // For videos, capture the specified frame as thumbnail
  useEffect(() => {
    // If user has explicitly selected a thumbnail, use it directly
    if (hasUserSelectedThumbnail && itemThumbnail) {
      setThumbnailUrl(itemThumbnail);
      setIsLoading(false);
      return;
    }

    // Skip if we already have a cached thumbnail for this exact cache key
    const existingCache = thumbnailCache.get(cacheKey);
    if (existingCache) {
      setThumbnailUrl(existingCache);
      setIsLoading(false);
      return;
    }

    // Track if this effect has been cancelled (cleanup ran)
    let isCancelled = false;
    let videoElement: HTMLVideoElement | null = null;
    let blobUrl: string | null = null;

    // Reset loading state when starting a new load
    setIsLoading(true);

    if (itemType === 'video') {
      // If capturedVideoFrame is -1, use existing thumbnail without capture
      if (capturedVideoFrame < 0) {
        if (!isCancelled) {
          setThumbnailUrl(itemThumbnail || null);
          setIsLoading(false);
        }
        return;
      }

      // Helper to set up video element and capture frame
      const setupVideoCapture = (videoSrc: string) => {
        videoElement = document.createElement('video');
        videoElement.crossOrigin = 'anonymous';
        videoElement.src = videoSrc;
        videoElement.muted = true;
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
          if (isCancelled || !videoElement) return;
          // Seek to the specified frame time (clamped to video duration)
          const seekTime = Math.min(capturedVideoFrame, videoElement.duration - 0.1);
          videoElement.currentTime = Math.max(0.1, seekTime);
        };

        videoElement.onseeked = () => {
          if (isCancelled || !videoElement) return;
          try {
            // Check for valid video dimensions before capture
            if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
              const canvas = document.createElement('canvas');
              canvas.width = videoElement.videoWidth;
              canvas.height = videoElement.videoHeight;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(videoElement, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                // Cache the thumbnail for future renders
                thumbnailCache.set(cacheKey, dataUrl);
                setThumbnailUrl(dataUrl);
              } else {
                // Canvas context failed, use fallback
                setThumbnailUrl(itemThumbnail || null);
              }
            } else {
              // Invalid dimensions, use fallback thumbnail
              console.warn('Video dimensions are 0, falling back to thumbnail');
              setThumbnailUrl(itemThumbnail || null);
            }
          } catch (e) {
            // CORS or other error - use original thumbnail or placeholder
            console.warn('Failed to capture video frame:', e);
            setThumbnailUrl(itemThumbnail || null);
          }
          setIsLoading(false);
        };

        videoElement.onerror = () => {
          if (isCancelled) return;
          console.warn('Video load error, falling back to thumbnail');
          setThumbnailUrl(itemThumbnail || null);
          setIsLoading(false);
        };

        // Start loading
        videoElement.load();
      };

      // Check if we need to use the proxy (Firebase Storage URLs)
      if (itemUrl.includes('firebasestorage.googleapis.com')) {
        // Fetch the video as a blob with credentials, then create object URL
        const proxiedUrl = getProxiedVideoUrl(itemUrl);
        fetch(proxiedUrl, { credentials: 'include' })
          .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.blob();
          })
          .then(blob => {
            if (isCancelled) return;
            blobUrl = URL.createObjectURL(blob);
            setupVideoCapture(blobUrl);
          })
          .catch(err => {
            if (isCancelled) return;
            console.warn('Failed to fetch proxied video, falling back to thumbnail:', err);
            setThumbnailUrl(itemThumbnail || null);
            setIsLoading(false);
          });
      } else {
        // Non-Firebase URL, use directly
        setupVideoCapture(itemUrl);
      }
    } else {
      // For images, use the URL directly
      if (!isCancelled) {
        setThumbnailUrl(itemUrl || (item as any).src || null);
        setIsLoading(false);
      }
    }

    // Cleanup function - prevents state updates after unmount and stops video loading
    return () => {
      isCancelled = true;
      if (videoElement) {
        videoElement.onloadedmetadata = null;
        videoElement.onseeked = null;
        videoElement.onerror = null;
        videoElement.src = '';
        videoElement.load(); // Abort any pending load
        videoElement = null;
      }
      // Revoke the blob URL to free memory
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
      }
    };
  }, [cacheKey, hasUserSelectedThumbnail, itemThumbnail]); // Re-run when cache key or user selection changes

  const displayText = item.caption || item.title;

  // Container classes based on displayFullWidth
  const containerClass = displayFullWidth
    ? "relative w-full"
    : "relative w-full flex justify-center";

  const imageContainerClass = displayFullWidth
    ? "relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer group w-full min-h-[200px]"
    : "relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer group min-h-[200px]";

  const imageClass = displayFullWidth
    ? "w-full h-auto object-cover min-h-[200px] max-h-[800px]"
    : "max-h-[800px] w-auto h-auto object-contain min-h-[200px]";

  // Check if thumbnail is a valid, non-empty data URL or regular URL
  const hasValidThumbnail = thumbnailUrl && thumbnailUrl.length > 50; // data URLs are long

  return (
    <div className="thumbnail-with-play-button">
      {/* Caption above image (if not hidden) */}
      {!hideCaption && displayText && (
        <div className="mb-3 text-center">
          <h3 className="text-lg font-semibold text-gray-900">{displayText}</h3>
        </div>
      )}

      {/* Image/Thumbnail with Play Button Overlay */}
      <div className={containerClass}>
        <div
          className={imageContainerClass}
          onClick={onPlay}
        >
          {isLoading ? (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : hasValidThumbnail ? (
            <img
              src={thumbnailUrl}
              alt={item.title || item.caption || "Gallery item"}
              className={imageClass}
              onError={(e) => {
                // If image fails to load, hide it so fallback shows
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-gray-500 text-sm">Click to play video</span>
              </div>
            </div>
          )}

          {/* Centered Play Button Overlay - using left:50% and transform for true centering */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-200">
              {/* Play Triangle - centered with slight offset for visual balance */}
              <svg
                className="w-7 h-7 text-gray-700"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginLeft: '2px' }}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
