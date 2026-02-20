'use client';

/**
 * useBlockEditorModal Hook
 * Manages state and logic for the BlockEditorPreviewModal
 *
 * Accepts optional config for customizing component discovery and defaults.
 */

import { useMemo, useCallback } from 'react';
import { DEFAULT_BLOCK_SELECTOR_CONFIG } from '../defaultConfig';
import { generateBlockId } from '../helpers';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type {
  BlockTypeOption,
  DigitalContentBlock,
  UseBlockEditorModalReturn,
  BlockSelectorConfig,
  ContentComponentInfo,
} from '../types';

// =============================================================================
// FIELD TYPE MAPPING
// =============================================================================

/**
 * Field definition from content-discovery
 */
interface FieldDefinition {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  itemType?: string;
  maxItems?: number;
  minItems?: number;
  fields?: FieldDefinition[];
  objectFields?: FieldDefinition[];
  rows?: number;
  defaultValue?: any;
}

/**
 * Map content-discovery field types to FormRenderer field types
 */
function mapFieldType(fieldDef: FieldDefinition): string {
  const typeMap: Record<string, string> = {
    'text': 'text',
    'textarea': 'textarea',
    'select': 'select',
    'checkbox': 'checkbox',
    'number': 'number',
    'date': 'date',
    'url': 'url',
    'image': 'image',
    'video': 'video',
    'array': 'array',
    'richtext': 'html',
    'link-action': 'link-action',
    'background-color': 'backgroundColor',
    'typography-group': 'text', // Typography groups rendered as JSON for now
    'object': 'textarea', // Complex objects as JSON
    'time': 'text', // Time input as text
    'icon-select': 'text', // Icon select as text
  };

  return typeMap[fieldDef.type] || 'text';
}

/**
 * Convert a FieldDefinition from content-discovery to FieldConfig for FormRenderer
 */
function convertFieldDefinition(fieldDef: FieldDefinition): FieldConfig {
  const baseConfig: FieldConfig = {
    name: fieldDef.name,
    label: fieldDef.label,
    type: mapFieldType(fieldDef) as any, // Dynamic mapping may include custom types
    required: fieldDef.required,
    placeholder: fieldDef.placeholder,
    helperText: fieldDef.helperText,
    disabled: fieldDef.disabled,
  };

  // Handle select options
  if (fieldDef.options) {
    baseConfig.options = fieldDef.options;
  }

  // Handle array fields
  if (fieldDef.type === 'array') {
    baseConfig.itemType = (fieldDef.itemType as 'text' | 'number') || 'text';
    baseConfig.maxItems = fieldDef.maxItems;
    baseConfig.minItems = fieldDef.minItems;

    // Convert object fields for array items
    if (fieldDef.fields || fieldDef.objectFields) {
      baseConfig.objectFields = (fieldDef.fields || fieldDef.objectFields)?.map(convertFieldDefinition);
    }
  }

  // Handle textarea rows
  if (fieldDef.rows) {
    baseConfig.rows = fieldDef.rows;
  }

  return baseConfig;
}

// =============================================================================
// HOOK
// =============================================================================

interface UseBlockEditorModalParams {
  blockType: BlockTypeOption | null;
  onSave: (block: DigitalContentBlock) => void;
  config?: BlockSelectorConfig;
}

/**
 * Hook for managing the block editor modal state
 */
export function useBlockEditorModal({
  blockType,
  onSave,
  config,
}: UseBlockEditorModalParams): UseBlockEditorModalReturn {
  // Use provided config or default
  const contentComponents = config?.contentComponents || DEFAULT_BLOCK_SELECTOR_CONFIG.contentComponents;
  const getComponentDefaults = config?.getComponentDefaults || DEFAULT_BLOCK_SELECTOR_CONFIG.getComponentDefaults;

  // Get the component info from content discovery
  const componentInfo = useMemo(() => {
    if (!blockType) return null;
    return contentComponents.find(
      (c: ContentComponentInfo) => c.name === blockType.name && c.category === blockType.category
    );
  }, [blockType, contentComponents]);

  // Convert propFields to FieldConfig array
  const fields = useMemo((): FieldConfig[] => {
    if (!componentInfo?.propFields) return [];
    return componentInfo.propFields.map((field: any) => convertFieldDefinition(field as FieldDefinition));
  }, [componentInfo]);

  // Get default data for the form
  const defaultData = useMemo((): Record<string, any> => {
    if (!blockType) return {};

    // Try component defaults first
    if (getComponentDefaults) {
      const defaults = getComponentDefaults(blockType.name, blockType.category);
      if (Object.keys(defaults).length > 0) {
        return defaults;
      }
    }

    // Fall back to generating from field definitions
    if (!componentInfo?.propFields) return {};

    const data: Record<string, any> = {};
    componentInfo.propFields.forEach((field: any) => {
      if (field.defaultValue !== undefined) {
        data[field.name] = field.defaultValue;
      } else if (field.type === 'array') {
        data[field.name] = [];
      } else if (field.type === 'checkbox') {
        data[field.name] = false;
      } else if (field.type === 'number') {
        data[field.name] = 0;
      } else if (field.type === 'typography-group') {
        data[field.name] = {};
      } else {
        data[field.name] = '';
      }
    });
    return data;
  }, [blockType, componentInfo, getComponentDefaults]);

  // Handle saving the block
  const handleSave = useCallback((formData: Record<string, any>) => {
    if (!blockType) return;

    const newBlock: DigitalContentBlock = {
      id: generateBlockId(),
      type: blockType.name,
      category: blockType.category,
      props: formData,
      enabled: true,
      order: 0,
    };

    onSave(newBlock);
  }, [blockType, onSave]);

  return {
    fields,
    defaultData,
    handleSave,
  };
}

export default useBlockEditorModal;
