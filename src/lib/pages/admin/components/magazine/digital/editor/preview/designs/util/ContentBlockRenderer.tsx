'use client';

/**
 * ContentBlockRenderer - Shared component for rendering content blocks
 *
 * Renders any content block from the COMPONENT_MAP registry.
 * Used by multiple preview components to support swappable content.
 */

import React from 'react';
import { COMPONENT_MAP } from '../../../../../web/preview/designs/CustomSectionPreview';

// =============================================================================
// TYPES
// =============================================================================

export interface ContentBlock {
  id?: string;
  type: string;
  category: string;
  props: Record<string, any>;
  enabled?: boolean;
  order?: number;
}

export interface ContentBlockRendererProps {
  block: ContentBlock;
  className?: string;
  style?: React.CSSProperties;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Renders a content block using the COMPONENT_MAP registry.
 * Handles unknown categories and components gracefully with error messages.
 */
export function ContentBlockRenderer({
  block,
  className,
  style,
}: ContentBlockRendererProps) {
  // Get component from COMPONENT_MAP
  const categoryComponents = COMPONENT_MAP[block.category];
  if (!categoryComponents) {
    return (
      <div
        className={`p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm ${className || ''}`}
        style={style}
      >
        Unknown category: {block.category}
      </div>
    );
  }

  const Component = categoryComponents[block.type];
  if (!Component) {
    return (
      <div
        className={`p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm ${className || ''}`}
        style={style}
      >
        Unknown component: {block.type} in category: {block.category}
      </div>
    );
  }

  // Render the component with its props
  if (className || style) {
    return (
      <div className={className} style={style}>
        <Component {...block.props} />
      </div>
    );
  }

  return <Component {...block.props} />;
}

/**
 * Empty state placeholder when no content block is selected
 */
export function ContentBlockPlaceholder({
  message = 'No content block selected',
  hint = 'Use the form to select or add a content block',
  className,
  style,
}: {
  message?: string;
  hint?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className || ''}`}
      style={style}
    >
      <div className="text-gray-400 text-sm">
        <span className="text-2xl mb-2 block">🧩</span>
        {message}
      </div>
      {hint && <div className="text-gray-300 text-xs mt-1">{hint}</div>}
    </div>
  );
}

export default ContentBlockRenderer;
