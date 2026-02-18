'use client';

import React from 'react';
import type { WebPreviewComponentProps, CustomSectionData, ContentBlock, CustomSectionLayout } from '../../types';
import { DEFAULT_TITLE_TYPOGRAPHY, DEFAULT_SUBTITLE_TYPOGRAPHY } from '../../types';
import type { TypographySettings } from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';

// =============================================================================
// IMPORT ALL CONTENT COMPONENTS
// =============================================================================

// Shared components
import * as SharedComponents from '@/lib/pages/magazine/components/content/shared';
import { SectionStrip } from '@/lib/pages/magazine/components/content/shared';

// Section-specific components
import * as MariesCornerComponents from '@/lib/pages/magazine/components/content/maries-corner';
import * as WhatsNewGlamlinkComponents from '@/lib/pages/magazine/components/content/whats-new-glamlink';
import * as CoverProFeatureComponents from '@/lib/pages/magazine/components/content/cover-pro-feature';
import * as TopTreatmentComponents from '@/lib/pages/magazine/components/content/top-treatment';
import * as TopProductSpotlightComponents from '@/lib/pages/magazine/components/content/top-product-spotlight';
import * as MagazineClosingComponents from '@/lib/pages/magazine/components/content/magazine-closing';
import * as CoinDropComponents from '@/lib/pages/magazine/components/content/coin-drop';
import * as GlamlinkStoriesComponents from '@/lib/pages/magazine/components/content/glamlink-stories';
import * as SpotlightCityComponents from '@/lib/pages/magazine/components/content/spotlight-city';
import * as RisingStarComponents from '@/lib/pages/magazine/components/content/rising-star';

// =============================================================================
// COMPONENT MAP
// =============================================================================

/**
 * Maps category names to their component modules
 * Each module exports components as { ComponentName: Component }
 */
export const COMPONENT_MAP: Record<string, Record<string, React.ComponentType<any>>> = {
  'shared': SharedComponents,
  'maries-corner': MariesCornerComponents,
  'whats-new-glamlink': WhatsNewGlamlinkComponents,
  'cover-pro-feature': CoverProFeatureComponents,
  'top-treatment': TopTreatmentComponents,
  'top-product-spotlight': TopProductSpotlightComponents,
  'magazine-closing': MagazineClosingComponents,
  'coin-drop': CoinDropComponents,
  'glamlink-stories': GlamlinkStoriesComponents,
  'spotlight-city': SpotlightCityComponents,
  'rising-star': RisingStarComponents,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get layout CSS classes for the block container
 */
function getLayoutClasses(layout: CustomSectionLayout): string {
  switch (layout) {
    case 'two-column':
      return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    case 'grid-3':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    case 'single-column':
    default:
      return 'flex flex-col gap-4';
  }
}

/**
 * Get component from COMPONENT_MAP
 */
function getComponent(category: string, type: string): React.ComponentType<any> | null {
  const categoryComponents = COMPONENT_MAP[category];
  if (!categoryComponents) {
    console.warn(`Unknown category: ${category}`);
    return null;
  }

  const Component = categoryComponents[type];
  if (!Component) {
    console.warn(`Unknown component: ${type} in category: ${category}`);
    return null;
  }

  return Component;
}

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
  // For responsive sizes like "text-sm md:text-base", use the first (mobile) size
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
      'text-7xl': '4.5rem',
      'text-8xl': '6rem',
      'text-9xl': '8rem',
    };
    // Extract base class from responsive variants (e.g., "text-sm md:text-base" -> "text-sm")
    const baseClass = merged.fontSize.split(' ').find(c => !c.includes(':')) || merged.fontSize;
    styles.fontSize = fontSizeMap[baseClass] || merged.fontSize;
  }

  // Font family - includes named fonts from tailwind.config.ts
  if (merged.fontFamily) {
    const fontFamilyMap: Record<string, string> = {
      'font-sans': 'ui-sans-serif, system-ui, sans-serif',
      'font-serif': 'ui-serif, Georgia, serif',
      'font-mono': 'ui-monospace, monospace',
      // Named fonts (matching tailwind.config.ts)
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
      // Gray scale
      'text-gray-900': '#111827',
      'text-gray-800': '#1f2937',
      'text-gray-700': '#374151',
      'text-gray-600': '#4b5563',
      'text-gray-500': '#6b7280',
      'text-gray-400': '#9ca3af',
      'text-gray-300': '#d1d5db',
      'text-white': '#ffffff',
      'text-black': '#000000',
      // Brand colors
      'text-glamlink-teal': '#22B8C8',
      'text-glamlink-purple': '#9333ea',
      // Standard colors
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
      'text-teal-600': '#0d9488',
      'text-teal-500': '#14b8a6',
      'text-indigo-600': '#4f46e5',
      'text-pink-600': '#db2777',
    };
    styles.color = colorMap[merged.color] || merged.color;
  }

  return styles;
}

/**
 * Get block styling as inline CSS
 */
function getBlockStyles(block: ContentBlock): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (block.styling) {
    const { backgroundColor, borderWidth, borderColor, borderRadius, padding, marginTop, marginBottom } = block.styling;

    if (backgroundColor) {
      // Handle both Tailwind classes and hex colors
      if (backgroundColor.startsWith('#') || backgroundColor.startsWith('rgb')) {
        styles.backgroundColor = backgroundColor;
      } else if (backgroundColor.startsWith('bg-')) {
        // Map common Tailwind bg classes
        const bgMap: Record<string, string> = {
          'bg-white': '#ffffff',
          'bg-gray-50': '#f9fafb',
          'bg-gray-100': '#f3f4f6',
          'bg-gray-200': '#e5e7eb',
        };
        styles.backgroundColor = bgMap[backgroundColor] || backgroundColor;
      }
    }

    if (borderWidth && borderWidth > 0) {
      styles.borderWidth = `${borderWidth}px`;
      styles.borderStyle = 'solid';
      styles.borderColor = borderColor || '#e5e7eb';
    }

    if (borderRadius) {
      styles.borderRadius = `${borderRadius}px`;
    }

    if (padding) {
      styles.padding = `${padding}px`;
    }

    if (marginTop) {
      styles.marginTop = `${marginTop}px`;
    }

    if (marginBottom) {
      styles.marginBottom = `${marginBottom}px`;
    }
  }

  return styles;
}

// =============================================================================
// BLOCK RENDERER
// =============================================================================

interface BlockRendererProps {
  block: ContentBlock;
}

function BlockRenderer({ block }: BlockRendererProps) {
  const Component = getComponent(block.category, block.type);

  if (!Component) {
    return (
      <div className="p-4 border border-dashed border-red-300 rounded-lg bg-red-50 text-red-600 text-sm">
        <p className="font-medium">Unknown component</p>
        <p className="text-xs mt-1">Type: {block.type}, Category: {block.category}</p>
      </div>
    );
  }

  const blockStyles = getBlockStyles(block);

  return (
    <div style={blockStyles}>
      <Component {...block.props} />
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * CustomSectionPreview - Live HTML preview for Custom Section
 *
 * Renders multiple content blocks with:
 * - Dynamic component resolution via COMPONENT_MAP
 * - Configurable layout (single-column, two-column, grid-3)
 * - Block-level styling (background, border, padding)
 * - Section-level styling (background color)
 */
export default function CustomSectionPreview({ sectionData }: WebPreviewComponentProps) {
  // Type guard - ensure we have custom section data
  const customData = sectionData as Partial<CustomSectionData>;
  const content = customData.content;

  // Get typography styles for header
  const titleStyle = getTypographyStyles(customData.titleTypography, DEFAULT_TITLE_TYPOGRAPHY);
  const subtitleStyle = getTypographyStyles(customData.subtitleTypography, DEFAULT_SUBTITLE_TYPOGRAPHY);

  // Get section background color (default to tan/cream color #FAF7F2)
  // Treat #ffffff (old default) as "use default" so existing sections get the tan color
  const rawBgColor = customData.backgroundColor || content?.sectionBackgroundColor;
  const sectionBackgroundColor = (!rawBgColor || rawBgColor === '#ffffff' || rawBgColor === '#FFFFFF')
    ? '#FAF7F2'
    : rawBgColor;

  // Get layout
  const layout = content?.layout || 'single-column';
  const layoutClasses = getLayoutClasses(layout);

  // Get and sort blocks
  const blocks = content?.blocks || [];
  const enabledBlocks = blocks
    .filter(block => block.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Check if we have any content
  const hasHeader = customData.title || customData.subtitle;
  const hasBlocks = enabledBlocks.length > 0;
  const hasContent = hasHeader || hasBlocks;

  // Section strip configuration
  const sectionStrip = (customData as any).sectionStrip;
  const isCornerStrip = sectionStrip?.enabled &&
    ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center'].includes(sectionStrip?.position || '');

  // Section container styles
  const sectionStyles: React.CSSProperties = {
    backgroundColor: sectionBackgroundColor,
    position: isCornerStrip ? 'relative' : undefined,
  };

  // Add section border/rounded if specified
  if (content?.sectionBorder) {
    sectionStyles.borderWidth = '1px';
    sectionStyles.borderStyle = 'solid';
    sectionStyles.borderColor = '#e5e7eb';
  }

  if (content?.sectionRounded) {
    sectionStyles.borderRadius = '8px';
  }

  if (content?.sectionPadding) {
    sectionStyles.padding = `${content.sectionPadding}px`;
  }

  // Check if strip should be inserted inside content blocks
  const isInsideContentStrip = sectionStrip?.enabled && sectionStrip?.position === 'inside-content';
  const insideBlockIndex = sectionStrip?.insideBlockIndex ?? 0;

  // Render blocks with optional strip insertion
  const renderBlocksWithStrip = () => {
    if (!hasBlocks) return null;

    const elements: React.ReactNode[] = [];

    enabledBlocks.forEach((block, index) => {
      // Insert section strip before this block if position matches
      if (isInsideContentStrip && index === insideBlockIndex) {
        elements.push(
          <div key={`strip-before-${block.id}`} className="my-4">
            <SectionStrip config={sectionStrip} renderAsInline />
          </div>
        );
      }
      elements.push(<BlockRenderer key={block.id} block={block} />);
    });

    // If insideBlockIndex is >= number of blocks, append at the end
    if (isInsideContentStrip && insideBlockIndex >= enabledBlocks.length) {
      elements.push(
        <div key="strip-at-end" className="my-4">
          <SectionStrip config={sectionStrip} renderAsInline />
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="w-full min-h-[300px] p-4" style={sectionStyles}>
      {/* Section Strip - Corner positions (absolute overlay) */}
      {isCornerStrip && <SectionStrip config={sectionStrip} />}

      {hasContent ? (
        <div className="w-full">
          {/* Section Header */}
          {hasHeader && (
            <div className="mb-6 text-center">
              {customData.title && (
                <h1 style={titleStyle} className="mb-2">
                  {customData.title}
                </h1>
              )}
              {customData.subtitle && (
                <h2 style={subtitleStyle}>
                  {customData.subtitle}
                </h2>
              )}
            </div>
          )}

          {/* Content Blocks (with optional strip insertion for inside-content position) */}
          {hasBlocks && (
            <div className={layoutClasses}>
              {renderBlocksWithStrip()}
            </div>
          )}

          {/* No blocks state */}
          {!hasBlocks && hasHeader && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No content blocks added yet</p>
              <p className="text-xs mt-1">Add blocks using the Custom Section Editor</p>
            </div>
          )}

          {/* Section Strip - After content position */}
          {sectionStrip?.enabled && sectionStrip?.position === 'after-content' && (
            <div className="mt-6">
              <SectionStrip config={sectionStrip} renderAsInline />
            </div>
          )}
        </div>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-gray-400 text-center">
          <div className="text-4xl mb-3">🧩</div>
          <p className="text-lg mb-2">Custom Section</p>
          <p className="text-sm">Add content blocks to build your section</p>
        </div>
      )}
    </div>
  );
}
