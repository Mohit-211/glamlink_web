import { useState, useMemo, useCallback } from 'react';
import { getComponentInfo, ContentComponentInfo, FieldDefinition } from './config/content-discovery';
import type { ContentBlock } from '../types';

interface UseBlockEditorParams {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface UseBlockEditorReturn {
  expanded: boolean;
  toggleExpand: () => void;
  componentInfo: ContentComponentInfo | undefined;
  displayFields: FieldDefinition[];
  handlePropChange: (propName: string, value: any) => void;
  handleToggleEnabled: () => void;
}

export function useBlockEditor({
  block,
  onUpdate,
  isExpanded = false,
  onToggleExpand,
}: UseBlockEditorParams): UseBlockEditorReturn {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const expanded = onToggleExpand ? isExpanded : localExpanded;
  const toggleExpand = onToggleExpand || (() => setLocalExpanded(!localExpanded));

  // Get component info from content-discovery
  const componentInfo = useMemo(() => {
    return getComponentInfo(block.type, block.category);
  }, [block.type, block.category]);

  // Handle prop update
  const handlePropChange = useCallback((propName: string, value: any) => {
    onUpdate({
      props: {
        ...block.props,
        [propName]: value,
      },
    });
  }, [onUpdate, block.props]);

  // Handle enable/disable toggle
  const handleToggleEnabled = useCallback(() => {
    onUpdate({ enabled: block.enabled === false ? true : false });
  }, [onUpdate, block.enabled]);

  // Filter out typography-group fields that are paired with text fields
  // They will be rendered inline with their paired text field
  const displayFields = useMemo(() => {
    if (!componentInfo) return [];

    // Get all field names for pairing detection
    const fieldNames = componentInfo.propFields.map(f => f.name);

    return componentInfo.propFields.filter(field => {
      // Filter out typography-group fields that have a paired text field
      if (field.type === 'typography-group') {
        // Check if this is a paired typography field (e.g., 'titleTypography' pairs with 'title')
        const baseName = field.name.replace(/Typography$/, '');
        const hasPairedTextField = fieldNames.includes(baseName);
        // Skip if paired - it will be rendered inline with the text field
        return !hasPairedTextField;
      }
      return true;
    });
  }, [componentInfo]);

  return {
    expanded,
    toggleExpand,
    componentInfo,
    displayFields,
    handlePropChange,
    handleToggleEnabled,
  };
}

export default useBlockEditor;
