import React from 'react';
import type { DigitalPage } from '../editor/types';

interface DigitalPageCardProps {
  page: DigitalPage;
  issueId: string;
  onEdit?: (page: DigitalPage) => void;
  isSelected?: boolean;
  onSelectionChange?: (pageId: string, selected: boolean) => void;
  showSelection?: boolean;
}

export default function DigitalPageCard({
  page,
  onEdit,
  isSelected = false,
  onSelectionChange,
  showSelection = false,
}: DigitalPageCardProps) {
  // Can this page be selected? Only if it has a canvas
  const canSelect = showSelection && page.hasCanvas && page.canvasDataUrl;
  // Format page type for display
  const formatPageType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-200'
          : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Selection checkbox */}
            {canSelect && onSelectionChange && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectionChange(page.id, e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <h3 className="font-medium text-gray-900">Page {page.pageNumber}</h3>
          </div>
          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
            {formatPageType(page.pageType)}
          </span>
        </div>
        {page.title && (
          <p className="text-sm text-gray-500 mt-1 truncate">{page.title}</p>
        )}
      </div>

      {/* Canvas Preview */}
      <div className="p-4">
        {page.canvasDataUrl ? (
          <img
            src={page.canvasDataUrl}
            alt={`Page ${page.pageNumber}`}
            className="w-full aspect-[3/4] object-contain bg-gray-100 rounded border"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-gray-50 rounded border-dashed border-2 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-400 text-sm mt-2 block">No canvas generated</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${
          page.hasCanvas
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {page.hasCanvas ? 'Canvas ready' : 'Canvas not generated'}
        </span>

        {onEdit && (
          <button
            onClick={() => onEdit(page)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
