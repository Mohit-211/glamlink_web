'use client';

/**
 * ConfirmOverwriteModal Component
 *
 * Warning modal to confirm before overwriting existing custom block data.
 * Features:
 * - Shows preview of current vs new data
 * - Clear visual distinction (red for loss, green for new)
 * - Warning icon and messaging
 * - Cannot be undone notice
 */

import React from 'react';

interface ConfirmOverwriteModalProps {
  currentData: Record<string, any>;
  newData: Record<string, any>;
  componentName: string;
  sectionTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmOverwriteModal({
  currentData,
  newData,
  componentName,
  sectionTitle,
  onConfirm,
  onCancel
}: ConfirmOverwriteModalProps) {
  // Generate preview text
  const currentPreview = generateDataPreview(currentData);
  const newPreview = generateDataPreview(newData);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-yellow-500">⚠️</span>
            Replace Existing Data?
          </h3>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Loading data from <strong>"{sectionTitle}"</strong> will replace your current {componentName} data:
          </p>

          <div className="space-y-3">
            {/* Current data (will be lost) */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-xs font-semibold text-red-800 mb-1">
                Current Data (will be lost):
              </div>
              <div className="text-sm text-red-700">{currentPreview}</div>
            </div>

            {/* New data (from section) */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="text-xs font-semibold text-green-800 mb-1">
                New Data (from section):
              </div>
              <div className="text-sm text-green-700">{newPreview}</div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Replace
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate human-readable preview of data
 *
 * Shows up to 3 fields with values, formatted appropriately:
 * - Arrays: "{count} {fieldName}"
 * - Strings: Quoted with truncation
 * - Objects: "{fieldName}: {...}"
 *
 * @param data - Data object to preview
 * @returns Preview string
 */
function generateDataPreview(data: Record<string, any>): string {
  const keys = Object.keys(data);
  if (keys.length === 0) return 'Empty';

  const previews: string[] = [];

  // Show up to 3 fields with values
  for (const key of keys.slice(0, 3)) {
    const value = data[key];

    if (Array.isArray(value)) {
      previews.push(`${value.length} ${key}`);
    } else if (typeof value === 'string' && value) {
      const truncated = value.slice(0, 30);
      const ellipsis = value.length > 30 ? '...' : '';
      previews.push(`"${truncated}${ellipsis}"`);
    } else if (typeof value === 'object' && value) {
      previews.push(`${key}: {...}`);
    }
  }

  return previews.length > 0 ? previews.join(', ') : 'Data present';
}
