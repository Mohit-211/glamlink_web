'use client';

/**
 * Types for the unified CondensedCardEditor component
 *
 * The component supports two modes:
 * - 'admin': Full feature set (dimensions, presets, styling, preview)
 * - 'profile': Simplified view (readonly presets, no dimensions, no styling)
 */

import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type {
  CondensedCardConfig,
  CondensedCardSectionInstance,
  CondensedCardDimensions,
  CondensedCardDimensionPreset,
} from '@/lib/features/digital-cards/types/condensedCardConfig';

// =============================================================================
// TYPES
// =============================================================================

export type EditorMode = 'admin' | 'profile';
export type LayoutPresetMode = 'full' | 'readonly' | 'hidden';

export interface AddableSectionInfo {
  sectionId: string;
  label: string;
  innerSectionType: string;
}

export interface CondensedCardEditorProps {
  // =========================================================================
  // Core Data
  // =========================================================================

  /** Current configuration */
  config: CondensedCardConfig;

  /** Professional data for context */
  professional?: Professional;

  // =========================================================================
  // Mode Configuration
  // =========================================================================

  /**
   * Editor mode - sets sensible defaults for all feature flags
   * - 'admin': Full feature set (dimensions, presets, styling, preview)
   * - 'profile': Simplified view (readonly presets, no dimensions, no styling)
   * @default 'admin'
   */
  mode?: EditorMode;

  // =========================================================================
  // Feature Flags (override mode defaults)
  // =========================================================================

  /** Show page dimensions selector (admin: true, profile: false) */
  showDimensions?: boolean;

  /** Layout preset mode: 'full' (CRUD), 'readonly' (load only), 'hidden' */
  layoutPresetMode?: LayoutPresetMode;

  /** Show styling section group (admin: true, profile: false) */
  showStylingSection?: boolean;

  /** Show generate preview button (admin: true, profile: false) */
  showGeneratePreview?: boolean;

  /** Show info box with instructions (admin: false, profile: true) */
  showInfoBox?: boolean;

  /** Use reset confirmation dialog instead of direct buttons */
  useResetDialog?: boolean;

  // =========================================================================
  // SectionEditor Feature Flags
  // =========================================================================

  /** Show visibility toggle in section editor */
  showSectionVisibilityToggle?: boolean;

  /** Show remove button in section editor (admin: true, profile: false) */
  showSectionRemoveButton?: boolean;

  /** Show custom layout sections in section editor */
  showSectionCustomLayouts?: boolean;

  /** Hide section styling (background, border, padding) in section editor */
  hideSectionStyling?: boolean;

  /** Show editing highlight ring around active section */
  showEditingHighlight?: boolean;

  /** Use column-based layout editor with drag-and-drop (admin: true, profile: false by default) */
  useColumnLayout?: boolean;

  // =========================================================================
  // Data for Profile Mode
  // =========================================================================

  /** List of sections that can be added (used by profile mode) */
  addableSections?: AddableSectionInfo[];

  /** ID of the newly added section (for cancel button) */
  newlyAddedSectionId?: string | null;

  // =========================================================================
  // Dimension Handlers (admin mode)
  // =========================================================================

  /** Handler for preset change */
  onPresetChange?: (preset: CondensedCardDimensionPreset) => void;

  /** Handler for dimension change */
  onDimensionsChange?: (dimensions: Partial<CondensedCardDimensions>) => void;

  // =========================================================================
  // Section Handlers
  // =========================================================================

  /** Handler for section changes */
  onSectionChange: (sectionId: string, updates: Partial<CondensedCardSectionInstance>) => void;

  /** Handler for removing a section (admin mode) */
  onRemoveSection?: (sectionId: string) => void;

  /** Handler for setting all sections (from preset load) */
  onSetSections: (sections: CondensedCardSectionInstance[]) => void;

  /** Handler for adding a section from addable list */
  onAddSection?: (sectionId: string) => void;

  /** Handler for canceling a newly added section */
  onCancelAdd?: (sectionId: string) => void;

  // =========================================================================
  // Position Editing Handlers
  // =========================================================================

  /** Handler when user clicks "Update Position + Size" button */
  onEditSectionPosition?: (sectionId: string) => void;

  /** Handler when user clicks "Save Position" button */
  onSavePosition?: () => void;

  // =========================================================================
  // Reset Handlers
  // =========================================================================

  /** Handler for reset all to defaults */
  onResetToDefaults?: () => void;

  /** Handler for reset content sections only */
  onResetContentSections?: () => void;

  /** Handler for showing reset dialog (profile mode) */
  onShowResetDialog?: () => void;

  // =========================================================================
  // Preview Handlers (admin mode)
  // =========================================================================

  /** Handler for generating preview */
  onGeneratePreview?: () => void;

  /** Whether preview is being generated */
  isGenerating?: boolean;

  /** Preview error message */
  previewError?: string | null;

  // =========================================================================
  // Move Sections Mode (profile mode)
  // =========================================================================

  /** Whether move sections mode is active */
  moveSectionsMode?: boolean;

  /** Callback to enter move sections mode */
  onEnterMoveMode?: () => void;

  /** Callback to exit move sections mode */
  onExitMoveMode?: () => void;

  // =========================================================================
  // Other
  // =========================================================================

  /** Whether the editor is disabled */
  disabled?: boolean;

  /** ID of the currently active section in edit mode */
  activeSectionId?: string | null;
}

// =============================================================================
// MODE DEFAULTS
// =============================================================================

export const ADMIN_MODE_DEFAULTS: Partial<CondensedCardEditorProps> = {
  showDimensions: true,
  layoutPresetMode: 'full',
  showStylingSection: true,
  showGeneratePreview: true,
  showInfoBox: false,
  useResetDialog: false,
  showSectionVisibilityToggle: true,
  showSectionRemoveButton: true,
  showSectionCustomLayouts: true,
  hideSectionStyling: false,
  showEditingHighlight: false,
  useColumnLayout: true,
};

export const PROFILE_MODE_DEFAULTS: Partial<CondensedCardEditorProps> = {
  showDimensions: false,
  layoutPresetMode: 'readonly',
  showStylingSection: false,
  showGeneratePreview: false,
  showInfoBox: true,
  useResetDialog: true,
  showSectionVisibilityToggle: false,
  showSectionRemoveButton: false,
  showSectionCustomLayouts: false,
  hideSectionStyling: true,
  showEditingHighlight: true,
  useColumnLayout: false,
};

/**
 * Get mode defaults for a given editor mode
 */
export function getModeDefaults(mode: EditorMode): Partial<CondensedCardEditorProps> {
  return mode === 'profile' ? PROFILE_MODE_DEFAULTS : ADMIN_MODE_DEFAULTS;
}
