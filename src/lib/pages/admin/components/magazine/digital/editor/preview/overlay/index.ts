/**
 * Custom Layout Overlay Components
 *
 * Visual overlay system for displaying custom layout object positions.
 */

// Main component
export { default as CustomLayoutOverlay } from './CustomLayoutOverlay';

// Sub-components
export { default as ObjectOverlay } from './ObjectOverlay';
export { default as SubSpacerOverlay } from './SubSpacerOverlay';
export { default as OverlayLegend } from './OverlayLegend';

// Helper functions
export {
  getObjectColor,
  getObjectBackground,
  getTypeLabel,
  getSubSpacerColor,
  getSubSpacerBackground,
} from './helpers';
