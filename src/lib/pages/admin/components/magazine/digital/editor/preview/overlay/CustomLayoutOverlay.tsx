'use client';

/**
 * CustomLayoutOverlay - Renders numbered overlays showing object positions
 *
 * Displays visual representation of custom layout objects with:
 * - Colored dashed borders based on object type
 * - Numbered labels for each object
 * - Type indicator in corner
 * - Position dimensions displayed
 * - Sub-spacers for text and custom-block objects
 * - Legend explaining the color coding
 */

import React from 'react';
import type { CustomObject } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import ObjectOverlay from './ObjectOverlay';
import SubSpacerOverlay from './SubSpacerOverlay';
import OverlayLegend from './OverlayLegend';

// =============================================================================
// TYPES
// =============================================================================

interface CustomLayoutOverlayProps {
  objects: CustomObject[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CustomLayoutOverlay({ objects }: CustomLayoutOverlayProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none bg-gray-100/30"
      style={{ zIndex: 9999 }}
    >
      {objects.map((obj, index) => (
        <React.Fragment key={obj.id}>
          {/* Main object overlay */}
          <ObjectOverlay object={obj} index={index} />

          {/* Sub-spacers for text and custom-block objects */}
          <SubSpacerOverlay object={obj} index={index} />
        </React.Fragment>
      ))}

      {/* Legend */}
      <OverlayLegend />
    </div>
  );
}
