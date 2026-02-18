'use client';

import React, { useState, memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import TiptapEditor from './TiptapEditor';
import HtmlPreview from './HtmlPreview';
import { Eye, EyeOff } from 'lucide-react';

interface HtmlFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * HtmlField - Rich text editor with WYSIWYG editing and preview mode
 *
 * Key features:
 * - TipTap editor with formatting tools (bold, italic, lists, etc.)
 * - Font size selector (12px - 32px)
 * - Text color picker (16 presets + custom hex)
 * - Raw HTML editor modal
 * - Edit/Preview toggle
 * - No local state for value - uses form context directly
 */
function HtmlFieldComponent({ field, error }: HtmlFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const value = getFieldValue(field.name) ?? '';

  const handleChange = (newValue: string) => {
    updateField(field.name, newValue);
  };

  const handleBlur = () => {
    validateField(field.name);
  };

  // Get minHeight from field config or use default
  const minHeight = (field as any).minHeight || 150;
  const showPreview = (field as any).showPreview !== false; // Default to true
  // Get maxLength from field config for character count
  const maxLength = (field as any).maxLength || field.validation?.maxLength;
  const showCharCount = maxLength !== undefined;

  return (
    <BaseField field={field} error={error}>
      <div className="space-y-2">
        {showPreview && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isPreviewMode ? (
                <>
                  <EyeOff size={16} />
                  Edit
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Preview
                </>
              )}
            </button>
          </div>
        )}

        {isPreviewMode ? (
          <HtmlPreview
            content={value}
            className=""
          />
        ) : (
          <TiptapEditor
            value={value}
            onChange={handleChange}
            disabled={field.disabled}
            minHeight={minHeight}
            placeholder={field.placeholder || 'Start typing...'}
            maxLength={maxLength}
            showCharCount={showCharCount}
          />
        )}
      </div>
    </BaseField>
  );
}

// Memo compares field and error - re-renders only when field config or validation error changes
export const HtmlField = memo(HtmlFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});

// Export sub-components for direct use if needed
export { TiptapEditor, HtmlPreview };
export { StandaloneHtmlField } from './StandaloneHtmlField';

// Alias for backward compatibility
export const RichTextField = HtmlField;
