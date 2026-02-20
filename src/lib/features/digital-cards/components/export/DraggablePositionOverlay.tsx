'use client';

/**
 * DraggablePositionOverlay - Interactive overlay for drag-to-move and resize
 *
 * Self-contained component that manages its own drag state.
 *
 * Features:
 * - Teal highlight border around section
 * - 8 resize handles (4 edges + 4 corners)
 * - Drag anywhere on section to move
 * - Drag handles to resize
 * - Cursor changes based on interaction
 * - Real-time position preview during drag
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PositionConfig, DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import { formatDimension } from './useCondensedCardView';

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

interface DraggablePositionOverlayProps {
  /** Section ID for identification */
  sectionId: string;
  /** Initial position config */
  position: PositionConfig;
  /** Z-index for the overlay */
  zIndex?: number;
  /** Card dimensions for coordinate conversion (in pixels) */
  cardDimensions?: { width: number; height: number };
  /** Scale factor of the preview (viewport pixels to card pixels) */
  scaleFactor?: number;
  /** Callback when save is clicked */
  onSave: (newPosition: PositionConfig) => void;
  /** Callback when cancel is clicked */
  onCancel: () => void;
  /** Callback during drag for real-time position updates */
  onPositionChange?: (newPosition: PositionConfig) => void;
}

// =============================================================================
// RESIZE HANDLE COMPONENT
// =============================================================================

interface ResizeHandleProps {
  position: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  onMouseDown: (e: React.MouseEvent, mode: DragMode) => void;
}

function ResizeHandle({ position, onMouseDown }: ResizeHandleProps) {
  const handleStyles: Record<string, React.CSSProperties> = {
    n: { top: -4, left: '50%', transform: 'translateX(-50%)', width: 24, height: 8, cursor: 'ns-resize' },
    s: { bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 24, height: 8, cursor: 'ns-resize' },
    e: { right: -4, top: '50%', transform: 'translateY(-50%)', width: 8, height: 24, cursor: 'ew-resize' },
    w: { left: -4, top: '50%', transform: 'translateY(-50%)', width: 8, height: 24, cursor: 'ew-resize' },
    ne: { top: -5, right: -5, width: 10, height: 10, cursor: 'nesw-resize' },
    nw: { top: -5, left: -5, width: 10, height: 10, cursor: 'nwse-resize' },
    se: { bottom: -5, right: -5, width: 10, height: 10, cursor: 'nwse-resize' },
    sw: { bottom: -5, left: -5, width: 10, height: 10, cursor: 'nesw-resize' },
  };

  const dragMode: DragMode = `resize-${position}` as DragMode;

  return (
    <div
      className="absolute bg-white border-2 border-glamlink-teal rounded-sm hover:bg-glamlink-teal/20 z-10"
      style={{ ...handleStyles[position], position: 'absolute' }}
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

export function DraggablePositionOverlay({
  sectionId,
  position,
  zIndex = 1000,
  cardDimensions = { width: 1080, height: 1350 },
  scaleFactor = 0.5,
  onSave,
  onCancel,
  onPositionChange,
}: DraggablePositionOverlayProps) {
  console.log('[DraggablePositionOverlay] Rendering with:', { sectionId, position, scaleFactor });

  // Local state for drag operations
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<PositionConfig>(
    JSON.parse(JSON.stringify(position))
  );

  const dragStartRef = useRef<DragStartState | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset position when prop changes
  useEffect(() => {
    setCurrentPosition(JSON.parse(JSON.stringify(position)));
  }, [position]);

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

    // Apply minimum size constraints
    const minSize = 5;
    if (newPosition.width.value < minSize) newPosition.width.value = minSize;
    if (newPosition.height.value < minSize) newPosition.height.value = minSize;

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

  const handleSaveClick = useCallback(() => {
    onSave(currentPosition);
  }, [currentPosition, onSave]);

  const handleCancelClick = useCallback(() => {
    onCancel();
  }, [onCancel]);

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

      // Notify parent of position change for real-time updates
      if (onPositionChange) {
        onPositionChange(newPosition);
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
  }, [isDragging, dragMode, scaleFactor, calculateNewPosition, onPositionChange]);

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
    return 'move';
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <>
      {/* Overlay container */}
      <div
        ref={overlayRef}
        className="absolute pointer-events-auto"
        style={{
          left: formatDimension(currentPosition.x),
          top: formatDimension(currentPosition.y),
          width: formatDimension(currentPosition.width),
          height: formatDimension(currentPosition.height),
          zIndex,
          cursor: getCursor(),
        }}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {/* Highlight box */}
        <div
          className="absolute inset-0 rounded-md"
          style={{
            backgroundColor: 'rgba(34, 184, 200, 0.1)',
            border: '3px solid #22B8C8',
          }}
        />

        {/* Section label */}
        <div className="absolute -top-8 left-0 px-2 py-1 bg-glamlink-teal text-white text-xs font-semibold rounded shadow-sm whitespace-nowrap">
          Drag to move
        </div>

        {/* Resize handles */}
        <ResizeHandle position="n" onMouseDown={handleMouseDown} />
        <ResizeHandle position="s" onMouseDown={handleMouseDown} />
        <ResizeHandle position="e" onMouseDown={handleMouseDown} />
        <ResizeHandle position="w" onMouseDown={handleMouseDown} />
        <ResizeHandle position="ne" onMouseDown={handleMouseDown} />
        <ResizeHandle position="nw" onMouseDown={handleMouseDown} />
        <ResizeHandle position="se" onMouseDown={handleMouseDown} />
        <ResizeHandle position="sw" onMouseDown={handleMouseDown} />
      </div>

      {/* Floating toolbar */}
      <div
        className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3"
        style={{ zIndex: zIndex + 10 }}
      >
        <span className="text-xs text-gray-600">
          Drag to move, drag edges/corners to resize
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCancelClick}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-3 py-1.5 text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default DraggablePositionOverlay;
