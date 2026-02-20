import type { CSSProperties } from 'react';

/**
 * Get inline style object for background color
 * Handles hex colors, gradients, and returns empty object for Tailwind classes
 *
 * @param backgroundColor - Color value (hex, gradient, or Tailwind class)
 * @returns CSS properties object with background if applicable
 */
export const getBackgroundStyle = (backgroundColor?: string): CSSProperties => {
  if (!backgroundColor) return {};

  // Check if it's a hex color or gradient
  if (
    backgroundColor.startsWith("#") ||
    backgroundColor.startsWith("linear-gradient") ||
    backgroundColor.startsWith("radial-gradient")
  ) {
    return { background: backgroundColor };
  }

  // Otherwise return empty (for Tailwind classes to be applied via className)
  return {};
};

/**
 * Get Tailwind className for background color
 * Returns the class if it's a Tailwind bg- class, otherwise empty string
 *
 * @param backgroundColor - Color value (hex, gradient, or Tailwind class)
 * @returns Tailwind class string or empty string
 */
export const getBackgroundClass = (backgroundColor?: string): string => {
  if (!backgroundColor) return "";

  // If it's a Tailwind class (starts with bg-), return it
  if (backgroundColor.startsWith("bg-")) {
    return backgroundColor;
  }

  // Otherwise return empty
  return "";
};

/**
 * Combined helper to get both style and class for a background color
 *
 * @param backgroundColor - Color value (hex, gradient, or Tailwind class)
 * @returns Object with style and className properties
 */
export const getBackgroundProps = (backgroundColor?: string): {
  style: CSSProperties;
  className: string;
} => {
  return {
    style: getBackgroundStyle(backgroundColor),
    className: getBackgroundClass(backgroundColor),
  };
};
