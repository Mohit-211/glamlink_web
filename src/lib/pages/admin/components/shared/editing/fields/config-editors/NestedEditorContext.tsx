'use client';

/**
 * NestedEditorContext
 *
 * Provides shared state management for nested form config editors.
 * Manages expanded states for sections/fields and JSON editor modal state.
 *
 * @example
 * ```tsx
 * <NestedEditorProvider>
 *   <FormConfigEditor config={config} onChange={setConfig} />
 * </NestedEditorProvider>
 * ```
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type JsonEditorTargetType = 'config' | 'section' | 'field';

export interface JsonEditorTarget {
  type: JsonEditorTargetType;
  id?: string;
  parentId?: string; // For fields, this is the section ID
  data: any;
}

export interface NestedEditorContextValue {
  // Expanded state management
  expandedSections: Set<string>;
  expandedFields: Set<string>;
  toggleSection: (sectionId: string) => void;
  toggleField: (fieldId: string) => void;
  expandSection: (sectionId: string) => void;
  collapseSection: (sectionId: string) => void;
  expandField: (fieldId: string) => void;
  collapseField: (fieldId: string) => void;
  collapseAll: () => void;
  expandAllSections: (sectionIds: string[]) => void;

  // JSON editor modal state
  jsonEditorTarget: JsonEditorTarget | null;
  isJsonEditorOpen: boolean;
  openJsonEditor: (target: JsonEditorTarget) => void;
  closeJsonEditor: () => void;

  // Callbacks for applying JSON changes (set by consumer)
  onApplyJsonChanges: ((data: any, target: JsonEditorTarget) => void) | null;
  setOnApplyJsonChanges: (callback: (data: any, target: JsonEditorTarget) => void) => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const NestedEditorContext = createContext<NestedEditorContextValue | null>(null);

// =============================================================================
// HOOK
// =============================================================================

export function useNestedEditorContext(): NestedEditorContextValue {
  const context = useContext(NestedEditorContext);
  if (!context) {
    throw new Error('useNestedEditorContext must be used within a NestedEditorProvider');
  }
  return context;
}

// Optional hook that doesn't throw (for optional usage)
export function useNestedEditorContextOptional(): NestedEditorContextValue | null {
  return useContext(NestedEditorContext);
}

// =============================================================================
// PROVIDER
// =============================================================================

interface NestedEditorProviderProps {
  children: ReactNode;
  initialExpandedSections?: string[];
  initialExpandedFields?: string[];
}

export function NestedEditorProvider({
  children,
  initialExpandedSections = [],
  initialExpandedFields = [],
}: NestedEditorProviderProps) {
  // Expanded state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(initialExpandedSections)
  );
  const [expandedFields, setExpandedFields] = useState<Set<string>>(
    new Set(initialExpandedFields)
  );

  // JSON editor state
  const [jsonEditorTarget, setJsonEditorTarget] = useState<JsonEditorTarget | null>(null);
  const [onApplyJsonChanges, setOnApplyJsonChangesState] = useState<
    ((data: any, target: JsonEditorTarget) => void) | null
  >(null);

  // Section toggle handlers
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => new Set([...prev, sectionId]));
  }, []);

  const collapseSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
  }, []);

  const expandAllSections = useCallback((sectionIds: string[]) => {
    setExpandedSections(new Set(sectionIds));
  }, []);

  // Field toggle handlers
  const toggleField = useCallback((fieldId: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  }, []);

  const expandField = useCallback((fieldId: string) => {
    setExpandedFields((prev) => new Set([...prev, fieldId]));
  }, []);

  const collapseField = useCallback((fieldId: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      next.delete(fieldId);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
    setExpandedFields(new Set());
  }, []);

  // JSON editor handlers
  const openJsonEditor = useCallback((target: JsonEditorTarget) => {
    setJsonEditorTarget(target);
  }, []);

  const closeJsonEditor = useCallback(() => {
    setJsonEditorTarget(null);
  }, []);

  const setOnApplyJsonChanges = useCallback(
    (callback: (data: any, target: JsonEditorTarget) => void) => {
      setOnApplyJsonChangesState(() => callback);
    },
    []
  );

  const value: NestedEditorContextValue = {
    // Expanded state
    expandedSections,
    expandedFields,
    toggleSection,
    toggleField,
    expandSection,
    collapseSection,
    expandField,
    collapseField,
    collapseAll,
    expandAllSections,

    // JSON editor
    jsonEditorTarget,
    isJsonEditorOpen: jsonEditorTarget !== null,
    openJsonEditor,
    closeJsonEditor,
    onApplyJsonChanges,
    setOnApplyJsonChanges,
  };

  return (
    <NestedEditorContext.Provider value={value}>
      {children}
    </NestedEditorContext.Provider>
  );
}

export default NestedEditorProvider;
