/**
 * Canvas Preview Module
 *
 * Provides html2canvas-based preview generation for digital pages.
 *
 * Structure:
 * - useCanvasPreview.ts - React hook for state management (includes types)
 * - CanvasCreator.tsx - Helper functions for canvas generation
 * - FooterPreview.tsx - Footer component for page previews
 */

// Main hook and types
export { useCanvasPreview, default } from './useCanvasPreview';
export type {
  CanvasPreviewResult,
  GeneratePreviewOptions,
  UseCanvasPreviewReturn,
} from './useCanvasPreview';

// Canvas Creator utilities
export {
  generateCanvasPreview,
  getPreviewComponent,
  calculateRenderDimensions,
  createOffscreenContainer,
  renderPreviewToContainer,
  captureContainerAsCanvas,
  cleanupContainer,
} from './CanvasCreator';

export type {
  RenderDimensions,
  ContainerContext,
  CanvasGenerationOptions,
} from './CanvasCreator';

// Footer preview component
export { default as FooterPreview } from './FooterPreview';
export type { FooterPreviewProps } from './FooterPreview';

// Image processing (re-exported from shared module)
export { processImages } from '../shared';
