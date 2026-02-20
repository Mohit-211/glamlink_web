'use client';

/**
 * Generate Canvas Preview
 *
 * Main orchestration function that uses all steps to generate a canvas preview.
 */

import type { DigitalPageData, DigitalPageType, PagePdfSettings } from '../../../types';
import { getPreviewComponent } from './step1-getPreviewComponent';
import { calculateRenderDimensions } from './step2-calculateRenderDimensions';
import { createOffscreenContainer } from './step3-createOffscreenContainer';
import { renderPreviewToContainer, type CanvasGenerationOptions } from './step4-renderPreviewToContainer';
import { captureContainerAsCanvas } from './step5-captureContainerAsCanvas';
import { cleanupContainer, type ContainerContext } from './step6-cleanupContainer';

/**
 * Generate a canvas preview from page data
 * Orchestrates all steps and returns the canvas data URL
 */
export async function generateCanvasPreview(
  pageData: Partial<DigitalPageData>,
  pageType: DigitalPageType,
  pdfSettings: PagePdfSettings,
  options: CanvasGenerationOptions = {},
  onProgress?: (message: string) => void
): Promise<{ dataUrl: string; width: number; height: number }> {
  let containerContext: ContainerContext | null = null;

  try {
    onProgress?.('Preparing preview...');

    // Step 1: Get preview component
    const PreviewComponent = getPreviewComponent(pageType);

    // Step 2: Calculate dimensions
    const dimensions = calculateRenderDimensions(pdfSettings);

    // Step 3: Create container
    const container = createOffscreenContainer(
      dimensions,
      pdfSettings.backgroundColor || '#ffffff'
    );

    // Step 4: Render React component
    onProgress?.('Rendering content...');
    const root = await renderPreviewToContainer(
      container,
      PreviewComponent,
      pageData,
      pdfSettings,
      options
    );

    // Store context for cleanup
    containerContext = { container, root };

    // Step 5: Capture canvas
    const canvas = await captureContainerAsCanvas(
      container,
      dimensions,
      pdfSettings.backgroundColor || '#ffffff',
      onProgress
    );

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    // Step 6: Cleanup
    cleanupContainer(containerContext);
  }
}
