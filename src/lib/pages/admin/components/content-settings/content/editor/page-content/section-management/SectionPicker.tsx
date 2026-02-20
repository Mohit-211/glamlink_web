'use client';

import { useState } from 'react';
import { SECTION_REGISTRY } from '@/lib/features/display-cms/sectionRegistry';
import type { PageType } from '@/lib/features/display-cms/types';

interface SectionPickerProps {
  isOpen: boolean;
  pageType: PageType;
  existingSectionTypes: string[];
  onSelect: (type: string) => void;
  onClose: () => void;
}

type FilterType = 'all' | 'shared' | PageType;

const PAGE_TYPE_LABELS: Array<{ value: PageType; label: string }> = [
  { value: 'home', label: 'Home' },
  { value: 'for-clients', label: 'For Clients' },
  { value: 'for-professionals', label: 'For Professionals' },
  { value: 'magazine', label: 'Magazine' },
  { value: 'promos', label: 'Promos' },
  { value: 'apply-digital-card', label: 'Digital Card' },
  { value: 'apply-featured', label: 'Featured' }
];

export default function SectionPicker({
  isOpen,
  pageType,
  existingSectionTypes,
  onSelect,
  onClose
}: SectionPickerProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isOpen) return null;

  // Get all sections from registry and apply filters
  // We show ALL sections that match the filter, but mark some as disabled
  const allFilteredSections = SECTION_REGISTRY.filter(section => {
    // Apply the filter type using the category field
    if (filter === 'all') {
      return true;
    } else if (filter === 'shared') {
      return section.category === 'shared';
    } else {
      return section.category === filter;
    }
  });

  // Remove any duplicates (safety check) and sort by label
  const seenIds = new Set<string>();
  const filteredSections = allFilteredSections
    .filter(section => {
      if (seenIds.has(section.id)) {
        console.warn(`Duplicate section found: ${section.id}`);
        return false;
      }
      seenIds.add(section.id);
      return true;
    })
    .map(section => ({
      ...section,
      // Section is disabled if: allowMultiple is false AND it's already added
      isDisabled: !section.allowMultiple && existingSectionTypes.includes(section.id)
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add Section</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose a section type to add to your {pageType} page
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-2 flex-wrap">
              {/* All Sections */}
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-glamlink-teal text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All Sections
              </button>

              {/* Shared Sections */}
              <button
                onClick={() => setFilter('shared')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'shared'
                    ? 'bg-glamlink-teal text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Shared Sections
              </button>

              {/* Page Type Buttons (7 buttons via map) */}
              {PAGE_TYPE_LABELS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filter === value
                      ? 'bg-glamlink-teal text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Section grid */}
          <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
            {filteredSections.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No sections available with current filter
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredSections.map(section => {
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        if (!section.isDisabled) {
                          onSelect(section.id);
                          onClose();
                        }
                      }}
                      disabled={section.isDisabled}
                      className={`p-4 border rounded-lg transition-colors text-left ${
                        section.isDisabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : 'border-gray-200 hover:border-glamlink-teal hover:bg-glamlink-teal/5 group'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-medium ${
                          section.isDisabled
                            ? 'text-gray-500'
                            : 'text-gray-900 group-hover:text-glamlink-teal'
                        }`}>
                          {section.label}
                        </h4>
                        {section.isDisabled && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            Already added
                          </span>
                        )}
                        {!section.isDisabled && section.category === 'shared' && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Shared
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${section.isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                        {section.description}
                      </p>
                      {section.allowMultiple && !section.isDisabled && (
                        <span className="text-xs text-gray-500">
                          Multiple allowed
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
