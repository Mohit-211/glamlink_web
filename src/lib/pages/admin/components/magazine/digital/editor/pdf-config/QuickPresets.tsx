'use client';

/**
 * QuickPresets - Preset configuration buttons for PDF settings
 */

import React from 'react';
import { PRESETS } from './usePDFConfigPanel';
import type { PagePdfSettings } from '../types';

// =============================================================================
// TYPES
// =============================================================================

interface QuickPresetsProps {
  onApplyPreset: (preset: Partial<PagePdfSettings>) => void;
}

// =============================================================================
// PRESET BUTTON CONFIGS
// =============================================================================

const PRESET_BUTTONS = [
  { key: 'standardDocument', label: 'Standard Document', preset: PRESETS.standardDocument },
  { key: 'fullBleedDark', label: 'Full Bleed Dark', preset: PRESETS.fullBleedDark },
  { key: 'presentation', label: 'Presentation', preset: PRESETS.presentation },
  { key: 'socialPost', label: 'Social Post', preset: PRESETS.socialPost },
] as const;

// =============================================================================
// COMPONENT
// =============================================================================

export default function QuickPresets({ onApplyPreset }: QuickPresetsProps) {
  return (
    <div className="pt-2 border-t border-gray-200">
      <label className="block text-xs font-medium text-gray-600 mb-2">
        Quick Presets
      </label>
      <div className="flex flex-wrap gap-2">
        {PRESET_BUTTONS.map(({ key, label, preset }) => (
          <button
            key={key}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
