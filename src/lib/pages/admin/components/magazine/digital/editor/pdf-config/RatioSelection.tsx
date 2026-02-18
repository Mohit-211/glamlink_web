'use client';

/**
 * RatioSelection - Page ratio selection grid with custom dimensions
 */

import React from 'react';
import { RATIO_OPTIONS } from './usePDFConfigPanel';
import type { PdfRatioType } from '../types';

// =============================================================================
// TYPES
// =============================================================================

interface RatioSelectionProps {
  selectedRatio: PdfRatioType;
  customWidth: number;
  customHeight: number;
  onRatioChange: (ratio: PdfRatioType) => void;
  onCustomWidthChange: (width: number) => void;
  onCustomHeightChange: (height: number) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function RatioSelection({
  selectedRatio,
  customWidth,
  customHeight,
  onRatioChange,
  onCustomWidthChange,
  onCustomHeightChange,
}: RatioSelectionProps) {
  return (
    <div className="space-y-2">
      {/* Ratio Grid */}
      <label className="block text-xs font-medium text-gray-600">
        Page Ratio
      </label>
      <div className="grid grid-cols-3 gap-2">
        {RATIO_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onRatioChange(option.value)}
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg border text-xs
              transition-colors
              ${
                selectedRatio === option.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }
            `}
          >
            <span className="text-lg mb-1">{option.icon}</span>
            <span className="text-center leading-tight">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Custom Dimensions */}
      {selectedRatio === 'custom' && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Width (mm)
            </label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => onCustomWidthChange(parseInt(e.target.value) || 210)}
              min={50}
              max={500}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Height (mm)
            </label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => onCustomHeightChange(parseInt(e.target.value) || 297)}
              min={50}
              max={500}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
