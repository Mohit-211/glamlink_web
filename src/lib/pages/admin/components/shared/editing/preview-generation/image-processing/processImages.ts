/**
 * Image Processing for Canvas Capture
 *
 * Functions for processing images in DOM elements before html2canvas capture.
 * Handles Firebase Storage URL proxying and base64 conversion.
 */

import type { ProgressCallback } from '../types';
import { IMAGE_PROXY_ENDPOINT, IMAGE_LOAD_TIMEOUT_MS } from './constants';
import { blobToBase64, isFirebaseUrl, waitForImageLoad } from './imageUtils';

// =============================================================================
// SINGLE IMAGE PROCESSING
// =============================================================================

/**
 * Proxy a single Firebase Storage image and convert to base64
 * Returns the base64 data URL or null if failed
 */
export async function proxyFirebaseImage(url: string): Promise<string | null> {
  if (!isFirebaseUrl(url)) {
    return null;
  }

  try {
    const proxyUrl = `${IMAGE_PROXY_ENDPOINT}?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      console.warn(`Failed to proxy image: ${url}`);
      return null;
    }

    const blob = await response.blob();
    return blobToBase64(blob);
  } catch (error) {
    console.warn(`Error proxying image ${url}:`, error);
    return null;
  }
}

// =============================================================================
// BATCH IMAGE PROCESSING
// =============================================================================

/**
 * Process all images in an element - proxy Firebase images and convert to base64
 *
 * This is necessary for html2canvas to properly capture images without CORS issues.
 * IMPORTANT: Waits for each image to actually load before proceeding.
 *
 * @param element - DOM element containing images to process
 * @param onProgress - Optional progress callback
 */
export async function processImages(
  element: HTMLElement,
  onProgress?: ProgressCallback
): Promise<void> {
  const images = element.querySelectorAll('img');
  const totalImages = images.length;

  if (totalImages === 0) return;

  onProgress?.(`Processing ${totalImages} image(s)...`);

  for (let i = 0; i < images.length; i++) {
    const img = images[i] as HTMLImageElement;
    const originalSrc = img.src;

    // Skip empty or already base64 images
    if (!originalSrc || originalSrc.startsWith('data:')) {
      continue;
    }

    try {
      // Determine fetch URL - proxy Firebase images
      let fetchUrl = originalSrc;
      if (isFirebaseUrl(originalSrc)) {
        fetchUrl = `${IMAGE_PROXY_ENDPOINT}?url=${encodeURIComponent(originalSrc)}`;
      }

      // Fetch and convert to base64
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch image: ${originalSrc}`);
        continue;
      }

      const blob = await response.blob();
      const base64 = await blobToBase64(blob);

      // Set new src
      img.src = base64;

      // CRITICAL: Wait for image to actually load
      await waitForImageLoad(img, IMAGE_LOAD_TIMEOUT_MS);

      onProgress?.(`Loaded image ${i + 1}/${totalImages}`);
    } catch (error) {
      console.warn(`Error processing image ${originalSrc}:`, error);
    }
  }
}

/**
 * Process images in batches to avoid overwhelming the browser
 *
 * @param element - DOM element containing images
 * @param batchSize - Number of images to process concurrently
 * @param onProgress - Optional progress callback
 */
export async function processImagesInBatches(
  element: HTMLElement,
  batchSize: number = 5,
  onProgress?: ProgressCallback
): Promise<void> {
  const images = Array.from(element.querySelectorAll('img')) as HTMLImageElement[];
  const totalImages = images.length;

  if (totalImages === 0) return;

  onProgress?.(`Processing ${totalImages} image(s) in batches...`);

  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (img, batchIndex) => {
        const originalSrc = img.src;

        if (!originalSrc || originalSrc.startsWith('data:')) {
          return;
        }

        try {
          let fetchUrl = originalSrc;
          if (isFirebaseUrl(originalSrc)) {
            fetchUrl = `${IMAGE_PROXY_ENDPOINT}?url=${encodeURIComponent(originalSrc)}`;
          }

          const response = await fetch(fetchUrl);
          if (!response.ok) return;

          const blob = await response.blob();
          const base64 = await blobToBase64(blob);

          img.src = base64;
          await waitForImageLoad(img, IMAGE_LOAD_TIMEOUT_MS);
        } catch (error) {
          console.warn(`Error processing image:`, error);
        }
      })
    );

    const processed = Math.min(i + batchSize, totalImages);
    onProgress?.(`Loaded ${processed}/${totalImages} images`);
  }
}
