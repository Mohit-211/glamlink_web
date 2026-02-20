'use client';

/**
 * CustomLayoutEditorField - Form field wrapper for CustomLayoutEditor
 *
 * This field type allows users to create and manage custom layout objects
 * (Text, Image, Spacer) with absolute positioning for the page-custom page type.
 */

import React, { memo } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { BaseField } from '@/lib/pages/admin/components/shared/editing/fields/BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { CustomObject } from '../types';
import CustomLayoutEditor from './CustomLayoutEditor';

interface CustomLayoutEditorFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * CustomLayoutEditorFieldComponent - Wraps CustomLayoutEditor with form context
 *
 * Integrates the CustomLayoutEditor component with the form system by:
 * - Getting the current objects array from form context
 * - Updating form state when objects change
 */
function CustomLayoutEditorFieldComponent({
  field,
  error,
}: CustomLayoutEditorFieldProps) {
  const { getFieldValue, updateField, context } = useFormContext();

  // Get the current objects array
  const objects = (getFieldValue(field.name) as CustomObject[]) || [];

  // Get pdfSettings, issueId, and availablePages from context
  const pdfSettings = context?.pdfSettings;
  const issueId = context?.issueId;
  const availablePages = context?.availablePages;

  const handleChange = (updatedObjects: CustomObject[]) => {
    updateField(field.name, updatedObjects);
  };

  return (
    <BaseField field={field} error={error}>
      <CustomLayoutEditor
        objects={objects}
        onChange={handleChange}
        pdfSettings={pdfSettings}
        issueId={issueId}
        availablePages={availablePages}
      />
    </BaseField>
  );
}

// Memoize to prevent unnecessary re-renders
export const CustomLayoutEditorField = memo(
  CustomLayoutEditorFieldComponent,
  (prev, next) => {
    return prev.field === next.field && prev.error === next.error;
  }
);

export default CustomLayoutEditorField;
