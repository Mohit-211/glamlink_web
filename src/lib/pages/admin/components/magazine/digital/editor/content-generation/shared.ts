/**
 * Shared utilities for PDF/Canvas generation
 *
 * Re-exports from the centralized preview-generation module.
 * This module is maintained for backwards compatibility with existing
 * magazine code. New code should import directly from:
 * '@/lib/pages/admin/components/shared/editing/preview-generation'
 */

// =============================================================================
// RE-EXPORTS FROM SHARED PREVIEW-GENERATION MODULE
// =============================================================================

// Constants
export {
  HTML2CANVAS_SCALE,
  RENDER_WAIT_MS,
  IMAGE_WAIT_MS,
  IMAGE_PROXY_ENDPOINT,
  DIMENSIONS,
  PDF_DPI,
  MM_PER_INCH,
} from '@/lib/pages/admin/components/shared/editing/preview-generation';

// Dimension utilities
export {
  getPdfDimensions,
  mmToPixels,
  pixelsToMm,
  calculateRenderDimensions as calculateRenderDimensionsFromSettings,
  getPdfOrientation,
  getAspectRatio,
} from '@/lib/pages/admin/components/shared/editing/preview-generation';

// Image utilities
export {
  blobToBase64,
  loadImage,
  isFirebaseUrl,
  fetchImageAsBase64,
  getProxiedUrl,
  waitForImageLoad,
} from '@/lib/pages/admin/components/shared/editing/preview-generation';

// Image processing
export {
  processImages,
  proxyFirebaseImage,
} from '@/lib/pages/admin/components/shared/editing/preview-generation';

// PDF utilities
export {
  usePdfGeneration,
} from '@/lib/pages/admin/components/shared/editing/preview-generation';

// Types
export type {
  PdfRatioType,
  PdfSettings,
  PdfDimensions,
  RenderDimensions,
  CanvasGenerationConfig,
  CanvasResult,
  ProgressCallback,
  PdfLinkConfig,
  PdfGenerationResult,
  GeneratePdfOptions,
} from '@/lib/pages/admin/components/shared/editing/preview-generation';
