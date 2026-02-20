/**
 * Step 2: Calculate Render Dimensions
 *
 * Calculate pixel dimensions from PDF settings.
 * Converts millimeters to pixels at 96 DPI.
 */

import type { PagePdfSettings } from '../../../types';
import { getPdfDimensions } from '../../shared';

// =============================================================================
// TYPES
// =============================================================================

/** Calculated render dimensions in pixels */
export interface RenderDimensions {
  renderWidth: number;
  renderHeight: number;
  marginPx: number;
  pdfWidthMm: number;
  pdfHeightMm: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DPI = 96;

// =============================================================================
// FUNCTION
// =============================================================================

/**
 * Calculate pixel dimensions from PDF settings
 * Converts millimeters to pixels at 96 DPI
 */
export function calculateRenderDimensions(pdfSettings: PagePdfSettings): RenderDimensions {
  const dimensions = getPdfDimensions(pdfSettings);
  const marginMm = pdfSettings.margin || 0;

  const renderWidth = Math.round((dimensions.width / 25.4) * DPI);
  const renderHeight = Math.round((dimensions.height / 25.4) * DPI);
  const marginPx = Math.round((marginMm / 25.4) * DPI);

  return {
    renderWidth,
    renderHeight,
    marginPx,
    pdfWidthMm: dimensions.width,
    pdfHeightMm: dimensions.height,
  };
}
