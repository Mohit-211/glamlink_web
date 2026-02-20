'use client';

/**
 * PageImageWithCustomBlockPreview - Image with title and customizable content block
 *
 * Layout: Image (top) → Title/Subtitle (middle) → Content Block (bottom)
 *
 * Features:
 * - Image display with object-fit and position support
 * - Title and subtitle with typography settings
 * - Dynamic content block rendering from web preview components
 * - Container styling for the content block area
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import { usePageImageWithCustomBlockProps } from '../util/usePageData';
import { COMPONENT_MAP } from '../../../../../web/preview/designs/CustomSectionPreview';

// =============================================================================
// HELPER: Render Content Block
// =============================================================================

interface ContentBlockRendererProps {
  block: {
    type: string;
    category: string;
    props: Record<string, any>;
  };
}

function ContentBlockRenderer({ block }: ContentBlockRendererProps) {
  // Get component from COMPONENT_MAP
  const categoryComponents = COMPONENT_MAP[block.category];
  if (!categoryComponents) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
        Unknown category: {block.category}
      </div>
    );
  }

  const Component = categoryComponents[block.type];
  if (!Component) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
        Unknown component: {block.type} in category: {block.category}
      </div>
    );
  }

  // Render the component with its props
  return <Component {...block.props} />;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PageImageWithCustomBlockPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const {
    imageUrl,
    objectFit,
    objectPosition,
    bgStyle,
    titleStyles,
    subtitleStyles,
    customBlock,
    hasCustomBlock,
    blockContainerStyle,
  } = usePageImageWithCustomBlockProps(pageData, pdfSettings);

  return (
    <div className="w-full h-full flex flex-col" style={bgStyle}>
      {/* Image Section - takes flexible space */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={pageData.title || 'Image'}
            className="max-w-[85%] max-h-full object-contain"
            style={{
              objectFit: objectFit as any,
              objectPosition,
            }}
          />
        ) : (
          <div className="w-[85%] h-48 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-400 text-sm">No image selected</span>
          </div>
        )}
      </div>

      {/* Title Section */}
      <div className="flex-shrink-0 px-8 text-center">
        {pageData.title && (
          <h1
            className="text-2xl font-bold tracking-wider uppercase mb-1"
            style={titleStyles}
          >
            {pageData.title}
          </h1>
        )}
        {pageData.subtitle && (
          <p
            className="text-sm tracking-wide"
            style={subtitleStyles}
          >
            {pageData.subtitle}
          </p>
        )}
      </div>

      {/* Content Block Section */}
      <div className="flex-shrink-0 px-6 pb-6">
        {hasCustomBlock && customBlock ? (
          <div style={blockContainerStyle}>
            <ContentBlockRenderer block={customBlock} />
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            style={{ marginTop: blockContainerStyle.marginTop }}
          >
            <div className="text-gray-400 text-sm">
              <span className="text-2xl mb-2 block">🧩</span>
              No content block selected
            </div>
            <div className="text-gray-300 text-xs mt-1">
              Use the form to select or add a content block
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
