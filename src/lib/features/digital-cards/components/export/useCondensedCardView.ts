'use client';

/**
 * useCondensedCardView - Shared hook for CondensedCardView and CondensedCardPositionOverlay
 *
 * Provides:
 * - Config processing (migration + merge with defaults)
 * - Sorted sections by z-index
 * - Position to CSS style conversion
 * - Video extraction for video sections
 * - Overlay color palette management
 */

import { useMemo } from 'react';
import type { Professional, GalleryItem } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardConfig, CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';
import type { PositionConfig, DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import {
  DEFAULT_CONDENSED_CARD_CONFIG,
  migrateCondensedCardConfig,
  mergeWithDefaultConfig,
} from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// TYPES
// =============================================================================

export interface OverlayColor {
  bg: string;
  border: string;
  label: string;
}

export interface UseCondensedCardViewProps {
  /** Optional configuration to process */
  config?: CondensedCardConfig;
}

export interface UseCondensedCardViewReturn {
  /** Processed and merged configuration */
  config: CondensedCardConfig;
  /** Card dimensions from config */
  cardWidth: number;
  cardHeight: number;
  /** Sections sorted by z-index (lower first) */
  sortedSections: CondensedCardSectionInstance[];
}

// =============================================================================
// OVERLAY COLOR PALETTE
// =============================================================================

export const OVERLAY_COLORS: OverlayColor[] = [
  { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgb(59, 130, 246)', label: 'Blue' },
  { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgb(236, 72, 153)', label: 'Pink' },
  { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgb(34, 197, 94)', label: 'Green' },
  { bg: 'rgba(249, 115, 22, 0.2)', border: 'rgb(249, 115, 22)', label: 'Orange' },
  { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgb(139, 92, 246)', label: 'Purple' },
  { bg: 'rgba(234, 179, 8, 0.2)', border: 'rgb(234, 179, 8)', label: 'Yellow' },
  { bg: 'rgba(20, 184, 166, 0.2)', border: 'rgb(20, 184, 166)', label: 'Teal' },
  { bg: 'rgba(244, 63, 94, 0.2)', border: 'rgb(244, 63, 94)', label: 'Red' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert PositionConfig to CSS styles for absolute positioning
 */
export function positionToStyle(
  position: PositionConfig,
  parentWidth: number,
  parentHeight: number
): React.CSSProperties {
  const getPixelValue = (dim: { value: number; unit: 'px' | '%' }, parentSize: number) => {
    if (dim.unit === 'px') return dim.value;
    return (dim.value / 100) * parentSize;
  };

  return {
    position: 'absolute',
    left: `${getPixelValue(position.x, parentWidth)}px`,
    top: `${getPixelValue(position.y, parentHeight)}px`,
    width: `${getPixelValue(position.width, parentWidth)}px`,
    height: `${getPixelValue(position.height, parentHeight)}px`,
  };
}

/**
 * Format dimension value to CSS string
 */
export function formatDimension(dim: DimensionValue): string {
  return `${dim.value}${dim.unit}`;
}

/**
 * Get color for section index (cycles through palette)
 */
export function getColorForIndex(index: number): OverlayColor {
  return OVERLAY_COLORS[index % OVERLAY_COLORS.length];
}

/**
 * Extract video from professional.gallery for video sections
 *
 * This ensures video sections display the user's actual video from gallery
 * instead of falling back to default placeholder videos.
 *
 * @param professional - Professional data containing gallery
 * @param sectionType - Section type ID (e.g., 'signature-work', 'video-display')
 * @returns First video from gallery, or null if none found
 */
export function extractVideoForSection(
  professional: Professional,
  sectionType: string
): GalleryItem | null {
  // Only extract video for video-based sections
  if (sectionType === 'signature-work' || sectionType === 'video-display') {
    const videoItem = professional.gallery?.find(item => item.type === 'video');
    return videoItem || null;
  }
  return null;
}

// =============================================================================
// MAIN HOOK
// =============================================================================

/**
 * useCondensedCardView - Process config and provide sorted sections
 *
 * Used by both CondensedCardView and CondensedCardPositionOverlay components.
 */
export function useCondensedCardView({
  config: configProp,
}: UseCondensedCardViewProps): UseCondensedCardViewReturn {
  // Migrate and merge provided config with defaults
  const config = useMemo<CondensedCardConfig>(() => {
    if (!configProp) return DEFAULT_CONDENSED_CARD_CONFIG;

    // Migrate if needed (handles old Record format)
    const migrated = migrateCondensedCardConfig(configProp);

    // Merge with defaults
    return mergeWithDefaultConfig(migrated);
  }, [configProp]);

  // Get dimensions from config
  const { width: cardWidth, height: cardHeight } = config.dimensions;

  // Sort sections by z-index (lower z-index renders first)
  const sortedSections = useMemo(() => {
    return [...config.sections].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  }, [config.sections]);

  return {
    config,
    cardWidth,
    cardHeight,
    sortedSections,
  };
}

export default useCondensedCardView;
