'use client';

/**
 * PDF Dimension Utilities
 *
 * Provides dimension calculations for PDF generation, including standard
 * presets and custom dimension support.
 */

import type { PdfRatioType, PdfSettings, PdfDimensions, RenderDimensions } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Standard PDF dimensions in millimeters for each ratio type
 */
export const DIMENSIONS: Record<Exclude<PdfRatioType, 'custom'>, PdfDimensions> = {
  'a4-portrait': { width: 210, height: 297 },
  'a4-landscape': { width: 297, height: 210 },
  '16:9': { width: 297, height: 167 },
  '4:3': { width: 280, height: 210 },
  'square': { width: 210, height: 210 },
};

/**
 * Default dimensions for custom ratio type (A4 portrait)
 */
export const DEFAULT_CUSTOM_DIMENSIONS: PdfDimensions = {
  width: 210,
  height: 297,
};

/**
 * DPI for converting mm to pixels
 * Standard screen DPI is 96
 */
export const PDF_DPI = 96;

/**
 * Millimeters per inch
 */
export const MM_PER_INCH = 25.4;

// =============================================================================
// DIMENSION FUNCTIONS
// =============================================================================

/**
 * Get PDF dimensions in millimeters based on settings
 *
 * @param settings - PDF settings with ratio and optional custom dimensions
 * @returns Width and height in millimeters
 */
export function getPdfDimensions(settings: PdfSettings): PdfDimensions {
  if (settings.ratio === 'custom') {
    return {
      width: settings.customWidth || DEFAULT_CUSTOM_DIMENSIONS.width,
      height: settings.customHeight || DEFAULT_CUSTOM_DIMENSIONS.height,
    };
  }

  return DIMENSIONS[settings.ratio];
}

/**
 * Convert millimeters to pixels at a given DPI
 *
 * @param mm - Value in millimeters
 * @param dpi - DPI value (default: 96)
 * @returns Value in pixels
 */
export function mmToPixels(mm: number, dpi: number = PDF_DPI): number {
  return Math.round((mm / MM_PER_INCH) * dpi);
}

/**
 * Convert pixels to millimeters at a given DPI
 *
 * @param pixels - Value in pixels
 * @param dpi - DPI value (default: 96)
 * @returns Value in millimeters
 */
export function pixelsToMm(pixels: number, dpi: number = PDF_DPI): number {
  return (pixels / dpi) * MM_PER_INCH;
}

/**
 * Calculate render dimensions in pixels from PDF settings
 *
 * Converts PDF dimensions from millimeters to pixels for html2canvas capture.
 *
 * @param settings - PDF settings with ratio and optional custom dimensions
 * @param dpi - DPI for conversion (default: 96)
 * @returns Width and height in pixels
 */
export function calculateRenderDimensions(
  settings: PdfSettings,
  dpi: number = PDF_DPI
): RenderDimensions {
  const pdfDimensions = getPdfDimensions(settings);

  return {
    width: mmToPixels(pdfDimensions.width, dpi),
    height: mmToPixels(pdfDimensions.height, dpi),
    marginPx: settings.margin ? mmToPixels(settings.margin, dpi) : 0,
  };
}

/**
 * Get PDF orientation based on dimensions
 *
 * @param settings - PDF settings
 * @returns 'portrait' or 'landscape'
 */
export function getPdfOrientation(settings: PdfSettings): 'portrait' | 'landscape' {
  const dimensions = getPdfDimensions(settings);
  return dimensions.width > dimensions.height ? 'landscape' : 'portrait';
}

/**
 * Calculate aspect ratio from PDF settings
 *
 * @param settings - PDF settings
 * @returns Aspect ratio (width / height)
 */
export function getAspectRatio(settings: PdfSettings): number {
  const dimensions = getPdfDimensions(settings);
  return dimensions.width / dimensions.height;
}
