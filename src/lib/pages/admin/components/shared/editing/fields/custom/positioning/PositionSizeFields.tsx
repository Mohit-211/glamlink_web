'use client';

/**
 * PositionSizeFields - X, Y, Width, Height field group
 *
 * Shared component for editing position and size values.
 * Used by positioning editors (magazine custom-layout, condensed card, etc.)
 */

import React from 'react';
import { DimensionInput } from './DimensionInput';
import type { PositionConfig, DimensionValue } from './types';

// =============================================================================
// TYPES
// =============================================================================

export interface PositionSizeFieldsProps {
  /** Current position configuration */
  value: PositionConfig;
  /** Callback when any value changes */
  onChange: (value: PositionConfig) => void;
  /** Optional title for the section */
  title?: string;
  /** Whether to show the title */
  showTitle?: boolean;
  /** Whether to show z-index field */
  showZIndex?: boolean;
  /** Whether to show visibility toggle */
  showVisibility?: boolean;
  /** Whether all inputs are disabled */
  disabled?: boolean;
  /** Custom labels for position fields */
  labels?: {
    x?: string;
    y?: string;
    width?: string;
    height?: string;
    zIndex?: string;
  };
  /** Custom class name for the container */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PositionSizeFields({
  value,
  onChange,
  title = 'Position & Size',
  showTitle = true,
  showZIndex = true,
  showVisibility = false,
  disabled = false,
  labels = {},
  className = '',
}: PositionSizeFieldsProps) {
  const handleDimensionChange = (
    field: 'x' | 'y' | 'width' | 'height',
    newValue: DimensionValue
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const handleZIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zIndex = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onChange({
      ...value,
      zIndex,
    });
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      visible: e.target.checked,
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showTitle && (
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      )}

      {/* Visibility toggle */}
      {showVisibility && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="position-visibility"
            checked={value.visible ?? true}
            onChange={handleVisibilityChange}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="position-visibility"
            className="text-sm text-gray-700"
          >
            Visible
          </label>
        </div>
      )}

      {/* Position row (X, Y) */}
      <div className="flex gap-3">
        <DimensionInput
          label={labels.x || 'X Position'}
          value={value.x}
          onChange={(x) => handleDimensionChange('x', x)}
          disabled={disabled}
        />
        <DimensionInput
          label={labels.y || 'Y Position'}
          value={value.y}
          onChange={(y) => handleDimensionChange('y', y)}
          disabled={disabled}
        />
      </div>

      {/* Size row (Width, Height) */}
      <div className="flex gap-3">
        <DimensionInput
          label={labels.width || 'Width'}
          value={value.width}
          onChange={(width) => handleDimensionChange('width', width)}
          disabled={disabled}
          min={0}
        />
        <DimensionInput
          label={labels.height || 'Height'}
          value={value.height}
          onChange={(height) => handleDimensionChange('height', height)}
          disabled={disabled}
          min={0}
        />
      </div>

      {/* Z-Index */}
      {showZIndex && (
        <div className="w-32">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {labels.zIndex || 'Z-Index'}
          </label>
          <input
            type="number"
            value={value.zIndex ?? ''}
            onChange={handleZIndexChange}
            placeholder="auto"
            disabled={disabled}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      )}
    </div>
  );
}

export default PositionSizeFields;
