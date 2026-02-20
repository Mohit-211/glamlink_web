/**
 * Shared utilities for layout-objects
 *
 * These utilities are used across multiple object types (text, image, custom-block, etc.)
 */

// Tailwind to CSS conversion for html2canvas
export {
  convertFontSize,
  convertColor,
  convertFontFamily,
  convertFontWeight,
  convertTypographySettings,
} from './tailwindConverter';

// Typography helpers for text styling
export {
  type TypographySettings,
  isTypographySettings,
  normalizeTypography,
  getDefaultTitleTypography,
  getDefaultSubtitleTypography,
  extractText,
  applyTypographyStyles,
} from './typographyHelpers';

// HTML content processing for canvas rendering
export {
  addParagraphSpacing,
  addHeadingSpacing,
  addListSpacing,
  processHtmlForCanvas,
} from './htmlContentHelpers';

// Data extractors for custom block components
export {
  type DataExtractor,
  extractors,
  searchContentForFields,
} from './dataExtractors';

// Sub-spacer editor component
export { default as SubSpacerEditor } from './SubSpacerEditor';
