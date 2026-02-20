'use client';

/**
 * LayoutCard Component
 *
 * Card component for displaying a layout template in the Load Layout modal.
 * Includes preview image, layout name, and description with hover effects.
 */

import React from 'react';
import type { DigitalLayout } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// TYPES
// =============================================================================

interface LayoutCardProps {
  layout: DigitalLayout;
  onSelect: (layout: DigitalLayout) => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Get icon based on page type
function getLayoutIcon(pageType: string): string {
  if (pageType.includes('article')) return '📰';
  if (pageType.includes('image')) return '🖼️';
  if (pageType.includes('gallery')) return '🎨';
  if (pageType.includes('quote')) return '💬';
  if (pageType.includes('custom')) return '✨';
  return '📄';
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LayoutCard({ layout, onSelect }: LayoutCardProps) {
  const { layoutName, layoutDescription, layoutCategory, previewImage, layoutData } = layout;
  const icon = getLayoutIcon(layoutData.pageType);

  return (
    <button
      type="button"
      onClick={() => onSelect(layout)}
      className="group w-full text-left border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all duration-200 overflow-hidden bg-white"
    >
      {/* Preview Image */}
      <div className="h-32 bg-gray-100 overflow-hidden">
        {previewImage ? (
          <img
            src={previewImage}
            alt={layoutName}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <span className="text-3xl mb-1">{icon}</span>
            <span className="text-xs font-medium capitalize">
              {layoutData.pageType.replace(/-/g, ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Layout Name */}
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
          {layoutName}
        </h3>

        {/* Description */}
        {layoutDescription && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {layoutDescription}
          </p>
        )}

        {/* Badges */}
        <div className="mt-2 flex flex-wrap gap-1">
          {/* Page Type Badge */}
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded">
            {icon} {layoutData.pageType.replace(/-/g, ' ')}
          </span>
          {/* Category Badge */}
          {layoutCategory && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded">
              {layoutCategory}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
