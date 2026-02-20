'use client';

/**
 * PageCustom - Custom Layout Preview Component
 *
 * Renders a custom layout with absolutely positioned Text, Image, and Spacer objects.
 * Each object can have x, y, width, height in px or %.
 * Text objects can have sub-spacers for float wrapping.
 */

import React from 'react';
import type { DigitalPreviewComponentProps } from '../../../types';
import type { CustomObject } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import CustomObjectRenderer from './CustomObjectRenderer';

// =============================================================================
// PROPS EXTRACTION
// =============================================================================

interface PageCustomProps {
  backgroundColor: string;
  objects: CustomObject[];
}

function usePageCustomProps(
  pageData: Partial<{ backgroundColor?: string; objects?: CustomObject[] }>,
  pdfSettings?: { backgroundColor?: string }
): PageCustomProps {
  const backgroundColor =
    pageData.backgroundColor || pdfSettings?.backgroundColor || '#ffffff';
  const objects: CustomObject[] = pageData.objects || [];

  return {
    backgroundColor,
    objects,
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PageCustom({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const { backgroundColor, objects } = usePageCustomProps(pageData, pdfSettings);

  // Empty state
  if (objects.length === 0) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="text-center text-gray-400">
          <p className="text-sm">No objects added yet</p>
          <p className="text-xs mt-1">Add Text, Image, or Spacer objects to build your layout</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {objects.map((obj, index) => (
        <CustomObjectRenderer
          key={obj.id}
          object={obj}
          index={index}
        />
      ))}
    </div>
  );
}

// Also export the hook for use elsewhere
export { usePageCustomProps };
