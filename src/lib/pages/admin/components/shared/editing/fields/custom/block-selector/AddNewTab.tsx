'use client';

/**
 * AddNewTab Component
 * Tab content for creating new content blocks from available block types
 *
 * Opens a modal for editing block properties before adding.
 * Accepts optional config for customizing available block types.
 */

import React, { useState, lazy, Suspense } from 'react';
import {
  getAvailableBlockTypes,
  getBlockCategories,
  filterBlockTypes,
} from './helpers';
import type { AddNewTabProps, BlockTypeOption, DigitalContentBlock } from './types';

// Lazy load the modal to break circular dependency with FormRenderer
// The chain was: fields/index → block-selector → AddNewTab → modal → FormRenderer → fields/index
const BlockEditorPreviewModal = lazy(() => import('./modal/BlockEditorPreviewModal'));

/**
 * Displays available block types for selection
 */
export function AddNewTab({ onSelectBlock, config }: AddNewTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingType, setEditingType] = useState<BlockTypeOption | null>(null);

  // Use config's contentComponents if provided, otherwise use defaults
  const contentComponents = config?.contentComponents;
  const blockTypes = getAvailableBlockTypes(contentComponents);
  const categories = getBlockCategories(contentComponents);
  const filteredTypes = filterBlockTypes(blockTypes, selectedCategory, searchTerm);

  // Open the editor modal for the selected block type
  const handleSelectType = (type: BlockTypeOption) => {
    setEditingType(type);
  };

  // Handle save from the modal
  const handleModalSave = (block: DigitalContentBlock) => {
    onSelectBlock(block);
    setEditingType(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setEditingType(null);
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search blocks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 text-xs rounded-full ${
              selectedCategory === cat
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Block Types Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
        {filteredTypes.map((type) => (
          <button
            key={`${type.category}-${type.name}`}
            onClick={() => handleSelectType(type)}
            className="p-2 text-left border rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="text-sm font-medium truncate">{type.displayName}</div>
            <div className="text-xs text-gray-400 truncate">{type.category}</div>
          </button>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-4">
          No blocks match your search
        </div>
      )}

      {/* Block Editor Modal - wrapped in Suspense for lazy loading */}
      {editingType !== null && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Loading editor...</p>
            </div>
          </div>
        }>
          <BlockEditorPreviewModal
            isOpen={true}
            blockType={editingType}
            onClose={handleModalClose}
            onSave={handleModalSave}
            config={config}
          />
        </Suspense>
      )}
    </div>
  );
}

export default AddNewTab;
