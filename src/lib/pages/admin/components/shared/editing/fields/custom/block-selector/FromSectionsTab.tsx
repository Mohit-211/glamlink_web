'use client';

/**
 * FromSectionsTab Component
 * Tab content for selecting content blocks from existing magazine sections
 */

import React from 'react';
import { useBlockSelector } from './useBlockSelector';
import type { FromSectionsTabProps } from './types';

/**
 * Displays sections with content blocks for selection
 */
export function FromSectionsTab({ issueId, onSelectBlock }: FromSectionsTabProps) {
  const {
    sections,
    loading,
    error,
    expandedSection,
    setExpandedSection,
    fetchSections,
  } = useBlockSelector(issueId);

  if (!issueId) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No issue context available. Use "Add New" tab to create a block.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Loading sections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">
        {error}
        <button
          onClick={fetchSections}
          className="ml-2 text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No sections with content blocks found in this issue.
        <br />
        <span className="text-xs">Use "Add New" tab to create a block.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-auto">
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedSection(
              expandedSection === section.id ? null : section.id
            )}
            className="w-full px-3 py-2 text-left text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
          >
            <span>{section.title}</span>
            <span className="text-xs text-gray-400">
              {section.blocks.length} block{section.blocks.length !== 1 ? 's' : ''}
            </span>
          </button>

          {expandedSection === section.id && (
            <div className="p-2 space-y-1 bg-white">
              {section.blocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => onSelectBlock(block)}
                  className="w-full px-3 py-2 text-left text-sm rounded hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                >
                  <span>{block.type}</span>
                  <span className="text-xs text-gray-400">{block.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FromSectionsTab;
