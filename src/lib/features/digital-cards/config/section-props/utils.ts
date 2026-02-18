/**
 * Section Props Configuration - Utility Functions
 *
 * Provides helper functions for accessing and manipulating
 * section props configuration.
 */

import { UnifiedPropField } from './types';
import { SECTION_TITLE_OPTIONS } from './title-options';
import { CONTENT_SECTIONS_CONFIG } from './content-sections';
import { MEDIA_SECTIONS_CONFIG } from './media-sections';
import { PROFILE_SECTIONS_CONFIG } from './profile-sections';
import { LOCATION_SECTIONS_CONFIG } from './location-sections';
import {
  SECTION_ADMIN_OPTIONS,
  SECTION_POSITION_OPTIONS,
  SECTION_OUTER_STYLING_OPTIONS,
  SECTION_INNER_STYLING_OPTIONS,
} from './admin-options';

// =============================================================================
// ASSEMBLED SECTION PROPS CONFIG
// =============================================================================

/**
 * Complete section props configuration
 * Assembled from all category-specific configurations
 */
export const SECTION_PROPS_CONFIG: Record<string, UnifiedPropField[]> = {
  ...CONTENT_SECTIONS_CONFIG,
  ...MEDIA_SECTIONS_CONFIG,
  ...PROFILE_SECTIONS_CONFIG,
  ...LOCATION_SECTIONS_CONFIG,
};

// =============================================================================
// TITLE OPTIONS UTILITIES
// =============================================================================

/**
 * Get the title options for section header editing
 * @param mode Optional mode filter - all users see title options
 */
export function getSectionTitleOptions(): UnifiedPropField[] {
  return SECTION_TITLE_OPTIONS;
}

/**
 * Get typography-specific title options (grouped)
 */
export function getTitleTypographyOptions(): UnifiedPropField[] {
  return SECTION_TITLE_OPTIONS.filter(p => p.group === 'titleTypography');
}

/**
 * Get basic title options (title text and alignment)
 */
export function getBasicTitleOptions(): UnifiedPropField[] {
  return SECTION_TITLE_OPTIONS.filter(p => !p.group);
}

// =============================================================================
// SECTION PROPS UTILITIES
// =============================================================================

/**
 * Get the props configuration for a given section type
 * @param sectionType The section type ID
 * @param editor Optional editor type filter ('condensedCard' or 'cardSections')
 * @param mode Optional mode filter ('admin' or 'profile') - filters out adminOnly props for profile mode
 */
export function getPropsForEditor(
  sectionType: string | null,
  editor?: 'condensedCard' | 'cardSections',
  mode?: 'admin' | 'profile'
): UnifiedPropField[] {
  if (!sectionType) return [];
  let props = SECTION_PROPS_CONFIG[sectionType] || [];

  // Filter by editor type if specified
  if (editor === 'cardSections') {
    // Card Sections has been removed - return empty
    return [];
  }

  // Filter by mode if specified
  if (mode === 'profile') {
    props = props.filter(p => !p.adminOnly);
  }

  return props;
}

// =============================================================================
// ADMIN OPTIONS UTILITIES
// =============================================================================

/**
 * Get admin-only options (z-index)
 * @param mode Mode filter - only returns options in admin mode
 */
export function getSectionAdminOptions(mode?: 'admin' | 'profile'): UnifiedPropField[] {
  if (mode === 'profile') {
    return [];
  }
  return SECTION_ADMIN_OPTIONS;
}

/**
 * Get position options for admin editing
 * @param mode Mode filter - only returns options in admin mode
 */
export function getPositionOptions(mode?: 'admin' | 'profile'): UnifiedPropField[] {
  if (mode === 'profile') {
    return [];
  }
  return SECTION_POSITION_OPTIONS;
}

/**
 * Get outer container styling options for admin editing
 * @param mode Mode filter - only returns options in admin mode
 */
export function getOuterStylingOptions(mode?: 'admin' | 'profile'): UnifiedPropField[] {
  if (mode === 'profile') {
    return [];
  }
  return SECTION_OUTER_STYLING_OPTIONS;
}

/**
 * Get inner container styling options for admin editing
 * @param mode Mode filter - only returns options in admin mode
 */
export function getInnerStylingOptions(mode?: 'admin' | 'profile'): UnifiedPropField[] {
  if (mode === 'profile') {
    return [];
  }
  return SECTION_INNER_STYLING_OPTIONS;
}

/**
 * Get section container options (like z-index)
 * @param mode Optional mode filter - hides adminOnly options in profile mode
 * @deprecated Use getSectionAdminOptions instead
 */
export function getSectionContainerOptions(mode?: 'admin' | 'profile'): UnifiedPropField[] {
  return getSectionAdminOptions(mode);
}

// =============================================================================
// DEPRECATED UTILITIES
// =============================================================================

/**
 * Get all props for a section type
 * @deprecated Use getPropsForEditor instead
 */
export function getSharedProps(sectionType: string): UnifiedPropField[] {
  return getPropsForEditor(sectionType);
}

/**
 * Check if a prop exists for a section type
 */
export function isPropShared(sectionType: string, propKey: string): boolean {
  const props = getPropsForEditor(sectionType);
  return props.some(p => p.key === propKey);
}

// =============================================================================
// SECTION ID UTILITIES
// =============================================================================

/**
 * Normalize section IDs to a canonical form
 * Handles legacy section ID variations
 */
export function normalizeSectionId(sectionId: string): string {
  // Map legacy/alternate IDs to canonical form
  const idMap: Record<string, string> = {
    'importantInfo': 'important-info',
    'map-section': 'map',
    'specialties-section': 'specialties',
    'video-display': 'signature-work',
  };
  return idMap[sectionId] || sectionId;
}

/**
 * Get human-readable section name for display
 */
export function getSectionDisplayName(sectionType: string): string {
  const nameMap: Record<string, string> = {
    'specialties': 'Specialties',
    'important-info': 'Important Info',
    'importantInfo': 'Important Info',
    'signature-work': 'Signature Work',
    'signature-work-actions': 'Signature Work & Actions',
    'current-promotions': 'Current Promotions',
    'current-promotions-detailed': 'Current Promotions',
    'bio-simple': 'Bio',
    'bio-preview': 'Bio Preview',
    'headerAndBio': 'Header and Bio',
    'about-me': 'About Me',
    'map-section': 'Location Map',
    'map': 'Location Map',
    'mapWithHours': 'Map with Hours',
    'mapAndContentContainer': 'Map',
    'business-hours': 'Business Hours',
    'overview-stats': 'Overview Stats',
    'footer': 'Footer',
    'header': 'Header',
    'nameTitle': 'Name & Title',
    'rating': 'Rating',
    'contact': 'Contact',
    'cardUrl': 'Card URL',
    'branding': 'Branding',
    'custom': 'Custom Section',
    'contentContainer': 'Content Container',
    'quick-actions-line': 'Quick Actions',
  };
  return nameMap[sectionType] || sectionType;
}

// =============================================================================
// DEPRECATED CARD SECTION UTILITIES
// =============================================================================

/**
 * Get the Card Section ID for a canonical section type
 * @deprecated Card Sections have been removed - use condensedCardConfig instead
 */
export function getCardSectionId(canonicalId: string): string {
  return canonicalId;
}

/**
 * Maps canonical section IDs to Card Section IDs
 * @deprecated Card Sections have been removed
 */
export const CARD_SECTION_ID_MAP: Record<string, string> = {};

/**
 * Maps canonical IDs to Card Section IDs
 * @deprecated Card Sections have been removed
 */
export const CANONICAL_TO_CARD_SECTION_ID: Record<string, string> = {};
