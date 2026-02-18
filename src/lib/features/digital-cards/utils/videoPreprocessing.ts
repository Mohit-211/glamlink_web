/**
 * Video Preprocessing Utilities
 *
 * Handles video frame capture, thumbnail extraction, and placeholder generation
 * for condensed card preview generation. Addresses the issue where html2canvas
 * cannot capture iframe/video elements.
 *
 * Phase 2 of Condensed Card Preview Enhancement
 */

// =============================================================================
// TYPES
// =============================================================================

export interface VideoFrameResult {
  dataUrl: string;
  success: boolean;
  error?: string;
  width?: number;
  height?: number;
}

export type VideoType = 'youtube' | 'vimeo' | 'direct';

// =============================================================================
// VIDEO TYPE DETECTION
// =============================================================================

/**
 * Detect video type from URL
 */
export function detectVideoType(url: string): VideoType {
  if (!url) return 'direct';

  const urlLower = url.toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  }

  if (urlLower.includes('vimeo.com')) {
    return 'vimeo';
  }

  return 'direct';
}

// =============================================================================
// YOUTUBE THUMBNAIL EXTRACTION
// =============================================================================

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
}

/**
 * Get YouTube thumbnail URL
 * Tries maxresdefault first, falls back to hqdefault
 */
export async function getYouTubeThumbnailUrl(url: string): Promise<VideoFrameResult> {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return {
      success: false,
      error: 'Invalid YouTube URL',
      dataUrl: '',
    };
  }

  // Try maxresdefault (1280x720)
  const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
    const response = await fetch(maxResUrl);
    if (response.ok) {
      const blob = await response.blob();
      const dataUrl = await blobToDataUrl(blob);
      return {
        success: true,
        dataUrl,
        width: 1280,
        height: 720,
      };
    }
  } catch (err) {
    console.warn('Failed to fetch maxresdefault, trying hqdefault:', err);
  }

  // Fallback to hqdefault (480x360)
  const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const response = await fetch(hqUrl);
    if (response.ok) {
      const blob = await response.blob();
      const dataUrl = await blobToDataUrl(blob);
      return {
        success: true,
        dataUrl,
        width: 480,
        height: 360,
      };
    }
  } catch (err) {
    return {
      success: false,
      error: 'Failed to fetch YouTube thumbnail',
      dataUrl: '',
    };
  }

  return {
    success: false,
    error: 'YouTube thumbnail not available',
    dataUrl: '',
  };
}

// =============================================================================
// VIMEO THUMBNAIL EXTRACTION
// =============================================================================

/**
 * Extract Vimeo video ID from URL
 */
export function extractVimeoVideoId(url: string): string | null {
  if (!url) return null;

  // vimeo.com/VIDEO_ID or vimeo.com/channels/*/VIDEO_ID
  const match = url.match(/vimeo\.com\/(?:channels\/[^/]+\/)?(\d+)/);
  return match ? match[1] : null;
}

/**
 * Get Vimeo thumbnail URL via oembed API
 */
export async function getVimeoThumbnailUrl(url: string): Promise<VideoFrameResult> {
  const videoId = extractVimeoVideoId(url);

  if (!videoId) {
    return {
      success: false,
      error: 'Invalid Vimeo URL',
      dataUrl: '',
    };
  }

  try {
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error('Vimeo API request failed');
    }

    const data = await response.json();
    let thumbnailUrl = data.thumbnail_url;

    if (!thumbnailUrl) {
      throw new Error('No thumbnail in Vimeo response');
    }

    // Upgrade to higher quality: replace _640 with _1280
    thumbnailUrl = thumbnailUrl.replace('_640', '_1280');

    // Fetch the thumbnail and convert to data URL
    const imgResponse = await fetch(thumbnailUrl);
    if (!imgResponse.ok) {
      throw new Error('Failed to fetch Vimeo thumbnail image');
    }

    const blob = await imgResponse.blob();
    const dataUrl = await blobToDataUrl(blob);

    return {
      success: true,
      dataUrl,
      width: data.width || 1280,
      height: data.height || 720,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch Vimeo thumbnail',
      dataUrl: '',
    };
  }
}

// =============================================================================
// DIRECT VIDEO FRAME CAPTURE
// =============================================================================

/**
 * Check if URL is a Firebase Storage URL
 */
function isFirebaseVideoUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com');
}

/**
 * Get proxied URL for Firebase Storage videos
 */
function getProxiedVideoUrl(url: string): string {
  if (isFirebaseVideoUrl(url)) {
    return `/api/magazine/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Capture video frame at t=0 seconds
 * Uses proxy for Firebase Storage videos to avoid CORS issues
 */
export async function captureVideoFrame(videoUrl: string): Promise<VideoFrameResult> {
  // Use proxy for Firebase videos
  const fetchUrl = getProxiedVideoUrl(videoUrl);
  const isProxied = fetchUrl !== videoUrl;

  if (isProxied) {
    console.log('📹 Using proxy for Firebase video thumbnail');
  }

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.style.position = 'absolute';
    video.style.left = '-9999px';
    video.style.top = '0';

    let timeoutId: NodeJS.Timeout;
    let resolved = false;

    const cleanup = () => {
      clearTimeout(timeoutId);
      video.remove();
    };

    const resolveOnce = (result: VideoFrameResult) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(result);
    };

    // 10 second timeout
    timeoutId = setTimeout(() => {
      console.warn('Video load timeout:', videoUrl);
      resolveOnce({
        success: false,
        error: 'Video load timeout (10s)',
        dataUrl: '',
      });
    }, 10000);

    // Handle errors
    video.onerror = (err) => {
      console.warn('Video load error:', videoUrl, err);
      resolveOnce({
        success: false,
        error: 'Failed to load video',
        dataUrl: '',
      });
    };

    // Wait for metadata to load
    video.onloadedmetadata = () => {
      // Seek to beginning
      video.currentTime = 0;
    };

    // Capture frame when seeked to t=0
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolveOnce({
            success: false,
            error: 'Failed to get canvas context',
            dataUrl: '',
          });
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        resolveOnce({
          success: true,
          dataUrl,
          width: video.videoWidth,
          height: video.videoHeight,
        });
      } catch (err) {
        console.error('Failed to capture video frame:', err);
        resolveOnce({
          success: false,
          error: 'Failed to capture frame',
          dataUrl: '',
        });
      }
    };

    // Append to body and set src
    document.body.appendChild(video);
    video.src = fetchUrl;
    video.load();
  });
}

// =============================================================================
// MAIN ORCHESTRATOR
// =============================================================================

/**
 * Get video thumbnail/frame based on video type
 */
export async function getVideoThumbnail(url: string): Promise<VideoFrameResult> {
  if (!url) {
    return {
      success: false,
      error: 'No video URL provided',
      dataUrl: '',
    };
  }

  const videoType = detectVideoType(url);

  console.log(`Processing ${videoType} video:`, url);

  try {
    switch (videoType) {
      case 'youtube':
        return await getYouTubeThumbnailUrl(url);

      case 'vimeo':
        return await getVimeoThumbnailUrl(url);

      case 'direct':
        return await captureVideoFrame(url);

      default:
        return {
          success: false,
          error: 'Unknown video type',
          dataUrl: '',
        };
    }
  } catch (err) {
    console.error('Video thumbnail extraction failed:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      dataUrl: '',
    };
  }
}

// =============================================================================
// VIDEO PLACEHOLDER GENERATION
// =============================================================================

/**
 * Create video placeholder (gray box with play icon)
 */
export function createVideoPlaceholder(width: number = 640, height: number = 360): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Gray background
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(0, 0, width, height);

  // Play icon (triangle)
  const centerX = width / 2;
  const centerY = height / 2;
  const iconSize = Math.min(width, height) * 0.2;

  ctx.fillStyle = '#6b7280';
  ctx.beginPath();
  ctx.moveTo(centerX - iconSize / 2, centerY - iconSize / 2);
  ctx.lineTo(centerX + iconSize / 2, centerY);
  ctx.lineTo(centerX - iconSize / 2, centerY + iconSize / 2);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = '#6b7280';
  ctx.font = `${Math.floor(height * 0.08)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Video Preview', centerX, centerY + iconSize);

  return canvas.toDataURL('image/png');
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert Blob to Data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Extract video URL from video element or iframe
 */
export function extractVideoUrl(element: HTMLVideoElement | HTMLIFrameElement): string | null {
  if (element.tagName === 'VIDEO') {
    return (element as HTMLVideoElement).src || (element as HTMLVideoElement).currentSrc;
  }

  if (element.tagName === 'IFRAME') {
    return (element as HTMLIFrameElement).src;
  }

  return null;
}

/**
 * Generate unique ID for video element
 */
export function generateVideoId(element: HTMLVideoElement | HTMLIFrameElement, index: number): string {
  const url = extractVideoUrl(element);
  if (url) {
    // Use URL hash
    return `video-${btoa(url).substring(0, 12)}-${index}`;
  }
  return `video-${index}`;
}
