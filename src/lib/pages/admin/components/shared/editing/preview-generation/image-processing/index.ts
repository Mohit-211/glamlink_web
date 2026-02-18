/**
 * Image Processing Module
 *
 * Utilities for processing images before canvas capture.
 */

// =============================================================================
// CONSTANTS
// =============================================================================

export {
  HTML2CANVAS_SCALE,
  RENDER_WAIT_MS,
  IMAGE_WAIT_MS,
  IMAGE_LOAD_TIMEOUT_MS,
  IMAGE_PROXY_ENDPOINT,
} from './constants';

// =============================================================================
// IMAGE UTILITIES
// =============================================================================

export {
  blobToBase64,
  loadImage,
  waitForImageLoad,
  isFirebaseUrl,
  getProxiedUrl,
  fetchImageAsBase64,
} from './imageUtils';

// =============================================================================
// IMAGE PROCESSING
// =============================================================================

export {
  proxyFirebaseImage,
  processImages,
  processImagesInBatches,
} from './processImages';
