'use client';

/**
 * OverlayLegend - Displays a legend explaining overlay colors
 *
 * Shows color-coded boxes for each object type:
 * - Text (blue)
 * - Image (green)
 * - Spacer (gray)
 * - Custom Block (purple)
 * - Link (amber)
 * - Sub-Spacer (light blue)
 */

import React from 'react';
import { getObjectColor, getObjectBackground, getSubSpacerColor, getSubSpacerBackground } from './helpers';

// =============================================================================
// TYPES
// =============================================================================

interface LegendItem {
  type: string;
  label: string;
  color: string;
  background: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function OverlayLegend() {
  const legendItems: LegendItem[] = [
    { type: 'text', label: 'Text', color: getObjectColor('text'), background: getObjectBackground('text') },
    { type: 'image', label: 'Image', color: getObjectColor('image'), background: getObjectBackground('image') },
    { type: 'spacer', label: 'Spacer', color: getObjectColor('spacer'), background: getObjectBackground('spacer') },
    { type: 'custom-block', label: 'Custom Block', color: getObjectColor('custom-block'), background: getObjectBackground('custom-block') },
    { type: 'link', label: 'Link', color: getObjectColor('link'), background: getObjectBackground('link') },
    { type: 'sub-spacer', label: 'Sub-Spacer', color: getSubSpacerColor(), background: getSubSpacerBackground() },
  ];

  return (
    <div className="absolute bottom-2 left-2 flex gap-3 bg-white/90 p-2 rounded shadow-sm text-[10px]">
      {legendItems.map((item) => (
        <div key={item.type} className="flex items-center gap-1">
          <span
            className="w-3 h-3 border-2 border-dashed rounded"
            style={{ borderColor: item.color, backgroundColor: item.background }}
          />
          <span className="text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
