'use client';

/**
 * CondensedCardPositionOverlay - Visual overlay showing section positions
 *
 * Features:
 * - Colored semi-transparent boxes for each section
 * - Section labels (top-left)
 * - Z-index badges (bottom-right)
 * - Click-to-select functionality
 * - Hover effects
 * - 8-color palette cycling
 */

import React from 'react';
import type {
  CondensedCardConfig,
  CondensedCardSectionInstance,
} from '@/lib/features/digital-cards/types/condensedCardConfig';
import {
  useCondensedCardView,
  formatDimension,
  getColorForIndex,
} from './useCondensedCardView';

// =============================================================================
// TYPES
// =============================================================================

export interface CondensedCardPositionOverlayProps {
  /** Card configuration with section positions */
  config: CondensedCardConfig;
  /** Callback when a section is clicked */
  onSectionClick?: (sectionId: string) => void;
  /** Currently selected section ID (optional, for highlighting) */
  selectedSectionId?: string;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CondensedCardPositionOverlay({
  config: configProp,
  onSectionClick,
  selectedSectionId,
  className = '',
}: CondensedCardPositionOverlayProps) {
  // Use shared hook for config processing and section sorting
  const { cardWidth, cardHeight, sortedSections } = useCondensedCardView({
    config: configProp,
  });

  /**
   * Render a single section overlay box
   */
  const renderSectionBox = (section: CondensedCardSectionInstance, index: number) => {
    // Skip if not visible
    if (!section.visible) return null;

    const color = getColorForIndex(index);
    const isSelected = selectedSectionId === section.id;

    // Convert position to CSS
    const style: React.CSSProperties = {
      position: 'absolute',
      left: formatDimension(section.position.x),
      top: formatDimension(section.position.y),
      width: formatDimension(section.position.width),
      height: formatDimension(section.position.height),
      backgroundColor: color.bg,
      border: `2px ${isSelected ? 'solid' : 'dashed'} ${color.border}`,
      borderRadius: '4px',
      cursor: onSectionClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      zIndex: section.zIndex ?? 'auto',
    };

    return (
      <div
        key={section.id}
        style={style}
        onClick={() => onSectionClick?.(section.id)}
        className={`overlay-section ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''} hover:opacity-80`}
        title={`${section.label} (Z: ${section.zIndex ?? 0})`}
      >
        {/* Section Label (Top-Left) */}
        <div
          className="absolute top-1 left-1 px-2 py-1 rounded text-xs font-semibold shadow-sm"
          style={{
            backgroundColor: color.border,
            color: 'white',
          }}
        >
          {section.label}
        </div>

        {/* Z-Index Badge (Bottom-Right) */}
        {section.zIndex !== undefined && (
          <div
            className="absolute bottom-1 right-1 px-2 py-1 rounded text-xs font-semibold shadow-sm"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          >
            Z: {section.zIndex}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        pointerEvents: onSectionClick ? 'auto' : 'none',
        zIndex: 1000, // High z-index to overlay everything
      }}
    >
      {/* Render all section boxes */}
      {sortedSections.map((section, index) => renderSectionBox(section, index))}
    </div>
  );
}

export default CondensedCardPositionOverlay;
