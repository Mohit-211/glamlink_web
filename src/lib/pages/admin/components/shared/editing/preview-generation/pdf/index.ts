/**
 * PDF Generation Module
 *
 * Utilities for generating PDFs from canvas data using jsPDF.
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  PdfLinkConfig,
  PdfGenerationResult,
  GeneratePdfOptions,
} from './types';

// Re-export core PDF types from main types
export type {
  PdfRatioType,
  PdfSettings,
  PdfDimensions,
  UsePdfGenerationReturn,
} from '../types';

// =============================================================================
// DIMENSION UTILITIES
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
} from './dimensions';

// =============================================================================
// PDF GENERATION HOOK
// =============================================================================

export {
  usePdfGeneration,
  default as usePdfGenerationDefault,
} from './usePdfGeneration';
