'use client';

/**
 * BlockPreview Component
 * Renders a preview of a selected content block using componentMap
 *
 * Accepts optional componentMap prop for customization.
 * Falls back to DEFAULT_BLOCK_SELECTOR_CONFIG when not provided.
 */

import React from 'react';
import { DEFAULT_BLOCK_SELECTOR_CONFIG } from './defaultConfig';
import type { BlockPreviewProps, ComponentMap } from './types';

/**
 * Renders a preview of a content block
 */
export function BlockPreview({
  block,
  componentMap = DEFAULT_BLOCK_SELECTOR_CONFIG.componentMap,
}: BlockPreviewProps) {
  const categoryComponents = componentMap[block.category];
  const Component = categoryComponents?.[block.type];

  if (!Component) {
    return (
      <div className="p-3 bg-gray-50 rounded text-sm text-gray-500">
        Preview not available for {block.category}/{block.type}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-2 bg-gray-50 border-b text-xs text-gray-500 flex items-center justify-between">
        <span>Preview</span>
        <span className="font-mono text-gray-400">{block.category}/{block.type}</span>
      </div>
      <div className="p-4 max-h-48 overflow-auto">
        <div className="transform scale-75 origin-top-left">
          <Component {...block.props} />
        </div>
      </div>
    </div>
  );
}

export default BlockPreview;
