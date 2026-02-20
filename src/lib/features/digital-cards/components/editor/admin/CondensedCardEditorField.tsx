'use client';

/**
 * CondensedCardEditorField - Field wrapper for FormModal integration
 *
 * Wraps the unified CondensedCardEditor for use in the FormModal field registry.
 * Does NOT use BaseField wrapper as it renders its own complete UI.
 *
 * Features:
 * - Integrates with DragPositionContext for drag-to-edit mode
 * - Passes onEditSectionPosition callback to enable "Update Position + Size" button
 * - Uses useCondensedCardEditor hook for state management
 */

import React, { memo, useCallback } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing';
import { CondensedCardEditor } from '../shared/CondensedCardEditor';
import { useCondensedCardEditor } from './useCondensedCardEditor';
import { useDragPosition } from '../shared/DragPositionContext';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { CondensedCardConfig } from '@/lib/features/digital-cards/types/condensedCardConfig';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';

// =============================================================================
// TYPES
// =============================================================================

export interface CondensedCardEditorFieldProps {
  /** Field configuration */
  field: FieldConfig;
  /** Validation error (if any) */
  error?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

function CondensedCardEditorFieldComponent({ field, error }: CondensedCardEditorFieldProps) {
  const { getFieldValue, updateField, formData } = useFormContext();
  const { enterEditMode, activeSectionId, cancelEditMode } = useDragPosition();

  // Get current config value
  const initialConfig = getFieldValue(field.name) as CondensedCardConfig | undefined;

  // Get professional data from form context (if available)
  const professional = formData as Professional | undefined;

  // Handle config change - sync to form context
  const handleChange = useCallback((newConfig: CondensedCardConfig) => {
    updateField(field.name, newConfig);
  }, [field.name, updateField]);

  // Use the condensed card editor hook for state management
  const {
    config,
    isGeneratingPreview,
    previewError,
    addableSections,
    handlePresetChange,
    handleDimensionsChange,
    handleSectionChange,
    handleAddSection,
    handleRemoveSection,
    handleSetSections,
    generatePreview,
    resetToDefaults,
    resetContentSections,
  } = useCondensedCardEditor({
    initialConfig,
    onChange: handleChange,
    professional,
  });

  // Handle entering edit mode for a section
  const handleEditSectionPosition = useCallback((sectionId: string) => {
    console.log('[CondensedCardEditorField] handleEditSectionPosition called for:', sectionId);

    if (!config?.sections) {
      console.warn('[CondensedCardEditorField] No config.sections available');
      return;
    }

    const section = config.sections.find(s => s.id === sectionId);
    if (!section?.position) {
      console.warn(`[CondensedCardEditorField] Section ${sectionId} not found or has no position`);
      return;
    }

    console.log('[CondensedCardEditorField] Calling enterEditMode with position:', section.position);
    enterEditMode(sectionId, section.position);
  }, [config?.sections, enterEditMode]);

  // Handle saving position and exiting edit mode
  const handleSavePosition = useCallback(() => {
    console.log('[CondensedCardEditorField] handleSavePosition called');
    cancelEditMode();
  }, [cancelEditMode]);

  return (
    <div className="space-y-2">
      {/* Editor Component - using unified component with admin mode */}
      <CondensedCardEditor
        mode="admin"
        config={config}
        professional={professional}
        // Dimension handlers
        onPresetChange={handlePresetChange}
        onDimensionsChange={handleDimensionsChange}
        // Section handlers
        onSectionChange={handleSectionChange}
        onAddSection={handleAddSection}
        onRemoveSection={handleRemoveSection}
        onSetSections={handleSetSections}
        addableSections={addableSections}
        // Position editing
        onEditSectionPosition={handleEditSectionPosition}
        onSavePosition={handleSavePosition}
        activeSectionId={activeSectionId}
        // Reset handlers
        onResetToDefaults={resetToDefaults}
        onResetContentSections={resetContentSections}
        // Preview
        onGeneratePreview={generatePreview}
        isGenerating={isGeneratingPreview}
        previewError={previewError}
        // Other
        disabled={field.disabled}
      />

      {/* Error Display */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Memoize with field and error comparison
export const CondensedCardEditorField = memo(
  CondensedCardEditorFieldComponent,
  (prev, next) => prev.field === next.field && prev.error === next.error
);

export default CondensedCardEditorField;
