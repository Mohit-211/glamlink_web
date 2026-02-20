'use client';

/**
 * SubSpacerEditor - Generic sub-spacer editor for layout objects
 *
 * Manages sub-spacers with x/y positioning within parent objects.
 * Spacers are positioned absolutely and create invisible areas.
 *
 * Used by: Text objects, Custom Block objects
 */

import React, { useState, useCallback } from 'react';
import type { TextSubSpacer, DimensionValue } from '../types';
import { createDefaultSubSpacer } from '../types';

// =============================================================================
// TYPES
// =============================================================================

interface SubSpacerEditorProps {
  spacers: TextSubSpacer[];
  onChange: (spacers: TextSubSpacer[]) => void;
  maxSpacers?: number;
  label?: string;
}

// =============================================================================
// DIMENSION INPUT COMPONENT
// =============================================================================

interface DimensionInputProps {
  label: string;
  value: DimensionValue;
  onChange: (value: DimensionValue) => void;
}

function DimensionInput({ label, value, onChange }: DimensionInputProps) {
  // Provide default values if value is undefined (for backwards compatibility with old data)
  const safeValue = value || { value: 0, unit: '%' as const };

  return (
    <div className="flex-1">
      <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={safeValue.value}
          onChange={(e) => onChange({ ...safeValue, value: parseFloat(e.target.value) || 0 })}
          className="flex-1 min-w-0 w-16 px-2 py-1 text-xs border border-gray-300 rounded-l focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={safeValue.unit}
          onChange={(e) => onChange({ ...safeValue, unit: e.target.value as 'px' | '%' })}
          className="px-1 py-1 text-xs border border-l-0 border-gray-300 rounded-r bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="px">px</option>
          <option value="%">%</option>
        </select>
      </div>
    </div>
  );
}

// =============================================================================
// SPACER ITEM COMPONENT
// =============================================================================

interface SpacerItemProps {
  spacer: TextSubSpacer;
  index: number;
  onUpdate: (updates: Partial<TextSubSpacer>) => void;
  onDelete: () => void;
}

function SpacerItem({ spacer, index, onUpdate, onDelete }: SpacerItemProps) {
  return (
    <div className="p-2 bg-gray-50 rounded border border-gray-200">
      {/* Header with index and delete */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600">Spacer {index + 1}</span>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="Remove spacer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Position (X/Y) row */}
      <div className="flex gap-2 mb-2">
        <DimensionInput
          label="X Position"
          value={spacer.x}
          onChange={(x) => onUpdate({ x })}
        />
        <DimensionInput
          label="Y Position"
          value={spacer.y}
          onChange={(y) => onUpdate({ y })}
        />
      </div>

      {/* Size (Width/Height) row */}
      <div className="flex gap-2">
        <DimensionInput
          label="Width"
          value={spacer.width}
          onChange={(width) => onUpdate({ width })}
        />
        <DimensionInput
          label="Height"
          value={spacer.height}
          onChange={(height) => onUpdate({ height })}
        />
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SubSpacerEditor({
  spacers,
  onChange,
  maxSpacers = 10,
  label = 'Sub-Spacers'
}: SubSpacerEditorProps) {
  const [isExpanded, setIsExpanded] = useState(spacers.length > 0);

  // Add spacer
  const handleAddSpacer = useCallback(() => {
    if (spacers.length >= maxSpacers) return;

    const newSpacer = createDefaultSubSpacer();
    onChange([...spacers, newSpacer]);
    setIsExpanded(true);
  }, [spacers, maxSpacers, onChange]);

  // Update spacer
  const handleUpdateSpacer = useCallback((index: number, updates: Partial<TextSubSpacer>) => {
    const updated = [...spacers];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  }, [spacers, onChange]);

  // Delete spacer
  const handleDeleteSpacer = useCallback((index: number) => {
    onChange(spacers.filter((_, i) => i !== index));
  }, [spacers, onChange]);

  const canAddMore = spacers.length < maxSpacers;

  return (
    <div className="space-y-2">
      {/* Header with toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {label} ({spacers.length})
      </button>

      {/* Description */}
      {isExpanded && (
        <p className="text-xs text-gray-500 ml-6">
          Sub-spacers create invisible areas at specific positions within the container.
        </p>
      )}

      {/* Spacers list */}
      {isExpanded && (
        <div className="ml-6 space-y-2">
          {spacers.map((spacer, index) => (
            <SpacerItem
              key={spacer.id}
              spacer={spacer}
              index={index}
              onUpdate={(updates) => handleUpdateSpacer(index, updates)}
              onDelete={() => handleDeleteSpacer(index)}
            />
          ))}

          {/* Add button */}
          {canAddMore && (
            <button
              type="button"
              onClick={handleAddSpacer}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Sub-Spacer
            </button>
          )}

          {/* Empty state */}
          {spacers.length === 0 && (
            <p className="text-xs text-gray-400 italic">
              No sub-spacers. Add one to create invisible positioning areas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
