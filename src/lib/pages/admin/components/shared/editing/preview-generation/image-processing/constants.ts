/**
 * Shared Constants for Preview Generation
 *
 * Common constants used across canvas/PDF generation features.
 */

// =============================================================================
// CANVAS CONSTANTS
// =============================================================================

/** Scale factor for html2canvas capture (2x for better quality) */
export const HTML2CANVAS_SCALE = 2;

/** Delay after React render before capturing (ms) */
export const RENDER_WAIT_MS = 500;

/** Delay after image processing before capturing (ms) */
export const IMAGE_WAIT_MS = 300;

/** Default timeout for image loading (ms) */
export const IMAGE_LOAD_TIMEOUT_MS = 5000;

// =============================================================================
// API ENDPOINTS
// =============================================================================

/** Endpoint for proxying Firebase Storage images (CORS bypass) */
export const IMAGE_PROXY_ENDPOINT = '/api/magazine/image-proxy';
