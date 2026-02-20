/**
 * Canvas Generation Steps
 *
 * Individual step functions for generating canvas previews.
 * Each step handles a specific part of the process.
 */

// Step 1: Get Preview Component
export { getPreviewComponent } from './step1-getPreviewComponent';

// Step 2: Calculate Render Dimensions
export { calculateRenderDimensions } from './step2-calculateRenderDimensions';
export type { RenderDimensions } from './step2-calculateRenderDimensions';

// Step 3: Create Offscreen Container
export { createOffscreenContainer } from './step3-createOffscreenContainer';

// Step 4: Render Preview to Container
export { renderPreviewToContainer } from './step4-renderPreviewToContainer';
export type { CanvasGenerationOptions } from './step4-renderPreviewToContainer';

// Step 5: Capture Container as Canvas
export { captureContainerAsCanvas } from './step5-captureContainerAsCanvas';

// Step 6: Cleanup Container
export { cleanupContainer } from './step6-cleanupContainer';
export type { ContainerContext } from './step6-cleanupContainer';

// Main generation function
export { generateCanvasPreview } from './generateCanvasPreview';
