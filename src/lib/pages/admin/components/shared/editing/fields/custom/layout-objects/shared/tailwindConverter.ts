/**
 * Tailwind to CSS Converter
 *
 * Converts Tailwind utility classes to CSS values for html2canvas compatibility.
 * When html2canvas captures elements, it needs actual CSS values, not Tailwind classes.
 *
 * This module provides conversion functions for:
 * - Font sizes (text-sm, text-5xl, etc.)
 * - Colors (text-glamlink-teal, text-gray-500, etc.)
 * - Font families (font-[Merriweather,serif], font-sans, etc.)
 * - Font weights (font-bold, font-semibold, etc.)
 *
 * All mappings are based on /lib/pages/magazine/config/universalStyles.ts
 */

// Font size mapping (Tailwind class → pixel value)
const FONT_SIZE_MAP: Record<string, string> = {
  'text-xs': '12px',
  'text-sm': '14px',
  'text-base': '16px',
  'text-lg': '18px',
  'text-xl': '20px',
  'text-2xl': '24px',
  'text-3xl': '30px',
  'text-4xl': '36px',
  'text-5xl': '48px',
  'text-6xl': '60px',
  'text-7xl': '72px',
  'text-8xl': '96px',
  'text-9xl': '128px',
};

// Color mapping (Tailwind class → hex color)
const COLOR_MAP: Record<string, string> = {
  // Gray scale
  'text-gray-900': '#111827',
  'text-gray-800': '#1f2937',
  'text-gray-700': '#374151',
  'text-gray-600': '#4b5563',
  'text-gray-500': '#6b7280',
  'text-gray-400': '#9ca3af',
  'text-gray-300': '#d1d5db',
  'text-gray-200': '#e5e7eb',
  'text-gray-100': '#f3f4f6',
  'text-gray-50': '#f9fafb',

  // Brand colors
  'text-glamlink-teal': '#14b8a6',
  'text-glamlink-purple': '#9333ea',

  // Standard colors
  'text-white': '#ffffff',
  'text-black': '#000000',
  'text-blue-600': '#2563eb',
  'text-blue-500': '#3b82f6',
  'text-green-600': '#16a34a',
  'text-green-500': '#22c55e',
  'text-red-600': '#dc2626',
  'text-red-500': '#ef4444',
  'text-yellow-600': '#ca8a04',
  'text-yellow-500': '#eab308',
  'text-purple-600': '#9333ea',
  'text-purple-500': '#a855f7',
  'text-indigo-600': '#4f46e5',
  'text-indigo-500': '#6366f1',
  'text-pink-600': '#db2777',
  'text-pink-500': '#ec4899',
  'text-teal-600': '#0d9488',
  'text-teal-500': '#14b8a6',
};

// Font family mapping (Tailwind class → CSS font-family)
// Uses named classes from tailwind.config.ts fontFamily
const FONT_FAMILY_MAP: Record<string, string> = {
  'font-sans': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  'font-serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
  'font-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  // Named fonts (matching tailwind.config.ts fontFamily)
  'font-georgia': 'Georgia, serif',
  'font-playfair': '"Playfair Display", serif',
  'font-merriweather': 'Merriweather, serif',
  'font-montserrat': 'Montserrat, sans-serif',
  'font-roboto': 'Roboto, sans-serif',
  'font-lato': 'Lato, sans-serif',
  'font-red-hat-display': '"Red Hat Display", sans-serif',
  'font-corsiva': '"Monotype Corsiva", cursive',

  // Legacy arbitrary value syntax (for backward compatibility)
  'font-[Georgia,serif]': 'Georgia, serif',
  'font-[Playfair_Display,serif]': '"Playfair Display", serif',
  'font-[Merriweather,serif]': 'Merriweather, serif',
  'font-[Montserrat,sans-serif]': 'Montserrat, sans-serif',
  'font-[Roboto,sans-serif]': 'Roboto, sans-serif',
  'font-[Lato,sans-serif]': 'Lato, sans-serif',
  'font-[Red_Hat_Display,sans-serif]': '"Red Hat Display", sans-serif',
  'font-[Monotype_Corsiva,cursive]': '"Monotype Corsiva", cursive',
};

// Font weight mapping (Tailwind class → numeric weight)
const FONT_WEIGHT_MAP: Record<string, string> = {
  'font-thin': '100',
  'font-extralight': '200',
  'font-light': '300',
  'font-normal': '400',
  'font-medium': '500',
  'font-semibold': '600',
  'font-bold': '700',
  'font-extrabold': '800',
  'font-black': '900',
};

/**
 * Extract base class from responsive variant
 *
 * Responsive Tailwind classes use breakpoint prefixes (md:, lg:, etc.)
 * For html2canvas, we need the base (non-responsive) class.
 *
 * Examples:
 *   "text-5xl md:text-6xl" → "text-5xl"
 *   "font-bold lg:font-black" → "font-bold"
 *   "text-gray-700" → "text-gray-700"
 *
 * @param classString - Single or multiple Tailwind classes
 * @returns Base class without responsive prefix
 */
function extractBaseClass(classString: string): string {
  if (!classString) return '';

  const classes = classString.split(' ');

  // Find first class without colon (non-responsive)
  const baseClass = classes.find(c => !c.includes(':'));
  if (baseClass) return baseClass;

  // If all classes are responsive, return first one
  return classes[0] || '';
}

/**
 * Convert Tailwind font size to CSS pixel value
 *
 * Handles:
 * - Simple classes: "text-5xl" → "48px"
 * - Responsive: "text-5xl md:text-6xl" → "48px"
 * - Already CSS: "48px" → "48px"
 * - Unknown: returns original value
 *
 * @param fontSize - Tailwind class or CSS value
 * @returns CSS pixel value
 */
export function convertFontSize(fontSize?: string): string | undefined {
  if (!fontSize) return undefined;

  // Already a CSS value (contains px, rem, em, etc.)
  if (fontSize.includes('px') || fontSize.includes('rem') || fontSize.includes('em')) {
    return fontSize;
  }

  // Extract base class from responsive variants
  const baseClass = extractBaseClass(fontSize);

  // Look up in map
  return FONT_SIZE_MAP[baseClass] || fontSize;
}

/**
 * Convert Tailwind color class to CSS hex value
 *
 * Handles:
 * - Tailwind: "text-glamlink-teal" → "#14b8a6"
 * - Hex: "#14b8a6" → "#14b8a6"
 * - RGB: "rgb(20, 184, 166)" → "rgb(20, 184, 166)"
 * - Responsive: "text-gray-700 md:text-gray-900" → "#374151"
 *
 * @param color - Tailwind class or CSS color value
 * @returns CSS color value
 */
export function convertColor(color?: string): string | undefined {
  if (!color) return undefined;

  // Already a CSS color value
  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
    return color;
  }

  // Extract base class from responsive variants
  const baseClass = extractBaseClass(color);

  // Look up in map
  return COLOR_MAP[baseClass] || color;
}

/**
 * Convert Tailwind font family to CSS font-family value
 *
 * Handles:
 * - Tailwind: "font-[Merriweather,serif]" → "Merriweather, serif"
 * - Generic: "font-sans" → "system-ui, -apple-system, ..."
 * - Already CSS: "Merriweather, serif" → "Merriweather, serif"
 * - Responsive: "font-serif md:font-sans" → "Georgia, ..."
 *
 * @param fontFamily - Tailwind class or CSS font-family
 * @returns CSS font-family value
 */
export function convertFontFamily(fontFamily?: string): string | undefined {
  if (!fontFamily) return undefined;

  // Already a CSS value (doesn't start with font-)
  if (!fontFamily.startsWith('font-')) {
    return fontFamily;
  }

  // Extract base class from responsive variants
  const baseClass = extractBaseClass(fontFamily);

  // Look up in map
  return FONT_FAMILY_MAP[baseClass] || fontFamily;
}

/**
 * Convert Tailwind font weight to CSS numeric value
 *
 * Handles:
 * - Tailwind: "font-bold" → "700"
 * - Numeric: "700" → "700"
 * - Responsive: "font-bold md:font-black" → "700"
 *
 * @param fontWeight - Tailwind class or CSS font-weight
 * @returns CSS numeric font-weight
 */
export function convertFontWeight(fontWeight?: string): string | undefined {
  if (!fontWeight) return undefined;

  // Already a numeric value
  if (/^\d+$/.test(fontWeight)) {
    return fontWeight;
  }

  // Extract base class from responsive variants
  const baseClass = extractBaseClass(fontWeight);

  // Look up in map
  return FONT_WEIGHT_MAP[baseClass] || fontWeight;
}

/**
 * Convert all typography settings at once
 *
 * Convenience function that converts all typography-related Tailwind classes
 * to their CSS equivalents in one call.
 *
 * @param settings - Object with Tailwind typography classes
 * @returns Object with CSS values
 */
export function convertTypographySettings(settings: {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
}): {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
} {
  return {
    fontSize: convertFontSize(settings.fontSize),
    fontFamily: convertFontFamily(settings.fontFamily),
    fontWeight: convertFontWeight(settings.fontWeight),
    color: convertColor(settings.color),
  };
}
