/**
 * Shared Image Preprocessing Utility
 *
 * Consolidates the 5-step preprocessing pipeline used by both:
 * - useCardShare.ts (for public /for-professionals pages)
 * - useCondensedCardPreview.ts (for admin condensed card preview)
 *
 * Pipeline Steps:
 * 1. Clone the live element
 * 2. Process videos (extract thumbnails from live element)
 * 3. Process maps (capture static map images)
 * 4. Convert Firebase images to base64
 * 5. Clean up problematic elements (canvases, gradient elements, Google Maps remnants)
 */

import {
  isFirebaseUrl,
  fetchImageAsBase64,
} from '@/lib/pages/admin/components/shared/editing/preview-generation';
import {
  getVideoThumbnail,
  createVideoPlaceholder,
  extractVideoUrl,
  generateVideoId,
} from './videoPreprocessing';
import {
  processAllMaps,
  replaceMapsInClone,
  removeAllMapElements,
} from './mapPreprocessing';

// =============================================================================
// TYPES
// =============================================================================

export interface PreprocessingProgress {
  current: number;
  total: number;
}

export interface PreprocessOptions {
  /** Remove action buttons marked with data-export-exclude */
  removeActionButtons?: boolean;
  /** Callback for progress updates */
  onProgress?: (step: string, progress?: PreprocessingProgress) => void;
}

export interface PreprocessResult {
  /** The preprocessed DOM element ready for image capture */
  element: HTMLElement;
  /** Number of videos processed */
  videosProcessed: number;
  /** Number of maps processed */
  mapsProcessed: number;
  /** Number of Firebase images converted */
  imagesConverted: number;
  /** Number of problematic elements removed */
  elementsRemoved: number;
}

// =============================================================================
// MAIN PREPROCESSING FUNCTION
// =============================================================================

/**
 * Preprocess an HTML element for image export.
 *
 * This function:
 * 1. Clones the live element
 * 2. Removes action buttons if specified
 * 3. Extracts video thumbnails from the LIVE element and replaces videos in clone
 * 4. Captures map screenshots from the LIVE element and replaces maps in clone
 * 5. Converts Firebase Storage image URLs to base64 data URLs
 * 6. Removes problematic elements (zero-dimension canvases, gradient elements)
 *
 * @param liveElement - The live DOM element to preprocess
 * @param options - Preprocessing options
 * @returns PreprocessResult with the ready-to-capture element and stats
 */
export async function preprocessForImageExport(
  liveElement: HTMLElement,
  options: PreprocessOptions = {}
): Promise<PreprocessResult> {
  const { removeActionButtons = true, onProgress } = options;

  let videosProcessed = 0;
  let mapsProcessed = 0;
  let imagesConverted = 0;
  let elementsRemoved = 0;

  // ========================================================================
  // STEP 1: Clone the element for preprocessing
  // ========================================================================
  onProgress?.('Preparing preview...');
  console.log('📋 Cloning element for preprocessing...');
  const element = liveElement.cloneNode(true) as HTMLElement;

  // ========================================================================
  // STEP 2: Remove action buttons from export (optional)
  // ========================================================================
  if (removeActionButtons) {
    console.log('🔘 Removing action buttons from export...');

    // Remove elements marked with data-export-exclude attribute
    const excludedElements = element.querySelectorAll('[data-export-exclude="true"]');
    excludedElements.forEach(el => {
      el.remove();
      elementsRemoved++;
      console.log('  Removed excluded element');
    });

    // Also remove by class pattern as fallback
    const actionButtons = element.querySelector('.absolute.top-6.right-6');
    if (actionButtons) {
      actionButtons.remove();
      elementsRemoved++;
      console.log('  Removed action buttons by class');
    }

    // Remove buttons that are for actions (not part of the card content like "Book Now")
    const allButtons = element.querySelectorAll('button');
    allButtons.forEach(btn => {
      const isActionButton =
        btn.title === 'Copy card URL' ||
        btn.title === 'Save as image' ||
        btn.title === 'Close';
      if (isActionButton) {
        btn.remove();
        elementsRemoved++;
      }
    });
  }

  // ========================================================================
  // STEP 3: Process videos (extract thumbnails from LIVE element first)
  // ========================================================================
  onProgress?.('Extracting video frames...');
  console.log('📹 Processing videos...');

  const liveVideoElements = liveElement.querySelectorAll('video, iframe');
  const videoDataMap = new Map<string, string>();
  const videoArray = Array.from(liveVideoElements);

  for (let i = 0; i < videoArray.length; i++) {
    const videoEl = videoArray[i] as HTMLVideoElement | HTMLIFrameElement;
    onProgress?.('Extracting video frames...', { current: i + 1, total: videoArray.length });

    const videoUrl = extractVideoUrl(videoEl);

    if (!videoUrl) {
      console.warn(`  Video ${i + 1}: No URL found`);
      continue;
    }

    const videoId = generateVideoId(videoEl, i);

    try {
      const result = await getVideoThumbnail(videoUrl);
      if (result.success && result.dataUrl) {
        videoDataMap.set(videoId, result.dataUrl);
        videosProcessed++;
        console.log(`  ✓ Video ${i + 1}/${videoArray.length} thumbnail extracted`);
      } else {
        console.warn(`  Video ${i + 1} failed: ${result.error}`);
        const placeholder = createVideoPlaceholder(640, 360);
        videoDataMap.set(videoId, placeholder);
      }
    } catch (err) {
      console.error(`  Video ${i + 1} error:`, err);
      const placeholder = createVideoPlaceholder(640, 360);
      videoDataMap.set(videoId, placeholder);
    }
  }
  console.log(`  Processed ${videoDataMap.size} videos`);

  // Replace videos in cloned element with thumbnails
  const clonedVideos = element.querySelectorAll('video, iframe');
  Array.from(clonedVideos).forEach((videoEl, index) => {
    const videoId = generateVideoId(videoEl as HTMLVideoElement | HTMLIFrameElement, index);
    const dataUrl = videoDataMap.get(videoId);

    if (dataUrl && videoEl.parentElement) {
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      img.style.borderRadius = '8px';
      videoEl.parentElement.replaceChild(img, videoEl);
      console.log(`  ✓ Replaced video ${index + 1} with thumbnail`);
    }
  });

  // ========================================================================
  // STEP 4: Process maps (capture from LIVE element, replace in clone)
  // ========================================================================
  onProgress?.('Capturing map screenshots...');
  console.log('🗺️ Processing maps...');

  const mapDataMap = await processAllMaps(liveElement, (current, total) => {
    onProgress?.('Capturing map screenshots...', { current, total });
    console.log(`  Map ${current}/${total}...`);
  });
  mapsProcessed = mapDataMap.size;
  console.log(`  Captured ${mapDataMap.size} maps`);

  // Replace maps in cloned element
  replaceMapsInClone(element, mapDataMap);

  // Remove any remaining Google Maps elements
  const mapElementsRemoved = removeAllMapElements(element);
  elementsRemoved += mapElementsRemoved;
  console.log(`  Removed ${mapElementsRemoved} remaining map elements`);

  // ========================================================================
  // STEP 5: Force visibility on responsive elements (hidden md:block, etc.)
  // ========================================================================
  console.log('👁️ Forcing visibility on responsive elements...');

  // Find elements with "hidden md:block" or similar responsive visibility classes
  const hiddenElements = element.querySelectorAll('[class*="hidden"][class*="md:block"], [class*="hidden"][class*="lg:block"]');
  hiddenElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    // Remove hidden class and force display
    htmlEl.classList.remove('hidden');
    htmlEl.style.display = 'block';
    console.log(`  ✓ Forced visibility on: ${htmlEl.className.substring(0, 50)}...`);
  });

  // ========================================================================
  // STEP 6: Convert ALL external images to base64 (Firebase, QR codes, etc.)
  // ========================================================================
  onProgress?.('Processing images...');
  console.log('🖼️ Processing external images (Step 6)...');
  const images = element.querySelectorAll('img');

  for (const img of Array.from(images)) {
    const src = img.src;
    // Skip data URLs and empty sources
    if (!src || src.startsWith('data:')) continue;

    // Convert any external URL (Firebase, QuickChart QR codes, etc.) to base64
    const isExternal = src.startsWith('http://') || src.startsWith('https://');
    if (isExternal) {
      try {
        console.log(`  Converting: ${src.substring(0, 60)}...`);
        const dataUrl = await fetchImageAsBase64(src);
        img.src = dataUrl;
        imagesConverted++;
        console.log(`  ✓ Converted to base64`);
      } catch (err) {
        console.warn('  Failed to convert image:', src, err);
        // Set a placeholder for failed images
        img.src =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      }
    }
  }
  console.log(`  Converted ${imagesConverted} external images to base64`);

  // ========================================================================
  // STEP 6: Remove problematic elements for html2canvas/html-to-image
  // ========================================================================
  console.log('🧹 Cleaning up problematic elements...');

  // Remove ALL canvas elements with 0 dimensions
  const allCanvases = element.querySelectorAll('canvas');
  allCanvases.forEach(canvas => {
    if (canvas.width === 0 || canvas.height === 0) {
      console.log(`  🗑️ Removing zero-dimension canvas: ${canvas.width}x${canvas.height}`);
      canvas.remove();
      elementsRemoved++;
    }
  });

  console.log(`✅ Preprocessing complete`);

  return {
    element,
    videosProcessed,
    mapsProcessed,
    imagesConverted,
    elementsRemoved,
  };
}

// =============================================================================
// POST-PROCESSING HELPERS
// =============================================================================

/**
 * Fix gradient elements with small dimensions that cause html2canvas errors.
 * Should be called AFTER the element is appended to the DOM.
 *
 * @param element - The preprocessed element (must be in DOM)
 * @returns Number of elements fixed
 */
export function fixSmallGradientElements(element: HTMLElement): number {
  let fixedCount = 0;

  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => {
    const htmlEl = el as HTMLElement;
    const style = window.getComputedStyle(htmlEl);
    const bgImage = style.backgroundImage;

    if (bgImage && bgImage !== 'none') {
      const hasGradient = bgImage.includes('gradient');
      const hasProblematicUrl = bgImage.includes('data:') || bgImage.includes('blob:');

      if (hasGradient || hasProblematicUrl) {
        const width = htmlEl.offsetWidth;
        const height = htmlEl.offsetHeight;

        if (width < 2 || height < 2) {
          if (hasGradient) {
            if (width < 2) {
              htmlEl.style.minWidth = '20px';
              fixedCount++;
            }
            if (height < 2) {
              htmlEl.style.minHeight = '2px';
              fixedCount++;
            }
            console.log(`🔧 Fixed small gradient element: ${width}x${height} -> min 20x2`);
          } else {
            htmlEl.style.backgroundImage = 'none';
            fixedCount++;
          }
        }
      }
    }
  });

  if (fixedCount > 0) {
    console.log(`🧹 Fixed ${fixedCount} problematic elements`);
  }

  return fixedCount;
}

/**
 * Create a filter function for html-to-image that excludes problematic elements.
 */
export function createImageExportFilter(): (node: Element) => boolean {
  return (node: Element) => {
    if (!node || !node.tagName) return true;

    const tagName = node.tagName.toLowerCase();
    const className = (node as HTMLElement).className || '';

    // Skip Google Maps elements
    if (tagName.includes('gmp-') || tagName.includes('google-map')) {
      console.log('🚫 Filtering out:', tagName);
      return false;
    }
    if (
      typeof className === 'string' &&
      (className.includes('gm-') ||
        className.includes('google-map') ||
        className.includes('gmp-'))
    ) {
      console.log('🚫 Filtering out class:', className);
      return false;
    }

    // Skip zero-dimension canvases
    if (tagName === 'canvas') {
      const canvas = node as HTMLCanvasElement;
      if (canvas.width === 0 || canvas.height === 0) {
        console.log('🚫 Filtering out zero-dim canvas');
        return false;
      }
    }

    return true;
  };
}

/**
 * Create an ignoreElements function for html2canvas.
 */
export function createHtml2CanvasIgnoreElements(): (el: Element) => boolean {
  return (el: Element) => {
    const tagName = el.tagName?.toLowerCase() || '';
    const className = el.className || '';
    const id = el.id || '';
    const htmlEl = el as HTMLElement;

    // Ignore canvas elements with 0 dimensions
    if (tagName === 'canvas') {
      const canvas = el as HTMLCanvasElement;
      if (canvas.width === 0 || canvas.height === 0) {
        console.log('🚫 html2canvas ignoring zero-dimension canvas');
        return true;
      }
    }

    // Ignore elements with gradient backgrounds that have 0 dimensions
    try {
      const style = window.getComputedStyle(htmlEl);
      if (style?.backgroundImage?.includes('gradient')) {
        const width = htmlEl.offsetWidth;
        const height = htmlEl.offsetHeight;
        if (width === 0 || height === 0) {
          console.log('🚫 html2canvas ignoring zero-dimension gradient element');
          return true;
        }
      }
    } catch {
      // Ignore errors from getComputedStyle
    }

    const isMapElement =
      tagName.includes('gmp-') ||
      tagName.includes('google-map') ||
      (typeof className === 'string' &&
        (className.includes('gm-') ||
          className.includes('google-map') ||
          className.includes('gmp-'))) ||
      id.includes('gm-') ||
      id.includes('google-map') ||
      id.includes('gmap');

    if (isMapElement) {
      console.log('🚫 html2canvas ignoring element:', tagName, className);
    }

    return isMapElement;
  };
}

/**
 * Create an onclone callback for html2canvas that cleans up the cloned document.
 */
export function createHtml2CanvasOnClone(): (clonedDoc: Document) => void {
  return (clonedDoc: Document) => {
    console.log('🧬 html2canvas onclone callback - cleaning cloned document');

    // Remove ALL zero-dimension canvases
    const allCanvases = clonedDoc.querySelectorAll('canvas');
    let removedCanvases = 0;
    allCanvases.forEach(canvas => {
      if (canvas.width === 0 || canvas.height === 0) {
        try {
          canvas.remove();
          removedCanvases++;
        } catch {
          // Already removed
        }
      }
    });
    if (removedCanvases > 0) {
      console.log(`🧹 onclone: Removed ${removedCanvases} zero-dimension canvases`);
    }

    // Fix gradient elements with 0 dimensions
    const allElements = clonedDoc.querySelectorAll('*');
    let fixedGradients = 0;
    allElements.forEach(el => {
      try {
        const htmlEl = el as HTMLElement;
        const style = clonedDoc.defaultView?.getComputedStyle(htmlEl);
        if (style?.backgroundImage?.includes('gradient')) {
          const width = htmlEl.offsetWidth;
          const height = htmlEl.offsetHeight;
          if (width === 0 || height === 0) {
            htmlEl.style.backgroundImage = 'none';
            fixedGradients++;
          }
        }
      } catch {
        // Ignore errors
      }
    });
    if (fixedGradients > 0) {
      console.log(`🧹 onclone: Fixed ${fixedGradients} zero-dimension gradient elements`);
    }

    // Remove all Google Maps elements from the cloned document
    const mapSelectors = [
      '[class*="gm-"]',
      '[class*="google-map"]',
      '[id*="gm-"]',
      'gmp-map',
      'google-map',
      '[class*="gmp-"]',
    ];

    let removed = 0;
    for (const selector of mapSelectors) {
      try {
        const elements = clonedDoc.querySelectorAll(selector);
        elements.forEach(el => {
          if (!el.getAttribute('data-replaced-map')) {
            try {
              el.remove();
              removed++;
            } catch {
              // Already removed
            }
          }
        });
      } catch {
        // Invalid selector
      }
    }

    console.log(`🧹 onclone cleanup: Removed ${removed} elements from cloned document`);
  };
}

// =============================================================================
// DOWNLOAD HELPER
// =============================================================================

/**
 * Download a data URL as a PNG file.
 *
 * @param dataUrl - The data URL of the image
 * @param filename - The filename for the download
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
