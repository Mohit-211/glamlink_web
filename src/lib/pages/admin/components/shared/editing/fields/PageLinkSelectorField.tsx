'use client';

/**
 * PageLinkSelectorField - Dropdown selector for internal page links
 *
 * Used for TOC entries to select a target page from available pages in the issue.
 * Stores pageNumber (number) for PDF generation compatibility.
 */

import React, { memo, useMemo } from 'react';
import { useFormContext } from '../form/FormProvider';
import { BaseField, getInputClassName } from './BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface AvailablePage {
  id: string;
  pageNumber: number;
  title?: string;
  pageType: string;
}

interface PageLinkSelectorFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * PageLinkSelectorFieldComponent - Select dropdown for internal page links
 *
 * Key features:
 * - Reads availablePages from form context
 * - Displays pages as "Page X: Title" or "Page X: pageType"
 * - Stores pageNumber value (number) for PDF link compatibility
 * - Shows warning when no pages available
 */
function PageLinkSelectorFieldComponent({ field, error }: PageLinkSelectorFieldProps) {
  const { getFieldValue, updateField, validateField, context } = useFormContext();
  const value = getFieldValue(field.name) ?? '';
  const availablePages = (context?.availablePages || []) as AvailablePage[];

  // Sort pages by page number for consistent display
  const sortedPages = useMemo(() => {
    return [...availablePages].sort((a, b) => a.pageNumber - b.pageNumber);
  }, [availablePages]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Convert to number if value exists, otherwise empty string
    const newValue = e.target.value ? parseInt(e.target.value, 10) : '';
    updateField(field.name, newValue);
  };

  const handleBlur = () => {
    validateField(field.name);
  };

  return (
    <BaseField field={field} error={error}>
      <select
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={field.disabled}
        required={field.required}
        className={getInputClassName(!!error)}
      >
        <option value="">{field.placeholder || 'Select a page...'}</option>
        {sortedPages.map((page) => (
          <option key={page.id} value={page.pageNumber}>
            Page {page.pageNumber}: {page.title || page.pageType}
          </option>
        ))}
      </select>
      {sortedPages.length === 0 && (
        <p className="text-xs text-amber-600 mt-1">
          Save some pages first to link to them.
        </p>
      )}
    </BaseField>
  );
}

export const PageLinkSelectorField = memo(
  PageLinkSelectorFieldComponent,
  (prev, next) => {
    return prev.field === next.field && prev.error === next.error;
  }
);
