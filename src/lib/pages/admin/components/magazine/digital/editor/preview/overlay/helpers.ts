/**
 * Helper Functions for CustomLayoutOverlay
 *
 * Color and styling utilities for rendering object overlays.
 */

// =============================================================================
// COLOR HELPERS
// =============================================================================

/**
 * Get border color for object type
 */
export function getObjectColor(type: string): string {
  switch (type) {
    case 'text':
      return '#3B82F6'; // Blue
    case 'image':
      return '#10B981'; // Green
    case 'spacer':
      return '#6B7280'; // Gray
    case 'custom-block':
      return '#8B5CF6'; // Purple
    case 'link':
      return '#F59E0B'; // Amber
    default:
      return '#000000';
  }
}

/**
 * Get background color with transparency
 */
export function getObjectBackground(type: string): string {
  switch (type) {
    case 'text':
      return 'rgba(59, 130, 246, 0.1)'; // Blue-100
    case 'image':
      return 'rgba(16, 185, 129, 0.1)'; // Green-100
    case 'spacer':
      return 'rgba(107, 114, 128, 0.1)'; // Gray-100
    case 'custom-block':
      return 'rgba(139, 92, 246, 0.1)'; // Purple-100
    case 'link':
      return 'rgba(245, 158, 11, 0.1)'; // Amber-100
    default:
      return 'rgba(0, 0, 0, 0.1)';
  }
}

/**
 * Get type label for display
 */
export function getTypeLabel(type: string): string {
  switch (type) {
    case 'text':
      return 'TEXT';
    case 'image':
      return 'IMAGE';
    case 'spacer':
      return 'SPACER';
    case 'custom-block':
      return 'BLOCK';
    case 'link':
      return 'LINK';
    default:
      return 'UNKNOWN';
  }
}

// =============================================================================
// SUB-SPACER HELPERS
// =============================================================================

/**
 * Get sub-spacer border color (blue with opacity)
 */
export function getSubSpacerColor(): string {
  return '#60A5FA'; // Blue-400
}

/**
 * Get sub-spacer background color
 */
export function getSubSpacerBackground(): string {
  return 'rgba(96, 165, 250, 0.15)'; // Blue-400 with low opacity
}
