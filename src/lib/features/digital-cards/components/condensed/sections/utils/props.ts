/**
 * Shared Prop Defaults for Condensed Card Section Components
 *
 * Consolidates default values for section props to ensure consistency
 * across components and simplify prop extraction.
 */

import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// HEADER AND BIO DEFAULTS
// =============================================================================

export const HEADER_BIO_DEFAULTS = {
  bioItalic: true,
  showVerifiedBadge: true,
  imageSize: 80,
  nameFontSize: '1.25rem',
  titleFontSize: '1rem',
  bioFontSize: '0.875rem',
} as const;

// =============================================================================
// FOOTER SECTION DEFAULTS
// =============================================================================

export const FOOTER_DEFAULTS = {
  iconSize: 32,
  spacing: 24,
} as const;

// =============================================================================
// QUICK ACTIONS LINE DEFAULTS
// =============================================================================

export const QUICK_ACTIONS_DEFAULTS = {
  button1Image: '',
  button1Url: '',
  button1Width: 32,
  button2Image: '',
  button2Url: '',
  button2Width: 32,
  button3Image: '',
  button3Url: '',
  button3Width: 32,
  showDecorativeLines: true,
  buttonSpacing: 12,
} as const;

// =============================================================================
// MAP SECTION DEFAULTS
// =============================================================================

export const MAP_DEFAULTS = {
  showAddressOverlay: false,
  showAddressBelowMap: false,
  mapHeight: '400px',
} as const;

// =============================================================================
// CONTENT CONTAINER DEFAULTS
// =============================================================================

export const CONTENT_CONTAINER_DEFAULTS = {
  // Title options
  title: '',
  titleAlignment: 'center-with-lines' as const,
  titleTypography: {},
  // Inner section
  innerSectionType: null as string | null,
  innerSectionProps: {} as Record<string, unknown>,
  // Outer container styling
  containerBackground: '#ffffff',
  borderRadius: 12,
  padding: 16,
  containerHeight: 0, // 0 = auto
  fullWidthSection: false,
  // Inner section styling
  sectionBackground: '#ffffff',
  sectionBorderRadius: 8,
  sectionPadding: 12,
  sectionMinHeight: 0, // 0 = auto
};

// =============================================================================
// DROPSHADOW CONTAINER DEFAULTS
// =============================================================================

export const DROPSHADOW_DEFAULTS = {
  // Shadow properties
  shadowOffsetX: 4,
  shadowOffsetY: 4,
  shadowBlur: 12,
  shadowSpread: 0,
  shadowColor: '#000000',
  shadowOpacity: 0.15,
  // Border properties - default to NO border (just dropshadow)
  borderColor: '#e5e7eb',
  borderWidth: 0,
  // Container properties
  containerBackground: '#ffffff',
  borderRadius: 12,
} as const;

// =============================================================================
// PROP EXTRACTION HELPER
// =============================================================================

/**
 * Extract props from a section with fallback to defaults
 *
 * @param section - The section instance containing props
 * @param defaults - Default values to use when props are missing
 * @returns Object with all props from defaults, overridden by section.props values
 *
 * @example
 * const props = extractSectionProps(section, HEADER_BIO_DEFAULTS);
 * // props.bioItalic will be section.props.bioItalic or true
 */
export function extractSectionProps<T extends Record<string, unknown>>(
  section: CondensedCardSectionInstance | undefined,
  defaults: T
): T {
  if (!section?.props) {
    return { ...defaults };
  }

  const result = { ...defaults };

  for (const key in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, key)) {
      const sectionValue = section.props[key];
      if (sectionValue !== undefined) {
        (result as Record<string, unknown>)[key] = sectionValue;
      }
    }
  }

  return result;
}

/**
 * Get a single prop value with fallback to default
 *
 * @param section - The section instance containing props
 * @param key - The prop key to extract
 * @param defaultValue - Default value if prop is undefined
 * @returns The prop value or default
 *
 * @example
 * const iconSize = getSectionProp(section, 'iconSize', 32);
 */
export function getSectionProp<T>(
  section: CondensedCardSectionInstance | undefined,
  key: string,
  defaultValue: T
): T {
  const value = section?.props?.[key];
  return value !== undefined ? (value as T) : defaultValue;
}
