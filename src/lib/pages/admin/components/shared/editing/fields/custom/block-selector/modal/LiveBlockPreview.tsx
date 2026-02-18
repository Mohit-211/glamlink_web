'use client';

/**
 * LiveBlockPreview Component
 * Renders a live preview of a content block using componentMap
 * Updates in real-time as form values change
 *
 * Accepts optional componentMap prop for customization.
 * Falls back to DEFAULT_BLOCK_SELECTOR_CONFIG when not provided.
 */

import React from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { DEFAULT_BLOCK_SELECTOR_CONFIG } from '../defaultConfig';
import type { LiveBlockPreviewProps } from '../types';

/**
 * Renders a live preview of the content block at 75% scale
 */
export function LiveBlockPreview({
  category,
  type,
  componentMap = DEFAULT_BLOCK_SELECTOR_CONFIG.componentMap,
}: LiveBlockPreviewProps) {
  const { formData } = useFormContext();

  // Get the component from componentMap
  const categoryComponents = componentMap[category];
  const Component = categoryComponents?.[type];

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm font-medium">Preview not available</p>
        <p className="text-xs mt-1">
          Component: {category}/{type}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 rounded-lg border border-gray-200">
      {/* Preview Header */}
      <div className="sticky top-0 z-10 px-3 py-2 bg-white border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-500">Live Preview</span>
        <span className="text-xs font-mono text-gray-400">{category}/{type}</span>
      </div>

      {/* Scaled Preview Container */}
      <div className="p-4">
        <div
          className="origin-top-left bg-white rounded shadow-sm"
          style={{
            transform: 'scale(0.75)',
            width: '133.33%', // 100/0.75 to compensate for scale
          }}
        >
          <Component {...formData} />
        </div>
      </div>
    </div>
  );
}

export default LiveBlockPreview;
