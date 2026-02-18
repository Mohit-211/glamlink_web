'use client';

/**
 * DragPositionContext - Shared context for drag-to-reposition and resize functionality
 *
 * Provides state and handlers for:
 * - Entering/exiting edit mode for a section
 * - Dragging to move sections
 * - Dragging handles to resize sections
 * - Real-time position preview during drag
 * - Saving or canceling changes
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { PositionConfig, DimensionValue } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Drag mode indicates what type of drag operation is in progress.
 * - 'move': Dragging to reposition the section
 * - 'resize-*': Dragging a handle to resize (n=north, s=south, e=east, w=west)
 * - null: No drag in progress
 */
export type DragMode =
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

/**
 * Drag start state - captured when user starts dragging
 */
interface DragStartState {
  clientX: number;
  clientY: number;
  startPosition: PositionConfig;
}

/**
 * Context value interface
 */
export interface DragPositionContextValue {
  // Current state
  activeSectionId: string | null;
  dragMode: DragMode;
  isDragging: boolean;
  previewPosition: PositionConfig | null;
  originalPosition: PositionConfig | null;

  // Card dimensions (needed for coordinate conversion)
  cardDimensions: { width: number; height: number } | null;
  setCardDimensions: (dims: { width: number; height: number }) => void;

  // Scale factor for the preview (viewport pixels to card pixels)
  scaleFactor: number;
  setScaleFactor: (factor: number) => void;

  // Actions
  enterEditMode: (sectionId: string, originalPosition: PositionConfig) => void;
  cancelEditMode: () => void;
  startDrag: (mode: DragMode, clientX: number, clientY: number) => void;
  updateDrag: (clientX: number, clientY: number) => void;
  endDrag: () => void;
  saveChanges: () => PositionConfig | null;
}

// =============================================================================
// CONTEXT
// =============================================================================

const DragPositionContext = createContext<DragPositionContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

interface DragPositionProviderProps {
  children: React.ReactNode;
}

export function DragPositionProvider({ children }: DragPositionProviderProps) {
  // State
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<PositionConfig | null>(null);
  const [originalPosition, setOriginalPosition] = useState<PositionConfig | null>(null);
  const [cardDimensions, setCardDimensions] = useState<{ width: number; height: number } | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  // Ref to store drag start state
  const dragStartRef = useRef<DragStartState | null>(null);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  /**
   * Enter edit mode for a section
   */
  const enterEditMode = useCallback((sectionId: string, position: PositionConfig) => {
    setActiveSectionId(sectionId);
    setOriginalPosition(JSON.parse(JSON.stringify(position)));
    setPreviewPosition(JSON.parse(JSON.stringify(position)));
    setDragMode(null);
    setIsDragging(false);
  }, []);

  /**
   * Cancel edit mode and restore original position
   */
  const cancelEditMode = useCallback(() => {
    setActiveSectionId(null);
    setDragMode(null);
    setIsDragging(false);
    setPreviewPosition(null);
    setOriginalPosition(null);
    dragStartRef.current = null;
  }, []);

  /**
   * Start a drag operation
   */
  const startDrag = useCallback((mode: DragMode, clientX: number, clientY: number) => {
    if (!previewPosition) return;

    dragStartRef.current = {
      clientX,
      clientY,
      startPosition: JSON.parse(JSON.stringify(previewPosition)),
    };

    setDragMode(mode);
    setIsDragging(true);
  }, [previewPosition]);

  /**
   * Update position during drag
   */
  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragStartRef.current || !dragMode || !previewPosition || !cardDimensions) return;

    const { clientX: startX, clientY: startY, startPosition } = dragStartRef.current;

    // Calculate delta in viewport pixels
    const deltaViewportX = clientX - startX;
    const deltaViewportY = clientY - startY;

    // Convert delta to card pixels (accounting for preview scale)
    const deltaCardX = deltaViewportX / scaleFactor;
    const deltaCardY = deltaViewportY / scaleFactor;

    // Create new position based on drag mode
    const newPosition = JSON.parse(JSON.stringify(startPosition)) as PositionConfig;

    // Helper to update a dimension value
    const updateDimension = (
      dim: DimensionValue,
      delta: number,
      containerSize: number
    ): DimensionValue => {
      if (dim.unit === '%') {
        // Convert delta (in card px) to percentage
        const deltaPercent = (delta / containerSize) * 100;
        return { value: dim.value + deltaPercent, unit: '%' };
      } else {
        // Delta is already in card pixels
        return { value: dim.value + delta, unit: 'px' };
      }
    };

    // Apply changes based on drag mode
    switch (dragMode) {
      case 'move':
        // Update X and Y position
        newPosition.x = updateDimension(startPosition.x, deltaCardX, cardDimensions.width);
        newPosition.y = updateDimension(startPosition.y, deltaCardY, cardDimensions.height);
        break;

      case 'resize-n':
        // North: change Y and Height (anchor bottom)
        newPosition.y = updateDimension(startPosition.y, deltaCardY, cardDimensions.height);
        newPosition.height = updateDimension(startPosition.height, -deltaCardY, cardDimensions.height);
        break;

      case 'resize-s':
        // South: change Height only (anchor top)
        newPosition.height = updateDimension(startPosition.height, deltaCardY, cardDimensions.height);
        break;

      case 'resize-e':
        // East: change Width only (anchor left)
        newPosition.width = updateDimension(startPosition.width, deltaCardX, cardDimensions.width);
        break;

      case 'resize-w':
        // West: change X and Width (anchor right)
        newPosition.x = updateDimension(startPosition.x, deltaCardX, cardDimensions.width);
        newPosition.width = updateDimension(startPosition.width, -deltaCardX, cardDimensions.width);
        break;

      case 'resize-ne':
        // Northeast: change Y, Height, Width
        newPosition.y = updateDimension(startPosition.y, deltaCardY, cardDimensions.height);
        newPosition.height = updateDimension(startPosition.height, -deltaCardY, cardDimensions.height);
        newPosition.width = updateDimension(startPosition.width, deltaCardX, cardDimensions.width);
        break;

      case 'resize-nw':
        // Northwest: change X, Y, Width, Height
        newPosition.x = updateDimension(startPosition.x, deltaCardX, cardDimensions.width);
        newPosition.y = updateDimension(startPosition.y, deltaCardY, cardDimensions.height);
        newPosition.width = updateDimension(startPosition.width, -deltaCardX, cardDimensions.width);
        newPosition.height = updateDimension(startPosition.height, -deltaCardY, cardDimensions.height);
        break;

      case 'resize-se':
        // Southeast: change Width, Height
        newPosition.width = updateDimension(startPosition.width, deltaCardX, cardDimensions.width);
        newPosition.height = updateDimension(startPosition.height, deltaCardY, cardDimensions.height);
        break;

      case 'resize-sw':
        // Southwest: change X, Width, Height
        newPosition.x = updateDimension(startPosition.x, deltaCardX, cardDimensions.width);
        newPosition.width = updateDimension(startPosition.width, -deltaCardX, cardDimensions.width);
        newPosition.height = updateDimension(startPosition.height, deltaCardY, cardDimensions.height);
        break;
    }

    // Apply minimum size constraints (prevent negative/zero dimensions)
    const minSize = 5; // Minimum 5% or 5px
    if (newPosition.width.value < minSize) {
      newPosition.width.value = minSize;
    }
    if (newPosition.height.value < minSize) {
      newPosition.height.value = minSize;
    }

    setPreviewPosition(newPosition);
  }, [dragMode, previewPosition, cardDimensions, scaleFactor]);

  /**
   * End drag operation
   */
  const endDrag = useCallback(() => {
    setDragMode(null);
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  /**
   * Save changes and return the final position
   */
  const saveChanges = useCallback((): PositionConfig | null => {
    const finalPosition = previewPosition;

    // Reset state
    setActiveSectionId(null);
    setDragMode(null);
    setIsDragging(false);
    setPreviewPosition(null);
    setOriginalPosition(null);
    dragStartRef.current = null;

    return finalPosition;
  }, [previewPosition]);

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const value: DragPositionContextValue = {
    activeSectionId,
    dragMode,
    isDragging,
    previewPosition,
    originalPosition,
    cardDimensions,
    setCardDimensions,
    scaleFactor,
    setScaleFactor,
    enterEditMode,
    cancelEditMode,
    startDrag,
    updateDrag,
    endDrag,
    saveChanges,
  };

  return (
    <DragPositionContext.Provider value={value}>
      {children}
    </DragPositionContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useDragPosition(): DragPositionContextValue {
  const context = useContext(DragPositionContext);

  if (context === undefined) {
    throw new Error('useDragPosition must be used within a DragPositionProvider');
  }

  return context;
}

export default DragPositionContext;
