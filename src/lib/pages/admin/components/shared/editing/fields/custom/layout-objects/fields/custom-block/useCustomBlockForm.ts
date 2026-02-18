/**
 * useCustomBlockForm - Hook for custom block form logic
 *
 * Manages:
 * - Form/JSON edit mode toggle
 * - Component selection and field changes
 * - JSON editor state and validation
 * - Loading data from existing sections
 */

import { useState, useCallback, useMemo } from 'react';
import type { CustomBlockCustomObject } from '../../types';
import { getComponentInfo } from '@/lib/pages/admin/components/magazine/web/editor/config/content-discovery';

// =============================================================================
// TYPES
// =============================================================================

export type EditMode = 'form' | 'json';

export interface UseCustomBlockFormParams {
  object: CustomBlockCustomObject;
  onUpdate: (updates: Partial<CustomBlockCustomObject>) => void;
}

export interface UseCustomBlockFormReturn {
  // Edit mode state
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;

  // JSON editor state
  jsonInput: string;
  setJsonInput: (value: string) => void;
  jsonError: string | null;

  // Component info
  componentInfo: ReturnType<typeof getComponentInfo> | null;

  // Handlers
  handleCategoryChange: (category: string) => void;
  handleComponentChange: (componentName: string) => void;
  handleFieldChange: (fieldName: string, value: any) => void;
  handleOpenJsonEditor: () => void;
  handleApplyJson: () => void;
  handleLoadFromSection: (data: Record<string, any>) => void;
  handleSpacersChange: (spacers: CustomBlockCustomObject['spacers']) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useCustomBlockForm({
  object,
  onUpdate,
}: UseCustomBlockFormParams): UseCustomBlockFormReturn {
  // Toggle between form and JSON mode
  const [editMode, setEditMode] = useState<EditMode>('form');

  // JSON editor state
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Get component field definitions from content-discovery
  const componentInfo = useMemo(() => {
    if (!object.blockType || !object.blockCategory) return null;
    return getComponentInfo(object.blockType, object.blockCategory);
  }, [object.blockType, object.blockCategory]);

  // Handle category selection
  const handleCategoryChange = useCallback((category: string) => {
    onUpdate({
      blockCategory: category,
      blockType: '',      // Reset component when category changes
      blockProps: {}      // Reset props
    });
  }, [onUpdate]);

  // Handle component selection
  const handleComponentChange = useCallback((componentName: string) => {
    const info = getComponentInfo(componentName, object.blockCategory);

    // Generate default props from field definitions
    const defaultProps: Record<string, any> = {};
    info?.propFields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaultProps[field.name] = field.defaultValue;
      }
    });

    onUpdate({
      blockType: componentName,
      blockProps: defaultProps
    });
  }, [object.blockCategory, onUpdate]);

  // Handle individual field changes
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    // Check if this is a typography-group field
    const field = componentInfo?.propFields.find(f => f.name === fieldName);

    if (field?.type === 'typography-group' && value && typeof value === 'object' && !Array.isArray(value)) {
      // Flatten typography object into individual props
      // e.g., { fontSize: "text-xl", fontFamily: "font-sans" }
      // becomes individual props in blockProps
      const updatedProps = { ...object.blockProps };
      Object.keys(value).forEach(key => {
        updatedProps[key] = value[key];
      });
      onUpdate({
        blockProps: updatedProps
      });
    } else {
      // Regular field update
      onUpdate({
        blockProps: {
          ...object.blockProps,
          [fieldName]: value
        }
      });
    }
  }, [object.blockProps, componentInfo, onUpdate]);

  // Switch to JSON mode
  const handleOpenJsonEditor = useCallback(() => {
    setJsonInput(JSON.stringify(object.blockProps, null, 2));
    setJsonError(null);
    setEditMode('json');
  }, [object.blockProps]);

  // Apply JSON changes
  const handleApplyJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      onUpdate({ blockProps: parsed });
      setJsonError(null);
      setEditMode('form');
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }, [jsonInput, onUpdate]);

  // Handle loading data from existing section
  const handleLoadFromSection = useCallback((data: Record<string, any>) => {
    onUpdate({ blockProps: data });
  }, [onUpdate]);

  // Handle spacers change
  const handleSpacersChange = useCallback((spacers: CustomBlockCustomObject['spacers']) => {
    onUpdate({ spacers });
  }, [onUpdate]);

  return {
    // Edit mode state
    editMode,
    setEditMode,

    // JSON editor state
    jsonInput,
    setJsonInput,
    jsonError,

    // Component info
    componentInfo,

    // Handlers
    handleCategoryChange,
    handleComponentChange,
    handleFieldChange,
    handleOpenJsonEditor,
    handleApplyJson,
    handleLoadFromSection,
    handleSpacersChange,
  };
}

export default useCustomBlockForm;
