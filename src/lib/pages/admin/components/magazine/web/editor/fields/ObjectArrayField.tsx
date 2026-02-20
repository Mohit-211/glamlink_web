'use client';

import React from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { FieldDefinition } from '../config/content-discovery';
import { useObjectArrayField } from './useObjectArrayField';

// Forward declaration - will be imported from parent
interface EnhancedFieldRendererProps {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  issueId?: string;
  allProps?: Record<string, any>;
  onPropChange?: (propName: string, value: any) => void;
}

interface ObjectArrayFieldProps {
  field: FieldDefinition;
  value: Record<string, any>[];
  onChange: (value: Record<string, any>[]) => void;
  issueId?: string;
  // Pass the field renderer to avoid circular dependency
  FieldRenderer: React.ComponentType<EnhancedFieldRendererProps>;
}

/**
 * ObjectArrayField - Array of objects with nested fields
 * Used for fields like PhotoGalleryProducts.products, SocialLinks.links
 */
export default function ObjectArrayField({
  field,
  value,
  onChange,
  issueId,
  FieldRenderer
}: ObjectArrayFieldProps) {
  const {
    items,
    maxItems,
    expandedItems,
    itemFields,
    addItem,
    removeItem,
    updateItemField,
    toggleExpanded,
    getItemSummary,
  } = useObjectArrayField({ field, value, onChange });

  return (
    <div className="space-y-3">
      {/* Existing items */}
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Item header */}
          <div
            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleExpanded(index)}
          >
            <div className="flex items-center gap-2">
              {expandedItems.has(index) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-900">
                {getItemSummary(item, index)}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(index);
              }}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Item content - expanded fields */}
          {expandedItems.has(index) && itemFields.length > 0 && (
            <div className="p-4 space-y-4 border-t border-gray-200 bg-white">
              {itemFields.map((itemField) => (
                <div key={itemField.name}>
                  {/* Skip label for image fields (they render their own) */}
                  {itemField.type !== 'image' && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {itemField.label}
                      {itemField.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}
                  <FieldRenderer
                    field={itemField}
                    value={item[itemField.name]}
                    onChange={(newValue) => updateItemField(index, itemField.name, newValue)}
                    issueId={issueId}
                    allProps={item}
                    onPropChange={(propName, newValue) => updateItemField(index, propName, newValue)}
                  />
                  {itemField.helperText && (
                    <p className="mt-1 text-xs text-gray-500">{itemField.helperText}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add new item button */}
      {items.length < maxItems && (
        <button
          type="button"
          onClick={addItem}
          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600"
        >
          <Plus className="w-4 h-4" />
          Add {field.label}
        </button>
      )}

      {/* Item count */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{items.length} of {maxItems} items</span>
        {items.length >= maxItems && (
          <span className="text-amber-600">Maximum items reached</span>
        )}
      </div>
    </div>
  );
}
