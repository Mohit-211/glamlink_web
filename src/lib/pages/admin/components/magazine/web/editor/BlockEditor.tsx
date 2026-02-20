'use client';

import React from 'react';
import type { ContentBlock } from '../types';
import type { FieldDefinition } from './config/content-discovery';
import BlockHeader from './components/BlockHeader';
import { useBlockEditor } from './useBlockEditor';
import EnhancedFieldRenderer from './components/enhanced-fields';

interface BlockEditorProps {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  issueId?: string;
}

export default function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
  isExpanded = false,
  onToggleExpand,
  issueId = 'admin',
}: BlockEditorProps) {
  const {
    expanded,
    toggleExpand,
    componentInfo,
    displayFields,
    handlePropChange,
    handleToggleEnabled,
  } = useBlockEditor({
    block,
    onUpdate,
    isExpanded,
    onToggleExpand,
  });

  return (
    <div className={`border rounded-lg overflow-hidden ${block.enabled !== false ? 'border-gray-200' : 'border-gray-300 opacity-75'}`}>
      {/* Header */}
      <BlockHeader
        block={block}
        componentInfo={componentInfo}
        isExpanded={expanded}
        onToggle={toggleExpand}
        onToggleEnabled={handleToggleEnabled}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 bg-white">
          {componentInfo ? (
            <div className="space-y-4">
              {displayFields.length > 0 ? (
                displayFields.map((field: FieldDefinition) => (
                  <div key={field.name}>
                    {field.type !== 'checkbox' && field.type !== 'image' && (
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    )}
                    <EnhancedFieldRenderer
                      field={field}
                      value={block.props[field.name]}
                      onChange={(value: any) => handlePropChange(field.name, value)}
                      issueId={issueId}
                      allProps={block.props}
                      onPropChange={handlePropChange}
                      allFields={componentInfo?.propFields}
                    />
                    {field.helperText && (
                      <p className="mt-1 text-xs text-gray-500">{field.helperText}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No editable fields for this component.</p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-orange-600">
                Component not found in content-discovery system
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Type: {block.type}, Category: {block.category}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
