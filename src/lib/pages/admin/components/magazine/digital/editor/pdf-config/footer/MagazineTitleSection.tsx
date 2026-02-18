'use client';

/**
 * MagazineTitleSection - Magazine title configuration for footer
 */

import React from 'react';
import type { FooterSettings } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

interface MagazineTitleSectionProps {
  footerSettings: FooterSettings;
  onUpdate: <K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ALIGNMENT_OPTIONS = ['left', 'right'] as const;
const DEFAULT_GLAMLINK_TEAL = '#14b8a6';

// =============================================================================
// COMPONENT
// =============================================================================

export default function MagazineTitleSection({
  footerSettings,
  onUpdate,
}: MagazineTitleSectionProps) {
  return (
    <div className="space-y-2">
      {/* Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showMagazineTitle"
          checked={footerSettings.showMagazineTitle}
          onChange={(e) => onUpdate('showMagazineTitle', e.target.checked)}
          className="h-4 w-4 text-indigo-600 rounded border-gray-300"
        />
        <label htmlFor="showMagazineTitle" className="text-xs font-medium text-gray-700">
          Magazine Title
        </label>
        <span className="text-xs text-gray-400">&quot;The Glamlink Edit&quot;</span>
      </div>

      {/* Expanded Options */}
      {footerSettings.showMagazineTitle && (
        <div className="ml-6 space-y-2">
          {/* Alignment */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">Align:</span>
            <div className="flex gap-1">
              {ALIGNMENT_OPTIONS.map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdate('magazineTitleAlignment', align)}
                  className={`
                    px-2 py-1 text-xs rounded transition-colors capitalize
                    ${
                      footerSettings.magazineTitleAlignment === align
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
              value={footerSettings.magazineTitleColor}
              onChange={(e) => onUpdate('magazineTitleColor', e.target.value)}
              className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={footerSettings.magazineTitleColor}
              onChange={(e) => onUpdate('magazineTitleColor', e.target.value)}
              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => onUpdate('magazineTitleColor', DEFAULT_GLAMLINK_TEAL)}
              className="px-2 py-1 text-xs bg-teal-500 text-white rounded hover:bg-teal-600"
              title="Reset to Glamlink Teal"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
