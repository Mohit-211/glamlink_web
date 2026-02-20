"use client";

import { useState } from 'react';
import { ChevronUpIcon } from '@/lib/pages/admin/components/shared/common';

interface ContentBlock {
  type?: string;
  category?: string;
  [key: string]: any;
}

interface ContentBlocksRendererProps {
  row: any;
  column: any;
  value: any;
}

export default function ContentBlocksRenderer({ row }: ContentBlocksRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Try to get content blocks from various possible locations
  const contentBlocks: ContentBlock[] =
    row.contentBlocks ||
    row.content?.contentBlocks ||
    (Array.isArray(row.content) ? row.content : []);

  // If no content blocks, show dash
  if (!contentBlocks || contentBlocks.length === 0) {
    return <span className="text-gray-400">-</span>;
  }

  const blockCount = contentBlocks.length;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        View Content Blocks ({blockCount})
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(false)}
        className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700 mb-1"
      >
        <ChevronUpIcon className="mr-1" />
        Collapse
      </button>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {contentBlocks.map((block, index) => (
          <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
            [{block.type || 'unknown'}]
            {block.category && ` (${block.category})`}
          </div>
        ))}
      </div>
    </div>
  );
}
