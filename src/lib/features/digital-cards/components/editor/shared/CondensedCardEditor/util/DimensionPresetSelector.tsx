'use client';

/**
 * DimensionPresetSelector - Dropdown for presets + custom input
 *
 * Allows users to select from predefined dimension presets or
 * enter custom dimensions for the condensed card.
 */

import React from 'react';
import type {
  CondensedCardDimensions,
  CondensedCardDimensionPreset,
} from '@/lib/features/digital-cards/types/condensedCardConfig';
import { DIMENSION_PRESETS, getPresetOptions } from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// TYPES
// =============================================================================

export interface DimensionPresetSelectorProps {
  /** Current dimensions */
  value: CondensedCardDimensions;
  /** Callback when preset changes */
  onPresetChange: (preset: CondensedCardDimensionPreset) => void;
  /** Callback when dimensions change */
  onDimensionsChange: (dimensions: Partial<CondensedCardDimensions>) => void;
  /** Whether the inputs are disabled */
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DimensionPresetSelector({
  value,
  onPresetChange,
  onDimensionsChange,
  disabled = false,
}: DimensionPresetSelectorProps) {
  const presetOptions = getPresetOptions();
  const isCustom = value.preset === 'custom';

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = e.target.value as CondensedCardDimensionPreset;
    onPresetChange(preset);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    if (!isNaN(width) && width > 0) {
      onDimensionsChange({ width });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value, 10);
    if (!isNaN(height) && height > 0) {
      onDimensionsChange({ height });
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Page Dimensions</h4>

      {/* Preset Dropdown */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Preset
        </label>
        <select
          value={value.preset}
          onChange={handlePresetSelect}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          {presetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
      </div>

      {/* Dimension Inputs */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Width (px)
          </label>
          <input
            type="number"
            value={value.width}
            onChange={handleWidthChange}
            disabled={disabled || !isCustom}
            min={100}
            max={4000}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div className="flex items-center pb-2">
          <span className="text-gray-400">×</span>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Height (px)
          </label>
          <input
            type="number"
            value={value.height}
            onChange={handleHeightChange}
            disabled={disabled || !isCustom}
            min={100}
            max={4000}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      </div>

      {/* Info Text */}
      {!isCustom && (
        <p className="text-xs text-gray-500">
          Select "Custom" to enter custom dimensions
        </p>
      )}

      {/* Aspect Ratio Display */}
      <div className="text-xs text-gray-500">
        Aspect Ratio: {(value.width / value.height).toFixed(2)}:1
      </div>
    </div>
  );
}

export default DimensionPresetSelector;
