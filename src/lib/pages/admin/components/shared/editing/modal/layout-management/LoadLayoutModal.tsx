'use client';

/**
 * LoadLayoutModal Component
 *
 * Modal for loading saved layout templates. Features:
 * - Search input for filtering layouts by name/description
 * - Category filter dropdown
 * - Responsive grid of layout cards (2-3-4 columns)
 * - Empty state when no layouts exist
 * - Loading and error states using shared components
 */

import React from 'react';
import { Dialog } from '@headlessui/react';
import type { DigitalLayout } from '@/lib/pages/admin/types/digitalLayouts';
import { useLoadLayoutModal } from './useLoadLayoutModal';
import LayoutCard from '@/lib/pages/admin/components/magazine/digital/editor/page-creator/LayoutCard';
import { Loading, ErrorComponent, NoRecords } from '@/lib/pages/admin/components/shared/common/state';
import { RefreshIcon, XMarkIcon, SearchIcon } from '@/lib/pages/admin/components/shared/common/Icons';

// =============================================================================
// TYPES
// =============================================================================

interface LoadLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
  onSelectLayout: (layout: DigitalLayout) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LoadLayoutModal({
  isOpen,
  onClose,
  issueId,
  onSelectLayout
}: LoadLayoutModalProps) {
  const {
    filteredLayouts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    existingCategories,
    isLoading,
    error,
    fetchLayouts,
    handleSelect
  } = useLoadLayoutModal({
    issueId,
    onSelectLayout,
    onClose
  });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-5xl w-full max-h-[80vh] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Load Layout Template
            </Dialog.Title>
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchLayouts}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh layouts"
              >
                <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filters: Category + Search */}
          <div className="px-6 py-4 border-b border-gray-200 space-y-3">
            {/* Category Filter */}
            {existingCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 max-w-xs px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('')}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search layouts by name or description..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Loading State */}
            {isLoading && (
              <Loading
                message="Loading layouts..."
                size="md"
                height="py-12"
              />
            )}

            {/* Error State */}
            {error && !isLoading && (
              <ErrorComponent
                title="Failed to Load Layouts"
                message={error}
                onRetry={fetchLayouts}
                className="max-w-md mx-auto"
              />
            )}

            {/* Empty State - No layouts exist */}
            {!isLoading && !error && filteredLayouts.length === 0 && !searchQuery && !selectedCategory && (
              <NoRecords
                itemName="Saved Layouts"
                icon={<span className="text-3xl">📑</span>}
                description="Save your first layout to reuse configurations across multiple pages."
              />
            )}

            {/* Empty State - Filter/Search returns no results */}
            {!isLoading && !error && filteredLayouts.length === 0 && (searchQuery || selectedCategory) && (
              <NoRecords
                itemName="Matching Layouts"
                icon={<SearchIcon className="h-8 w-8 text-gray-400 mx-auto" />}
                description={`Try a different ${selectedCategory ? 'category' : ''}${selectedCategory && searchQuery ? ' or ' : ''}${searchQuery ? 'search term' : ''}, or clear the filters to see all layouts.`}
              />
            )}

            {/* Layout Grid */}
            {!isLoading && !error && filteredLayouts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredLayouts.map((layout) => (
                  <LayoutCard
                    key={layout.id}
                    layout={layout}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {!isLoading && !error && filteredLayouts.length > 0 && (
                  <>
                    Showing {filteredLayouts.length} layout{filteredLayouts.length !== 1 ? 's' : ''}
                    {selectedCategory && <span className="ml-1">in "{selectedCategory}"</span>}
                    {searchQuery && <span className="ml-1">matching "{searchQuery}"</span>}
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
