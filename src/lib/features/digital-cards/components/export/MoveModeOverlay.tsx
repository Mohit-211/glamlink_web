'use client';

/**
 * MoveModeOverlay - Draggable overlay for Move Sections mode
 *
 * A simplified draggable overlay that:
 * - Shows colored border for the section
 * - Allows drag to move and resize
 * - Updates position in real-time (no Save/Cancel buttons)
 * - Supports multiple overlays on screen at once
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PositionConfig, DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import { useAppDispatch } from '@/store/hooks';
import { updateSection } from '@/lib/features/digital-cards/store';

// =============================================================================
// TYPES
// =============================================================================

type DragMode =
  | 'move'
  | 'resize-n'
  | 'resize-s'
  | 'resize-e'
  | 'resize-w'
  | 'resize-ne'
  | 'resize-nw'
  | 'resize-se'
  | 'resize-sw'
  | null;

interface DragStartState {
  clientX: number;
  clientY: number;
  startPosition: PositionConfig;
}

export interface MoveModeOverlayProps {
  /** Section ID for identification */
  sectionId: string;
  /** Section label for display */
  label: string;
  /** Initial position config */
  position: PositionConfig;
  /** Border color */
  borderColor: string;
  /** Background color (with transparency) */
  bgColor: string;
  /** Z-index for the overlay */
  zIndex?: number;
  /** Card dimensions for coordinate conversion (in pixels) */
  cardDimensions?: { width: number; height: number };
  /** Scale factor of the preview (viewport pixels to card pixels) */
  scaleFactor?: number;
  /** Callback when position changes (for form state sync) */
  onPositionChange?: (sectionId: string, newPosition: PositionConfig) => void;
}

// =============================================================================
// RESIZE HANDLE COMPONENT
// =============================================================================

interface ResizeHandleProps {
  position: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  color: string;
  onMouseDown: (e: React.MouseEvent, mode: DragMode) => void;
}

function ResizeHandle({ position, color, onMouseDown }: ResizeHandleProps) {
  const handleStyles: Record<string, React.CSSProperties> = {
    n: { top: -4, left: '50%', transform: 'translateX(-50%)', width: 20, height: 6, cursor: 'ns-resize' },
    s: { bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 20, height: 6, cursor: 'ns-resize' },
    e: { right: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 20, cursor: 'ew-resize' },
    w: { left: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 20, cursor: 'ew-resize' },
    ne: { top: -4, right: -4, width: 8, height: 8, cursor: 'nesw-resize' },
    nw: { top: -4, left: -4, width: 8, height: 8, cursor: 'nwse-resize' },
    se: { bottom: -4, right: -4, width: 8, height: 8, cursor: 'nwse-resize' },
    sw: { bottom: -4, left: -4, width: 8, height: 8, cursor: 'nesw-resize' },
  };

  const dragMode: DragMode = `resize-${position}` as DragMode;

  return (
    <div
      className="absolute rounded-sm z-10"
      style={{
        ...handleStyles[position],
        position: 'absolute',
        backgroundColor: 'white',
        border: `2px solid ${color}`,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onMouseDown(e, dragMode);
      }}
    />
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MoveModeOverlay({
  sectionId,
  label,
  position,
  borderColor,
  bgColor,
  zIndex = 900,
  cardDimensions = { width: 1080, height: 1350 },
  scaleFactor = 0.5,
  onPositionChange,
}: MoveModeOverlayProps) {
  const dispatch = useAppDispatch();

  // Local state for drag operations
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<PositionConfig>(
    JSON.parse(JSON.stringify(position))
  );

  const dragStartRef = useRef<DragStartState | null>(null);

  // Reset position when prop changes (from external update)
  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(JSON.parse(JSON.stringify(position)));
    }
  }, [position, isDragging]);

  // ==========================================================================
  // DRAG LOGIC
  // ==========================================================================

  const updateDimension = useCallback((
    dim: DimensionValue,
    delta: number,
    containerSize: number
  ): DimensionValue => {
    if (dim.unit === '%') {
      const deltaPercent = (delta / containerSize) * 100;
      return { value: dim.value + deltaPercent, unit: '%' };
    } else {
      return { value: dim.value + delta, unit: 'px' };
    }
  }, []);

  const calculateNewPosition = useCallback((
    startPosition: PositionConfig,
    deltaX: number,
    deltaY: number,
    mode: DragMode
  ): PositionConfig => {
    const newPosition = JSON.parse(JSON.stringify(startPosition)) as PositionConfig;

    switch (mode) {
      case 'move':
        newPosition.x = updateDimension(startPosition.x, deltaX, cardDimensions.width);
        newPosition.y = updateDimension(startPosition.y, deltaY, cardDimensions.height);
        break;
      case 'resize-n':
        newPosition.y = updateDimension(startPosition.y, deltaY, cardDimensions.height);
        newPosition.height = updateDimension(startPosition.height, -deltaY, cardDimensions.height);
        break;
      case 'resize-s':
        newPosition.height = updateDimension(startPosition.height, deltaY, cardDimensions.height);
        break;
      case 'resize-e':
        newPosition.width = updateDimension(startPosition.width, deltaX, cardDimensions.width);
        break;
      case 'resize-w':
        newPosition.x = updateDimension(startPosition.x, deltaX, cardDimensions.width);
        newPosition.width = updateDimension(startPosition.width, -deltaX, cardDimensions.width);
        break;
      case 'resize-ne':
        newPosition.y = updateDimension(startPosition.y, deltaY, cardDimensions.height);
        newPosition.height = updateDimension(startPosition.height, -deltaY, cardDimensions.height);
        newPosition.width = updateDimension(startPosition.width, deltaX, cardDimensions.width);
        break;
      case 'resize-nw':
        newPosition.x = updateDimension(startPosition.x, deltaX, cardDimensions.width);
        newPosition.y = updateDimension(startPosition.y, deltaY, cardDimensions.height);
        newPosition.width = updateDimension(startPosition.width, -deltaX, cardDimensions.width);
        newPosition.height = updateDimension(startPosition.height, -deltaY, cardDimensions.height);
        break;
      case 'resize-se':
        newPosition.width = updateDimension(startPosition.width, deltaX, cardDimensions.width);
        newPosition.height = updateDimension(startPosition.height, deltaY, cardDimensions.height);
        break;
      case 'resize-sw':
        newPosition.x = updateDimension(startPosition.x, deltaX, cardDimensions.width);
        newPosition.width = updateDimension(startPosition.width, -deltaX, cardDimensions.width);
        newPosition.height = updateDimension(startPosition.height, deltaY, cardDimensions.height);
        break;
    }

    // Apply minimum size constraints (5%)
    const minSize = 5;
    if (newPosition.width.value < minSize) newPosition.width.value = minSize;
    if (newPosition.height.value < minSize) newPosition.height.value = minSize;

    // Clamp position to bounds (0-100%)
    if (newPosition.x.value < 0) newPosition.x.value = 0;
    if (newPosition.y.value < 0) newPosition.y.value = 0;
    if (newPosition.x.value + newPosition.width.value > 100) {
      newPosition.x.value = 100 - newPosition.width.value;
    }
    if (newPosition.y.value + newPosition.height.value > 100) {
      newPosition.y.value = 100 - newPosition.height.value;
    }

    return newPosition;
  }, [cardDimensions, updateDimension]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleMouseDown = useCallback((e: React.MouseEvent, mode: DragMode) => {
    e.preventDefault();
    e.stopPropagation();

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startPosition: JSON.parse(JSON.stringify(currentPosition)),
    };

    setDragMode(mode);
    setIsDragging(true);
  }, [currentPosition]);

  // ==========================================================================
  // GLOBAL MOUSE EVENTS
  // ==========================================================================

  useEffect(() => {
    if (!isDragging || !dragStartRef.current || !dragMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      const { clientX: startX, clientY: startY, startPosition } = dragStartRef.current!;

      // Calculate delta in viewport pixels, then convert to card pixels
      const deltaViewportX = e.clientX - startX;
      const deltaViewportY = e.clientY - startY;
      const deltaCardX = deltaViewportX / scaleFactor;
      const deltaCardY = deltaViewportY / scaleFactor;

      const newPosition = calculateNewPosition(startPosition, deltaCardX, deltaCardY, dragMode);
      setCurrentPosition(newPosition);

      // Update Redux in real-time for live preview
      dispatch(updateSection({ sectionId, updates: { position: newPosition } }));

      // Notify parent for form state sync
      if (onPositionChange) {
        onPositionChange(sectionId, newPosition);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setDragMode(null);
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragMode, scaleFactor, calculateNewPosition, dispatch, sectionId, onPositionChange]);

  // ==========================================================================
  // CURSOR
  // ==========================================================================

  const getCursor = (): string => {
    if (isDragging) {
      if (dragMode === 'move') return 'grabbing';
      const dir = dragMode?.replace('resize-', '');
      if (dir === 'n' || dir === 's') return 'ns-resize';
      if (dir === 'e' || dir === 'w') return 'ew-resize';
      if (dir === 'ne' || dir === 'sw') return 'nesw-resize';
      return 'nwse-resize';
    }
    return 'grab';
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: `${currentPosition.x.value}%`,
        top: `${currentPosition.y.value}%`,
        width: `${currentPosition.width.value}%`,
        height: `${currentPosition.height.value}%`,
        zIndex,
        cursor: getCursor(),
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
    >
      {/* Highlight box */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: bgColor,
          border: `3px solid ${borderColor}`,
        }}
      />

      {/* Section label */}
      <div
        className="absolute -top-6 left-0 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
        style={{
          backgroundColor: borderColor,
          color: 'white',
        }}
      >
        {label}
      </div>

      {/* Resize handles */}
      <ResizeHandle position="n" color={borderColor} onMouseDown={handleMouseDown} />
      <ResizeHandle position="s" color={borderColor} onMouseDown={handleMouseDown} />
      <ResizeHandle position="e" color={borderColor} onMouseDown={handleMouseDown} />
      <ResizeHandle position="w" color={borderColor} onMouseDown={handleMouseDown} />
      <ResizeHandle position="ne" color={borderColor} onMouseDown={handleMouseDown} />
      <ResizeHandle position="nw" color={borderColor} onMouseDown={handleMouseDown} />
      <ResizeHandle position="se" color={borderColor} onMouseDown={handleMouseDown} />
      <ResizeHandle position="sw" color={borderColor} onMouseDown={handleMouseDown} />
    </div>
  );
}

export default MoveModeOverlay;
