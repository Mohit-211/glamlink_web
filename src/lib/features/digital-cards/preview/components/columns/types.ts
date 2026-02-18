/**
 * Types for Segmented Column Layout
 *
 * The segmented layout allows:
 * - Independent column flow (left and right columns stack independently)
 * - Full-width sections that interrupt the two-column layout
 * - Content continues in two-column layout after full-width sections
 */

import type { WebsiteSectionInfo } from '../../utils/sectionUtils';

/**
 * A two-column segment where left and right columns flow independently
 */
export interface TwoColumnSegment {
  type: 'two-column';
  /** Sections in the left column, sorted by rowOrder */
  left: WebsiteSectionInfo[];
  /** Sections in the right column, sorted by rowOrder */
  right: WebsiteSectionInfo[];
}

/**
 * A full-width segment containing a single section that spans both columns
 */
export interface FullWidthSegment {
  type: 'full-width';
  /** The full-width section */
  section: WebsiteSectionInfo;
}

/**
 * A layout segment - either two-column or full-width
 */
export type LayoutSegment = TwoColumnSegment | FullWidthSegment;

/**
 * Complete layout structure as an array of segments
 */
export interface LayoutStructure {
  /** Ordered array of layout segments */
  segments: LayoutSegment[];
}
