'use client';

import React from 'react';
import { CONTENT_COMPONENTS } from '../../config/content-discovery';
import type { BlockPickerItem } from '@/lib/pages/admin/components/magazine/web/types';
import ComponentCard from './ComponentCard';
import CategoryFilter from './CategoryFilter';
import SearchInput from './SearchInput';
import { useBlockPickerModal } from './useBlockPickerModal';

interface BlockPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: BlockPickerItem) => void;
}

export default function BlockPickerModal({
  isOpen,
  onClose,
  onSelect,
}: BlockPickerModalProps) {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredComponents,
    handleSelect,
  } = useBlockPickerModal({ onSelect, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Content Block</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose from {CONTENT_COMPONENTS.length} available components
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-4 bg-gray-50">
          {/* Search */}
          <SearchInput value={searchQuery} onChange={setSearchQuery} />

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Component Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={`${component.category}-${component.name}`}
                  component={component}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No components found</p>
              <p className="text-sm mt-1">Try a different search or category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} available
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
