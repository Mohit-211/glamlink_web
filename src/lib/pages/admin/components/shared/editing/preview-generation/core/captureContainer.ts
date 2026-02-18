'use client';

/**
 * Capture Container
 *
 * Captures a DOM container as a canvas using html2canvas.
 */

import html2canvas from 'html2canvas';
import type { RenderDimensions, ProgressCallback } from '../types';
import { HTML2CANVAS_SCALE, IMAGE_WAIT_MS } from '../image-processing/constants';
import { processImages } from '../image-processing/processImages';

// =============================================================================
// TYPES
// =============================================================================

export interface CaptureOptions {
  /** Scale factor for html2canvas (default: 2) */
  scale?: number;
  /** Whether to process images before capture (default: true) */
  processImagesBeforeCapture?: boolean;
  /** CSS classes to add during capture (will be removed after) */
  captureClasses?: string[];
  /** html2canvas ignore elements callback */
  ignoreElements?: (element: Element) => boolean;
  /** html2canvas onclone callback */
  onClone?: (clonedDoc: Document) => void;
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

/**
 * Capture a container element as a canvas
 *
 * Processes images (Firebase proxy, base64 conversion) and captures
 * with html2canvas.
 *
 * @param container - DOM element to capture
 * @param dimensions - Width and height for capture
 * @param backgroundColor - Background color for canvas
 * @param onProgress - Optional progress callback
 * @param options - Additional capture options
 * @returns The captured canvas element
 */
export async function captureContainer(
  container: HTMLDivElement,
  dimensions: RenderDimensions,
  backgroundColor: string,
  onProgress?: ProgressCallback,
  options: CaptureOptions = {}
): Promise<HTMLCanvasElement> {
  const {
    scale = HTML2CANVAS_SCALE,
    processImagesBeforeCapture = true,
    captureClasses = ['pdf-capture-mode'],
    ignoreElements,
    onClone,
  } = options;

  // Process images (proxy Firebase URLs, convert to base64)
  if (processImagesBeforeCapture) {
    onProgress?.('Processing images...');
    await processImages(container, onProgress);

    // Wait for images to update in DOM
    await new Promise(resolve => setTimeout(resolve, IMAGE_WAIT_MS));
  }

  // Add capture classes (e.g., to hide link hotspots)
  captureClasses.forEach(cls => container.classList.add(cls));

  try {
    // Capture with html2canvas
    onProgress?.('Capturing canvas...');

    const canvas = await html2canvas(container, {
      scale,
      useCORS: false,
      allowTaint: false,
      logging: false,
      backgroundColor,
      width: dimensions.width,
      height: dimensions.height,
      windowWidth: dimensions.width,
      foreignObjectRendering: false,
      imageTimeout: 0,
      ignoreElements,
      onclone: onClone,
    });

    return canvas;
  } finally {
    // Remove capture classes after capture
    captureClasses.forEach(cls => container.classList.remove(cls));
  }
}

/**
 * Capture container and return as data URL
 */
export async function captureContainerAsDataUrl(
  container: HTMLDivElement,
  dimensions: RenderDimensions,
  backgroundColor: string,
  onProgress?: ProgressCallback,
  options: CaptureOptions = {}
): Promise<string> {
  const canvas = await captureContainer(
    container,
    dimensions,
    backgroundColor,
    onProgress,
    options
  );

  return canvas.toDataURL('image/png');
}
