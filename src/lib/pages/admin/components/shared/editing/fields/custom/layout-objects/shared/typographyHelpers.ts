import type { TypographySettings as BaseTypographySettings } from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';
import {
  convertFontSize,
  convertColor,
  convertFontFamily,
  convertFontWeight,
} from './tailwindConverter';

/**
 * Typography Helpers
 *
 * Utility functions for handling typography settings in custom layout objects.
 * Supports backward compatibility by handling both string and TypographySettings formats.
 * Includes Tailwind-to-CSS conversion for html2canvas compatibility.
 */

// Extended TypographySettings with text content field
export interface TypographySettings extends BaseTypographySettings {
  text?: string;
}

/**
 * Check if value is TypographySettings object
 */
export function isTypographySettings(value: any): value is TypographySettings {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Normalize title/subtitle to TypographySettings
 * Handles both string and TypographySettings input for backward compatibility
 */
export function normalizeTypography(
  value: string | TypographySettings | undefined
): TypographySettings {
  if (!value) {
    return {
      text: '',
      fontSize: undefined,
      fontFamily: undefined,
      fontWeight: undefined,
      alignment: 'left',
      color: undefined,
      tag: 'h3',
    };
  }

  if (typeof value === 'string') {
    // Old string format - convert to TypographySettings with text
    return {
      text: value,
      fontSize: undefined,
      fontFamily: undefined,
      fontWeight: undefined,
      alignment: 'left',
      color: undefined,
      tag: 'h3',
    };
  }

  return value;
}

/**
 * Get default TypographySettings for title
 */
export function getDefaultTitleTypography(): TypographySettings {
  return {
    text: '',
    fontSize: '32px',
    fontFamily: 'Playfair Display',
    fontWeight: '700',
    alignment: 'left',
    color: '#1f2937', // gray-800
    tag: 'h2',
  };
}

/**
 * Get default TypographySettings for subtitle
 */
export function getDefaultSubtitleTypography(): TypographySettings {
  return {
    text: '',
    fontSize: '18px',
    fontFamily: 'Inter',
    fontWeight: '400',
    alignment: 'left',
    color: '#6b7280', // gray-500
    tag: 'h3',
  };
}

/**
 * Extract text from title/subtitle (handles both string and TypographySettings)
 */
export function extractText(value: string | TypographySettings | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.text || '';
}

/**
 * Apply TypographySettings to inline styles
 * Converts TypographySettings object to React CSS properties
 *
 * IMPORTANT: Converts Tailwind classes to CSS values for html2canvas compatibility.
 * Without conversion, Tailwind classes like "text-5xl" would be invalid inline styles.
 */
export function applyTypographyStyles(
  settings: TypographySettings | string | undefined
): { style: React.CSSProperties } {
  if (!settings || typeof settings === 'string') {
    return { style: {} };
  }

  // Convert Tailwind classes to CSS values
  const style: React.CSSProperties = {
    fontSize: convertFontSize(settings.fontSize),
    fontFamily: convertFontFamily(settings.fontFamily),
    fontWeight: convertFontWeight(settings.fontWeight),
    textAlign: settings.alignment,
    color: convertColor(settings.color),
    lineHeight: settings.lineHeight,
  };

  return { style };
}
