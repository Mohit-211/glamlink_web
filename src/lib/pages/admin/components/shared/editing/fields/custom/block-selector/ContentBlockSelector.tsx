'use client';

/**
 * ContentBlockSelector - Main Component
 *
 * UI for selecting or adding content blocks to digital pages.
 *
 * Features:
 * - Two tabs: "From Sections" (select existing) and "Add New" (create new block)
 * - Fetches sections from current issue that have content blocks
 * - Shows preview of selected block
 * - Clear selection button
 * - Configurable component registry via config prop
 */

import React, { useState } from 'react';
import { FromSectionsTab } from './FromSectionsTab';
import { AddNewTab } from './AddNewTab';
import { BlockPreview } from './BlockPreview';
import type { ContentBlockSelectorProps, TabType, DigitalContentBlock } from './types';

/**
 * Main content block selector component
 */
export function ContentBlockSelector({
  issueId,
  selectedBlock,
  onChange,
  config,
}: ContentBlockSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('add-new');

  const handleSelectBlock = (block: DigitalContentBlock) => {
    onChange(block);
  };

  const handleClearSelection = () => {
    onChange(null);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('from-sections')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'from-sections'
              ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          From Sections
        </button>
        <button
          onClick={() => setActiveTab('add-new')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'add-new'
              ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Add New
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-3">
        {activeTab === 'from-sections' ? (
          <FromSectionsTab
            issueId={issueId}
            onSelectBlock={handleSelectBlock}
          />
        ) : (
          <AddNewTab
            onSelectBlock={handleSelectBlock}
            config={config}
          />
        )}
      </div>

      {/* Selected Block Display */}
      {selectedBlock && (
        <div className="border-t p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              Selected: {selectedBlock.type}
            </div>
            <button
              onClick={handleClearSelection}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          </div>
          <BlockPreview
            block={selectedBlock}
            componentMap={config?.componentMap}
          />
        </div>
      )}
    </div>
  );
}

export default ContentBlockSelector;
