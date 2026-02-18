// ============================================
// TYPOGRAPHY DEFAULT VALUES
// ============================================

import type { TypographySettings } from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';

/**
 * Default typography values for title text
 * Used when no custom typography is provided
 */
export const DEFAULT_TITLE_TYPOGRAPHY: TypographySettings = {
  fontSize: 'text-4xl md:text-5xl',
  fontFamily: 'font-sans',
  fontWeight: 'font-bold',
  alignment: 'left',
  color: 'text-gray-900'
};

/**
 * Default typography values for subtitle text
 * Used when no custom typography is provided
 */
export const DEFAULT_SUBTITLE_TYPOGRAPHY: TypographySettings = {
  fontSize: 'text-xl',
  fontFamily: 'font-sans',
  fontWeight: 'font-normal',
  alignment: 'left',
  color: 'text-gray-600'
};

/**
 * Default typography values for white title text (on dark backgrounds)
 * Used for cover images with overlays
 */
export const DEFAULT_TITLE_TYPOGRAPHY_WHITE: TypographySettings = {
  fontSize: 'text-4xl md:text-5xl',
  fontFamily: 'font-sans',
  fontWeight: 'font-bold',
  alignment: 'left',
  color: 'text-white'
};

/**
 * Default typography values for white subtitle text (on dark backgrounds)
 * Used for cover images with overlays
 */
export const DEFAULT_SUBTITLE_TYPOGRAPHY_WHITE: TypographySettings = {
  fontSize: 'text-xl',
  fontFamily: 'font-sans',
  fontWeight: 'font-normal',
  alignment: 'left',
  color: 'text-white'
};
