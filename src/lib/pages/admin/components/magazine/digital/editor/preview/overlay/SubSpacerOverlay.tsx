'use client';

/**
 * SubSpacerOverlay - Renders sub-spacer overlays for text and custom-block objects
 *
 * Sub-spacers are positioned RELATIVE to their parent object:
 * - x=80% means 80% of the way across the parent's width, not 80% from page left
 * - width=30% means 30% of parent's width, not 30% of page
 */

import React from 'react';
import type { CustomObject, TextSubSpacer } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import { formatDimension, isTextObject, isCustomBlockObject } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import { getSubSpacerColor, getSubSpacerBackground } from './helpers';

// =============================================================================
// TYPES
// =============================================================================

interface SubSpacerOverlayProps {
  object: CustomObject;
  index: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

interface CalculatedPosition {
  left: string;
  top: string;
  width: string;
  height: string;
}

/**
 * Calculate absolute position and size of a sub-spacer relative to its parent
 */
function calculateSpacerPosition(
  spacer: TextSubSpacer,
  parentObject: CustomObject
): CalculatedPosition {
  const parentX = parentObject.x?.value ?? 0;
  const parentY = parentObject.y?.value ?? 0;
  const parentWidth = parentObject.width?.value ?? 0;
  const parentHeight = parentObject.height?.value ?? 0;
  const parentXUnit = parentObject.x?.unit ?? '%';
  const parentYUnit = parentObject.y?.unit ?? '%';
  const parentWidthUnit = parentObject.width?.unit ?? '%';
  const parentHeightUnit = parentObject.height?.unit ?? '%';

  const spacerX = spacer.x?.value ?? 0;
  const spacerY = spacer.y?.value ?? 0;
  const spacerWidth = spacer.width?.value ?? 0;
  const spacerHeight = spacer.height?.value ?? 0;
  const spacerXUnit = spacer.x?.unit ?? '%';
  const spacerYUnit = spacer.y?.unit ?? '%';
  const spacerWidthUnit = spacer.width?.unit ?? '%';
  const spacerHeightUnit = spacer.height?.unit ?? '%';

  let leftValue: string;
  let topValue: string;
  let widthValue: string;
  let heightValue: string;

  // Position calculations
  if (spacerXUnit === '%' && parentXUnit === '%' && parentWidthUnit === '%') {
    // Pure percentage calculation
    const offsetPercent = (spacerX / 100) * parentWidth;
    leftValue = `${parentX + offsetPercent}%`;
  } else {
    // Mixed units - use calc()
    leftValue = `calc(${formatDimension(parentObject.x)} + (${spacerX}% / 100 * ${formatDimension(parentObject.width)}))`;
  }

  if (spacerYUnit === '%' && parentYUnit === '%' && parentHeightUnit === '%') {
    // Pure percentage calculation
    const offsetPercent = (spacerY / 100) * parentHeight;
    topValue = `${parentY + offsetPercent}%`;
  } else {
    // Mixed units - use calc()
    topValue = `calc(${formatDimension(parentObject.y)} + (${spacerY}% / 100 * ${formatDimension(parentObject.height)}))`;
  }

  // Size calculations (also relative to parent)
  if (spacerWidthUnit === '%' && parentWidthUnit === '%') {
    // Pure percentage: spacer.width% of parent.width%
    const actualWidthPercent = (spacerWidth / 100) * parentWidth;
    widthValue = `${actualWidthPercent}%`;
  } else {
    // Mixed units - use calc()
    widthValue = `calc(${spacerWidth}% / 100 * ${formatDimension(parentObject.width)})`;
  }

  if (spacerHeightUnit === '%' && parentHeightUnit === '%') {
    // Pure percentage: spacer.height% of parent.height%
    const actualHeightPercent = (spacerHeight / 100) * parentHeight;
    heightValue = `${actualHeightPercent}%`;
  } else {
    // Mixed units - use calc()
    heightValue = `calc(${spacerHeight}% / 100 * ${formatDimension(parentObject.height)})`;
  }

  return { left: leftValue, top: topValue, width: widthValue, height: heightValue };
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function SubSpacerOverlay({ object, index }: SubSpacerOverlayProps) {
  // Only render for text and custom-block objects with spacers
  if (!(isTextObject(object) || isCustomBlockObject(object))) {
    return null;
  }

  if (!object.spacers || object.spacers.length === 0) {
    return null;
  }

  const subSpacerColor = getSubSpacerColor();
  const subSpacerBg = getSubSpacerBackground();

  return (
    <>
      {object.spacers.map((spacer, spacerIndex) => {
        const position = calculateSpacerPosition(spacer, object);

        return (
          <div
            key={spacer.id}
            className="absolute border-2 border-dashed flex items-center justify-center"
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              height: position.height,
              borderColor: subSpacerColor,
              backgroundColor: subSpacerBg,
              zIndex: Math.max(0, object.zIndex ?? index) + 1,
            }}
          >
            <span
              className="px-1 py-0.5 text-[9px] font-semibold rounded"
              style={{
                backgroundColor: subSpacerColor,
                color: 'white',
              }}
            >
              Sub {spacerIndex + 1}/{object.spacers!.length}
            </span>
          </div>
        );
      })}
    </>
  );
}
