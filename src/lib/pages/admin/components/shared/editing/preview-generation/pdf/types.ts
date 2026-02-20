/**
 * PDF Generation Types
 */

import type { PdfSettings, PdfRatioType } from '../types';

// =============================================================================
// PDF LINK TYPES
// =============================================================================

/**
 * Configuration for a clickable link in the PDF
 */
export interface PdfLinkConfig {
  /** Link text (for calculating width) */
  text: string;
  /** Link URL */
  url: string;
  /** X position in mm (from left edge) */
  x: number;
  /** Y position in mm (from top edge) */
  y: number;
  /** Font size in points */
  fontSize?: number;
}

// =============================================================================
// PDF GENERATION TYPES
// =============================================================================

/**
 * Result of PDF generation
 */
export interface PdfGenerationResult {
  success: boolean;
  fileName?: string;
  error?: string;
}

/**
 * Options for PDF generation
 */
export interface GeneratePdfOptions {
  /** Optional clickable links to add to the PDF */
  links?: PdfLinkConfig[];
}

// =============================================================================
// RE-EXPORTS
// =============================================================================

export type { PdfSettings, PdfRatioType };
