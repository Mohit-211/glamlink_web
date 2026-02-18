"use client";

/**
 * DropshadowContainer - A styled container with customizable drop shadow
 *
 * An empty container with configurable shadow, border, and background styling.
 * The container size is determined by the position settings (width/height).
 * No inner section - just the styled container itself.
 */

import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { getBackgroundStyle, buildBoxShadow } from './utils/helpers';
import { DROPSHADOW_DEFAULTS } from './utils/props';
import { selectSectionProps } from '@/lib/features/digital-cards/store';
import { useAppSelector } from "../../../../../../../store/hooks";

// =============================================================================
// TYPES
// =============================================================================

interface DropshadowContainerProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DropshadowContainer({ professional, section }: DropshadowContainerProps) {
  // READ FROM REDUX - use section ID for this specific instance (not type-based which breaks with multiple instances)
  const sectionId = section?.id || '';
  const reduxProps = useAppSelector(selectSectionProps(sectionId));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Shadow properties
  const shadowOffsetX = mergedProps?.shadowOffsetX ?? DROPSHADOW_DEFAULTS.shadowOffsetX;
  const shadowOffsetY = mergedProps?.shadowOffsetY ?? DROPSHADOW_DEFAULTS.shadowOffsetY;
  const shadowBlur = mergedProps?.shadowBlur ?? DROPSHADOW_DEFAULTS.shadowBlur;
  const shadowSpread = mergedProps?.shadowSpread ?? DROPSHADOW_DEFAULTS.shadowSpread;
  const shadowColor = mergedProps?.shadowColor ?? DROPSHADOW_DEFAULTS.shadowColor;
  const shadowOpacity = mergedProps?.shadowOpacity ?? DROPSHADOW_DEFAULTS.shadowOpacity;

  // Border properties - default to NO border (just dropshadow)
  const borderColor = mergedProps?.borderColor ?? DROPSHADOW_DEFAULTS.borderColor;
  const borderWidth = mergedProps?.borderWidth ?? DROPSHADOW_DEFAULTS.borderWidth;

  // Container properties
  const containerBackground = mergedProps?.containerBackground ?? DROPSHADOW_DEFAULTS.containerBackground;
  const borderRadius = mergedProps?.borderRadius ?? DROPSHADOW_DEFAULTS.borderRadius;

  // Build container style with shadow
  const containerStyle: React.CSSProperties = {
    ...getBackgroundStyle(containerBackground),
    borderRadius: `${borderRadius}px`,
    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
    boxShadow: buildBoxShadow(shadowOffsetX, shadowOffsetY, shadowBlur, shadowSpread, shadowColor, shadowOpacity),
    width: '100%',
    height: '100%',
  };

  return (
    <div style={containerStyle} className="dropshadow-container" />
  );
}
