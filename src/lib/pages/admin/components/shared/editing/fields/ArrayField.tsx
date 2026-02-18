'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFormContext } from '../form/FormProvider';
import { BaseField, getInputClassName } from './BaseField';
import ImageUploadField from './custom/media/imageUpload';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { PagePdfSettings } from '@/lib/pages/admin/components/magazine/digital/editor/types';

// PDF dimensions in mm
const PDF_DIMENSIONS: Record<string, { width: number; height: number }> = {
  'a4-portrait': { width: 210, height: 297 },
  'a4-landscape': { width: 297, height: 210 },
  '16:9': { width: 297, height: 167 },
  '4:3': { width: 280, height: 210 },
  'square': { width: 210, height: 210 },
};

/**
 * Calculate dynamic aspect ratio for TOC card images based on entry count, PDF settings, and layout placement
 *
 * For 'top' layout (default):
 *   - Card width is full (half page width), image height varies by row count
 *   - Image takes remaining space after fixed content area (~18mm)
 *
 * For 'left' layout:
 *   - Image takes 50% of card width, 100% of card height
 *   - Results in a taller aspect ratio
 */
function calculateTocImageAspectRatio(
  entryCount: number,
  pdfSettings?: PagePdfSettings,
  imagePlacement: 'top' | 'left' = 'top'
): { ratio: number; label: string } | null {
  if (!pdfSettings || entryCount === 0) return null;

  // Get page dimensions
  let pageWidth: number;
  let pageHeight: number;

  if (pdfSettings.ratio === 'custom') {
    pageWidth = pdfSettings.customWidth || 210;
    pageHeight = pdfSettings.customHeight || 297;
  } else {
    const dims = PDF_DIMENSIONS[pdfSettings.ratio];
    if (!dims) return null;
    pageWidth = dims.width;
    pageHeight = dims.height;
  }

  // Layout measurements (matching TableOfContentsPreview.tsx and useCombinedPdf.ts)
  const pagePadding = 6.35;  // p-6 ≈ 24px ≈ 6.35mm
  const gap = 4.23;          // gap-4 ≈ 16px ≈ 4.23mm
  const contentHeight = 18;  // Fixed content area height (~18mm) - only used for 'top' layout
  const headerOffset = 12.7; // Assume title present for safety

  // Calculate card width (2 columns)
  const availableWidth = pageWidth - (pagePadding * 2) - gap;
  const cardWidth = availableWidth / 2;

  // Calculate card height based on row count
  const numRows = Math.ceil(entryCount / 2);
  const availableGridHeight = pageHeight - (pagePadding * 2) - headerOffset;
  const totalGapHeight = (numRows - 1) * gap;
  const cardHeight = (availableGridHeight - totalGapHeight) / numRows;

  if (imagePlacement === 'left') {
    // LEFT LAYOUT: Image is 50% of card width, full card height
    const imageWidth = cardWidth / 2;
    const imageHeight = cardHeight;
    const ratio = imageWidth / imageHeight;
    const label = `TOC Left (${Math.round(imageWidth)}×${Math.round(imageHeight)}mm)`;
    return { ratio, label };
  }

  // TOP LAYOUT (default): Image is full card width, card height minus content area
  const imageHeight = Math.max(cardHeight - contentHeight, 20); // minimum 20mm
  const ratio = cardWidth / imageHeight;
  const label = `TOC Card (${Math.round(cardWidth)}×${Math.round(imageHeight)}mm)`;
  return { ratio, label };
}

interface ArrayFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * ArrayField - Controlled array field component
 *
 * Supports two modes based on field.data:
 * - 'string' (default): Array of strings
 * - 'object': Array of objects with itemSchema
 *
 * Key features:
 * - Main items array comes from form context (no local duplication)
 * - Only UI state (newItemValue, expandedItems) is local
 * - Error passed as prop to enable targeted re-renders
 */
function ArrayFieldComponent({ field, error }: ArrayFieldProps) {
  const { getFieldValue, updateField, validateField, context } = useFormContext();

  // Get items from form context - this is the source of truth
  // Handle case where value might be a string instead of array
  const rawValue = getFieldValue(field.name);
  const items: any[] = Array.isArray(rawValue) ? rawValue : (rawValue ? [rawValue] : []);

  // Determine array type
  const dataType = field.data || 'string';
  const maxItems = field.maxItems || 10;

  // Get PDF settings from context (passed from PageCreator)
  const pdfSettings = context?.pdfSettings as PagePdfSettings | undefined;

  // Get page-level image placement setting for TOC cards
  const tocImagePlacement = getFieldValue('tocImagePlacement') as 'top' | 'left' | undefined;

  // Calculate dynamic aspect ratio for TOC images based on entry count, PDF settings, and layout
  // This applies to ALL entries since tocImagePlacement is a page-level setting
  const dynamicTocAspectRatio = useMemo(() => {
    // Only calculate for tocEntries field (or fields with dynamicAspectRatio flag)
    if (field.name !== 'tocEntries' && !field.dynamicAspectRatio) {
      return null;
    }
    const placement = tocImagePlacement || 'top';
    return calculateTocImageAspectRatio(items.length, pdfSettings, placement);
  }, [field.name, field.dynamicAspectRatio, items.length, pdfSettings, tocImagePlacement]);

  // UI state only (not duplicating data)
  const [newItemValue, setNewItemValue] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(() => new Set());

  // ============================================
  // STRING ARRAY OPERATIONS
  // ============================================

  const addStringItem = useCallback(() => {
    if (newItemValue.trim() && items.length < maxItems) {
      const newItems = [...items, newItemValue.trim()];
      updateField(field.name, newItems);
      setNewItemValue('');
    }
  }, [newItemValue, items, maxItems, updateField, field.name]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateField(field.name, newItems);
    // Update expanded items for object arrays
    if (dataType === 'object') {
      setExpandedItems(prev => {
        const newExpanded = new Set<number>();
        prev.forEach(i => {
          if (i < index) newExpanded.add(i);
          else if (i > index) newExpanded.add(i - 1);
        });
        return newExpanded;
      });
    }
  }, [items, updateField, field.name, dataType]);

  const updateStringItem = useCallback((index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    updateField(field.name, newItems);
  }, [items, updateField, field.name]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStringItem();
    }
  };

  // ============================================
  // OBJECT ARRAY OPERATIONS
  // ============================================

  const addObjectItem = useCallback(() => {
    if (items.length < maxItems && field.itemSchema) {
      const newItem: Record<string, any> = {};
      field.itemSchema.forEach(schemaField => {
        newItem[schemaField.name] = schemaField.type === 'checkbox' ? false : '';
      });
      const newItems = [...items, newItem];
      updateField(field.name, newItems);
      setExpandedItems(prev => new Set([...prev, newItems.length - 1]));
    }
  }, [items, maxItems, field.itemSchema, field.name, updateField]);

  const updateObjectField = useCallback((index: number, fieldName: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: value };
    updateField(field.name, newItems);
  }, [items, updateField, field.name]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // ============================================
  // RENDER STRING ARRAY
  // ============================================

  if (dataType === 'string') {
    return (
      <BaseField field={field} error={error}>
        <div className="space-y-2">
          {/* Existing items */}
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateStringItem(index, e.target.value)}
                className={getInputClassName(!!error)}
                placeholder={`${field.label} ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                title="Remove item"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add new item */}
          {items.length < maxItems && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className={getInputClassName(!!error)}
                placeholder={`Add ${field.label.toLowerCase()}...`}
              />
              <button
                type="button"
                onClick={addStringItem}
                disabled={!newItemValue.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          )}

          {/* Item count */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{items.length} of {maxItems} items</span>
            {items.length >= maxItems && (
              <span className="text-amber-600">Maximum items reached</span>
            )}
          </div>
        </div>
      </BaseField>
    );
  }

  // ============================================
  // RENDER OBJECT ARRAY
  // ============================================

  return (
    <BaseField field={field} error={error}>
      <div className="space-y-4">
        {/* Existing items */}
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Item header */}
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {field.label} #{index + 1}
                </h3>
                {expandedItems.has(index) ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
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

            {/* Item content */}
            {expandedItems.has(index) && field.itemSchema && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                {field.itemSchema.map((schemaField) => (
                  <div key={schemaField.name} className="space-y-1">
                    {/* Skip outer label for image fields - ImageUploadField renders its own */}
                    {schemaField.type !== 'image' && (
                      <label className="block text-sm font-medium text-gray-700">
                        {schemaField.label}
                        {schemaField.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    )}
                    {renderSubField(item, index, schemaField, updateObjectField, dynamicTocAspectRatio, context)}
                    {schemaField.helperText && (
                      <p className="text-xs text-gray-500">{schemaField.helperText}</p>
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
            onClick={addObjectItem}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
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
    </BaseField>
  );
}

// Interface for available pages (for page-link-selector)
interface AvailablePage {
  id: string;
  pageNumber: number;
  title?: string;
  pageType: string;
}

// Helper function to render sub-fields in object arrays
function renderSubField(
  item: any,
  itemIndex: number,
  schemaField: any,
  updateObjectField: (index: number, fieldName: string, value: any) => void,
  dynamicAspectRatio?: { ratio: number; label: string } | null,
  context?: any
) {
  const value = item[schemaField.name] || '';
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

  switch (schemaField.type) {
    case 'text':
    case 'email':
    case 'url':
    case 'tel':
      return (
        <input
          type={schemaField.type}
          value={value}
          onChange={(e) => updateObjectField(itemIndex, schemaField.name, e.target.value)}
          className={inputClass}
          placeholder={schemaField.placeholder}
          required={schemaField.required}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => updateObjectField(itemIndex, schemaField.name, parseFloat(e.target.value) || '')}
          className={inputClass}
          placeholder={schemaField.placeholder}
          min={schemaField.min}
          max={schemaField.max}
          step={schemaField.step}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={value}
          onChange={(e) => updateObjectField(itemIndex, schemaField.name, e.target.value)}
          rows={schemaField.rows || 3}
          className={inputClass}
          placeholder={schemaField.placeholder}
        />
      );

    case 'select':
      return (
        <select
          value={value}
          onChange={(e) => updateObjectField(itemIndex, schemaField.name, e.target.value)}
          className={inputClass}
        >
          {schemaField.placeholder && <option value="">{schemaField.placeholder}</option>}
          {schemaField.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'checkbox':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateObjectField(itemIndex, schemaField.name, e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          {schemaField.checkboxLabel && (
            <label className="ml-2 text-sm text-gray-700">{schemaField.checkboxLabel}</label>
          )}
        </div>
      );

    case 'date':
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => updateObjectField(itemIndex, schemaField.name, e.target.value)}
          className={inputClass}
        />
      );

    case 'image':
      // Use dynamic aspect ratio if available (for TOC entries), otherwise use schema's static ratio
      const effectiveAspectRatio = dynamicAspectRatio || schemaField.customAspectRatio;
      return (
        <ImageUploadField
          field={schemaField}
          value={value || ''}
          onChange={(name, val) => updateObjectField(itemIndex, schemaField.name, val)}
          fieldName={schemaField.name}
          placeholder={schemaField.placeholder || 'Enter image URL or upload...'}
          customAspectRatio={effectiveAspectRatio}
        />
      );

    case 'page-link-selector': {
      // Get available pages from context (sorted by page number)
      const availablePages = (context?.availablePages || []) as AvailablePage[];
      const sortedPages = [...availablePages].sort((a, b) => a.pageNumber - b.pageNumber);

      return (
        <>
          <select
            value={value}
            onChange={(e) => updateObjectField(itemIndex, schemaField.name, e.target.value ? parseInt(e.target.value, 10) : '')}
            className={inputClass}
            required={schemaField.required}
          >
            <option value="">{schemaField.placeholder || 'Select a page...'}</option>
            {sortedPages.map((page) => (
              <option key={page.id} value={page.pageNumber}>
                Page {page.pageNumber}: {page.title || page.pageType}
              </option>
            ))}
          </select>
          {sortedPages.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">Save some pages first to link to them.</p>
          )}
        </>
      );
    }

    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => updateObjectField(itemIndex, schemaField.name, e.target.value)}
          className={inputClass}
          placeholder={schemaField.placeholder}
        />
      );
  }
}

export const ArrayField = memo(ArrayFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});
