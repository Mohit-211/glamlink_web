/**
 * Layout Utilities for Segmented Column Layout
 *
 * Groups sections into segments for rendering:
 * - Two-column segments: left and right columns flow independently
 * - Full-width segments: single section spanning both columns
 *
 * Full-width sections act as "breakpoints" that separate two-column segments.
 */

import type { CondensedCardConfig } from '@/lib/features/digital-cards/types';
import {
  getWebsiteSectionsFromCondensedConfig,
  type WebsiteSectionInfo,
} from '../../utils/sectionUtils';
import type { LayoutSegment, TwoColumnSegment, LayoutStructure } from './types';

/**
 * Creates an empty two-column segment
 */
function createEmptyTwoColumnSegment(): TwoColumnSegment {
  return {
    type: 'two-column',
    left: [],
    right: [],
  };
}

/**
 * Checks if a two-column segment has any content
 */
function hasTwoColumnContent(segment: TwoColumnSegment): boolean {
  return segment.left.length > 0 || segment.right.length > 0;
}

/**
 * Groups sections into layout segments.
 *
 * Algorithm:
 * 1. Sort all sections by rowOrder (already done by getWebsiteSectionsFromCondensedConfig)
 * 2. Iterate through sections in order
 * 3. Accumulate left/right sections into the current two-column segment
 * 4. When a full-width section is encountered:
 *    - Close the current two-column segment (if it has content)
 *    - Add the full-width section as its own segment
 *    - Start a new two-column segment
 * 5. After iteration, close any remaining two-column segment
 *
 * @param config - The condensed card configuration
 * @param cardWidth - Card width for position calculations (default: 1080)
 * @param cardHeight - Card height for position calculations (default: 1920)
 * @returns LayoutStructure with ordered segments
 */
export function groupSectionsIntoSegments(
  config: CondensedCardConfig | undefined,
  cardWidth: number = 1080,
  cardHeight: number = 1920
): LayoutStructure {
  const allSections = getWebsiteSectionsFromCondensedConfig(config, cardWidth, cardHeight);

  if (allSections.length === 0) {
    return { segments: [] };
  }

  const segments: LayoutSegment[] = [];
  let currentTwoColumn = createEmptyTwoColumnSegment();

  for (const section of allSections) {
    if (section.column === 'full') {
      // Full-width section encountered - close current two-column segment if it has content
      if (hasTwoColumnContent(currentTwoColumn)) {
        segments.push(currentTwoColumn);
        currentTwoColumn = createEmptyTwoColumnSegment();
      }

      // Add the full-width section as its own segment
      segments.push({
        type: 'full-width',
        section,
      });
    } else if (section.column === 'left') {
      // Add to left column of current segment
      currentTwoColumn.left.push(section);
    } else if (section.column === 'right') {
      // Add to right column of current segment
      currentTwoColumn.right.push(section);
    }
  }

  // Close any remaining two-column segment
  if (hasTwoColumnContent(currentTwoColumn)) {
    segments.push(currentTwoColumn);
  }

  return { segments };
}

/**
 * Gets sections for a specific column from a LayoutStructure.
 * Useful for debugging or when you need just one column's sections.
 *
 * @param structure - The layout structure
 * @param column - Which column to extract ('left' | 'right')
 * @returns Array of sections for that column across all two-column segments
 */
export function getSectionsFromColumn(
  structure: LayoutStructure,
  column: 'left' | 'right'
): WebsiteSectionInfo[] {
  const sections: WebsiteSectionInfo[] = [];

  for (const segment of structure.segments) {
    if (segment.type === 'two-column') {
      sections.push(...segment[column]);
    }
  }

  return sections;
}

/**
 * Gets all full-width sections from a LayoutStructure.
 *
 * @param structure - The layout structure
 * @returns Array of full-width sections in order
 */
export function getFullWidthSections(structure: LayoutStructure): WebsiteSectionInfo[] {
  const sections: WebsiteSectionInfo[] = [];

  for (const segment of structure.segments) {
    if (segment.type === 'full-width') {
      sections.push(segment.section);
    }
  }

  return sections;
}

/**
 * Counts the total number of sections in a LayoutStructure.
 *
 * @param structure - The layout structure
 * @returns Total section count
 */
export function countSections(structure: LayoutStructure): number {
  let count = 0;

  for (const segment of structure.segments) {
    if (segment.type === 'full-width') {
      count += 1;
    } else {
      count += segment.left.length + segment.right.length;
    }
  }

  return count;
}
