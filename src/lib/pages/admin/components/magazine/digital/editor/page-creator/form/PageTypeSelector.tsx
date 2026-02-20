'use client';

import React, { useState, useMemo } from 'react';
import {
  digitalPreviewComponents,
  getDigitalPreviewComponent,
  type DigitalPageCategory,
} from '@/lib/pages/admin/config/digitalPreviewComponents';
import type { DigitalPageType } from '../../types';

// =============================================================================
// CATEGORY CONFIGURATION
// =============================================================================

const CATEGORIES: { id: DigitalPageCategory | null; label: string; icon: string }[] = [
  { id: null, label: 'All', icon: '📑' },
  { id: 'image', label: 'Image', icon: '🖼️' },
  { id: 'article', label: 'Article', icon: '📰' },
];

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface PageTypeSelectorProps {
  selectedPageType: DigitalPageType;
  onPageTypeChange: (pageType: DigitalPageType) => void;
  onLoadLayout?: () => void;
  showLoadLayout?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PageTypeSelector({
  selectedPageType,
  onPageTypeChange,
  onLoadLayout,
  showLoadLayout = false,
}: PageTypeSelectorProps) {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<DigitalPageCategory | null>(null);

  // Filter components based on selected category
  const filteredComponents = useMemo(() => {
    if (!selectedCategory) return digitalPreviewComponents;
    return digitalPreviewComponents.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  // Get current preview config for description
  const previewConfig = getDigitalPreviewComponent(selectedPageType);

  return (
    <div className="flex-shrink-0 mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Page Type
        </label>
        {showLoadLayout && onLoadLayout && (
          <button
            type="button"
            onClick={onLoadLayout}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Load Layout
          </button>
        )}
      </div>

      {/* Category Badge Filter */}
      <div className="flex gap-2 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id ?? 'all'}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-full transition-colors
              ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Filtered Page Type Dropdown */}
      <select
        value={selectedPageType}
        onChange={(e) => onPageTypeChange(e.target.value as DigitalPageType)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {filteredComponents.map((component) => (
          <option key={component.id} value={component.id}>
            {component.icon} {component.label}
          </option>
        ))}
      </select>
      {previewConfig?.description && (
        <p className="text-xs text-gray-500 mt-1">{previewConfig.description}</p>
      )}
    </div>
  );
}
