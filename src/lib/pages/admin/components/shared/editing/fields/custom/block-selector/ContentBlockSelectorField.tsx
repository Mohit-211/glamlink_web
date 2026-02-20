'use client';

/**
 * ContentBlockSelectorField - Form field wrapper for ContentBlockSelector
 *
 * This field type allows users to select or create content blocks
 * from the web preview system for use in digital page layouts.
 *
 * Supports props-based configuration via field.config.blockSelectorConfig
 * or form context.blockSelectorConfig for custom component registries.
 */

import React, { memo } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { BaseField } from '@/lib/pages/admin/components/shared/editing/fields/BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import { ContentBlockSelector } from './ContentBlockSelector';
import type { DigitalContentBlock, BlockSelectorConfig } from './types';

interface ContentBlockSelectorFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * ContentBlockSelectorFieldComponent - Wraps ContentBlockSelector with form context
 *
 * Integrates the ContentBlockSelector component with the form system by:
 * - Getting the current value from form context
 * - Updating form state when block selection changes
 * - Passing issueId from field config if available
 * - Supporting custom BlockSelectorConfig via field.config or form context
 */
function ContentBlockSelectorFieldComponent({
  field,
  error,
}: ContentBlockSelectorFieldProps) {
  const { getFieldValue, updateField, context } = useFormContext();

  // Get the current block value
  const value = getFieldValue(field.name) as DigitalContentBlock | null;

  // Get issueId from FormProvider context
  const issueId = context?.issueId as string | undefined;

  // Get custom config from field.config or form context
  // Allows different consumers to use different component registries
  const config = (field.config?.blockSelectorConfig || context?.blockSelectorConfig) as BlockSelectorConfig | undefined;

  const handleChange = (block: DigitalContentBlock | null) => {
    updateField(field.name, block);
  };

  return (
    <BaseField field={field} error={error}>
      <ContentBlockSelector
        issueId={issueId}
        selectedBlock={value}
        onChange={handleChange}
        config={config}
      />
    </BaseField>
  );
}

// Memoize to prevent unnecessary re-renders
export const ContentBlockSelectorField = memo(
  ContentBlockSelectorFieldComponent,
  (prev, next) => {
    return prev.field === next.field && prev.error === next.error;
  }
);

export default ContentBlockSelectorField;
