/**
 * useFieldComparison Hook
 * 
 * Manages field comparisons for AI-generated content,
 * handles selection states and field updates.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type { FieldComparison, FieldType } from '../types';

export interface UseFieldComparisonOptions {
  onSelectionChange?: (selectedFields: string[]) => void;
  defaultSelectedFields?: string[];
  maxSelections?: number;
}

export function useFieldComparison(
  originalData: Record<string, any>,
  generatedData: Record<string, any>,
  options: UseFieldComparisonOptions = {}
) {
  const {
    onSelectionChange,
    defaultSelectedFields = [],
    maxSelections
  } = options;

  // State for field selection
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(defaultSelectedFields)
  );

  /**
   * Create field comparisons from original and generated data
   */
  const comparisons = useMemo((): FieldComparison[] => {
    const fieldNames = new Set([
      ...Object.keys(originalData || {}),
      ...Object.keys(generatedData || {})
    ]);

    return Array.from(fieldNames).map(fieldName => {
      const oldValue = originalData?.[fieldName];
      const newValue = generatedData?.[fieldName];
      
      return {
        fieldName,
        displayName: formatFieldName(fieldName),
        fieldType: inferFieldType(newValue || oldValue),
        oldValue,
        newValue,
        shouldUpdate: selectedFields.has(fieldName)
      };
    }).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [originalData, generatedData, selectedFields]);

  /**
   * Toggle field selection
   */
  const toggleField = useCallback((fieldName: string) => {
    setSelectedFields(prev => {
      const newSelection = new Set(prev);
      
      if (newSelection.has(fieldName)) {
        newSelection.delete(fieldName);
      } else {
        // Check max selections limit
        if (maxSelections && newSelection.size >= maxSelections) {
          console.warn(`Maximum ${maxSelections} fields can be selected`);
          return prev;
        }
        newSelection.add(fieldName);
      }
      
      const selectedArray = Array.from(newSelection);
      onSelectionChange?.(selectedArray);
      
      return newSelection;
    });
  }, [maxSelections, onSelectionChange]);

  /**
   * Select all fields that have changes
   */
  const selectAllChanged = useCallback(() => {
    const changedFields = comparisons
      .filter(comp => comp.oldValue !== comp.newValue)
      .map(comp => comp.fieldName);
    
    const fieldsToSelect = maxSelections 
      ? changedFields.slice(0, maxSelections)
      : changedFields;
    
    setSelectedFields(new Set(fieldsToSelect));
    onSelectionChange?.(fieldsToSelect);
  }, [comparisons, maxSelections, onSelectionChange]);

  /**
   * Select all available fields
   */
  const selectAll = useCallback(() => {
    const allFields = comparisons.map(comp => comp.fieldName);
    const fieldsToSelect = maxSelections 
      ? allFields.slice(0, maxSelections)
      : allFields;
    
    setSelectedFields(new Set(fieldsToSelect));
    onSelectionChange?.(fieldsToSelect);
  }, [comparisons, maxSelections, onSelectionChange]);

  /**
   * Clear all selections
   */
  const selectNone = useCallback(() => {
    setSelectedFields(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  /**
   * Get selected fields as array
   */
  const getSelectedFields = useCallback(() => {
    return Array.from(selectedFields);
  }, [selectedFields]);

  /**
   * Get selected field data
   */
  const getSelectedFieldData = useCallback(() => {
    const result: Record<string, any> = {};
    
    for (const fieldName of selectedFields) {
      if (generatedData?.[fieldName] !== undefined) {
        result[fieldName] = generatedData[fieldName];
      }
    }
    
    return result;
  }, [selectedFields, generatedData]);

  /**
   * Check if there are any changes in selected fields
   */
  const hasSelectedChanges = useMemo(() => {
    return comparisons.some(comp => 
      comp.shouldUpdate && comp.oldValue !== comp.newValue
    );
  }, [comparisons]);

  /**
   * Get count of changed fields
   */
  const changedFieldsCount = useMemo(() => {
    return comparisons.filter(comp => comp.oldValue !== comp.newValue).length;
  }, [comparisons]);

  /**
   * Get count of selected fields
   */
  const selectedFieldsCount = selectedFields.size;

  /**
   * Check if field selection is at maximum
   */
  const isSelectionAtMax = maxSelections ? selectedFields.size >= maxSelections : false;

  /**
   * Get comparison for a specific field
   */
  const getFieldComparison = useCallback((fieldName: string) => {
    return comparisons.find(comp => comp.fieldName === fieldName) || null;
  }, [comparisons]);

  /**
   * Get fields by type
   */
  const getFieldsByType = useCallback((fieldType: FieldType) => {
    return comparisons.filter(comp => comp.fieldType === fieldType);
  }, [comparisons]);

  /**
   * Get only changed fields
   */
  const getChangedFields = useCallback(() => {
    return comparisons.filter(comp => comp.oldValue !== comp.newValue);
  }, [comparisons]);

  /**
   * Get only selected fields
   */
  const getSelectedComparisons = useCallback(() => {
    return comparisons.filter(comp => comp.shouldUpdate);
  }, [comparisons]);

  /**
   * Check if specific field is selected
   */
  const isFieldSelected = useCallback((fieldName: string) => {
    return selectedFields.has(fieldName);
  }, [selectedFields]);

  /**
   * Check if specific field has changes
   */
  const hasFieldChanged = useCallback((fieldName: string) => {
    const comparison = getFieldComparison(fieldName);
    return comparison ? comparison.oldValue !== comparison.newValue : false;
  }, [getFieldComparison]);

  /**
   * Get preview of changes that will be applied
   */
  const getChangePreview = useCallback(() => {
    const selectedComparisons = getSelectedComparisons();
    const preview = {
      fieldsToUpdate: selectedComparisons.length,
      changes: selectedComparisons.map(comp => ({
        field: comp.fieldName,
        from: comp.oldValue,
        to: comp.newValue,
        type: comp.fieldType
      }))
    };
    
    return preview;
  }, [getSelectedComparisons]);

  /**
   * Validate selections
   */
  const validateSelections = useCallback(() => {
    const issues: string[] = [];
    
    if (selectedFields.size === 0) {
      issues.push('No fields selected for update');
    }
    
    if (maxSelections && selectedFields.size > maxSelections) {
      issues.push(`Too many fields selected (max: ${maxSelections})`);
    }
    
    const selectedComparisons = getSelectedComparisons();
    const hasAnyChanges = selectedComparisons.some(comp => 
      comp.oldValue !== comp.newValue
    );
    
    if (!hasAnyChanges) {
      issues.push('No actual changes in selected fields');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }, [selectedFields.size, maxSelections, getSelectedComparisons]);

  return {
    // Data
    comparisons,
    selectedFields: getSelectedFields(),
    selectedFieldsCount,
    changedFieldsCount,
    
    // Selection actions
    toggleField,
    selectAll,
    selectAllChanged,
    selectNone,
    
    // Queries
    getSelectedFieldData,
    getFieldComparison,
    getFieldsByType,
    getChangedFields,
    getSelectedComparisons,
    isFieldSelected,
    hasFieldChanged,
    
    // State checks
    hasSelectedChanges,
    isSelectionAtMax,
    
    // Utilities
    getChangePreview,
    validateSelections
  };
}

/**
 * Format field name for display
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim();
}

/**
 * Infer field type from value
 */
function inferFieldType(value: any): FieldType {
  if (value === null || value === undefined) {
    return 'text';
  }
  
  if (typeof value === 'number') {
    return 'number';
  }
  
  if (typeof value === 'boolean') {
    return 'checkbox';
  }
  
  if (Array.isArray(value)) {
    return 'array';
  }
  
  if (typeof value === 'string') {
    // Check for HTML content
    if (value.includes('<') && value.includes('>')) {
      return 'html';
    }
    
    // Check for email
    if (value.includes('@') && value.includes('.')) {
      return 'email';
    }
    
    // Check for URL
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return 'url';
    }
    
    // Check for date format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return 'date';
    }
    
    // Check for multiline text
    if (value.includes('\n') || value.length > 100) {
      return 'textarea';
    }
    
    return 'text';
  }
  
  return 'text';
}