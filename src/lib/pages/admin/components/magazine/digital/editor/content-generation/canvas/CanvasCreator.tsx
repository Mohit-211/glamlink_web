'use client';

/**
 * CanvasCreator - Canvas generation utilities for html2canvas
 *
 * This module re-exports from the steps/ directory for backward compatibility.
 * Each step is now in its own file for better organization:
 *
 * 1. step1-getPreviewComponent.ts - Get React component for page type
 * 2. step2-calculateRenderDimensions.ts - Calculate pixel dimensions from PDF settings
 * 3. step3-createOffscreenContainer.ts - Create DOM container for off-screen rendering
 * 4. step4-renderPreviewToContainer.tsx - Render React component to container
 * 5. step5-captureContainerAsCanvas.ts - Capture with html2canvas
 * 6. step6-cleanupContainer.ts - Remove container and unmount React
 * 7. generateCanvasPreview.tsx - Main orchestration function
 */

// Re-export everything from steps
export {
  // Step functions
  getPreviewComponent,
  calculateRenderDimensions,
  createOffscreenContainer,
  renderPreviewToContainer,
  captureContainerAsCanvas,
  cleanupContainer,
  generateCanvasPreview,
} from './steps';

// Re-export types
export type {
  RenderDimensions,
  ContainerContext,
  CanvasGenerationOptions,
} from './steps';
