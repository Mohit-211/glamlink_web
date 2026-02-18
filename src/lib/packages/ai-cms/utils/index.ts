/**
 * Utilities - Exports
 * 
 * Centralized exports for all utility functions in the ai-cms package.
 */

// HTML Formatter utilities
export {
  formatHtmlForDisplay,
  stripHtmlTags,
  textToHtml,
  sanitizeHtml,
  getHtmlTextLength,
  truncateHtml,
  getHtmlPreview
} from './formatters/htmlFormatter';

// Text Formatter utilities  
export {
  capitalize,
  toTitleCase,
  truncateText,
  extractWords,
  countWords,
  estimateReadingTime,
  slugify,
  normalizeWhitespace,
  toSentenceCase,
  wrapText,
  getInitials,
  formatName
} from './formatters/textFormatter';

// Validator utilities (when implemented)
export * from './validators';

// Parser utilities (when implemented)
export * from './parsers';