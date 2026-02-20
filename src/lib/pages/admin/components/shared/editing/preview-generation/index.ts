/**
 * Shared Preview Generation Module
 *
 * Provides reusable utilities for canvas/PDF generation across different
 * preview features (magazine, condensed card, etc.)
 *
 * @example
 * ```typescript
 * import {
 *   createOffscreenContainer,
 *   renderToContainer,
 *   captureContainer,
 *   cleanupContainer,
 *   processImages,
 *   usePreviewState,
 *   usePdfGeneration,
 * } from '@/lib/pages/admin/components/shared/editing/preview-generation';
 * ```
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  CanvasGenerationConfig,
  RenderDimensions,
  CanvasResult,
  ProgressCallback,
  PdfRatioType,
  PdfSettings,
  PdfDimensions,
  UsePreviewStateReturn,
  UseCanvasCaptureReturn,
  UsePdfGenerationReturn,
  ContainerContext,
} from './types';

// =============================================================================
// CORE UTILITIES
// =============================================================================

export {
  createOffscreenContainer,
  type CreateOffscreenContainerOptions,
} from './core/createOffscreenContainer';

export {
  renderToContainer,
} from './core/renderToContainer';

export {
  captureContainer,
} from './core/captureContainer';

export {
  cleanupContainer,
} from './core/cleanupContainer';

// =============================================================================
// IMAGE PROCESSING
// =============================================================================

export {
  IMAGE_PROXY_ENDPOINT,
  HTML2CANVAS_SCALE,
  RENDER_WAIT_MS,
  IMAGE_WAIT_MS,
} from './image-processing/constants';

export {
  blobToBase64,
  loadImage,
  isFirebaseUrl,
  fetchImageAsBase64,
  getProxiedUrl,
  waitForImageLoad,
} from './image-processing/imageUtils';

export {
  processImages,
  proxyFirebaseImage,
} from './image-processing/processImages';

// =============================================================================
// PDF UTILITIES
// =============================================================================

export {
  DIMENSIONS,
  DEFAULT_CUSTOM_DIMENSIONS,
  PDF_DPI,
  MM_PER_INCH,
  getPdfDimensions,
  mmToPixels,
  pixelsToMm,
  calculateRenderDimensions,
  getPdfOrientation,
  getAspectRatio,
} from './pdf/dimensions';

export {
  usePdfGeneration,
} from './pdf/usePdfGeneration';

export type {
  PdfLinkConfig,
  PdfGenerationResult,
  GeneratePdfOptions,
} from './pdf/types';

// =============================================================================
// HOOKS
// =============================================================================

export {
  usePreviewState,
} from './hooks/usePreviewState';

export {
  useCanvasCapture,
} from './hooks/useCanvasCapture';
