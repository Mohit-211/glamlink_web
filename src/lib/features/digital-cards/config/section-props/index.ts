/**
 * Section Props Configuration - Barrel Export
 *
 * Centralized exports for all section props configuration.
 * This file provides backward-compatible exports that match
 * the original sectionPropsConfig.ts API.
 *
 * Usage:
 * ```typescript
 * import {
 *   SECTION_PROPS_CONFIG,
 *   SECTION_TITLE_OPTIONS,
 *   getPropsForEditor,
 *   getSectionDisplayName,
 * } from '@/lib/features/digital-cards/config/section-props';
 * ```
 */

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type {
  PropFieldType,
  ToggleItem,
  UnifiedPropField,
} from './types';

// =============================================================================
// TITLE OPTIONS EXPORTS
// =============================================================================

export { SECTION_TITLE_OPTIONS } from './title-options';

// =============================================================================
// SECTION CONFIG EXPORTS
// =============================================================================

// Content sections
export {
  SPECIALTIES_PROPS,
  IMPORTANT_INFO_PROPS,
  CURRENT_PROMOTIONS_PROPS,
  CURRENT_PROMOTIONS_DETAILED_PROPS,
  CONTENT_SECTIONS_CONFIG,
} from './content-sections';

// Media sections
export {
  SIGNATURE_WORK_PROPS,
  SIGNATURE_WORK_ACTIONS_PROPS,
  MEDIA_SECTIONS_CONFIG,
} from './media-sections';

// Profile sections
export {
  BIO_SIMPLE_PROPS,
  BIO_PREVIEW_PROPS,
  HEADER_AND_BIO_PROPS,
  ABOUT_ME_PROPS,
  PROFILE_SECTIONS_CONFIG,
} from './profile-sections';

// Location sections
export {
  MAP_SECTION_PROPS,
  MAP_PROPS,
  MAP_WITH_HOURS_PROPS,
  MAP_AND_CONTENT_CONTAINER_PROPS,
  BUSINESS_HOURS_PROPS,
  OVERVIEW_STATS_PROPS,
  LOCATION_SECTIONS_CONFIG,
} from './location-sections';

// =============================================================================
// ADMIN OPTIONS EXPORTS
// =============================================================================

export {
  SECTION_ADMIN_OPTIONS,
  SECTION_POSITION_OPTIONS,
  SECTION_OUTER_STYLING_OPTIONS,
  SECTION_INNER_STYLING_OPTIONS,
  SECTION_CONTAINER_OPTIONS,
} from './admin-options';

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export {
  // Main config object
  SECTION_PROPS_CONFIG,

  // Title utilities
  getSectionTitleOptions,
  getTitleTypographyOptions,
  getBasicTitleOptions,

  // Section props utilities
  getPropsForEditor,

  // Admin options utilities
  getSectionAdminOptions,
  getPositionOptions,
  getOuterStylingOptions,
  getInnerStylingOptions,
  getSectionContainerOptions,

  // Deprecated utilities
  getSharedProps,
  isPropShared,

  // Section ID utilities
  normalizeSectionId,
  getSectionDisplayName,

  // Deprecated card section utilities
  getCardSectionId,
  CARD_SECTION_ID_MAP,
  CANONICAL_TO_CARD_SECTION_ID,
} from './utils';
