'use client';

import React from 'react';
import type { WebPreviewComponentProps } from '../../types';
import { DEFAULT_TITLE_TYPOGRAPHY, DEFAULT_SUBTITLE_TYPOGRAPHY } from '../../types';
import type { TypographySettings } from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';

/**
 * JoinGlamlinkPreview - Live HTML preview for Join Glamlink section
 *
 * Renders a styled section with:
 * - Title with customizable typography
 * - Subtitle with customizable typography
 * - Description text
 * - Configurable background color
 *
 * Updates in real-time as form values change via useFormContext
 */

// =============================================================================
// TYPOGRAPHY HELPERS
// =============================================================================

/**
 * Convert typography settings to inline CSS styles
 */
function getTypographyStyles(
  settings?: TypographySettings,
  defaults?: TypographySettings
): React.CSSProperties {
  const merged = {
    ...defaults,
    ...settings,
  };

  const styles: React.CSSProperties = {};

  // Font size - convert Tailwind classes to actual sizes
  if (merged.fontSize) {
    const fontSizeMap: Record<string, string> = {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
      'text-4xl': '2.25rem',
      'text-5xl': '3rem',
      'text-6xl': '3.75rem',
      'text-4xl md:text-5xl': '2.25rem',
    };
    styles.fontSize = fontSizeMap[merged.fontSize] || merged.fontSize;
  }

  // Font family
  if (merged.fontFamily) {
    const fontFamilyMap: Record<string, string> = {
      'font-sans': 'ui-sans-serif, system-ui, sans-serif',
      'font-serif': 'ui-serif, Georgia, serif',
      'font-mono': 'ui-monospace, monospace',
    };
    styles.fontFamily = fontFamilyMap[merged.fontFamily] || merged.fontFamily;
  }

  // Font weight
  if (merged.fontWeight) {
    const fontWeightMap: Record<string, number> = {
      'font-thin': 100,
      'font-extralight': 200,
      'font-light': 300,
      'font-normal': 400,
      'font-medium': 500,
      'font-semibold': 600,
      'font-bold': 700,
      'font-extrabold': 800,
      'font-black': 900,
    };
    styles.fontWeight = fontWeightMap[merged.fontWeight] || 400;
  }

  // Text alignment
  if (merged.alignment) {
    styles.textAlign = merged.alignment;
  }

  // Color - convert Tailwind classes to actual colors
  if (merged.color) {
    const colorMap: Record<string, string> = {
      'text-gray-900': '#111827',
      'text-gray-800': '#1f2937',
      'text-gray-700': '#374151',
      'text-gray-600': '#4b5563',
      'text-gray-500': '#6b7280',
      'text-gray-400': '#9ca3af',
      'text-white': '#ffffff',
      'text-black': '#000000',
    };
    styles.color = colorMap[merged.color] || merged.color;
  }

  return styles;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function JoinGlamlinkPreview({ sectionData }: WebPreviewComponentProps) {
  // Get typography styles
  const titleStyle = getTypographyStyles(sectionData.titleTypography, DEFAULT_TITLE_TYPOGRAPHY);
  const subtitleStyle = getTypographyStyles(sectionData.subtitleTypography, DEFAULT_SUBTITLE_TYPOGRAPHY);

  // Get background color
  const backgroundColor = sectionData.backgroundColor || '#ffffff';

  // Determine if we need padding based on content
  const hasContent = sectionData.title || sectionData.subtitle || sectionData.description;

  return (
    <div
      className="w-full min-h-[300px] flex flex-col items-center justify-center p-8"
      style={{ backgroundColor }}
    >
      {hasContent ? (
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* Title */}
          {sectionData.title && (
            <h1 style={titleStyle}>
              {sectionData.title}
            </h1>
          )}

          {/* Subtitle */}
          {sectionData.subtitle && (
            <h2 style={subtitleStyle}>
              {sectionData.subtitle}
            </h2>
          )}

          {/* Description */}
          {sectionData.description && (
            <p className="text-gray-700 text-base leading-relaxed">
              {sectionData.description}
            </p>
          )}
        </div>
      ) : (
        // Empty state
        <div className="text-gray-400 text-center">
          <p className="text-lg mb-2">No content yet</p>
          <p className="text-sm">Fill in the form to see a live preview</p>
        </div>
      )}
    </div>
  );
}
