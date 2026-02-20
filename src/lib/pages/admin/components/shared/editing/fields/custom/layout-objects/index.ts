/**
 * Layout Objects Module
 *
 * Shared components for building custom layout pages with positioned objects.
 * Supports Text, Image, Spacer, Custom Block, and Link object types.
 *
 * Usage:
 * ```typescript
 * import {
 *   CustomLayoutEditor,
 *   CustomObject,
 *   createDefaultTextObject,
 *   formatDimension,
 * } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
 * ```
 */

// =============================================================================
// TYPES
// =============================================================================

export * from './types';

// =============================================================================
// SHARED UTILITIES
// =============================================================================

export {
  // Tailwind to CSS conversion
  convertFontSize,
  convertColor,
  convertFontFamily,
  convertFontWeight,
  convertTypographySettings,
  // Typography helpers
  type TypographySettings,
  isTypographySettings,
  normalizeTypography,
  getDefaultTitleTypography,
  getDefaultSubtitleTypography,
  extractText,
  applyTypographyStyles,
  // HTML content processing
  addParagraphSpacing,
  addHeadingSpacing,
  addListSpacing,
  processHtmlForCanvas,
  // Data extractors
  type DataExtractor,
  extractors,
  searchContentForFields,
  // Sub-spacer editor
  SubSpacerEditor,
} from './shared';

// =============================================================================
// OBJECT TYPE FIELDS (Text, Image, Link, Custom Block forms)
// =============================================================================

export {
  // Text
  TextSpacerEditor,
  TextObjectForm,
  // Image
  ImageObjectForm,
  // Link
  LinkObjectForm,
  // Custom Block
  CustomBlockForm,
  CustomBlockSelector,
  LoadFromSectionButton,
  useLoadFromSection,
  SectionSelectionModal,
  ConfirmOverwriteModal,
} from './fields';

// =============================================================================
// EDITOR COMPONENTS
// =============================================================================

export { CustomLayoutEditor, ObjectItem, ObjectForm, CustomLayoutEditorField } from './editor';

// =============================================================================
// NOTE: block-selector has been moved to a separate directory at:
// @/lib/pages/admin/components/shared/editing/fields/custom/block-selector
// Import block-selector components directly from that path.
// =============================================================================
