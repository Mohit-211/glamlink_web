'use client';

/**
 * LayoutRow - A single row in the column layout editor
 *
 * Renders either a full-width section or left/right column sections.
 * Provides drop zones for drag-and-drop reordering.
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { CondensedCardSectionInstance, SectionColumn } from '@/lib/features/digital-cards/types/sections';
import type { LayoutRow as LayoutRowType } from './rowUtils';
import { DraggableSectionCard } from './DraggableSectionCard';

// =============================================================================
// TYPES
// =============================================================================

export interface LayoutRowProps {
  /** The row data */
  row: LayoutRowType;
  /** ID of the currently selected section (for props editing) */
  selectedSectionId?: string | null;
  /** ID of the currently active section for position editing */
  activeSectionId?: string | null;
  /** Callback when visibility is toggled */
  onToggleVisibility: (sectionId: string) => void;
  /** Callback when settings icon is clicked */
  onOpenSettings: (sectionId: string) => void;
  /** Callback when "Update Position + Size" is clicked */
  onEditPosition: (sectionId: string) => void;
  /** Callback when "Save" is clicked for position editing */
  onSavePosition?: (sectionId: string) => void;
  /** Callback when delete is clicked */
  onDelete: (sectionId: string) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Hide the "Update Position + Size" button */
  hidePositionButton?: boolean;
}

// =============================================================================
// DROP ZONE COMPONENT
// =============================================================================

interface DropZoneProps {
  id: string;
  column: SectionColumn;
  rowIndex: number;
  isEmpty: boolean;
  children?: React.ReactNode;
}

function DropZone({ id, column, rowIndex, isEmpty, children }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { column, rowIndex },
  });

  const columnLabel = column === 'full' ? 'Full Width' : column === 'left' ? 'Left' : 'Right';

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[48px] rounded-md transition-colors
        ${isEmpty
          ? `border-2 border-dashed ${isOver ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'}`
          : ''
        }
        ${isOver && !isEmpty ? 'ring-2 ring-purple-400 ring-offset-1' : ''}
        ${column === 'full' ? 'col-span-2' : ''}
      `}
    >
      {children || (
        <div className="flex items-center justify-center h-full min-h-[48px] text-xs text-gray-400">
          {isOver ? `Drop here (${columnLabel})` : `Empty ${columnLabel}`}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LayoutRow({
  row,
  selectedSectionId,
  activeSectionId,
  onToggleVisibility,
  onOpenSettings,
  onEditPosition,
  onSavePosition,
  onDelete,
  disabled = false,
  hidePositionButton = false,
}: LayoutRowProps) {
  const { rowIndex, left, right, full, isFullWidth } = row;

  // Render a full-width row
  if (isFullWidth && full) {
    return (
      <div className="grid grid-cols-2 gap-2 mb-2">
        <DropZone
          id={`drop-${rowIndex}-full`}
          column="full"
          rowIndex={rowIndex}
          isEmpty={false}
        >
          <div className="col-span-2 bg-gradient-to-r from-purple-50 via-white to-purple-50 rounded-md p-1">
            <DraggableSectionCard
              section={full}
              isSelected={selectedSectionId === full.id}
              isEditingPosition={activeSectionId === full.id}
              onToggleVisibility={onToggleVisibility}
              onOpenSettings={onOpenSettings}
              onEditPosition={onEditPosition}
              onSavePosition={onSavePosition}
              onDelete={onDelete}
              disabled={disabled}
              hidePositionButton={hidePositionButton}
            />
          </div>
        </DropZone>
      </div>
    );
  }

  // Render a two-column row
  return (
    <div className="grid grid-cols-2 gap-2 mb-2">
      {/* Left Column */}
      <DropZone
        id={`drop-${rowIndex}-left`}
        column="left"
        rowIndex={rowIndex}
        isEmpty={!left}
      >
        {left && (
          <DraggableSectionCard
            section={left}
            isSelected={selectedSectionId === left.id}
            isEditingPosition={activeSectionId === left.id}
            onToggleVisibility={onToggleVisibility}
            onOpenSettings={onOpenSettings}
            onEditPosition={onEditPosition}
            onSavePosition={onSavePosition}
            onDelete={onDelete}
            disabled={disabled}
            hidePositionButton={hidePositionButton}
          />
        )}
      </DropZone>

      {/* Right Column */}
      <DropZone
        id={`drop-${rowIndex}-right`}
        column="right"
        rowIndex={rowIndex}
        isEmpty={!right}
      >
        {right && (
          <DraggableSectionCard
            section={right}
            isSelected={selectedSectionId === right.id}
            isEditingPosition={activeSectionId === right.id}
            onToggleVisibility={onToggleVisibility}
            onOpenSettings={onOpenSettings}
            onEditPosition={onEditPosition}
            onSavePosition={onSavePosition}
            onDelete={onDelete}
            disabled={disabled}
            hidePositionButton={hidePositionButton}
          />
        )}
      </DropZone>
    </div>
  );
}

// =============================================================================
// INSERTION ROW (for adding new rows between existing rows)
// =============================================================================

interface InsertionRowProps {
  rowIndex: number;
  isActive?: boolean;
}

export function InsertionRow({ rowIndex, isActive = false }: InsertionRowProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `insert-${rowIndex}`,
    data: { column: 'full', rowIndex, insertNewRow: true },
  });

  if (!isActive && !isOver) {
    return (
      <div
        ref={setNodeRef}
        className="h-2 -my-1 transition-all"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        h-8 -my-3 flex items-center justify-center
        border-2 border-dashed rounded-md
        transition-all
        ${isOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 bg-gray-50'}
      `}
    >
      <span className="text-xs text-gray-500">
        {isOver ? 'Drop to insert new row' : 'Insert row here'}
      </span>
    </div>
  );
}

export default LayoutRow;
