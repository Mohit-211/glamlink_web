'use client';

/**
 * ObjectItem - Individual object row in the custom layout editor
 *
 * Displays:
 * - Object number badge
 * - Type icon
 * - Brief summary
 * - Up/Down arrows for reordering
 * - Delete button
 * - Expand/collapse toggle
 * - ObjectForm when expanded
 */

import React from 'react';
import type { CustomObject } from '../types';
import { isTextObject, isImageObject, isSpacerObject, isCustomBlockObject, isLinkObject } from '../types';
import { extractText } from '../shared/typographyHelpers';
import ObjectForm from './ObjectForm';

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

interface ObjectItemProps {
  object: CustomObject;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<CustomObject>) => void;
  pdfSettings?: any;  // PagePdfSettings type
  issueId?: string;
  availablePages?: AvailablePage[];  // For link object internal page selection
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getTypeIcon(type: string): string {
  switch (type) {
    case 'text':
      return '📝';
    case 'image':
      return '🖼️';
    case 'spacer':
      return '⬜';
    case 'custom-block':
      return '🧩';
    case 'link':
      return '🔗';
    default:
      return '❓';
  }
}

function getTypeName(type: string): string {
  switch (type) {
    case 'text':
      return 'Text';
    case 'image':
      return 'Image';
    case 'spacer':
      return 'Spacer';
    case 'custom-block':
      return 'Custom Block';
    case 'link':
      return 'Link';
    default:
      return 'Unknown';
  }
}

function getObjectSummary(object: CustomObject): string {
  if (isTextObject(object)) {
    const titleText = extractText(object.title);
    const subtitleText = extractText(object.subtitle);
    return titleText || subtitleText || 'Text Block';
  }
  if (isImageObject(object)) {
    const hasImage = object.image && (
      typeof object.image === 'string' ? object.image : object.image.url
    );
    return hasImage ? 'Image Set' : 'No Image';
  }
  if (isCustomBlockObject(object)) {
    if (!object.blockType) {
      return '(No component selected)';
    }
    return `${object.blockType} (${object.blockCategory})`;
  }
  if (isSpacerObject(object)) {
    return 'Spacer';
  }
  if (isLinkObject(object)) {
    if (object.linkType === 'external') {
      return object.externalUrl ? `External: ${object.externalUrl.substring(0, 30)}${object.externalUrl.length > 30 ? '...' : ''}` : 'External Link (no URL)';
    }
    return object.targetPageNumber ? `→ Page ${object.targetPageNumber}` : 'Internal Link (no page)';
  }
  return 'Object';
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'text':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'image':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'spacer':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'custom-block':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'link':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ObjectItem({
  object,
  index,
  isFirst,
  isLast,
  isExpanded,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
  pdfSettings,
  issueId,
  availablePages,
}: ObjectItemProps) {
  const typeColor = getTypeColor(object.type);

  return (
    <div className={`border rounded-lg ${isExpanded ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
      {/* Header row */}
      <div className="flex items-center gap-2 p-3">
        {/* Number badge */}
        <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-gray-500 bg-gray-100 rounded">
          {index + 1}
        </span>

        {/* Type badge */}
        <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${typeColor}`}>
          <span>{getTypeIcon(object.type)}</span>
          <span>{getTypeName(object.type)}</span>
        </span>

        {/* Summary */}
        <span className="flex-1 text-sm text-gray-600 truncate">
          {getObjectSummary(object)}
        </span>

        {/* Position info */}
        <span className="text-xs text-gray-400 hidden sm:inline">
          {object.x.value}{object.x.unit}, {object.y.value}{object.y.unit}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Move up */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className={`p-1 rounded ${isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            title="Move up"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Move down */}
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className={`p-1 rounded ${isLast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            title="Move down"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Expand/Collapse */}
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded form */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <ObjectForm object={object} onUpdate={onUpdate} pdfSettings={pdfSettings} issueId={issueId} availablePages={availablePages} />
        </div>
      )}
    </div>
  );
}
