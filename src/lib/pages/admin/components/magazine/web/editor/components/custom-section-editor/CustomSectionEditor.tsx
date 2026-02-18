'use client';

import React from 'react';
import BlockEditor from '../../BlockEditor';
import BlockPickerModal from '../block-picker';
import LayoutSelector from './LayoutSelector';
import EmptyBlocksState from './EmptyBlocksState';
import { useCustomSectionEditor } from './useCustomSectionEditor';

interface CustomSectionEditorProps {
  className?: string;
}

export default function CustomSectionEditor({ className }: CustomSectionEditorProps) {
  const {
    layout,
    sortedBlocks,
    isPickerOpen,
    expandedBlockId,
    setIsPickerOpen,
    handleAddBlock,
    handleUpdateBlock,
    handleDeleteBlock,
    handleDuplicateBlock,
    handleMoveUp,
    handleMoveDown,
    handleLayoutChange,
    handleToggleExpand,
  } = useCustomSectionEditor();

  return (
    <div className={className}>
      {/* Header with Layout and Add Button */}
      <div className="flex items-center justify-between mb-4">
        <LayoutSelector layout={layout} onChange={handleLayoutChange} />

        <button
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Block
        </button>
      </div>

      {/* Blocks List */}
      {sortedBlocks.length > 0 ? (
        <div className="space-y-3">
          {sortedBlocks.map((block, index) => (
            <div key={block.id} className="relative">
              {/* Move Buttons (outside BlockEditor for better UX) */}
              <div className="absolute -left-8 top-3 flex flex-col gap-0.5">
                <button
                  onClick={() => handleMoveUp(block.id)}
                  disabled={index === 0}
                  className={`p-1 rounded text-gray-400 ${
                    index === 0
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveDown(block.id)}
                  disabled={index === sortedBlocks.length - 1}
                  className={`p-1 rounded text-gray-400 ${
                    index === sortedBlocks.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Block Editor */}
              <BlockEditor
                block={block}
                onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                onDelete={() => handleDeleteBlock(block.id)}
                onDuplicate={() => handleDuplicateBlock(block.id)}
                isExpanded={expandedBlockId === block.id}
                onToggleExpand={() => handleToggleExpand(block.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyBlocksState onAddBlock={() => setIsPickerOpen(true)} />
      )}

      {/* Block Count */}
      {sortedBlocks.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {sortedBlocks.length} block{sortedBlocks.length !== 1 ? 's' : ''} "{' '}
          {sortedBlocks.filter((b) => b.enabled !== false).length} enabled
        </div>
      )}

      {/* Block Picker Modal */}
      <BlockPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddBlock}
      />
    </div>
  );
}
