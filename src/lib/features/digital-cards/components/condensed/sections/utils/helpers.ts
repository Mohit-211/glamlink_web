/**
 * Shared Helper Functions for Condensed Card Section Components
 *
 * Consolidates utility functions used across multiple section components
 * to eliminate duplication and ensure consistent behavior.
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface TitleTypography {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: string;
}

// =============================================================================
// BACKGROUND HELPERS
// =============================================================================

/**
 * Check if a background value is a CSS gradient
 */
export function isGradient(value: string): boolean {
  return (
    value.includes('gradient(') ||
    value.includes('linear-gradient') ||
    value.includes('radial-gradient')
  );
}

/**
 * Build inline styles for container background
 * Supports: hex colors, gradients, transparent, rgb values
 */
export function getBackgroundStyle(value: string): React.CSSProperties {
  if (!value || value === 'transparent') {
    return { backgroundColor: 'transparent' };
  }

  // If it's a gradient, use background (not backgroundColor)
  if (isGradient(value)) {
    return { background: value };
  }

  // If it starts with # or rgb, it's a color
  if (value.startsWith('#') || value.startsWith('rgb')) {
    return { backgroundColor: value };
  }

  // Otherwise treat as backgroundColor
  return { backgroundColor: value };
}

// =============================================================================
// TYPOGRAPHY HELPERS
// =============================================================================

/**
 * Check if a font family value is a Tailwind CSS class
 * (starts with 'font-' like 'font-sans', 'font-[Georgia,serif]')
 */
export function isTailwindFontClass(fontFamily: string | undefined): boolean {
  return fontFamily?.startsWith('font-') ?? false;
}

/**
 * Get the Tailwind font class name if applicable, otherwise empty string
 */
export function getTailwindFontClass(fontFamily: string | undefined): string {
  return isTailwindFontClass(fontFamily) ? fontFamily! : '';
}

/**
 * Build inline styles from typography settings
 * Note: fontFamily is excluded if it's a Tailwind class (should be applied via className)
 */
export function buildTypographyStyles(typography: TitleTypography = {}): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (typography.fontSize) {
    styles.fontSize = typography.fontSize;
  }
  // Only apply fontFamily as inline style if it's NOT a Tailwind class
  if (typography.fontFamily && !isTailwindFontClass(typography.fontFamily)) {
    styles.fontFamily = typography.fontFamily;
  }
  if (typography.fontWeight) {
    styles.fontWeight = typography.fontWeight as React.CSSProperties['fontWeight'];
  }
  if (typography.color) {
    styles.color = typography.color;
  }
  if (typography.lineHeight !== undefined) {
    styles.lineHeight = typography.lineHeight;
  }
  if (typography.textTransform) {
    styles.textTransform = typography.textTransform;
  }
  if (typography.letterSpacing) {
    styles.letterSpacing = typography.letterSpacing;
  }

  return styles;
}

// =============================================================================
// URL HELPERS
// =============================================================================

/**
 * Format URL to ensure it's a valid clickable link
 *
 * When type is provided, handles platform-specific formatting:
 * - instagram: Converts @username to full URL
 * - tiktok: Converts @username to full URL with @ in path
 * - website: Adds https:// if missing
 *
 * When type is undefined, simply ensures https:// prefix
 */
export function formatUrl(
  url: string | undefined,
  type?: 'instagram' | 'tiktok' | 'website'
): string | null {
  if (!url || url.trim() === '') return null;

  // If it's already a full URL, use it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If no type specified, just add https://
  if (!type) {
    return `https://${url}`;
  }

  // Format based on type
  switch (type) {
    case 'instagram':
      // Handle @username or just username
      const igHandle = url.replace(/^@/, '');
      return `https://instagram.com/${igHandle}`;
    case 'tiktok':
      // Handle @username or just username
      const ttHandle = url.replace(/^@/, '');
      return `https://tiktok.com/@${ttHandle}`;
    case 'website':
      // Add https:// if no protocol
      return `https://${url}`;
    default:
      return url;
  }
}

/**
 * Check if an image URL is valid
 * Accepts URLs starting with / (local), http://, https://, or data:
 */
export function isValidImageUrl(url: string | undefined): boolean {
  if (!url || url.trim() === '') return false;
  return (
    url.startsWith('/') ||
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:')
  );
}

// =============================================================================
// COLOR HELPERS
// =============================================================================

/**
 * Convert hex color to rgba with opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle shorthand hex (e.g., #fff)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Build box-shadow CSS value
 */
export function buildBoxShadow(
  offsetX: number,
  offsetY: number,
  blur: number,
  spread: number,
  color: string,
  opacity: number
): string {
  const shadowColor = hexToRgba(color, opacity);
  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`;
}

// =============================================================================
// TITLE TEMPLATE HELPERS
// =============================================================================

/**
 * Process title template by replacing tokens with professional data
 * Supported tokens: {name}
 *
 * @example
 * processTitle("About {name}", professional) // "About Jane Smith"
 * processTitle("Meet {name}!", professional) // "Meet Jane Smith!"
 */
export function processTitle(template: string, professional?: { name?: string }): string {
  if (!template) return '';

  return template.replace(/\{name\}/gi, professional?.name || '');
}
