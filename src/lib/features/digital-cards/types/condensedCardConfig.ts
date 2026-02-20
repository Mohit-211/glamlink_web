/**
 * Condensed Card Configuration Types
 *
 * MAIN EXPORT FILE - Re-exports all condensed card types from organized modules.
 *
 * This file provides backward compatibility by re-exporting everything that was
 * previously in this single file, now split into logical modules:
 * - dimensions.ts - Dimension presets and utilities
 * - sections.ts - Section types and constants
 * - styles.ts - Style types and main config interface
 * - defaults.ts - Default configurations and helpers
 * - migration.ts - Migration utilities
 */

// Dimension types and utilities
export type {
  CondensedCardDimensionPreset,
  DimensionPresetInfo,
  CondensedCardDimensions,
} from './dimensions';
export {
  DIMENSION_PRESETS,
  getDimensionsForPreset,
  getPresetOptions,
} from './dimensions';

// Section types and constants
export type {
  CondensedCardSectionId,
  CondensedCardSectionConfig,
  CondensedCardSectionInstance,
  SectionLayoutPreset,
} from './sections';
export { SECTION_ORDER } from './sections';

// Style types and main config
export type {
  CondensedCardGradient,
  CondensedCardStyles,
  CondensedCardConfig,
} from './styles';

// Default configurations and helpers
export {
  DEFAULT_SECTION_CONFIGS,
  DEFAULT_CONDENSED_CARD_STYLES,
  DEFAULT_CONDENSED_CARD_CONFIG,
  createDefaultCondensedCardConfig,
} from './defaults';

// Migration utilities (includes mergeWithDefaultConfig to avoid circular dependency)
export {
  migrateCondensedCardConfig,
  generateSectionInstanceId,
  mergeWithDefaultConfig,
} from './migration';
