'use client';

import React from 'react';

interface EmptyBlocksStateProps {
  onAddBlock: () => void;
}

export default function EmptyBlocksState({ onAddBlock }: EmptyBlocksStateProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="text-4xl mb-3">📦</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No content blocks yet
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Add content blocks to build your custom section
      </p>
      <button
        onClick={onAddBlock}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Content Block
      </button>
    </div>
  );
}
