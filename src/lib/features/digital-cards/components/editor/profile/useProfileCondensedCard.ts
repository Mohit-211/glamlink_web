'use client';

/**
 * useProfileCondensedCard - Hook for ProfileCondensedCardEditor state and logic
 *
 * Extracts all state management, callbacks, and effects from the main component
 * for better organization and testability.
 */

import { useCallback, useState, useEffect } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { useDragPosition } from '../shared/DragPositionContext';
import { useDerivedSections } from './useDerivedSections';
import { isStylingSection } from '@/lib/features/digital-cards/store';
import type { CondensedCardConfig, CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Determine which group a section belongs to
 */
export const getSectionGroup = (sectionType: string): 'styling' | 'content' => {
  if (isStylingSection(sectionType)) return 'styling';
  return 'content';
};

// =============================================================================
// TYPES
// =============================================================================

export interface UseProfileCondensedCardOptions {
  /** Callback when a section is newly added (for entering edit mode) */
  onSectionAdded?: (sectionId: string) => void;
}

export interface UseProfileCondensedCardReturn {
  // State
  newlyAddedSectionId: string | null;
  showResetDialog: boolean;
  activeSectionId: string | null;

  // Derived data
  sections: CondensedCardSectionInstance[];
  addableSections: Array<{ sectionId: string; label: string; innerSectionType: string }>;
  stylingSectionsList: CondensedCardSectionInstance[];
  contentSectionsList: CondensedCardSectionInstance[];
  hasSections: boolean;
  hasContentSections: boolean;

  // Handlers
  handleAddSection: (sectionId: string) => void;
  handleCancelAdd: (sectionId: string) => void;
  handleSectionChange: (sectionId: string, updates: Partial<CondensedCardSectionInstance>) => void;
  handleEditSectionPosition: (sectionId: string) => void;
  handleSavePosition: (sectionId: string) => void;
  handleResetConfirm: () => void;
  setShowResetDialog: (show: boolean) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useProfileCondensedCard(
  options: UseProfileCondensedCardOptions = {}
): UseProfileCondensedCardReturn {
  const { onSectionAdded } = options;
  const { getFieldValue, updateField } = useFormContext();

  // Get drag position context for "Update Position + Size" functionality
  const { enterEditMode, activeSectionId, cancelEditMode } = useDragPosition();

  // State for tracking newly added section and reset dialog
  const [newlyAddedSectionId, setNewlyAddedSectionId] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Get current condensed card config from form context
  const condensedCardConfig = getFieldValue('condensedCardConfig') as CondensedCardConfig | undefined;
  const sectionsConfig = getFieldValue('sectionsConfig');

  // Handle sections change
  const handleSectionsChange = useCallback(
    (sections: CondensedCardSectionInstance[]) => {
      updateField('condensedCardConfig', {
        ...condensedCardConfig,
        sections,
      });
    },
    [condensedCardConfig, updateField]
  );

  // Use the derived sections hook
  const {
    sections,
    addableSections,
    addSection,
    removeSection,
    updateSection,
    resetContentSections,
    hasSections,
    hasContentSections,
  } = useDerivedSections({
    condensedCardConfig,
    sectionsConfig,
    onSectionsChange: handleSectionsChange,
  });

  // Handle adding a section
  const handleAddSection = useCallback(
    (sectionId: string) => {
      const newSectionId = addSection(sectionId);
      if (newSectionId) {
        setNewlyAddedSectionId(newSectionId);
        onSectionAdded?.(newSectionId);
      }
    },
    [addSection, onSectionAdded]
  );

  // NOTE: Auto-enter edit mode is DISABLED for profile mode
  // Sections are now positioned via "Move Sections" mode which shows ALL sections at once
  // The user can drag/resize sections in move mode instead of editing one at a time
  // Clear newlyAddedSectionId after section is added (just for tracking purposes)
  useEffect(() => {
    if (newlyAddedSectionId) {
      // Just clear the newly added state after a short delay
      // Don't auto-enter edit mode - user will use "Move Sections" button instead
      const timer = setTimeout(() => {
        setNewlyAddedSectionId(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [newlyAddedSectionId]);

  // Handle canceling add (removes section)
  const handleCancelAdd = useCallback(
    (sectionId: string) => {
      console.log('[useProfileCondensedCard] Canceling add for section:', sectionId);
      removeSection(sectionId);
      setNewlyAddedSectionId(null);
      cancelEditMode();
    },
    [removeSection, cancelEditMode]
  );

  // Handle individual section update
  const handleSectionChange = useCallback(
    (sectionId: string, updates: Partial<CondensedCardSectionInstance>) => {
      updateSection(sectionId, updates);
    },
    [updateSection]
  );

  // Handle entering edit mode for a section's position
  const handleEditSectionPosition = useCallback(
    (sectionId: string) => {
      const section = sections.find(s => s.id === sectionId);
      if (!section?.position) {
        console.warn(`[useProfileCondensedCard] Section ${sectionId} not found or has no position`);
        return;
      }

      console.log('[useProfileCondensedCard] Entering edit mode for section:', sectionId);
      enterEditMode(sectionId, section.position);
    },
    [sections, enterEditMode]
  );

  // Handle saving position and exiting edit mode
  const handleSavePosition = useCallback(
    (sectionId: string) => {
      console.log('[useProfileCondensedCard] Saving position and exiting edit mode');
      // Clear newly added state if this was a new section
      if (newlyAddedSectionId === sectionId) {
        setNewlyAddedSectionId(null);
      }
      cancelEditMode();
    },
    [cancelEditMode, newlyAddedSectionId]
  );

  // Handle reset confirmation
  const handleResetConfirm = useCallback(() => {
    resetContentSections();
    setShowResetDialog(false);
    setNewlyAddedSectionId(null);
    cancelEditMode();
  }, [resetContentSections, cancelEditMode]);

  // Split sections into groups
  const stylingSectionsList = sections.filter(s => getSectionGroup(s.sectionType) === 'styling');
  const contentSectionsList = sections.filter(s => getSectionGroup(s.sectionType) === 'content');

  return {
    // State
    newlyAddedSectionId,
    showResetDialog,
    activeSectionId,

    // Derived data
    sections,
    addableSections,
    stylingSectionsList,
    contentSectionsList,
    hasSections,
    hasContentSections,

    // Handlers
    handleAddSection,
    handleCancelAdd,
    handleSectionChange,
    handleEditSectionPosition,
    handleSavePosition,
    handleResetConfirm,
    setShowResetDialog,
  };
}

export default useProfileCondensedCard;
