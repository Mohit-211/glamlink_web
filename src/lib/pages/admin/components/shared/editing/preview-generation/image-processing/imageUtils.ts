/**
 * Image Utility Functions
 *
 * Helper functions for image loading, conversion, and URL handling.
 */

import { IMAGE_PROXY_ENDPOINT } from './constants';

// =============================================================================
// BLOB/BASE64 CONVERSION
// =============================================================================

/**
 * Convert blob to base64 data URL
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// =============================================================================
// IMAGE LOADING
// =============================================================================

/**
 * Load an image from a source URL and return a promise
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    img.src = src;
  });
}

/**
 * Wait for an image element to complete loading with timeout
 * Returns true if loaded, false if timeout
 */
export function waitForImageLoad(
  img: HTMLImageElement,
  timeoutMs: number = 5000
): Promise<boolean> {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (img.complete && img.naturalWidth > 0) {
      resolve(true);
      return;
    }

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn('Image load timeout:', img.src.substring(0, 50));
        resolve(false);
      }
    }, timeoutMs);

    img.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve(true);
      }
    };

    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.warn('Image load error:', img.src.substring(0, 50));
        resolve(false);
      }
    };
  });
}

// =============================================================================
// URL HELPERS
// =============================================================================

/**
 * Check if URL is a Firebase Storage URL
 */
export function isFirebaseUrl(url: string): boolean {
  return url.includes('firebasestorage.googleapis.com');
}

/**
 * Get proxied URL for Firebase Storage images
 */
export function getProxiedUrl(url: string): string {
  if (isFirebaseUrl(url)) {
    return `${IMAGE_PROXY_ENDPOINT}?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// =============================================================================
// FETCH HELPERS
// =============================================================================

/**
 * Fetch image from URL and convert to base64 data URL
 * Uses proxy for Firebase Storage URLs to avoid CORS
 */
export async function fetchImageAsBase64(url: string): Promise<string> {
  const fetchUrl = getProxiedUrl(url);

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();
  return blobToBase64(blob);
}
