'use client';

/**
 * ObjectOverlay - Renders the main overlay for a custom layout object
 *
 * Displays:
 * - Colored dashed border based on object type
 * - Numbered label in the center
 * - Type indicator in the top-left corner
 * - Dimensions in the bottom-right corner
 */

import React from 'react';
import type { CustomObject } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import { formatDimension } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import { getObjectColor, getObjectBackground, getTypeLabel } from './helpers';

// =============================================================================
// TYPES
// =============================================================================

interface ObjectOverlayProps {
  object: CustomObject;
  index: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ObjectOverlay({ object, index }: ObjectOverlayProps) {
  const color = getObjectColor(object.type);
  const bgColor = getObjectBackground(object.type);

  return (
    <div
      className="absolute border-2 border-dashed flex items-center justify-center"
      style={{
        left: formatDimension(object.x),
        top: formatDimension(object.y),
        width: formatDimension(object.width),
        height: formatDimension(object.height),
        borderColor: color,
        backgroundColor: bgColor,
        zIndex: Math.max(0, object.zIndex ?? index),
      }}
    >
      {/* Number badge */}
      <span
        className="px-2 py-1 rounded text-sm font-bold shadow-sm"
        style={{
          backgroundColor: 'white',
          color: color,
          border: `2px solid ${color}`,
        }}
      >
        {index + 1}
      </span>

      {/* Type label */}
      <span
        className="absolute top-1 left-1 px-1 text-[10px] font-semibold uppercase rounded"
        style={{
          backgroundColor: color,
          color: 'white',
        }}
      >
        {getTypeLabel(object.type)}
      </span>

      {/* Dimensions label */}
      <span
        className="absolute bottom-1 right-1 px-1 text-[9px] font-mono bg-white/80 rounded"
        style={{ color: color }}
      >
        {formatDimension(object.width)} x {formatDimension(object.height)}
      </span>
    </div>
  );
}
