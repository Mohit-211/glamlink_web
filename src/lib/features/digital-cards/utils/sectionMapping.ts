/**
 * Section Mapping Utility
 *
 * Maps sectionsConfig (Sections tab) entries to condensedCardConfig.sections
 * (Condensed Card tab) entries. This enables automatic syncing between the
 * two configurations.
 *
 * When a user adds a section via the "Add section" button in the Sections tab,
 * a corresponding Content entry is dynamically created in the Condensed Card's
 * Content group.
 */

import type { PositionConfig, DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// TYPES
// =============================================================================

export interface SectionMappingConfig {
  /** Condensed card section type to use */
  condensedCardType: 'contentContainer' | 'mapAndContentContainer';
  /** The inner section type for the container */
  innerSectionType: string;
  /** Human-readable label for the inner section type */
  innerSectionLabel: string;
  /** Display label for the editor */
  defaultLabel: string;
  /** Default position configuration */
  defaultPosition: PositionConfig;
  /** Default z-index for layering */
  defaultZIndex: number;
  /** Default inner section props (e.g., hideTitle, listFormat) */
  defaultInnerSectionProps?: Record<string, any>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a DimensionValue
 */
function createDimension(value: number, unit: 'px' | '%' = '%'): DimensionValue {
  return { value, unit };
}

/**
 * Create a PositionConfig with percentage-based values
 */
function createPosition(
  x: number,
  y: number,
  width: number,
  height: number
): PositionConfig {
  return {
    x: createDimension(x, '%'),
    y: createDimension(y, '%'),
    width: createDimension(width, '%'),
    height: createDimension(height, '%'),
    visible: true,
  };
}

// =============================================================================
// SECTION MAPPING CONFIGURATION
// =============================================================================

/**
 * Maps sectionsConfig.id to condensedCardConfig section settings
 *
 * Key: Section ID from sectionsConfig (Sections tab)
 * Value: Configuration for the corresponding condensed card section
 */
export const SECTION_TO_CONDENSED_MAP: Record<string, SectionMappingConfig> = {
  // Map section - uses mapAndContentContainer with Business Hours below the map
  // New unified ID
  'map': {
    condensedCardType: 'mapAndContentContainer',
    innerSectionType: 'business-hours',
    innerSectionLabel: 'Business Hours - Operating hours in table format',
    defaultLabel: 'Location Map',
    defaultPosition: createPosition(2, 50, 96, 20),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Business Hours',
      hideTitle: true,
      listFormat: true,
    },
  },
  // Backward compatibility alias
  'map-section': {
    condensedCardType: 'mapAndContentContainer',
    innerSectionType: 'business-hours',
    innerSectionLabel: 'Business Hours - Operating hours in table format',
    defaultLabel: 'Location Map',
    defaultPosition: createPosition(2, 50, 96, 20),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Business Hours',
      hideTitle: true,
      listFormat: true,
    },
  },

  // Content sections - use contentContainer with appropriate innerSectionType
  // New unified ID
  'specialties': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'specialties',
    innerSectionLabel: 'Specialties - Professional specialties and services',
    defaultLabel: 'Specialties',
    defaultPosition: createPosition(2, 72, 96, 12),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Specialties',
      hideTitle: true,
      listFormat: true,
    },
  },
  // Backward compatibility alias
  'specialties-section': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'specialties',
    innerSectionLabel: 'Specialties - Professional specialties and services',
    defaultLabel: 'Specialties',
    defaultPosition: createPosition(2, 72, 96, 12),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Specialties',
      hideTitle: true,
      listFormat: true,
    },
  },

  'bio-simple': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'headerAndBio',
    innerSectionLabel: 'Header & Bio - Profile image with name, title, and bio',
    defaultLabel: 'Bio',
    defaultPosition: createPosition(2, 50, 96, 15),
    defaultZIndex: 3,
  },

  // New unified ID
  'importantInfo': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'importantInfo',
    innerSectionLabel: 'Important Info - Key information for clients',
    defaultLabel: 'Important Info',
    defaultPosition: createPosition(2, 65, 96, 12),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Important Info',
      hideTitle: true,
      listFormat: true,
    },
  },
  // Backward compatibility alias
  'important-info': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'importantInfo',
    innerSectionLabel: 'Important Info - Key information for clients',
    defaultLabel: 'Important Info',
    defaultPosition: createPosition(2, 65, 96, 12),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Important Info',
      hideTitle: true,
      listFormat: true,
    },
  },

  'signature-work': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'signature-work',
    innerSectionLabel: 'Signature Work - Video showcase of professional work',
    defaultLabel: 'Signature Work',
    defaultPosition: createPosition(2, 50, 96, 20),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Signature Work',
      hideTitle: true,        // Hide the "Signature Work" heading inside the section
      hideCaption: true,      // Hide the caption below the video/image
      displayedGalleryIndex: 0, // Show only first item, no thumbnails
      // showPlayButton is auto-detected based on item type (video vs image)
    },
  },

  'signature-work-actions': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'signature-work',
    innerSectionLabel: 'Signature Work - Video showcase of professional work',
    defaultLabel: 'Signature Work & Actions',
    defaultPosition: createPosition(2, 50, 96, 20),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Signature Work',
      hideTitle: true,        // Hide the "Signature Work" heading inside the section
      hideCaption: true,      // Hide the caption below the video/image
      displayedGalleryIndex: 0, // Show only first item, no thumbnails
      // showPlayButton is auto-detected based on item type (video vs image)
    },
  },

  'current-promotions': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'current-promotions',
    innerSectionLabel: 'Current Promotions - Simple list of active promotional offers',
    defaultLabel: 'Current Promotions',
    defaultPosition: createPosition(2, 78, 96, 10),
    defaultZIndex: 3,
  },

  // Note: current-promotions-detailed uses same inner section type as current-promotions
  // The "detailed" version is for the live card, but condensed card uses simple promotions

  'business-hours': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'business-hours',
    innerSectionLabel: 'Business Hours - Operating hours in table format',
    defaultLabel: 'Business Hours',
    defaultPosition: createPosition(2, 85, 96, 8),
    defaultZIndex: 3,
  },

  'overview-stats': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'overview-stats',
    innerSectionLabel: 'Overview Stats - Experience, rating, and services count',
    defaultLabel: 'Overview Stats',
    defaultPosition: createPosition(2, 50, 96, 15),
    defaultZIndex: 3,
  },

  'video-display': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'signature-work',
    innerSectionLabel: 'Video Display - Video content showcase',
    defaultLabel: 'Video Display',
    defaultPosition: createPosition(2, 50, 96, 20),
    defaultZIndex: 3,
    defaultInnerSectionProps: {
      title: 'Video',
      hideTitle: true,        // Hide the heading inside the section
      hideCaption: true,      // Hide the caption below the video
      displayedGalleryIndex: 0, // Show only first item, no thumbnails
      // showPlayButton is auto-detected based on item type (video vs image)
    },
  },

  'bio-preview': {
    condensedCardType: 'contentContainer',
    innerSectionType: 'headerAndBio',
    innerSectionLabel: 'Bio Preview - Truncated bio with read-more',
    defaultLabel: 'Bio Preview',
    defaultPosition: createPosition(2, 50, 96, 15),
    defaultZIndex: 3,
  },
};

// =============================================================================
// SECTION GROUP CONSTANTS (for ProfileCondensedCardEditor)
// =============================================================================

/**
 * Section types that belong to the "Styling" group in the Condensed Card editor.
 * These are static sections defined by admin, not synced from Sections tab.
 */
export const STYLING_SECTION_TYPES = [
  'dropshadowContainer',
  'footer',
  'custom',
  'quick-actions-line',
] as const;

/**
 * Section types that belong to the "Content" group in the Condensed Card editor.
 * These are dynamically synced from the Sections tab.
 */
export const CONTENT_SECTION_TYPES = [
  'contentContainer',
  'mapAndContentContainer',
] as const;

// =============================================================================
// DEFAULT STYLING FOR CONTENT SECTIONS
// =============================================================================

/**
 * Default styling props for newly created Content sections.
 * Applied when a section is first synced from Sections tab to Condensed Card.
 */
export const DEFAULT_CONTENT_SECTION_STYLING = {
  // Outer Container Styling
  containerBackground: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: 20,
  padding: 16,
  containerHeight: 0,
  fullWidthSection: false,

  // Inner Section Styling
  sectionBackground: '#ffffff',
  sectionBorderRadius: 8,
  sectionPadding: 12,
  sectionMinHeight: 0,
} as const;

// =============================================================================
// DEFAULT ADD SECTION POSITION
// =============================================================================

/**
 * Default position for newly added sections via the "Add Section" button.
 * All new sections start at this position and the user can then adjust.
 */
export const DEFAULT_ADD_SECTION_POSITION: PositionConfig = createPosition(6, 12, 43, 30);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a section ID from sectionsConfig has a condensed card mapping
 */
export function hasCondensedMapping(sectionId: string): boolean {
  return sectionId in SECTION_TO_CONDENSED_MAP;
}

/**
 * Get the mapping configuration for a section ID
 */
export function getCondensedMapping(sectionId: string): SectionMappingConfig | undefined {
  return SECTION_TO_CONDENSED_MAP[sectionId];
}

/**
 * Create a condensed card section instance from a sectionsConfig entry
 *
 * @param sectionId - The section ID from sectionsConfig (e.g., "map-section")
 * @param visible - Whether the section should be visible
 * @param existingSection - Optional existing section to preserve position/props
 * @param useDefaultAddPosition - If true, uses DEFAULT_ADD_SECTION_POSITION instead of mapping default
 * @returns A CondensedCardSectionInstance or null if no mapping exists
 */
export function createCondensedCardSection(
  sectionId: string,
  visible: boolean,
  existingSection?: CondensedCardSectionInstance,
  useDefaultAddPosition: boolean = false
): CondensedCardSectionInstance | null {
  const mapping = SECTION_TO_CONDENSED_MAP[sectionId];
  if (!mapping) return null;

  // Generate unique ID for this content section
  const instanceId = `${sectionId}-content`;

  // If existing section found, preserve its position and props
  if (existingSection) {
    return {
      ...existingSection,
      visible,
    };
  }

  // Determine which position to use
  const position = useDefaultAddPosition
    ? { ...DEFAULT_ADD_SECTION_POSITION }
    : { ...mapping.defaultPosition };

  // Create new section with default configuration and styling
  return {
    id: instanceId,
    sectionType: mapping.condensedCardType,
    label: mapping.defaultLabel,
    visible,
    position,
    zIndex: mapping.defaultZIndex,
    props: {
      innerSectionType: mapping.innerSectionType,
      // Apply default styling for Content sections
      ...DEFAULT_CONTENT_SECTION_STYLING,
      // Apply default inner section props nested inside innerSectionProps
      // (ContentContainer reads from section.props.innerSectionProps)
      innerSectionProps: mapping.defaultInnerSectionProps || {},
      // Also apply title at the top level for ContentContainer title display
      ...(mapping.defaultInnerSectionProps?.title ? { title: mapping.defaultInnerSectionProps.title } : {}),
    },
  };
}

/**
 * Get the condensed card section ID for a sectionsConfig section
 */
export function getCondensedSectionId(sectionId: string): string {
  return `${sectionId}-content`;
}

/**
 * Extract the original sectionsConfig ID from a condensed card section ID
 */
export function extractOriginalSectionId(condensedSectionId: string): string | null {
  if (!condensedSectionId.endsWith('-content')) {
    return null;
  }
  return condensedSectionId.replace(/-content$/, '');
}

/**
 * Check if a condensed card section is a "Content" type (synced from Sections tab)
 */
export function isContentSection(sectionType: string): boolean {
  return CONTENT_SECTION_TYPES.includes(sectionType as any);
}

/**
 * Check if a condensed card section is a "Styling" type (static, admin-defined)
 */
export function isStylingSection(sectionType: string): boolean {
  return STYLING_SECTION_TYPES.includes(sectionType as any);
}
