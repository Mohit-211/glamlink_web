'use client';

/**
 * PageNumberSection - Page number configuration for footer
 */

import React from 'react';
import type { FooterSettings, PageNumberFormat } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

interface PageNumberSectionProps {
  footerSettings: FooterSettings;
  onUpdate: <K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PAGE_NUMBER_FORMATS: Array<{ value: PageNumberFormat; label: string }> = [
  { value: 'page-x', label: 'Page X' },
  { value: 'x', label: 'X' },
  { value: 'x-of-y', label: 'X of Y' },
];

const ALIGNMENT_OPTIONS = ['left', 'right'] as const;

// =============================================================================
// COMPONENT
// =============================================================================

export default function PageNumberSection({
  footerSettings,
  onUpdate,
}: PageNumberSectionProps) {
  return (
    <div className="space-y-2">
      {/* Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showPageNumber"
          checked={footerSettings.showPageNumber}
          onChange={(e) => onUpdate('showPageNumber', e.target.checked)}
          className="h-4 w-4 text-indigo-600 rounded border-gray-300"
        />
        <label htmlFor="showPageNumber" className="text-xs font-medium text-gray-700">
          Page Number
        </label>
      </div>

      {/* Expanded Options */}
      {footerSettings.showPageNumber && (
        <div className="ml-6 space-y-2">
          {/* Format */}
          <div className="flex gap-1">
            {PAGE_NUMBER_FORMATS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate('pageNumberFormat', value)}
                className={`
                  px-2 py-1 text-xs rounded transition-colors
                  ${
                    footerSettings.pageNumberFormat === value
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">Align:</span>
            <div className="flex gap-1">
              {ALIGNMENT_OPTIONS.map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdate('pageNumberAlignment', align)}
                  className={`
                    px-2 py-1 text-xs rounded transition-colors capitalize
                    ${
                      footerSettings.pageNumberAlignment === align
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">Color:</span>
            <input
              type="color"
              value={footerSettings.pageNumberColor}
              onChange={(e) => onUpdate('pageNumberColor', e.target.value)}
              className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={footerSettings.pageNumberColor}
              onChange={(e) => onUpdate('pageNumberColor', e.target.value)}
              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
