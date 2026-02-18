/**
 * Condensed Card Migration Utilities
 *
 * Functions for migrating old config formats to new formats.
 */

import type { CondensedCardConfig } from './styles';
import type { CondensedCardSectionInstance, SectionColumn } from './sections';
import type { PositionConfig, DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import { DEFAULT_CONDENSED_CARD_STYLES, createDefaultCondensedCardConfig } from './defaults';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract numeric value from a DimensionValue or number
 * Handles both legacy number values and new DimensionValue objects
 */
function getDimensionNumber(dim: DimensionValue | number | undefined): number {
  if (dim === undefined) return 0;
  if (typeof dim === 'number') return dim;
  return dim.value;
}

// =============================================================================
// COLUMN/ROW DERIVATION UTILITIES
// =============================================================================

/**
 * Derive column from position
 * Left column: x < 50% of width
 * Right column: x >= 50% of width
 * Full width: width >= 90% of container
 *
 * @param position - Section position config
 * @param containerWidth - Container width (default 1080 for Instagram portrait)
 * @returns Derived column placement
 */
export function deriveColumnFromPosition(
  position: PositionConfig | undefined,
  containerWidth: number = 1080
): SectionColumn {
  if (!position) return 'left';

  const x = getDimensionNumber(position.x);
  const width = getDimensionNumber(position.width);

  // Full width if section spans 90% or more of container
  if (width >= containerWidth * 0.9) {
    return 'full';
  }

  // Left column if x is in left half
  const midpoint = containerWidth / 2;
  return x < midpoint ? 'left' : 'right';
}

/**
 * Derive row order from y position
 * Sections with similar y values are grouped into the same row
 *
 * @param sections - Array of sections to derive row orders for
 * @returns Sections with rowOrder populated
 */
export function deriveRowOrders(
  sections: CondensedCardSectionInstance[]
): CondensedCardSectionInstance[] {
  // Sort sections by y position
  const sorted = [...sections].sort((a, b) => {
    const yA = getDimensionNumber(a.position?.y);
    const yB = getDimensionNumber(b.position?.y);
    return yA - yB;
  });

  // Group sections by similar y positions (within 50px threshold)
  const threshold = 50;
  let currentRowIndex = 0;
  let lastY = -Infinity;

  return sorted.map((section) => {
    const y = getDimensionNumber(section.position?.y);

    // If y is significantly different from last y, start a new row
    if (y - lastY > threshold) {
      currentRowIndex++;
    }
    lastY = y;

    return {
      ...section,
      rowOrder: section.rowOrder ?? currentRowIndex,
    };
  });
}

// =============================================================================
// MIGRATION UTILITIES
// =============================================================================

/**
 * Migrate old Record-based config to new array-based config
 * Automatically converts legacy configs to the new format
 * Also populates column and rowOrder for sections that don't have them
 *
 * @param config - Config to migrate (can be old or new format)
 * @returns Migrated config with array-based sections
 */
export function migrateCondensedCardConfig(config: any): CondensedCardConfig {
  // No config provided - return default
  if (!config) {
    return createDefaultCondensedCardConfig();
  }

  const containerWidth = config?.dimensions?.width || 1080;

  // Already migrated (has array sections)
  if (Array.isArray(config?.sections)) {
    // Still need to populate column/rowOrder if missing
    const sectionsWithColumnRow = populateColumnAndRowOrder(
      config.sections,
      containerWidth
    );

    return {
      ...config,
      sections: sectionsWithColumnRow,
    } as CondensedCardConfig;
  }

  // Convert old Record to array
  let sections: CondensedCardSectionInstance[] = [];

  if (config?.sections && typeof config.sections === 'object' && !Array.isArray(config.sections)) {
    const oldSections = config.sections as Record<string, any>;
    let zIndex = 0;

    // Convert each old section to new format
    for (const [sectionId, sectionConfig] of Object.entries(oldSections)) {
      const position = sectionConfig.position;

      sections.push({
        id: `${sectionId}-1`,                      // Unique instance ID
        sectionType: sectionId,                    // Use old ID as section type
        label: sectionConfig.label || sectionId,   // Preserve label
        visible: sectionConfig.visible ?? true,    // Preserve visibility
        position: position,                        // Preserve position
        zIndex: zIndex++,                          // Sequential z-index
        column: deriveColumnFromPosition(position, containerWidth),  // Derive column
      });
    }
  }

  // Derive row orders for all sections
  sections = deriveRowOrders(sections);

  // Return migrated config
  return {
    dimensions: config?.dimensions || {
      preset: 'instagram-portrait',
      width: 1080,
      height: 1350,
    },
    sections,
    styles: config?.styles || { ...DEFAULT_CONDENSED_CARD_STYLES },
  };
}

/**
 * Populate column and rowOrder for sections that don't have them
 * Used for existing array-based configs that need column/rowOrder migration
 *
 * @param sections - Array of sections
 * @param containerWidth - Container width for column derivation
 * @returns Sections with column and rowOrder populated
 */
export function populateColumnAndRowOrder(
  sections: CondensedCardSectionInstance[],
  containerWidth: number = 1080
): CondensedCardSectionInstance[] {
  // First, populate column for sections that don't have it
  const sectionsWithColumn = sections.map((section) => {
    if (section.column) {
      return section;
    }

    return {
      ...section,
      column: deriveColumnFromPosition(section.position, containerWidth),
    };
  });

  // Then, populate rowOrder for sections that don't have it
  const needsRowOrder = sectionsWithColumn.some((s) => s.rowOrder === undefined);

  if (needsRowOrder) {
    return deriveRowOrders(sectionsWithColumn);
  }

  return sectionsWithColumn;
}

/**
 * Generate unique instance ID for a section
 *
 * @param sectionType - Section type (e.g., "header", "signature-work")
 * @param existingSections - Array of existing sections
 * @returns Unique instance ID (e.g., "header-1", "signature-work-2")
 */
export function generateSectionInstanceId(
  sectionType: string,
  existingSections: CondensedCardSectionInstance[]
): string {
  // Count existing instances of this type
  const existingCount = existingSections.filter(s => s.sectionType === sectionType).length;

  // Generate ID with incrementing suffix
  return `${sectionType}-${existingCount + 1}`;
}

/**
 * Merge partial config with defaults
 * Handles both old Record format and new array format
 *
 * NOTE: This function was moved here from defaults.ts to avoid circular dependency
 */
export function mergeWithDefaultConfig(partial: Partial<CondensedCardConfig> | any): CondensedCardConfig {
  // First, migrate if needed
  const migrated = migrateCondensedCardConfig(partial);
  const defaultConfig = createDefaultCondensedCardConfig();

  return {
    dimensions: {
      ...defaultConfig.dimensions,
      ...migrated.dimensions,
    },
    sections: migrated.sections.length > 0 ? migrated.sections : defaultConfig.sections,
    styles: {
      ...defaultConfig.styles,
      ...migrated.styles,
    },
  };
}
