'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

// Configuration for useJsonEditor hook
export interface UseJsonEditorConfig<T = Record<string, any>> {
  formData: T;
  fields?: FieldConfig[];
  onApply: (data: T) => void;
}

// Return type for useJsonEditor hook
export interface UseJsonEditorReturn {
  // State
  jsonText: string;
  parseError: string | null;
  copied: boolean;
  displayData: Record<string, any>;

  // Handlers
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleApply: () => void;
  handleCopy: () => Promise<void>;
  handleFormat: () => void;
  handleReset: () => void;
}

/**
 * useJsonEditor - Hook for JSON editor functionality
 *
 * Handles:
 * - JSON text state and validation
 * - Field filtering for custom tabs
 * - Copy to clipboard
 * - Format/prettify
 * - Reset to form data
 */
export function useJsonEditor<T extends Record<string, any> = Record<string, any>>({
  formData,
  fields,
  onApply,
}: UseJsonEditorConfig<T>): UseJsonEditorReturn {
  // Filter data based on fields prop (for custom tabs)
  const displayData = useMemo(() => {
    if (!fields || fields.length === 0) {
      // No filtering - show all formData (backward compatible)
      return formData;
    }

    // Filter to only show fields in the active tab
    const filtered: Partial<T> = {};
    fields.forEach(field => {
      if (field.name in formData) {
        filtered[field.name as keyof T] = formData[field.name as keyof T];
      }
    });
    return filtered;
  }, [fields, formData]);

  // Local state for the JSON text
  const [jsonText, setJsonText] = useState(() => JSON.stringify(displayData, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync JSON text when display data changes (from form fields or tab switch)
  useEffect(() => {
    setJsonText(JSON.stringify(displayData, null, 2));
    setParseError(null);
  }, [displayData]);

  // Handle JSON text change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);

    // Validate JSON as user types
    try {
      JSON.parse(newText);
      setParseError(null);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }, []);

  // Handle apply button
  const handleApply = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setParseError(null);
      onApply(parsed as T);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }, [jsonText, onApply]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [jsonText]);

  // Handle format/prettify
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setParseError(null);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON - cannot format');
    }
  }, [jsonText]);

  // Handle reset to current display data (filtered or full)
  const handleReset = useCallback(() => {
    setJsonText(JSON.stringify(displayData, null, 2));
    setParseError(null);
  }, [displayData]);

  return {
    // State
    jsonText,
    parseError,
    copied,
    displayData,

    // Handlers
    handleChange,
    handleApply,
    handleCopy,
    handleFormat,
    handleReset,
  };
}
