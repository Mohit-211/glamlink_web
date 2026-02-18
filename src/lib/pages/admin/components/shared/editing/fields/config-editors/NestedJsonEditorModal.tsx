'use client';

/**
 * NestedJsonEditorModal
 *
 * Modal component for editing form config/section/field as JSON.
 * Provides syntax highlighting, validation, and apply/cancel actions.
 *
 * @example
 * ```tsx
 * <NestedJsonEditorModal
 *   isOpen={isJsonEditorOpen}
 *   onClose={closeJsonEditor}
 *   target={jsonEditorTarget}
 *   onApply={handleApplyJson}
 * />
 * ```
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { X, Check, Copy, RotateCcw, AlertCircle } from 'lucide-react';
import type { JsonEditorTarget, JsonEditorTargetType } from './NestedEditorContext';

// =============================================================================
// TYPES
// =============================================================================

export interface NestedJsonEditorModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close the modal */
  onClose: () => void;
  /** The target being edited (config/section/field) */
  target: JsonEditorTarget | null;
  /** Apply the JSON changes */
  onApply: (data: any, target: JsonEditorTarget) => void;
  /** Custom validation function */
  validate?: (data: any, type: JsonEditorTargetType) => string | null;
}

// =============================================================================
// HELPERS
// =============================================================================

function getTitle(type: JsonEditorTargetType): string {
  switch (type) {
    case 'config':
      return 'Edit Form Configuration JSON';
    case 'section':
      return 'Edit Section JSON';
    case 'field':
      return 'Edit Field JSON';
    default:
      return 'Edit JSON';
  }
}

function getRequiredFields(type: JsonEditorTargetType): string[] {
  switch (type) {
    case 'config':
      return ['id', 'title'];
    case 'section':
      return ['id', 'title'];
    case 'field':
      return ['id', 'name', 'type', 'label'];
    default:
      return [];
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

function NestedJsonEditorModalComponent({
  isOpen,
  onClose,
  target,
  onApply,
  validate,
}: NestedJsonEditorModalProps) {
  const [jsonValue, setJsonValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize JSON when target changes
  useEffect(() => {
    if (target?.data) {
      setJsonValue(JSON.stringify(target.data, null, 2));
      setError(null);
    }
  }, [target]);

  // Format JSON
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonValue(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError('Invalid JSON syntax');
    }
  }, [jsonValue]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  }, [jsonValue]);

  // Reset to original
  const handleReset = useCallback(() => {
    if (target?.data) {
      setJsonValue(JSON.stringify(target.data, null, 2));
      setError(null);
    }
  }, [target]);

  // Validate and apply
  const handleApply = useCallback(() => {
    if (!target) return;

    try {
      const parsed = JSON.parse(jsonValue);

      // Check required fields
      const requiredFields = getRequiredFields(target.type);
      for (const field of requiredFields) {
        if (!parsed[field]) {
          setError(`Missing required field: ${field}`);
          return;
        }
      }

      // Custom validation
      if (validate) {
        const validationError = validate(parsed, target.type);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      onApply(parsed, target);
      onClose();
    } catch {
      setError('Invalid JSON syntax');
    }
  }, [jsonValue, target, validate, onApply, onClose]);

  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {getTitle(target.type)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-6 py-2 bg-gray-50 border-b border-gray-200">
          <button
            type="button"
            onClick={handleFormat}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <div className="flex-1" />
          <span className="text-xs text-gray-500">
            Required: {getRequiredFields(target.type).join(', ')}
          </span>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden p-4">
          <textarea
            value={jsonValue}
            onChange={(e) => {
              setJsonValue(e.target.value);
              setError(null);
            }}
            className={`w-full h-full min-h-[300px] font-mono text-sm p-4 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            spellCheck={false}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export const NestedJsonEditorModal = memo(NestedJsonEditorModalComponent);

export default NestedJsonEditorModal;
