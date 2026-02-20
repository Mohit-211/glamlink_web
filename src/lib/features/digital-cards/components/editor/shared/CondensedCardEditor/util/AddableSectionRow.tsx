'use client';

/**
 * AddableSectionRow - Row for sections not yet added to the condensed card
 *
 * Displays a section that can be added to the condensed card
 * with an "Add Section" button. Used by both admin and profile editors.
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface AddableSectionInfo {
  sectionId: string;
  label: string;
  innerSectionType: string;
}

export interface AddableSectionRowProps {
  section: AddableSectionInfo;
  onAdd?: () => void;
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AddableSectionRow({ section, onAdd, disabled }: AddableSectionRowProps) {
  return (
    <div className="bg-white border border-gray-200 border-dashed rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Not added indicator */}
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div>
          <span className="font-medium text-gray-600 text-sm">
            {section.label}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            (not on card)
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Section
      </button>
    </div>
  );
}

export default AddableSectionRow;
