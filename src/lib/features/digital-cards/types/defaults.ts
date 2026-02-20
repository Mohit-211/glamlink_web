/**
 * Condensed Card Default Configurations
 *
 * Default values and helper functions for creating configs.
 */

import type { PositionConfig, DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import type { CondensedCardDimensions } from './dimensions';
import type { CondensedCardSectionId, CondensedCardSectionConfig } from './sections';
import type { CondensedCardStyles, CondensedCardConfig } from './styles';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a default DimensionValue
 */
function createDimension(value: number, unit: 'px' | '%' = '%'): DimensionValue {
  return { value, unit };
}

/**
 * Create a default PositionConfig
 */
function createPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  unit: 'px' | '%' = '%'
): PositionConfig {
  return {
    x: createDimension(x, unit),
    y: createDimension(y, unit),
    width: createDimension(width, unit),
    height: createDimension(height, unit),
    visible: true,
  };
}

// =============================================================================
// SECTION DEFAULTS
// =============================================================================

export const DEFAULT_SECTION_CONFIGS: Record<CondensedCardSectionId, CondensedCardSectionConfig> = {
  header: {
    id: 'header',
    label: 'Header (Profile Image)',
    visible: true,
    position: createPosition(0, 0, 100, 35),
  },
  nameTitle: {
    id: 'nameTitle',
    label: 'Name & Title',
    visible: true,
    position: createPosition(0, 32, 100, 15),
  },
  rating: {
    id: 'rating',
    label: 'Rating',
    visible: true,
    position: createPosition(0, 45, 100, 5),
  },
  specialties: {
    id: 'specialties',
    label: 'Specialties',
    visible: true,
    position: createPosition(0, 50, 100, 8),
  },
  importantInfo: {
    id: 'importantInfo',
    label: 'Important Info',
    visible: true,
    position: createPosition(10, 30, 80, 20),
  },
  contact: {
    id: 'contact',
    label: 'Contact Info',
    visible: true,
    position: createPosition(0, 58, 100, 25),
  },
  cardUrl: {
    id: 'cardUrl',
    label: 'Card URL',
    visible: true,
    position: createPosition(0, 85, 100, 8),
  },
  branding: {
    id: 'branding',
    label: 'GLAMLINK Branding',
    visible: true,
    position: createPosition(0, 93, 100, 7),
  },
  headerAndBio: {
    id: 'headerAndBio',
    label: 'Header and Bio',
    visible: true,
    position: createPosition(0, 0, 100, 40),
  },
  map: {
    id: 'map',
    label: 'Map',
    visible: true,
    position: createPosition(0, 40, 100, 25),
  },
  mapWithHours: {
    id: 'mapWithHours',
    label: 'Map with Hours',
    visible: true,
    position: createPosition(0, 40, 100, 35),
  },
  footer: {
    id: 'footer',
    label: 'Footer',
    visible: true,
    position: createPosition(0, 90, 100, 10),
  },
  custom: {
    id: 'custom',
    label: 'Custom Section',
    visible: true,
    position: createPosition(0, 0, 100, 20),
  },
  contentContainer: {
    id: 'contentContainer',
    label: 'Content with Container',
    visible: true,
    position: createPosition(10, 10, 80, 30),
  },
};

// =============================================================================
// DEFAULT CONFIG
// =============================================================================

export const DEFAULT_CONDENSED_CARD_STYLES: CondensedCardStyles = {
  backgroundColor: '#ffffff',
  headerGradient: {
    from: '#22B8C8',  // glamlink-teal
    to: '#8B5CF6',    // glamlink-purple
    angle: 135,
  },
  padding: 0,
  borderRadius: 24,
};

export const DEFAULT_CONDENSED_CARD_CONFIG: CondensedCardConfig = {
  dimensions: {
    preset: 'instagram-portrait',
    width: 1080,
    height: 1350,
  },
  sections: [
    // Convert default sections to array format
    {
      id: 'header-1',
      sectionType: 'header',
      label: 'Header (Profile Image)',
      visible: true,
      position: createPosition(0, 0, 100, 35),
      zIndex: 0,
    },
    {
      id: 'nameTitle-1',
      sectionType: 'nameTitle',
      label: 'Name & Title',
      visible: true,
      position: createPosition(0, 32, 100, 15),
      zIndex: 1,
    },
    {
      id: 'rating-1',
      sectionType: 'rating',
      label: 'Rating',
      visible: true,
      position: createPosition(0, 45, 100, 5),
      zIndex: 2,
    },
    {
      id: 'specialties-1',
      sectionType: 'specialties',
      label: 'Specialties',
      visible: true,
      position: createPosition(0, 50, 100, 8),
      zIndex: 3,
    },
    {
      id: 'contact-1',
      sectionType: 'contact',
      label: 'Contact Info',
      visible: true,
      position: createPosition(0, 58, 100, 25),
      zIndex: 4,
    },
    {
      id: 'cardUrl-1',
      sectionType: 'cardUrl',
      label: 'Card URL',
      visible: true,
      position: createPosition(0, 85, 100, 8),
      zIndex: 5,
    },
    {
      id: 'branding-1',
      sectionType: 'branding',
      label: 'GLAMLINK Branding',
      visible: true,
      position: createPosition(0, 93, 100, 7),
      zIndex: 6,
    },
  ],
  styles: { ...DEFAULT_CONDENSED_CARD_STYLES },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create a new config with default values
 */
export function createDefaultCondensedCardConfig(): CondensedCardConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONDENSED_CARD_CONFIG));
}

// NOTE: mergeWithDefaultConfig has been moved to migration.ts to avoid circular dependency
// It is re-exported from condensedCardConfig.ts for backward compatibility
