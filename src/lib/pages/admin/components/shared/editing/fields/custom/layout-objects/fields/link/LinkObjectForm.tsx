'use client';

/**
 * LinkObjectForm - Form fields for editing Link layout objects
 *
 * Fields:
 * - Link type (external/internal)
 * - External URL input
 * - Internal page selector
 */

import React from 'react';
import type { LinkCustomObject } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

interface AvailablePage {
  id: string;
  pageNumber: number;
  title?: string;
  pageType: string;
}

interface LinkObjectFormProps {
  object: LinkCustomObject;
  onUpdate: (updates: Partial<LinkCustomObject>) => void;
  availablePages?: AvailablePage[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LinkObjectForm({ object, onUpdate, availablePages = [] }: LinkObjectFormProps) {
  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700">Link Settings</h4>

      {/* Link Type Selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Link Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="linkType"
              value="external"
              checked={object.linkType === 'external'}
              onChange={() => onUpdate({ linkType: 'external', targetPageNumber: undefined })}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">External URL</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="linkType"
              value="internal"
              checked={object.linkType === 'internal'}
              onChange={() => onUpdate({ linkType: 'internal', externalUrl: undefined })}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Internal Page</span>
          </label>
        </div>
      </div>

      {/* External URL Input */}
      {object.linkType === 'external' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
          <input
            type="url"
            value={object.externalUrl || ''}
            onChange={(e) => onUpdate({ externalUrl: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the full URL including https://
          </p>
        </div>
      )}

      {/* Internal Page Selector */}
      {object.linkType === 'internal' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Target Page</label>
          {availablePages.length > 0 ? (
            <select
              value={object.targetPageNumber || ''}
              onChange={(e) => onUpdate({ targetPageNumber: e.target.value ? parseInt(e.target.value, 10) : undefined })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a page...</option>
              {availablePages
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((page) => (
                  <option key={page.id} value={page.pageNumber}>
                    Page {page.pageNumber}: {page.title || page.pageType}
                  </option>
                ))}
            </select>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No pages available. Save some pages first to link to them.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Select a page to navigate to when clicked in the PDF
          </p>
        </div>
      )}

      {/* Info about invisible hotspot */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> Link objects are invisible clickable hotspots in the PDF.
          Position and resize this object to cover the area you want to be clickable.
          The blue dashed border is only visible in the editor.
        </p>
      </div>
    </div>
  );
}
