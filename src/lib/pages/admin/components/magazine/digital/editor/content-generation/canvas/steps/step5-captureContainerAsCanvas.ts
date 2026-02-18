/**
 * Step 5: Capture Container as Canvas
 *
 * Process images and capture container with html2canvas.
 */

import html2canvas from 'html2canvas';
import type { RenderDimensions } from './step2-calculateRenderDimensions';
import {
  HTML2CANVAS_SCALE,
  IMAGE_WAIT_MS,
  processImages,
} from '../../shared';

/**
 * Process images and capture container with html2canvas
 */
export async function captureContainerAsCanvas(
  container: HTMLDivElement,
  dimensions: RenderDimensions,
  backgroundColor: string,
  onProgress?: (message: string) => void
): Promise<HTMLCanvasElement> {
  // Process images (proxy Firebase URLs, convert to base64)
  onProgress?.('Processing images...');
  await processImages(container, onProgress);

  // Wait for images to update in DOM
  await new Promise(resolve => setTimeout(resolve, IMAGE_WAIT_MS));

  // Add pdf-capture-mode class to hide link hotspots during capture
  // This ensures link objects are invisible in the final PDF
  container.classList.add('pdf-capture-mode');

  // Capture with html2canvas
  onProgress?.('Capturing canvas...');
  const canvas = await html2canvas(container, {
    scale: HTML2CANVAS_SCALE,
    useCORS: false,
    allowTaint: false,
    logging: false,
    backgroundColor: backgroundColor,
    width: dimensions.renderWidth,
    height: dimensions.renderHeight,
    windowWidth: dimensions.renderWidth,
    foreignObjectRendering: false,
    imageTimeout: 0,
  });

  // Remove pdf-capture-mode class after capture
  container.classList.remove('pdf-capture-mode');

  return canvas;
}
