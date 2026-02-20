'use client';

/**
 * SectionSelectionModal Component
 *
 * Modal for selecting which section to load data from when multiple matches are found.
 * Features:
 * - Radio button selection
 * - Section title and subtitle display
 * - Data preview for each section
 * - Responsive layout
 */

import React from 'react';
import type { SectionMatch } from '../../../types';

interface SectionSelectionModalProps {
  sections: SectionMatch[];
  componentName: string;
  onSelect: (sectionId: string) => void;
  onCancel: () => void;
}

export default function SectionSelectionModal({
  sections,
  componentName,
  onSelect,
  onCancel
}: SectionSelectionModalProps) {
  const [selectedId, setSelectedId] = React.useState<string>(sections[0]?.sectionId || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Load from Section</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select which section to load <strong>{componentName}</strong> data from:
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sections.map((section) => (
              <label
                key={section.sectionId}
                className={`block p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedId === section.sectionId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="section"
                  value={section.sectionId}
                  checked={selectedId === section.sectionId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start gap-2">
                  {/* Radio button visual */}
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    selectedId === section.sectionId
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedId === section.sectionId && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Section info */}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{section.sectionTitle}</div>
                    {section.sectionSubtitle && (
                      <div className="text-sm text-gray-600">{section.sectionSubtitle}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Preview: {section.dataPreview}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
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
            onClick={() => onSelect(selectedId)}
            disabled={!selectedId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Load
          </button>
        </div>
      </div>
    </div>
  );
}
