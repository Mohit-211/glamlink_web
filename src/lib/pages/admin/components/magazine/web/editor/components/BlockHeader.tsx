'use client';

import React from 'react';
import { CATEGORY_LABELS, ContentComponentInfo } from '../config/content-discovery';
import type { ContentBlock } from '../../types';

interface BlockHeaderProps {
  block: ContentBlock;
  componentInfo: ContentComponentInfo | undefined;
  isExpanded: boolean;
  onToggle: () => void;
  onToggleEnabled: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

export default function BlockHeader({
  block,
  componentInfo,
  isExpanded,
  onToggle,
  onToggleEnabled,
  onDelete,
  onDuplicate,
}: BlockHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
        block.enabled !== false ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-200'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div className="text-gray-400 cursor-grab active:cursor-grabbing">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Expand/Collapse Arrow */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        {/* Component Info */}
        <div className="flex flex-col">
          <span className={`font-medium text-sm ${block.enabled !== false ? 'text-gray-900' : 'text-gray-500'}`}>
            {componentInfo?.displayName || block.type}
          </span>
          <span className="text-xs text-gray-500">
            {CATEGORY_LABELS[block.category] || block.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Enable/Disable Toggle */}
        <button
          onClick={onToggleEnabled}
          className={`px-2 py-1 text-xs font-medium rounded ${
            block.enabled !== false
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={block.enabled !== false ? 'Click to disable' : 'Click to enable'}
        >
          {block.enabled !== false ? 'Enabled' : 'Disabled'}
        </button>

        {/* Duplicate Button */}
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Duplicate block"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete block"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
