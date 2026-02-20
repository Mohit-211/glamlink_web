/**
 * Column Components for Preview Section Rendering
 *
 * Primary Export:
 * - PreviewSegmentedLayout: Independent column flow with full-width interrupts (recommended)
 * - PreviewRowBasedLayout: Alias for PreviewSegmentedLayout (backward compatibility)
 *
 * Legacy Exports (for backward compatibility):
 * - PreviewColumnRenderer: Column-based renderer
 * - PreviewLeftColumn, PreviewRightColumn, PreviewFullWidthSections: Convenience wrappers
 *
 * Layout Utilities:
 * - groupSectionsIntoSegments: Groups sections into two-column and full-width segments
 *
 * Types:
 * - LayoutSegment, TwoColumnSegment, FullWidthSegment: Segment type definitions
 */

// Main components
export {
  default as PreviewColumnRenderer,
  PreviewSegmentedLayout,
  PreviewRowBasedLayout,
  PreviewLeftColumn,
  PreviewRightColumn,
  PreviewFullWidthSections,
  type ColumnType,
  type SignatureWorkSettings,
  type PreviewColumnRendererProps,
  type PreviewRowBasedLayoutProps,
  type PreviewSegmentedLayoutProps,
  type PreviewLeftColumnProps,
  type PreviewRightColumnProps,
  type PreviewFullWidthSectionsProps,
} from './PreviewColumnRenderer';

// Layout utilities
export {
  groupSectionsIntoSegments,
  getSectionsFromColumn,
  getFullWidthSections,
  countSections,
} from './layoutUtils';

// Types
export type {
  LayoutSegment,
  TwoColumnSegment,
  FullWidthSegment,
  LayoutStructure,
} from './types';
