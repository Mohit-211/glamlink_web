/**
 * Section Utilities for Dynamic Digital Business Card Rendering
 *
 * Handles section visibility, ordering, and column assignments.
 * Supports both legacy sectionsConfig and new condensedCardConfig.
 *
 * The condensedCardConfig is now the single source of truth. Website column
 * placement is derived from the x position and width of sections.
 */

import type { ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardConfig } from '@/lib/features/digital-cards/types';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/sections';
import { DEFAULT_SECTIONS_CONFIG, DEFAULT_SECTION_COLUMNS } from '@/lib/pages/admin/config/sectionsRegistry';

// =============================================================================
// TYPES
// =============================================================================

export interface SectionVisibilityResult {
  /** Whether the section should be visible */
  isVisible: boolean;
  /** The desktop order of the section */
  desktopOrder: number;
  /** The mobile order of the section */
  mobileOrder: number;
  /** The column assignment */
  column: 'left' | 'right' | 'full';
}

// =============================================================================
// SECTION COLUMN MAPPINGS (Legacy - for backward compatibility)
// =============================================================================

/**
 * Maps section IDs to their default column assignment.
 * Used when migrating old configs without column field.
 * @deprecated Use DEFAULT_SECTION_COLUMNS from sectionsRegistry instead
 */
export const SECTION_COLUMN_MAP: Record<string, 'left' | 'right'> = {
  // Left column sections
  'bio-simple': 'left',
  'bio-preview': 'left',
  'signature-work-actions': 'left',
  'signature-work': 'left',
  'video-display': 'left',

  // Right column sections - new unified IDs
  'map': 'right',
  'specialties': 'right',
  'importantInfo': 'right',
  'current-promotions': 'right',
  'current-promotions-detailed': 'right',
  'business-hours': 'right',
  'overview-stats': 'right',

  // Right column sections - old IDs (backward compatibility)
  'map-section': 'right',
  'specialties-section': 'right',
  'important-info': 'right',
};

// =============================================================================
// MIGRATION UTILITIES
// =============================================================================

/**
 * Migrate a single section config from legacy format to new format
 * Legacy format: { id, visible, order }
 * New format: { id, visible, column, desktopOrder, mobileOrder }
 */
function migrateSection(section: any, index: number): ProfessionalSectionConfig {
  // If already has new fields, return as-is
  if (section.column !== undefined && section.desktopOrder !== undefined && section.mobileOrder !== undefined) {
    return section as ProfessionalSectionConfig;
  }

  // Migrate from legacy format
  const column = section.column || SECTION_COLUMN_MAP[section.id] || DEFAULT_SECTION_COLUMNS[section.id] || 'right';
  const legacyOrder = section.order ?? index;

  return {
    ...section,
    column,
    desktopOrder: section.desktopOrder ?? legacyOrder,
    mobileOrder: section.mobileOrder ?? legacyOrder,
  };
}

/**
 * Migrate an array of section configs from legacy format to new format
 */
export function migrateSectionsConfig(config: any[]): ProfessionalSectionConfig[] {
  return config.map((section, index) => migrateSection(section, index));
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the effective sections config, falling back to defaults if not provided.
 * Automatically migrates legacy configs to new format.
 */
export function getSectionsConfig(
  professionalSectionsConfig?: ProfessionalSectionConfig[]
): ProfessionalSectionConfig[] {
  if (professionalSectionsConfig && professionalSectionsConfig.length > 0) {
    // Migrate any legacy format sections
    return migrateSectionsConfig(professionalSectionsConfig);
  }
  return DEFAULT_SECTIONS_CONFIG as ProfessionalSectionConfig[];
}

/**
 * Check if a section is visible and get its ordering info
 */
export function getSectionVisibility(
  sectionId: string,
  sectionsConfig?: ProfessionalSectionConfig[]
): SectionVisibilityResult {
  const config = getSectionsConfig(sectionsConfig);
  const section = config.find(s => s.id === sectionId);

  if (!section) {
    // Section not in config - default to visible with high order
    const defaultColumn = SECTION_COLUMN_MAP[sectionId] || 'right';
    return { isVisible: true, desktopOrder: 999, mobileOrder: 999, column: defaultColumn };
  }

  return {
    isVisible: section.visible !== false,
    desktopOrder: section.desktopOrder ?? 999,
    mobileOrder: section.mobileOrder ?? 999,
    column: section.column || SECTION_COLUMN_MAP[section.id] || 'right',
  };
}

/**
 * Check if a section should be visible
 */
export function isSectionVisible(
  sectionId: string,
  sectionsConfig?: ProfessionalSectionConfig[]
): boolean {
  return getSectionVisibility(sectionId, sectionsConfig).isVisible;
}

/**
 * Get all visible sections for a specific column, sorted by desktop order
 */
export function getVisibleSectionsForColumn(
  column: 'left' | 'right',
  sectionsConfig?: ProfessionalSectionConfig[],
  useDesktopOrder: boolean = true
): ProfessionalSectionConfig[] {
  const config = getSectionsConfig(sectionsConfig);

  return config
    .filter(section => {
      // Use section's column field if available, otherwise fall back to default
      const sectionColumn = section.column || SECTION_COLUMN_MAP[section.id] || 'right';
      return sectionColumn === column && section.visible !== false;
    })
    .sort((a, b) => {
      if (useDesktopOrder) {
        return (a.desktopOrder ?? 999) - (b.desktopOrder ?? 999);
      }
      return (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999);
    });
}

/**
 * Get all visible sections sorted for mobile view (single column, uses mobileOrder)
 */
export function getVisibleSectionsForMobile(
  sectionsConfig?: ProfessionalSectionConfig[]
): ProfessionalSectionConfig[] {
  const config = getSectionsConfig(sectionsConfig);

  return config
    .filter(section => section.visible !== false)
    .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999));
}

/**
 * Get the column assignment for a section from its config or default
 */
export function getSectionColumn(
  sectionId: string,
  sectionsConfig?: ProfessionalSectionConfig[]
): 'left' | 'right' | 'full' {
  const config = getSectionsConfig(sectionsConfig);
  const section = config.find(s => s.id === sectionId);

  if (section?.column) {
    return section.column;
  }

  return SECTION_COLUMN_MAP[sectionId] || 'right';
}

// =============================================================================
// CONDENSED CARD CONFIG → WEBSITE DERIVATION
// =============================================================================

/**
 * Website-friendly section info derived from condensed card config
 */
export interface WebsiteSectionInfo {
  /** Section ID (from condensedCardConfig) */
  id: string;
  /** The section type (e.g., 'specialties', 'map', 'contentContainer') */
  sectionType: string;
  /** Inner section type for wrapper sections (contentContainer, mapAndContentContainer) */
  innerSectionType?: string;
  /** Derived column placement */
  column: 'left' | 'right' | 'full';
  /** Y position for ordering */
  yPosition: number;
  /** Whether section is visible */
  visible: boolean;
  /** Section props */
  props?: Record<string, any>;
  /** Inner section props for wrapper sections */
  innerSectionProps?: Record<string, any>;
}

/**
 * Get the position value in percentage (handles both px and % units)
 * For px values, assumes a standard card width of 1080px for conversion
 */
function getPositionAsPercentage(dim: { value: number; unit: 'px' | '%' }, cardWidth: number = 1080): number {
  if (dim.unit === '%') {
    return dim.value;
  }
  // Convert px to % based on card width
  return (dim.value / cardWidth) * 100;
}

/**
 * Derive website column placement from condensed card section position.
 *
 * Logic:
 * - Width >= 80% → 'full'
 * - X position < 50% → 'left'
 * - Otherwise → 'right'
 */
export function deriveColumnFromPosition(
  section: CondensedCardSectionInstance,
  cardWidth: number = 1080
): 'left' | 'right' | 'full' {
  if (!section.position) {
    return 'right'; // Default fallback
  }

  const width = getPositionAsPercentage(section.position.width, cardWidth);
  const x = getPositionAsPercentage(section.position.x, cardWidth);

  // Full width if width >= 80%
  if (width >= 80) {
    return 'full';
  }

  // Left column if x position is in left half
  if (x < 50) {
    return 'left';
  }

  return 'right';
}

/**
 * Sort sections by Y position (top to bottom)
 */
export function sortSectionsByYPosition(
  sections: CondensedCardSectionInstance[],
  cardHeight: number = 1920
): CondensedCardSectionInstance[] {
  return [...sections].sort((a, b) => {
    const aY = a.position ? getPositionAsPercentage(a.position.y, cardHeight) : 999;
    const bY = b.position ? getPositionAsPercentage(b.position.y, cardHeight) : 999;
    return aY - bY;
  });
}

/**
 * Get the effective section type for rendering.
 * For wrapper sections (contentContainer, mapAndContentContainer), returns the inner type.
 */
function getEffectiveSectionType(section: CondensedCardSectionInstance): string {
  // For wrapper sections, use the inner section type
  if (
    (section.sectionType === 'contentContainer' || section.sectionType === 'mapAndContentContainer') &&
    section.props?.innerSectionType
  ) {
    return section.props.innerSectionType;
  }
  return section.sectionType;
}

/**
 * Sort sections by rowOrder (if available) or Y position
 */
export function sortSectionsByRowOrder(
  sections: CondensedCardSectionInstance[],
  cardHeight: number = 1920
): CondensedCardSectionInstance[] {
  return [...sections].sort((a, b) => {
    // Prefer rowOrder if both have it
    if (a.rowOrder !== undefined && b.rowOrder !== undefined) {
      return a.rowOrder - b.rowOrder;
    }
    // If only one has rowOrder, it comes first
    if (a.rowOrder !== undefined) return -1;
    if (b.rowOrder !== undefined) return 1;
    // Fall back to Y position
    const aY = a.position ? getPositionAsPercentage(a.position.y, cardHeight) : 999;
    const bY = b.position ? getPositionAsPercentage(b.position.y, cardHeight) : 999;
    return aY - bY;
  });
}

/**
 * Get the column for a condensed card section - uses explicit column property if available,
 * otherwise derives from position.
 */
export function getCondensedSectionColumn(
  section: CondensedCardSectionInstance,
  cardWidth: number = 1080
): 'left' | 'right' | 'full' {
  // Use explicit column property if set
  if (section.column) {
    return section.column;
  }
  // Fall back to deriving from position
  return deriveColumnFromPosition(section, cardWidth);
}

/**
 * Convert condensed card config to website-friendly section info array.
 * This is the main function for deriving website layout from condensed card config.
 *
 * Uses explicit `column` property if set, otherwise derives from position.
 * Uses `rowOrder` for sorting if available, otherwise uses Y position.
 */
export function getWebsiteSectionsFromCondensedConfig(
  config: CondensedCardConfig | undefined,
  cardWidth: number = 1080,
  cardHeight: number = 1920
): WebsiteSectionInfo[] {
  if (!config?.sections || config.sections.length === 0) {
    return [];
  }

  // Filter to only visible sections
  const visibleSections = config.sections.filter(s => s.visible !== false);

  // Sort by rowOrder (preferred) or Y position (fallback)
  const sorted = sortSectionsByRowOrder(visibleSections, cardHeight);

  // Convert to website-friendly format
  return sorted.map(section => ({
    id: section.id,
    sectionType: section.sectionType,
    innerSectionType: section.props?.innerSectionType,
    column: getCondensedSectionColumn(section, cardWidth),
    yPosition: section.rowOrder ?? (section.position ? getPositionAsPercentage(section.position.y, cardHeight) : 999),
    visible: section.visible !== false,
    props: section.props,
    innerSectionProps: section.props?.innerSectionProps,
  }));
}

/**
 * Get visible sections for a specific column from condensed card config.
 * Replaces getVisibleSectionsForColumn for condensed card config.
 */
export function getWebsiteSectionsForColumn(
  config: CondensedCardConfig | undefined,
  column: 'left' | 'right' | 'full',
  cardWidth: number = 1080,
  cardHeight: number = 1920
): WebsiteSectionInfo[] {
  const allSections = getWebsiteSectionsFromCondensedConfig(config, cardWidth, cardHeight);
  return allSections.filter(s => s.column === column);
}

/**
 * Represents a row in the preview layout
 */
export interface PreviewLayoutRow {
  /** Row index (based on rowOrder) */
  rowIndex: number;
  /** Section in the left column (if any) */
  left?: WebsiteSectionInfo;
  /** Section in the right column (if any) */
  right?: WebsiteSectionInfo;
  /** Full-width section (if any) */
  full?: WebsiteSectionInfo;
  /** Whether this row has a full-width section */
  isFullWidth: boolean;
}

/**
 * Group sections into rows for preview rendering.
 * This ensures sections are rendered in row order (top to bottom)
 * instead of column order (all left, then all right, then full).
 */
export function groupWebsiteSectionsIntoRows(
  config: CondensedCardConfig | undefined,
  cardWidth: number = 1080,
  cardHeight: number = 1920
): PreviewLayoutRow[] {
  const allSections = getWebsiteSectionsFromCondensedConfig(config, cardWidth, cardHeight);

  if (allSections.length === 0) {
    return [];
  }

  // Group sections by their yPosition (rowOrder)
  const rowMap = new Map<number, PreviewLayoutRow>();

  for (const section of allSections) {
    const rowIndex = section.yPosition;

    if (!rowMap.has(rowIndex)) {
      rowMap.set(rowIndex, {
        rowIndex,
        isFullWidth: false,
      });
    }

    const row = rowMap.get(rowIndex)!;

    if (section.column === 'full') {
      row.full = section;
      row.isFullWidth = true;
    } else if (section.column === 'left') {
      row.left = section;
    } else if (section.column === 'right') {
      row.right = section;
    }
  }

  // Convert to array and sort by rowIndex
  return Array.from(rowMap.values()).sort((a, b) => a.rowIndex - b.rowIndex);
}

/**
 * Check if a section type is visible in the condensed card config.
 * Handles both direct sections and wrapped sections (contentContainer).
 */
export function isSectionTypeVisibleInCondensedConfig(
  config: CondensedCardConfig | undefined,
  sectionType: string
): boolean {
  if (!config?.sections) return false;

  return config.sections.some(section => {
    // Direct match
    if (section.sectionType === sectionType && section.visible !== false) {
      return true;
    }
    // Wrapped in container
    if (
      (section.sectionType === 'contentContainer' || section.sectionType === 'mapAndContentContainer') &&
      section.props?.innerSectionType === sectionType &&
      section.visible !== false
    ) {
      return true;
    }
    return false;
  });
}

/**
 * Get section props from condensed card config by section type.
 * Returns the innerSectionProps for wrapped sections.
 */
export function getSectionPropsFromCondensedConfig(
  config: CondensedCardConfig | undefined,
  sectionType: string
): Record<string, any> | undefined {
  if (!config?.sections) return undefined;

  const section = config.sections.find(s => {
    // Direct match
    if (s.sectionType === sectionType) return true;
    // Wrapped in container
    if (
      (s.sectionType === 'contentContainer' || s.sectionType === 'mapAndContentContainer') &&
      s.props?.innerSectionType === sectionType
    ) {
      return true;
    }
    return false;
  });

  if (!section) return undefined;

  // For wrapped sections, return innerSectionProps
  if (
    (section.sectionType === 'contentContainer' || section.sectionType === 'mapAndContentContainer') &&
    section.props?.innerSectionType === sectionType
  ) {
    return section.props.innerSectionProps;
  }

  return section.props;
}
