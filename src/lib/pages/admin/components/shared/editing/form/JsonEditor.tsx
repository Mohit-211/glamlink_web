'use client';

import React from 'react';
import { Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useFormContext } from './FormProvider';
import { useJsonEditor } from './useJsonEditor';
import type { JsonEditorProps } from '../types';

/**
 * JsonEditor - Raw JSON editing mode for forms
 *
 * Key features:
 * - Shows current form data as formatted JSON
 * - Validates JSON before applying
 * - Syncs with form context
 * - Copy to clipboard functionality
 * - Supports field filtering for custom tabs
 */
export function JsonEditor<T extends Record<string, any> = Record<string, any>>({
  onApply,
  entityType,
  fields,
}: JsonEditorProps<T>) {
  const { formData } = useFormContext<T>();

  const {
    jsonText,
    parseError,
    copied,
    handleChange,
    handleApply,
    handleCopy,
    handleFormat,
    handleReset,
  } = useJsonEditor({ formData, fields, onApply });

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Edit the JSON data directly. Changes will be applied when you click "Apply JSON".
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            title="Format JSON"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Reset to form data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error display */}
      {parseError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Invalid JSON</p>
            <p className="text-xs text-red-600 mt-0.5 font-mono">{parseError}</p>
          </div>
        </div>
      )}

      {/* JSON textarea */}
      <textarea
        value={jsonText}
        onChange={handleChange}
        className={`w-full h-96 px-4 py-3 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 resize-y ${
          parseError
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
        placeholder="Enter JSON data..."
        spellCheck={false}
      />

      {/* Apply button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleApply}
          disabled={!!parseError}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Apply JSON
        </button>
      </div>

      {/* Help text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Tips:</strong>
        </p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>JSON is validated in real-time as you type</li>
          <li>Use the "Format" button to prettify the JSON</li>
          <li>Click "Apply JSON" to update the form fields</li>
          <li>Switch back to Form tab to see your changes</li>
        </ul>
      </div>
    </div>
  );
}

export default JsonEditor;
