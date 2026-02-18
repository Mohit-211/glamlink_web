/**
 * PDF/Canvas Generation Module
 *
 * Re-exports all modules for backward compatibility.
 *
 * Organized into:
 * - canvas/ - html2canvas preview generation
 * - useDigitalPagePdf.ts - jsPDF PDF generation hook
 * - shared.ts - Common utilities (constants, dimensions, image helpers)
 */

// Canvas module (excluding RenderDimensions to avoid conflict with shared module)
export {
  useCanvasPreview,
  default,
  generateCanvasPreview,
  getPreviewComponent,
  calculateRenderDimensions,
  createOffscreenContainer,
  renderPreviewToContainer,
  captureContainerAsCanvas,
  cleanupContainer,
  FooterPreview,
} from './canvas';
export type {
  CanvasPreviewResult,
  GeneratePreviewOptions,
  UseCanvasPreviewReturn,
  ContainerContext,
  CanvasGenerationOptions,
  FooterPreviewProps,
} from './canvas';

// PDF hook
export { useDigitalPagePdf, default as useDigitalPagePdfDefault } from './useDigitalPagePdf';
export type { UseDigitalPagePdfReturn } from './useDigitalPagePdf';

// Shared utilities (includes RenderDimensions from shared module)
export * from './shared';
