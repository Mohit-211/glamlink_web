"use client";

import { BaseFieldProps } from './index';
import TiptapEditor from '@/lib/pages/admin/components/shared/editing/fields/html/TiptapEditor';

/**
 * TiptapField - Rich text editor field for apply forms
 *
 * Uses TiptapEditor to allow formatted text input including:
 * - Bold, italic, underline
 * - Lists (ordered and unordered)
 * - Multiple paragraphs
 */
export default function TiptapField({
  fieldKey,
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled
}: BaseFieldProps) {
  const handleChange = (htmlValue: string) => {
    onChange(fieldKey, htmlValue);
  };

  const handleBlur = () => {
    // Validate on blur if configured
    if (config.validation?.validateOnBlur && onBlur) {
      onBlur(fieldKey);
    }
  };

  const handleFocus = () => {
    // Clear error on focus if configured
    if (config.validation?.clearErrorOnFocus && onFocus) {
      onFocus(fieldKey);
    }
  };

  return (
    <div className="transition-all duration-200">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={error ? 'ring-1 ring-red-500 rounded-md' : ''}
        >
          <TiptapEditor
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            minHeight={config.rows ? config.rows * 24 : 100}
            placeholder={config.placeholder}
            showHtmlButton={false}
            maxLength={config.validation?.maxLength}
            showCharCount={config.validation?.maxLength !== undefined}
          />
        </div>

        {config.description && (
          <p className="text-sm text-gray-500">{config.description}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
