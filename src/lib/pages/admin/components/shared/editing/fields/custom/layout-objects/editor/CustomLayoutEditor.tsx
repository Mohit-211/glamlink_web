'use client';

/**
 * CustomLayoutEditor - Main editor component for custom layout objects
 *
 * Renders a list of objects (Text, Image, Spacer, Custom Block, Link) with:
 * - Up/Down arrows for reordering
 * - Add button with type selector
 * - Delete button per object
 * - Expandable form for each object
 */

import React, { useState, useCallback } from 'react';
import type {
  CustomObject,
  CustomObjectType,
} from '../types';
import {
  MAX_OBJECTS,
  createObjectByType,
} from '../types';
import ObjectItem from './ObjectItem';

// =============================================================================
// TYPES
// =============================================================================

// Type for available pages (for internal link selection)
interface AvailablePage {
  id: string;
  pageNumber: number;
  title?: string;
  pageType: string;
}

interface CustomLayoutEditorProps {
  objects: CustomObject[];
  onChange: (objects: CustomObject[]) => void;
  maxObjects?: number;
  pdfSettings?: any;  // PagePdfSettings type
  issueId?: string;
  availablePages?: AvailablePage[];  // For link object internal page selection
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CustomLayoutEditor({
  objects,
  onChange,
  maxObjects = MAX_OBJECTS,
  pdfSettings,
  issueId,
  availablePages,
}: CustomLayoutEditorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Toggle expansion
  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Add new object
  const handleAddObject = useCallback((type: CustomObjectType) => {
    if (objects.length >= maxObjects) return;

    const newObject = createObjectByType(type);
    onChange([...objects, newObject]);
    setExpandedIds((prev) => new Set(prev).add(newObject.id));
    setShowAddMenu(false);
  }, [objects, maxObjects, onChange]);

  // Update object
  const handleUpdateObject = useCallback((index: number, updates: Partial<CustomObject>) => {
    const updated = [...objects];
    updated[index] = { ...updated[index], ...updates } as CustomObject;
    onChange(updated);
  }, [objects, onChange]);

  // Delete object
  const handleDeleteObject = useCallback((index: number) => {
    const obj = objects[index];
    if (!confirm(`Delete this ${obj.type} object?`)) return;

    const updated = objects.filter((_, i) => i !== index);
    onChange(updated);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(obj.id);
      return next;
    });
  }, [objects, onChange]);

  // Move up
  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    const updated = [...objects];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  }, [objects, onChange]);

  // Move down
  const handleMoveDown = useCallback((index: number) => {
    if (index === objects.length - 1) return;
    const updated = [...objects];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  }, [objects, onChange]);

  const canAddMore = objects.length < maxObjects;

  return (
    <div className="space-y-4">
      {/* Header with count and add button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {objects.length} / {maxObjects} objects
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            disabled={!canAddMore}
            className={`
              inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md
              ${canAddMore
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Object
          </button>

          {/* Add menu dropdown */}
          {showAddMenu && canAddMore && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <button
                type="button"
                onClick={() => handleAddObject('text')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">📝</span> Text
              </button>
              <button
                type="button"
                onClick={() => handleAddObject('image')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">🖼️</span> Image
              </button>
              <button
                type="button"
                onClick={() => handleAddObject('spacer')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">⬜</span> Spacer
              </button>
              <button
                type="button"
                onClick={() => handleAddObject('custom-block')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">🧩</span> Custom Block
              </button>
              <button
                type="button"
                onClick={() => handleAddObject('link')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-2">🔗</span> Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {objects.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm">No objects added yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Click "Add Object" to start building your custom layout
          </p>
        </div>
      )}

      {/* Object list */}
      <div className="space-y-2">
        {objects.map((object, index) => (
          <ObjectItem
            key={object.id}
            object={object}
            index={index}
            isFirst={index === 0}
            isLast={index === objects.length - 1}
            isExpanded={expandedIds.has(object.id)}
            onToggleExpand={() => toggleExpanded(object.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            onDelete={() => handleDeleteObject(index)}
            onUpdate={(updates) => handleUpdateObject(index, updates)}
            pdfSettings={pdfSettings}
            issueId={issueId}
            availablePages={availablePages}
          />
        ))}
      </div>

      {/* Click outside to close add menu */}
      {showAddMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowAddMenu(false)}
        />
      )}
    </div>
  );
}
