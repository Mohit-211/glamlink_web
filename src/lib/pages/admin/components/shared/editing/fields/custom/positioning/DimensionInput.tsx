'use client';

/**
 * DimensionInput - Input field with px/% unit selector
 *
 * Shared component for entering dimension values with unit selection.
 * Used by positioning editors (magazine custom-layout, condensed card, etc.)
 */

import React from 'react';
import type { DimensionValue } from './types';

// =============================================================================
// TYPES
// =============================================================================

export interface DimensionInputProps {
  /** Label text displayed above the input */
  label: string;
  /** Current dimension value (number + unit) */
  value: DimensionValue;
  /** Callback when value changes */
  onChange: (value: DimensionValue) => void;
  /** Optional placeholder for the number input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment for number input */
  step?: number;
  /** Custom class name for the container */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DimensionInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  min,
  max,
  step = 1,
  className = 'flex-1',
}: DimensionInputProps) {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value);
    onChange({
      ...value,
      value: isNaN(numValue) ? 0 : numValue,
    });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      unit: e.target.value as 'px' | '%',
    });
  };

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="flex">
        <input
          type="number"
          value={value.value}
          onChange={handleValueChange}
          disabled={disabled}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <select
          value={value.unit}
          onChange={handleUnitChange}
          disabled={disabled}
          className="px-2 py-1.5 text-sm border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="px">px</option>
          <option value="%">%</option>
        </select>
      </div>
    </div>
  );
}

export default DimensionInput;
