/**
 * Condensed Card Dimension Types
 *
 * Types and utilities for card dimensions and presets.
 */

// =============================================================================
// DIMENSION PRESETS
// =============================================================================

export type CondensedCardDimensionPreset =
  | 'instagram-story'    // 1080x1920
  | 'instagram-portrait' // 1080x1350
  | 'instagram-square'   // 1080x1080
  | 'facebook-post'      // 1200x630
  | 'twitter-post'       // 1200x675
  | 'custom';

export interface DimensionPresetInfo {
  width: number;
  height: number;
  label: string;
  description: string;
}

export const DIMENSION_PRESETS: Record<CondensedCardDimensionPreset, DimensionPresetInfo> = {
  'instagram-story': {
    width: 1080,
    height: 1920,
    label: 'Instagram Story',
    description: '1080 × 1920 (9:16)',
  },
  'instagram-portrait': {
    width: 1080,
    height: 1350,
    label: 'Instagram Portrait',
    description: '1080 × 1350 (4:5)',
  },
  'instagram-square': {
    width: 1080,
    height: 1080,
    label: 'Instagram Square',
    description: '1080 × 1080 (1:1)',
  },
  'facebook-post': {
    width: 1200,
    height: 630,
    label: 'Facebook Post',
    description: '1200 × 630 (1.91:1)',
  },
  'twitter-post': {
    width: 1200,
    height: 675,
    label: 'Twitter Post',
    description: '1200 × 675 (16:9)',
  },
  'custom': {
    width: 1080,
    height: 1350,
    label: 'Custom',
    description: 'Custom dimensions',
  },
};

// =============================================================================
// CARD DIMENSIONS
// =============================================================================

export interface CondensedCardDimensions {
  preset: CondensedCardDimensionPreset;
  width: number;
  height: number;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get dimensions for a preset
 */
export function getDimensionsForPreset(preset: CondensedCardDimensionPreset): { width: number; height: number } {
  const info = DIMENSION_PRESETS[preset];
  return { width: info.width, height: info.height };
}

/**
 * Get preset options for dropdown
 */
export function getPresetOptions(): Array<{ value: CondensedCardDimensionPreset; label: string; description: string }> {
  return Object.entries(DIMENSION_PRESETS).map(([value, info]) => ({
    value: value as CondensedCardDimensionPreset,
    label: info.label,
    description: info.description,
  }));
}
