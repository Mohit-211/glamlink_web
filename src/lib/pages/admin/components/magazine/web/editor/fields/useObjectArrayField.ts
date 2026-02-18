'use client';

import { useState, useMemo, useCallback } from 'react';
import type { FieldDefinition } from '../config/content-discovery';

interface UseObjectArrayFieldParams {
  field: FieldDefinition;
  value: Record<string, any>[];
  onChange: (value: Record<string, any>[]) => void;
}

interface UseObjectArrayFieldReturn {
  items: Record<string, any>[];
  maxItems: number;
  expandedItems: Set<number>;
  itemFields: FieldDefinition[];
  allItemFields: FieldDefinition[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItemField: (index: number, fieldName: string, fieldValue: any) => void;
  toggleExpanded: (index: number) => void;
  getItemSummary: (item: Record<string, any>, index: number) => string;
}

export function useObjectArrayField({
  field,
  value,
  onChange,
}: UseObjectArrayFieldParams): UseObjectArrayFieldReturn {
  const items = value || [];
  const maxItems = field.maxItems || 10;
  const [expandedItems, setExpandedItems] = useState<Set<number>>(() => new Set());

  // Get the fields definition for each object item
  const allItemFields = field.fields || field.objectFields || [];

  // Filter out paired typography fields (they'll be rendered inline with text fields)
  const itemFields = useMemo(() => {
    const fieldNames = allItemFields.map(f => f.name);
    return allItemFields.filter(itemField => {
      if (itemField.type === 'typography-group') {
        // Check if this is a paired typography field
        const baseName = itemField.name.replace(/Typography$/, '');
        const hasPairedTextField = fieldNames.includes(baseName);
        return !hasPairedTextField;
      }
      return true;
    });
  }, [allItemFields]);

  const addItem = useCallback(() => {
    if (items.length < maxItems) {
      // Create a new item with default values (use allItemFields to include typography fields)
      const newItem: Record<string, any> = {};
      allItemFields.forEach((itemField) => {
        if (itemField.defaultValue !== undefined) {
          newItem[itemField.name] = itemField.defaultValue;
        } else if (itemField.type === 'checkbox') {
          newItem[itemField.name] = false;
        } else if (itemField.type === 'array') {
          newItem[itemField.name] = [];
        } else if (itemField.type === 'typography-group') {
          newItem[itemField.name] = {};
        } else {
          newItem[itemField.name] = '';
        }
      });
      const newItems = [...items, newItem];
      onChange(newItems);
      // Auto-expand the new item
      setExpandedItems(prev => new Set([...prev, newItems.length - 1]));
    }
  }, [items, maxItems, allItemFields, onChange]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
    // Update expanded items indices
    setExpandedItems(prev => {
      const newExpanded = new Set<number>();
      prev.forEach(i => {
        if (i < index) newExpanded.add(i);
        else if (i > index) newExpanded.add(i - 1);
      });
      return newExpanded;
    });
  }, [items, onChange]);

  const updateItemField = useCallback((index: number, fieldName: string, fieldValue: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: fieldValue };
    onChange(newItems);
  }, [items, onChange]);

  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  // Get a summary title for collapsed items
  const getItemSummary = useCallback((item: Record<string, any>, index: number): string => {
    // Try to find a title/name field
    const titleField = itemFields.find(f =>
      f.name === 'title' || f.name === 'name' || f.name === 'label'
    );
    if (titleField && item[titleField.name]) {
      return String(item[titleField.name]);
    }
    return `${field.label} #${index + 1}`;
  }, [itemFields, field.label]);

  return {
    items,
    maxItems,
    expandedItems,
    itemFields,
    allItemFields,
    addItem,
    removeItem,
    updateItemField,
    toggleExpanded,
    getItemSummary,
  };
}

export default useObjectArrayField;
