/**
 * Condensed Card Style Types
 *
 * Types for card styling and main configuration interface.
 */

import type { CondensedCardDimensions } from './dimensions';
import type { CondensedCardSectionInstance } from './sections';

// =============================================================================
// STYLE CONFIGURATION
// =============================================================================

export interface CondensedCardGradient {
  from: string;
  to: string;
  angle: number;  // in degrees
}

export interface CondensedCardStyles {
  backgroundColor: string;
  headerGradient: CondensedCardGradient;
  padding: number;  // in pixels
  borderRadius: number;  // in pixels
}

// =============================================================================
// MAIN CONFIG
// =============================================================================

/**
 * Main condensed card configuration
 *
 * NOTE: The sections property supports both formats:
 * - NEW: Array of CondensedCardSectionInstance (dynamic, recommended)
 * - OLD: Record<CondensedCardSectionId, CondensedCardSectionConfig> (legacy, auto-migrated)
 */
export interface CondensedCardConfig {
  dimensions: CondensedCardDimensions;
  sections: CondensedCardSectionInstance[];  // Array of section instances
  styles: CondensedCardStyles;
}
