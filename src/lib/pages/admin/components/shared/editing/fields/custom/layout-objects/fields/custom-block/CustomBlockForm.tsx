'use client';

/**
 * CustomBlockForm - Form for editing custom block props
 *
 * Features:
 * - Two-step component selection
 * - Dynamic form field generation from content-discovery
 * - JSON editor toggle
 * - Form/JSON bidirectional sync
 */

import React, { useCallback } from 'react';
import type { CustomBlockCustomObject } from '../../types';
import { useCustomBlockForm } from './useCustomBlockForm';
import CustomBlockSelector from './form-management/CustomBlockSelector';
import LoadFromSectionButton from './form-management/LoadFromSectionButton';
import { SubSpacerEditor } from '../../shared';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import type { FieldSchema } from '@/lib/pages/magazine/config/sections';
import {
  CATEGORY_LABELS,
  getComponentsByCategory
} from '@/lib/pages/admin/components/magazine/web/editor/config/content-discovery';

// =============================================================================
// TYPES
// =============================================================================

interface CustomBlockFormProps {
  object: CustomBlockCustomObject;
  onUpdate: (updates: Partial<CustomBlockCustomObject>) => void;
  issueId?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CustomBlockForm({ object, onUpdate, issueId }: CustomBlockFormProps) {
  const {
    editMode,
    setEditMode,
    jsonInput,
    setJsonInput,
    jsonError,
    componentInfo,
    handleCategoryChange,
    handleComponentChange,
    handleFieldChange,
    handleApplyJson,
    handleLoadFromSection,
    handleSpacersChange,
  } = useCustomBlockForm({ object, onUpdate });

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Custom Block Settings</h4>

        {/* Toggle button (only show if component selected) */}
        {object.blockType && (
          <button
            type="button"
            onClick={() => setEditMode(editMode === 'form' ? 'json' : 'form')}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {editMode === 'form' ? '{ } JSON' : '📋 Form'}
          </button>
        )}
      </div>

      {/* Component Selector (always shown) */}
      <CustomBlockSelector
        selectedCategory={object.blockCategory}
        selectedComponent={object.blockType}
        onCategoryChange={handleCategoryChange}
        onComponentChange={handleComponentChange}
        categoryLabels={CATEGORY_LABELS}
        getComponentsByCategory={getComponentsByCategory}
      />

      {/* Load from Section Button */}
      {object.blockType && object.blockCategory && issueId && (
        <div className="pt-3">
          <LoadFromSectionButton
            issueId={issueId}
            blockType={object.blockType}
            blockCategory={object.blockCategory}
            currentProps={object.blockProps}
            onLoad={handleLoadFromSection}
          />
        </div>
      )}

      {/* Form Mode - Dynamic Fields */}
      {editMode === 'form' && componentInfo && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Component: <strong>{componentInfo.displayName}</strong>
          </p>

          {componentInfo.propFields.map((field) => (
            <DynamicFieldRenderer
              key={field.name}
              field={field as FieldSchema}
              value={object.blockProps[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
              formData={object.blockProps}
              issueId={issueId}
            />
          ))}
        </div>
      )}

      {/* Sub-Spacers - Only show if component is selected */}
      {editMode === 'form' && object.blockType && object.blockCategory && (
        <div className="pt-3 border-t border-gray-200">
          <SubSpacerEditor
            spacers={object.spacers || []}
            onChange={handleSpacersChange}
            label="Block Sub-Spacers"
            maxSpacers={10}
          />
        </div>
      )}

      {/* JSON Mode - JSON Editor */}
      {editMode === 'json' && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Block Props (JSON)
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={15}
            className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            spellCheck={false}
          />

          {jsonError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-700">{jsonError}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApplyJson}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Apply JSON
            </button>
            <button
              type="button"
              onClick={() => setEditMode('form')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* No component selected state */}
      {!object.blockType && (
        <div className="py-4 text-center text-sm text-gray-500">
          Select a category and component above to configure this block
        </div>
      )}
    </div>
  );
}
