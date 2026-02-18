'use client';

import React, { memo } from 'react';
import { useFormContext } from '../../form/FormProvider';
import { BaseField, getInputClassName } from '../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface EditTokenFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * EditTokenField - Custom field for edit access tokens
 *
 * Features:
 * - Displays current token (read-only)
 * - "Generate Token" button to create new UUID
 * - "Copy" button to copy token to clipboard
 * - "Copy Edit Link" button to copy full edit URL
 */
function EditTokenFieldComponent({ field, error }: EditTokenFieldProps) {
  const { getFieldValue, updateField, formData } = useFormContext();
  const value = getFieldValue(field.name) || '';
  const [copied, setCopied] = React.useState<'token' | 'link' | null>(null);

  // Generate a UUID v4
  const generateToken = () => {
    const uuid = crypto.randomUUID();
    updateField(field.name, uuid);
  };

  // Copy token to clipboard
  const copyToken = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied('token');
    setTimeout(() => setCopied(null), 2000);
  };

  // Copy full edit link to clipboard
  const copyEditLink = async () => {
    if (!value) return;
    const cardUrl = formData.cardUrl || formData.id || '[id]';
    const baseUrl = window.location.origin;
    const editUrl = `${baseUrl}/for-professionals/${cardUrl}/edit?token=${value}`;
    await navigator.clipboard.writeText(editUrl);
    setCopied('link');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <BaseField field={field} error={error}>
      <div className="flex flex-col gap-2">
        {/* Token input (read-only) */}
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            readOnly
            placeholder="Click 'Generate Token' to create"
            className={`${getInputClassName(!!error)} flex-1 bg-gray-50 font-mono text-sm`}
          />
          {value && (
            <button
              type="button"
              onClick={copyToken}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
              title="Copy token"
            >
              {copied === 'token' ? '✓ Copied' : 'Copy'}
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={generateToken}
            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {value ? 'Regenerate Token' : 'Generate Token'}
          </button>

          {value && (
            <button
              type="button"
              onClick={copyEditLink}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
              {copied === 'link' ? '✓ Link Copied' : 'Copy Edit Link'}
            </button>
          )}
        </div>

        {/* Warning about regeneration */}
        {value && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Regenerating the token will invalidate any existing edit links shared with this professional.
          </p>
        )}
      </div>
    </BaseField>
  );
}

export const EditTokenField = memo(EditTokenFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});

export default EditTokenField;
