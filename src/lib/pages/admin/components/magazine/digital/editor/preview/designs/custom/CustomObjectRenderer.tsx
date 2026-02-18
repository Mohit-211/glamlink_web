'use client';

/**
 * CustomObjectRenderer - Renders individual custom layout objects
 *
 * Handles Text, Image, Spacer, and Custom Block objects with absolute positioning.
 * Text objects can have sub-spacers for float wrapping.
 * Custom blocks render content components from the component registry.
 */

import React from 'react';
import type {
  CustomObject,
  TextCustomObject,
  ImageCustomObject,
  SpacerCustomObject,
  LinkCustomObject,
  DimensionValue,
  TextSubSpacer,
} from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import {
  extractText,
  applyTypographyStyles,
  processHtmlForCanvas,
  isCustomBlockObject,
  isLinkObject,
} from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from '../util/previewHelpers';

// Import all content block component categories
import * as SharedComponents from '@/lib/pages/magazine/components/content/shared';
import * as CoinDropComponents from '@/lib/pages/magazine/components/content/coin-drop';
import * as GlamlinkStoriesComponents from '@/lib/pages/magazine/components/content/glamlink-stories';
import * as SpotlightCityComponents from '@/lib/pages/magazine/components/content/spotlight-city';
import * as CoverProFeatureComponents from '@/lib/pages/magazine/components/content/cover-pro-feature';
import * as MagazineClosingComponents from '@/lib/pages/magazine/components/content/magazine-closing';
import * as MariesCornerComponents from '@/lib/pages/magazine/components/content/maries-corner';
import * as RisingStarComponents from '@/lib/pages/magazine/components/content/rising-star';
import * as TopProductSpotlightComponents from '@/lib/pages/magazine/components/content/top-product-spotlight';
import * as TopTreatmentComponents from '@/lib/pages/magazine/components/content/top-treatment';
import * as WhatsNewGlamlinkComponents from '@/lib/pages/magazine/components/content/whats-new-glamlink';

// =============================================================================
// COMPONENT MAP
// =============================================================================

// Component registry mapping categories to their component modules
const COMPONENT_MAP: Record<string, Record<string, React.ComponentType<any>>> = {
  'shared': SharedComponents,
  'coin-drop': CoinDropComponents,
  'glamlink-stories': GlamlinkStoriesComponents,
  'spotlight-city': SpotlightCityComponents,
  'cover-pro-feature': CoverProFeatureComponents,
  'magazine-closing': MagazineClosingComponents,
  'maries-corner': MariesCornerComponents,
  'rising-star': RisingStarComponents,
  'top-product-spotlight': TopProductSpotlightComponents,
  'top-treatment': TopTreatmentComponents,
  'whats-new-glamlink': WhatsNewGlamlinkComponents,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format a DimensionValue to CSS string
 * Provides default values for backwards compatibility with old data
 */
function formatDimension(dim: DimensionValue | undefined): string {
  if (!dim) {
    return '0%'; // Default for undefined values
  }
  return `${dim.value}${dim.unit}`;
}

/**
 * Render content with drop-cap styling on first letter
 * Uses inline styles for PDF compatibility (html2canvas captures these better than CSS pseudo-elements)
 */
function renderDropCapContent(content: string): React.ReactNode {
  // Strip HTML to get plain text for first letter extraction
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  if (!textContent) {
    return <div dangerouslySetInnerHTML={{ __html: processHtmlForCanvas(content) }} />;
  }

  // Get the first letter from plain text
  const firstLetter = textContent.charAt(0);

  // Remove the first letter from the content while preserving HTML structure
  // Strategy: Find first text node content and remove its first character
  let modifiedContent = content;
  let foundFirst = false;

  // Replace first occurrence of the letter in actual text (not in tags)
  modifiedContent = content.replace(/(<[^>]*>)*([^<])/, (match, tags, char) => {
    if (!foundFirst && char === firstLetter) {
      foundFirst = true;
      return tags || ''; // Return just the tags, removing the first character
    }
    return match;
  });

  // Process the modified content and strip <p> wrapper if present to avoid margin issues
  let processedContent = processHtmlForCanvas(modifiedContent);
  // Remove wrapping <p> tags to prevent margin issues, we'll handle spacing ourselves
  const strippedContent = processedContent
    .replace(/^<p[^>]*>/i, '')  // Remove opening <p> tag
    .replace(/<\/p>$/i, '');     // Remove closing </p> tag

  // APPROACH: Use CSS float with specific adjustments for html2canvas compatibility
  // The key is using a negative margin-top to pull the drop cap up to align with text
  // html2canvas renders floats slightly lower than browsers do

  const dropCapFontSize = 56; // pixels - approximately 3.5rem
  const textLineHeight = 1.5;
  const textFontSize = 14; // approximate base font size in pixels

  // Calculate the offset needed to align drop cap top with text top
  // The drop cap's top needs to align with the cap-height of the text
  // html2canvas renders floats lower, so we need a significant negative margin
  const alignmentOffset = -22; // pixels - pulling up more aggressively

  // For html2canvas: render everything as a single text flow
  // The drop cap is inserted directly into the HTML string to ensure proper float behavior
  const dropCapHtml = `<span style="float:left;font-size:${dropCapFontSize}px;line-height:1.1;margin-right:8px;margin-top:${alignmentOffset}px;margin-bottom:4px;padding:0;font-weight:bold;font-family:Georgia,Times,serif;">${firstLetter}</span>`;

  const combinedHtml = dropCapHtml + strippedContent;

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        lineHeight: textLineHeight,
      }}
      dangerouslySetInnerHTML={{ __html: combinedHtml }}
    />
  );
}

// =============================================================================
// TEXT OBJECT PREVIEW
// =============================================================================

interface TextObjectPreviewProps {
  object: TextCustomObject;
  style: React.CSSProperties;
}

function TextObjectPreview({ object, style }: TextObjectPreviewProps) {
  // Outer container keeps absolute positioning from baseStyle
  const containerStyle: React.CSSProperties = {
    ...style,
    overflow: 'hidden',
    backgroundColor: object.backgroundColor || 'transparent',
  };

  // Inner wrapper provides relative positioning context for bottom spacers
  const innerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
  };

  // Extract text and styles from title/subtitle (handles both string and TypographySettings)
  const titleText = extractText(object.title);
  const titleStyles = typeof object.title === 'object' ? applyTypographyStyles(object.title).style : {};

  const subtitleText = extractText(object.subtitle);
  const subtitleStyles = typeof object.subtitle === 'object' ? applyTypographyStyles(object.subtitle).style : {};

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        {/* Render sub-spacers as floated elements for text wrapping */}
        {object.spacers?.map((spacer) => (
          <SubSpacerRenderer key={spacer.id} spacer={spacer} />
        ))}

        {/* Title */}
        {titleText && (
          <h3
            className="mb-1"
            style={{
              margin: 0,
              marginBottom: '0.25rem',
              ...titleStyles
            }}
          >
            {titleText}
          </h3>
        )}

        {/* Subtitle */}
        {subtitleText && (
          <p
            className="mb-2"
            style={{
              marginTop: '1rem',
              marginBottom: '0.5rem',
              marginLeft: 0,
              marginRight: 0,
              ...subtitleStyles
            }}
          >
            {subtitleText}
          </p>
        )}

        {/* HTML Content */}
        {object.content && (
          <div className="text-sm">
            {object.dropCapEnabled ? (
              renderDropCapContent(object.content)
            ) : (
              <div dangerouslySetInnerHTML={{ __html: processHtmlForCanvas(object.content) }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SUB-SPACER RENDERER (uses x/y absolute positioning)
// =============================================================================

interface SubSpacerRendererProps {
  spacer: TextSubSpacer;
}

function SubSpacerRenderer({ spacer }: SubSpacerRendererProps) {
  // Sub-spacers create invisible areas that text wraps around using CSS Shapes
  // Uses float + shape-outside + clip-path for proper text wrapping at arbitrary positions

  const xValue = spacer.x?.value ?? 0;
  const yValue = spacer.y?.value ?? 0;
  const widthValue = spacer.width?.value ?? 0;
  const heightValue = spacer.height?.value ?? 0;
  const xUnit = spacer.x?.unit ?? '%';
  const widthUnit = spacer.width?.unit ?? '%';

  // Determine float direction based on x position
  // x < 50% = left side, x >= 50% = right side
  const float = xValue < 50 ? 'left' : 'right';

  // Calculate inset values for shape-outside and clip-path
  // For middle positioning (e.g., y:40%, height:30%):
  // - Top inset: 40% (empty space above)
  // - Bottom inset: 30% (empty space below = 100% - 40% - 30%)
  // - Result: wrapping happens in the 40%-70% range
  const topInset = `${yValue}%`;
  const bottomInset = `${100 - yValue - heightValue}%`;
  const shapeInset = `inset(${topInset} 0 ${bottomInset} 0)`;

  const style: any = {
    float: float,
    clear: float,
    width: formatDimension(spacer.width),
    height: '100%',
    'shape-outside': shapeInset,             // Use hyphenated for browser compatibility
    'clip-path': shapeInset,                 // Use hyphenated for browser compatibility
    'pointer-events': 'none',
  };

  // Add horizontal margin based on float direction
  if (float === 'left') {
    // For left float, push away from left edge by x amount
    style.marginLeft = formatDimension(spacer.x);
    // Add right margin to create space between spacer and text
    style.marginRight = '0.5rem';
  } else {
    // For right float, calculate margin from right edge
    // marginRight = 100% - x - width (to position correctly from right side)
    if (xUnit === '%' && widthUnit === '%') {
      style.marginRight = `${100 - xValue - widthValue}%`;
    } else {
      style.marginRight = `calc(100% - ${formatDimension(spacer.x)} - ${formatDimension(spacer.width)})`;
    }
    // Add left margin to create space between spacer and text
    style.marginLeft = '0.5rem';
  }

  return <div style={style} />;
}

// =============================================================================
// IMAGE OBJECT PREVIEW
// =============================================================================

interface ImageObjectPreviewProps {
  object: ImageCustomObject;
  style: React.CSSProperties;
}

function ImageObjectPreview({ object, style }: ImageObjectPreviewProps) {
  const imageUrl = getImageUrl(object.image);
  const objectFit = object.objectFit || getImageObjectFit(object.image);
  const objectPosition = getImageObjectPosition(object.image);

  const containerStyle: React.CSSProperties = {
    ...style,
    overflow: 'hidden',
    borderRadius: object.borderRadius ? `${object.borderRadius}px` : undefined,
  };

  if (!imageUrl) {
    return (
      <div
        style={containerStyle}
        className="bg-gray-200 flex items-center justify-center"
      >
        <span className="text-gray-400 text-xs">No image</span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={imageUrl}
        alt=""
        className="w-full h-full"
        style={{
          objectFit: objectFit as any,
          objectPosition,
        }}
      />
    </div>
  );
}

// =============================================================================
// SPACER OBJECT PREVIEW (invisible in final render)
// =============================================================================

interface SpacerObjectPreviewProps {
  object: SpacerCustomObject;
  style: React.CSSProperties;
}

function SpacerObjectPreview({ object, style }: SpacerObjectPreviewProps) {
  // Spacers are invisible in the final render
  // They're only used for layout positioning and show in the overlay
  return null;
}

// =============================================================================
// LINK OBJECT PREVIEW (invisible clickable hotspot)
// =============================================================================

interface LinkObjectPreviewProps {
  object: LinkCustomObject;
  style: React.CSSProperties;
}

function LinkObjectPreview({ object, style }: LinkObjectPreviewProps) {
  // Show a dashed border in editor preview so users can see/position the hotspot
  // The .link-hotspot-preview class is used to hide this in PDF capture mode
  const containerStyle: React.CSSProperties = {
    ...style,
    // Editor-only visual indicator (dashed border)
    border: '2px dashed rgba(59, 130, 246, 0.5)', // blue-500 with opacity
    backgroundColor: 'rgba(59, 130, 246, 0.1)',   // subtle blue background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={containerStyle}
      className="link-hotspot-preview"
      title={object.linkType === 'external'
        ? `External: ${object.externalUrl || 'No URL set'}`
        : `Internal: Page ${object.targetPageNumber || 'Not set'}`
      }
    >
      {/* Visual indicator showing link type - hidden during PDF capture */}
      <div className="flex flex-col items-center text-blue-500" style={{ opacity: 0.7 }}>
        <span style={{ fontSize: '1.5rem' }}>{object.linkType === 'external' ? '🔗' : '📄'}</span>
        <span style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>
          {object.linkType === 'external' ? 'External Link' : `→ Page ${object.targetPageNumber || '?'}`}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface CustomObjectRendererProps {
  object: CustomObject;
  index: number;
}

export default function CustomObjectRenderer({
  object,
  index,
}: CustomObjectRendererProps) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: formatDimension(object.x),
    top: formatDimension(object.y),
    width: formatDimension(object.width),
    height: formatDimension(object.height),
    // Normalize zIndex to minimum 0 to prevent rendering behind background
    zIndex: Math.max(0, object.zIndex ?? index),
  };

  switch (object.type) {
    case 'text':
      return <TextObjectPreview object={object} style={baseStyle} />;
    case 'image':
      return <ImageObjectPreview object={object} style={baseStyle} />;
    case 'spacer':
      return <SpacerObjectPreview object={object} style={baseStyle} />;
    case 'custom-block':
      // Render custom block component using COMPONENT_MAP
      if (isCustomBlockObject(object) && object.blockType && object.blockCategory) {
        const customBlock = object; // Type narrowed to CustomBlockCustomObject
        const Component = COMPONENT_MAP[customBlock.blockCategory]?.[customBlock.blockType];
        if (!Component) {
          return (
            <div style={baseStyle} className="flex items-center justify-center text-xs text-gray-500">
              Component not found: {customBlock.blockType}
            </div>
          );
        }
        // Render custom block with sub-spacers (same pattern as Text objects)
        const innerStyle: React.CSSProperties = {
          position: 'relative',
          width: '100%',
          height: '100%',
        };

        return (
          <div style={baseStyle}>
            <div style={innerStyle}>
              {/* Render sub-spacers as floated elements for text wrapping */}
              {customBlock.spacers?.map((spacer: TextSubSpacer) => (
                <SubSpacerRenderer key={spacer.id} spacer={spacer} />
              ))}

              {/* Render the custom block component */}
              <Component {...customBlock.blockProps} />
            </div>
          </div>
        );
      }
      return null;
    case 'link':
      return <LinkObjectPreview object={object} style={baseStyle} />;
    default:
      return null;
  }
}

// Export helper for use in overlay
export { formatDimension };
