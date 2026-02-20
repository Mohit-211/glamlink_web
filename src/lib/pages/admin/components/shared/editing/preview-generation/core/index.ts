/**
 * Core Canvas Generation Module
 *
 * Low-level utilities for creating, rendering, capturing, and cleaning up
 * off-screen containers for canvas/PDF generation.
 */

// =============================================================================
// CONTAINER CREATION
// =============================================================================

export {
  createOffscreenContainer,
  type CreateOffscreenContainerOptions,
} from './createOffscreenContainer';

// =============================================================================
// REACT RENDERING
// =============================================================================

export {
  renderToContainer,
} from './renderToContainer';

// =============================================================================
// CANVAS CAPTURE
// =============================================================================

export {
  captureContainer,
  captureContainerAsDataUrl,
  type CaptureOptions,
} from './captureContainer';

// =============================================================================
// CLEANUP
// =============================================================================

export {
  cleanupContainer,
  cleanupContainerAndRoot,
  cleanupReactRoot,
  removeContainer,
} from './cleanupContainer';
