'use client';

/**
 * ProfileCondensedCardEditor - Condensed Card Editor for Profile Users
 *
 * A thin wrapper around the unified CondensedCardEditor that uses profile mode.
 * This component handles the profile-specific state management via useProfileCondensedCard
 * and passes all the necessary handlers to the unified component.
 *
 * Features:
 * - All sections are listed by default (added + not-yet-added)
 * - Click "Add Section" next to any section to add it to the card
 * - New sections appear at default position (X: 6%, Y: 12%, W: 43%, H: 30%)
 * - Edit position/size via drag-to-edit
 * - Edit inner section options (font sizes, show/hide toggles, etc.)
 * - Reset Sections: Remove all content sections and start fresh
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { CondensedCardEditor } from '../shared/CondensedCardEditor';
import { ResetConfirmDialog } from '../shared';
import { useProfileCondensedCard } from './useProfileCondensedCard';
import { useDerivedSections } from './useDerivedSections';
import type { CondensedCardConfig, CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';
import type { ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';
import { DEFAULT_CONDENSED_CARD_CONFIG } from '@/lib/features/digital-cards/types/condensedCardConfig';
import { setConfig, setSections } from '@/lib/features/digital-cards/store';
import { useAppDispatch } from '../../../../../../../store/hooks';

// =============================================================================
// TYPES
// =============================================================================

export interface ProfileCondensedCardEditorProps {
  /** The professional data for preview context */
  professional?: Professional;
  /** Callback when a section is newly added (for entering edit mode) */
  onSectionAdded?: (sectionId: string) => void;
  /** Hide the Styling section group (default: true) */
  hideStylingSection?: boolean;
  /** Whether move sections mode is active */
  moveSectionsMode?: boolean;
  /** Callback to enter move sections mode */
  onEnterMoveMode?: () => void;
  /** Callback to exit move sections mode */
  onExitMoveMode?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProfileCondensedCardEditor({
  professional,
  onSectionAdded,
  hideStylingSection = true,
  moveSectionsMode = false,
  onEnterMoveMode,
  onExitMoveMode,
}: ProfileCondensedCardEditorProps) {
  const { getFieldValue, updateField } = useFormContext();
  const dispatch = useAppDispatch();

  // Get config for the unified component
  const condensedCardConfig = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;
  const sectionsConfig = getFieldValue('sectionsConfig') as ProfessionalSectionConfig[] | undefined;
  const config = condensedCardConfig || DEFAULT_CONDENSED_CARD_CONFIG;

  // Initialize Redux store from form data on mount
  useEffect(() => {
    if (condensedCardConfig) {
      dispatch(setConfig({
        sections: condensedCardConfig.sections || [],
        dimensions: condensedCardConfig.dimensions,
        styles: condensedCardConfig.styles,
      }));
    }
  }, []); // Only on mount

  // Handler for sections change (used by useDerivedSections)
  const handleSectionsChange = useCallback(
    (newSections: CondensedCardSectionInstance[]) => {
      updateField('condensedCardConfig', {
        ...config,
        sections: newSections,
      });
      // Also update Redux for live preview
      dispatch(setSections(newSections));
    },
    [config, updateField, dispatch]
  );

  // Use the derived sections hook directly for removeSection
  const {
    removeSection,
  } = useDerivedSections({
    condensedCardConfig,
    sectionsConfig,
    onSectionsChange: handleSectionsChange,
  });

  // Use the profile-specific hook for state management
  const {
    // State
    newlyAddedSectionId,
    showResetDialog,
    activeSectionId,

    // Derived data
    sections,
    addableSections,

    // Handlers
    handleAddSection: hookHandleAddSection,
    handleCancelAdd,
    handleSectionChange,
    handleEditSectionPosition,
    handleSavePosition,
    handleResetConfirm: hookHandleResetConfirm,
    setShowResetDialog,
  } = useProfileCondensedCard({ onSectionAdded });

  // Sync Redux whenever sections change (for live preview updates)
  // This ensures Add/Remove/Reset all update the preview immediately
  useEffect(() => {
    dispatch(setSections(sections));
  }, [sections, dispatch]);

  // Wrapper for handleAddSection that also updates Redux
  const handleAddSection = useCallback((sectionId: string) => {
    hookHandleAddSection(sectionId);
    // Redux will be updated via handleSectionsChange in useDerivedSections
  }, [hookHandleAddSection]);

  // Handler for removing a section (delete icon)
  const handleRemoveSection = useCallback((sectionId: string) => {
    removeSection(sectionId);
    // Redux is already updated via handleSectionsChange
  }, [removeSection]);

  // Wrapper for reset that also updates Redux
  const handleResetConfirm = useCallback(() => {
    hookHandleResetConfirm();
    // Redux is already updated via handleSectionsChange
  }, [hookHandleResetConfirm]);

  // Handler for setting all sections (from preset load)
  const handleSetSections = useCallback((newSections: CondensedCardSectionInstance[]) => {
    updateField('condensedCardConfig', {
      ...config,
      sections: newSections,
    });
    // Also update Redux for live preview
    dispatch(setSections(newSections));
  }, [config, updateField, dispatch]);

  return (
    <>
      {/* Unified Editor Component with profile mode */}
      <CondensedCardEditor
        mode="profile"
        config={{ ...config, sections }}
        professional={professional}
        // Profile-specific feature overrides
        showStylingSection={!hideStylingSection}
        // Enable column-based drag-and-drop layout
        useColumnLayout={true}
        // Data for profile mode
        addableSections={addableSections}
        newlyAddedSectionId={newlyAddedSectionId}
        // Section handlers
        onSectionChange={handleSectionChange}
        onSetSections={handleSetSections}
        onAddSection={handleAddSection}
        onCancelAdd={handleCancelAdd}
        onRemoveSection={handleRemoveSection}
        // Reset handler - uses dialog
        onResetContentSections={handleResetConfirm}
        onShowResetDialog={() => setShowResetDialog(true)}
        // Move sections mode
        moveSectionsMode={moveSectionsMode}
        onEnterMoveMode={onEnterMoveMode}
        onExitMoveMode={onExitMoveMode}
        // Other
        disabled={false}
      />

      {/* Reset Confirmation Dialog */}
      <ResetConfirmDialog
        isOpen={showResetDialog}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetDialog(false)}
      />
    </>
  );
}

export default ProfileCondensedCardEditor;
