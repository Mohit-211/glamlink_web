// Main component
export { CondensedCardEditor, default } from './CondensedCardEditor';

// Types
export type {
  EditorMode,
  LayoutPresetMode,
  AddableSectionInfo,
  CondensedCardEditorProps,
} from './types';
export {
  ADMIN_MODE_DEFAULTS,
  PROFILE_MODE_DEFAULTS,
  getModeDefaults,
} from './types';

// Layout preset selector
export { LayoutPresetSelector } from './LayoutPresetSelector';
export type { LayoutPresetSelectorProps, LayoutPresetSelectorMode } from './LayoutPresetSelector';

// Layout presets hook
export { useLayoutPresets } from './useLayoutPresets';
export type { UseLayoutPresetsReturn } from './useLayoutPresets';

// Inner section props editor
export { InnerSectionPropsEditor } from './InnerSectionPropsEditor';
export type { InnerSectionPropsEditorProps } from './InnerSectionPropsEditor';

// Section props config
export { SECTION_PROPS_CONFIG } from '@/lib/features/digital-cards/config/sectionPropsConfig';
export type { UnifiedPropField as PropFieldConfig } from '@/lib/features/digital-cards/config/sectionPropsConfig';

// Util components (SectionGroup, dialogs, etc.)
export {
  SectionGroup,
  ConfirmDialog,
  LoadPresetConfirmDialog,
  ResetConfirmDialog,
  AddableSectionRow,
  DimensionPresetSelector,
  InfoBox,
} from './util';
export type {
  SectionGroupProps,
  ConfirmDialogProps,
  ConfirmDialogVariant,
  LoadPresetConfirmDialogProps,
  ResetConfirmDialogProps,
  AddableSectionInfo as UtilAddableSectionInfo,
  AddableSectionRowProps,
  DimensionPresetSelectorProps,
  InfoBoxProps,
} from './util';
