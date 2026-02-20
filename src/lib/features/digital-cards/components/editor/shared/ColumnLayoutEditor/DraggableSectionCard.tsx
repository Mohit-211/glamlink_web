'use client';

/**
 * DraggableSectionCard - A compact, draggable section card for the column layout editor
 *
 * Shows section name with controls for visibility, settings, and deletion.
 * The entire card (except icons) is draggable.
 */

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/sections';

// =============================================================================
// TYPES
// =============================================================================

export interface DraggableSectionCardProps {
  /** The section to display */
  section: CondensedCardSectionInstance;
  /** Whether the section is currently selected for props editing */
  isSelected?: boolean;
  /** Whether the section is currently being edited for position */
  isEditingPosition?: boolean;
  /** Callback when visibility is toggled */
  onToggleVisibility: (sectionId: string) => void;
  /** Callback when settings (gear) icon is clicked */
  onOpenSettings: (sectionId: string) => void;
  /** Callback when "Update Position + Size" is clicked */
  onEditPosition: (sectionId: string) => void;
  /** Callback when "Save" is clicked (when in edit mode) */
  onSavePosition?: (sectionId: string) => void;
  /** Callback when delete is clicked */
  onDelete: (sectionId: string) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Hide the "Update Position + Size" button */
  hidePositionButton?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DraggableSectionCard({
  section,
  isSelected = false,
  isEditingPosition = false,
  onToggleVisibility,
  onOpenSettings,
  onEditPosition,
  onSavePosition,
  onDelete,
  disabled = false,
  hidePositionButton = false,
}: DraggableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: section.id,
    data: { section },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  // Stop propagation for icon clicks so they don't trigger drag
  const handleIconClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md border
        ${isSelected
          ? 'bg-purple-50 border-purple-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
        ${isDragging ? 'shadow-lg z-50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
        transition-colors
      `}
      {...attributes}
      {...listeners}
    >
      {/* Visibility Toggle (Eye Icon) */}
      <button
        type="button"
        onClick={(e) => handleIconClick(e, () => onToggleVisibility(section.id))}
        onPointerDown={(e) => e.stopPropagation()}
        disabled={disabled}
        className={`p-1 rounded transition-colors ${
          section.visible !== false
            ? 'text-purple-600 hover:bg-purple-50'
            : 'text-gray-300 hover:bg-gray-100'
        }`}
        title={section.visible !== false ? 'Hide section' : 'Show section'}
      >
        {section.visible !== false ? (
          // Eye open icon
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          // Eye closed icon
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        )}
      </button>

      {/* Section Label (draggable area) */}
      <span className={`flex-1 text-sm font-medium truncate ${
        section.visible === false ? 'text-gray-400 line-through' : 'text-gray-700'
      }`}>
        {section.label}
      </span>

      {/* Update Position + Size / Save Button (hidden in profile mode) */}
      {!hidePositionButton && (
        isEditingPosition ? (
          <button
            type="button"
            onClick={(e) => handleIconClick(e, () => onSavePosition?.(section.id))}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={disabled}
            className="text-xs text-green-600 hover:text-green-800 font-semibold whitespace-nowrap bg-green-50 px-2 py-1 rounded"
            title="Save position changes"
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => handleIconClick(e, () => onEditPosition(section.id))}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={disabled}
            className="text-xs text-purple-600 hover:text-purple-800 hover:underline whitespace-nowrap"
            title="Update Position + Size"
          >
            Update Position + Size
          </button>
        )
      )}

      {/* Settings (Gear) Icon */}
      <button
        type="button"
        onClick={(e) => handleIconClick(e, () => onOpenSettings(section.id))}
        onPointerDown={(e) => e.stopPropagation()}
        disabled={disabled}
        className={`p-1 rounded hover:bg-gray-100 ${
          isSelected ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        title="Section settings"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Delete Icon */}
      <button
        type="button"
        onClick={(e) => handleIconClick(e, () => onDelete(section.id))}
        onPointerDown={(e) => e.stopPropagation()}
        disabled={disabled}
        className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
        title="Delete section"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export default DraggableSectionCard;
