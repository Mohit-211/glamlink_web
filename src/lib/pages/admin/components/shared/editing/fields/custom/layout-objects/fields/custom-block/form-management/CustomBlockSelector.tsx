'use client';

/**
 * CustomBlockSelector - Two-step dropdown for selecting content block components
 *
 * Step 1: Category selection (shared, coin-drop, etc.)
 * Step 2: Component selection from chosen category
 *
 * This component is decoupled from any specific content-discovery source.
 * It receives category labels and component data via props.
 */

import React, { useMemo } from 'react';

/**
 * Component info structure expected by the selector
 */
export interface ComponentInfo {
  name: string;
  displayName: string;
  description: string;
  category: string;
}

interface CustomBlockSelectorProps {
  selectedCategory: string;
  selectedComponent: string;
  onCategoryChange: (category: string) => void;
  onComponentChange: (componentName: string) => void;
  /** Record mapping category keys to display labels */
  categoryLabels: Record<string, string>;
  /** Function to get components for a given category */
  getComponentsByCategory: (category: string) => ComponentInfo[];
}

export default function CustomBlockSelector({
  selectedCategory,
  selectedComponent,
  onCategoryChange,
  onComponentChange,
  categoryLabels,
  getComponentsByCategory
}: CustomBlockSelectorProps) {
  // Get components for selected category
  const availableComponents = useMemo(() => {
    if (!selectedCategory) return [];
    return getComponentsByCategory(selectedCategory);
  }, [selectedCategory, getComponentsByCategory]);

  // Handle category change (parent will reset component selection)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    onCategoryChange(newCategory);
    // Note: Don't call onComponentChange here - parent handles resetting blockType
  };

  return (
    <div className="space-y-3">
      {/* Step 1: Category Selection */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select category...</option>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Step 2: Component Selection (only shown if category selected) */}
      {selectedCategory && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Component
          </label>
          <select
            value={selectedComponent}
            onChange={(e) => onComponentChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select component...</option>
            {availableComponents.map((comp) => (
              <option key={comp.name} value={comp.name}>
                {comp.displayName}
              </option>
            ))}
          </select>

          {/* Show description when component selected */}
          {selectedComponent && (
            <p className="text-xs text-gray-500 mt-1">
              {availableComponents.find(c => c.name === selectedComponent)?.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
