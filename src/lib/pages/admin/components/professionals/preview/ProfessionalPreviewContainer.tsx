'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { RefreshIcon } from '@/lib/pages/admin/components/shared/common';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing';
import { useDragPosition } from '@/lib/features/digital-cards/components/editor/shared/DragPositionContext';
import {
  useProfessionalPreviewContainer,
  type ProfessionalPreviewContainerProps,
} from './useDigitalBusinessCardPreview';
import type { CondensedCardConfig, CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';
import type { PositionConfig } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';

/**
 * ProfessionalPreviewContainer - Manages professional preview rendering with live form data
 *
 * Key features:
 * - Dropdown to select preview type (Professional Card, Digital Business Card)
 * - Real-time updates via useFormContext()
 * - Transforms Partial<Professional> data for preview components
 * - Refresh button to force re-render
 * - Drag-to-edit integration for Condensed Card preview
 */
export default function ProfessionalPreviewContainer({ previewComponents }: ProfessionalPreviewContainerProps) {
  const {
    selectedPreviewId,
    setSelectedPreviewId,
    refreshKey,
    transformedProfessional,
    PreviewComponent,
    handleRefresh,
    handleProfessionalUpdate,
  } = useProfessionalPreviewContainer(previewComponents);

  // Get drag position context for edit mode
  const {
    activeSectionId,
    previewPosition,
    cancelEditMode,
  } = useDragPosition();

  // Get form context to update the config when position is saved
  const { getFieldValue, updateField } = useFormContext();

  // Handle saving the position from the drag overlay
  const handleSavePosition = useCallback((newPosition: PositionConfig) => {
    console.log('[SavePosition] Called with:', { activeSectionId, newPosition });

    if (!activeSectionId) {
      console.warn('[SavePosition] No activeSectionId, aborting');
      return;
    }

    // Get current condensed card config
    const config = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;
    console.log('[SavePosition] Current config:', config);

    if (!config?.sections) {
      console.warn('[SavePosition] No config or sections, aborting');
      return;
    }

    // Update the section's position in the config
    const updatedSections = config.sections.map((section: CondensedCardSectionInstance) =>
      section.id === activeSectionId
        ? { ...section, position: newPosition }
        : section
    );

    console.log('[SavePosition] Updated sections:', updatedSections);

    // Update the form field
    updateField('condensedCardConfig', {
      ...config,
      sections: updatedSections,
    });

    console.log('[SavePosition] Form field updated');

    // Close edit mode
    cancelEditMode();

    // Refresh the preview
    handleRefresh();
  }, [activeSectionId, getFieldValue, updateField, cancelEditMode, handleRefresh]);

  // Handle cancel from the drag overlay
  const handleCancelEdit = useCallback(() => {
    cancelEditMode();
  }, [cancelEditMode]);

  // Handle real-time position changes during drag
  // This updates the form field so position values update in the editor
  const handlePositionChange = useCallback((newPosition: PositionConfig) => {
    if (!activeSectionId) return;

    // Get current condensed card config
    const config = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;
    if (!config?.sections) return;

    // Update the section's position in the config
    const updatedSections = config.sections.map((section: CondensedCardSectionInstance) =>
      section.id === activeSectionId
        ? { ...section, position: newPosition }
        : section
    );

    // Update the form field with the new position (real-time update)
    updateField('condensedCardConfig', {
      ...config,
      sections: updatedSections,
    });
  }, [activeSectionId, getFieldValue, updateField]);

  // Check if this is the condensed card preview (to pass edit props)
  const isCondensedCardPreview = selectedPreviewId === 'condensed-card';

  // Track previous activeSectionId to detect when edit mode is entered
  const prevActiveSectionIdRef = useRef<string | null>(null);

  // Auto-switch to "Access Card Image" preview when entering edit mode
  useEffect(() => {
    const prevActiveSectionId = prevActiveSectionIdRef.current;
    prevActiveSectionIdRef.current = activeSectionId;

    // If we're entering edit mode (activeSectionId changed from null to a value)
    // and not already on condensed-card preview, switch to it
    if (activeSectionId && !prevActiveSectionId && selectedPreviewId !== 'condensed-card') {
      console.log('[ProfessionalPreviewContainer] Auto-switching to Access Card Image for position editing');
      setSelectedPreviewId('condensed-card');
    }
  }, [activeSectionId, selectedPreviewId, setSelectedPreviewId]);

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <label htmlFor="preview-select" className="text-sm font-medium text-gray-700">
          Preview:
        </label>
        <select
          id="preview-select"
          value={selectedPreviewId}
          onChange={(e) => setSelectedPreviewId(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {previewComponents.map((preview) => (
            <option key={preview.id} value={preview.id}>
              {preview.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Refresh preview"
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="bg-gray-50 rounded-lg overflow-auto max-h-[calc(90vh-16rem)]">
        {/* Fixed width container for Digital Business Card preview (1000px min/max) */}
        <div
          style={{
            minWidth: selectedPreviewId === 'digital-card' ? '1000px' : undefined,
            maxWidth: selectedPreviewId === 'digital-card' ? '1000px' : undefined,
            margin: selectedPreviewId === 'digital-card' ? '0 auto' : undefined,
          }}
        >
          {PreviewComponent && (
            <PreviewComponent
              key={refreshKey}
              professional={transformedProfessional}
              onProfessionalUpdate={handleProfessionalUpdate}
              // Pass edit mode props for condensed card preview
              {...(isCondensedCardPreview && {
                editingSectionId: activeSectionId,
                editingPosition: previewPosition,
                onSavePosition: handleSavePosition,
                onCancelEdit: handleCancelEdit,
                onPositionChange: handlePositionChange,
              })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
