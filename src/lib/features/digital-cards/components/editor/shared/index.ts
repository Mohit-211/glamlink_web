// =============================================================================
// DRAG POSITION CONTEXT
// =============================================================================
export {
  DragPositionProvider,
  useDragPosition,
  type DragPositionContextValue,
  type DragMode,
} from './DragPositionContext';

// =============================================================================
// CONDENSED CARD EDITOR (unified)
// =============================================================================
export { CondensedCardEditor } from './CondensedCardEditor';
export type {
  EditorMode,
  LayoutPresetMode,
  AddableSectionInfo as CondensedCardAddableSectionInfo,
  CondensedCardEditorProps,
} from './CondensedCardEditor';
export { ADMIN_MODE_DEFAULTS, PROFILE_MODE_DEFAULTS, getModeDefaults } from './CondensedCardEditor';

// InnerSectionPropsEditor - in CondensedCardEditor folder
export { InnerSectionPropsEditor, SECTION_PROPS_CONFIG } from './CondensedCardEditor';
export type { InnerSectionPropsEditorProps, PropFieldConfig } from './CondensedCardEditor';

// Layout preset selector - in CondensedCardEditor folder
export { LayoutPresetSelector, useLayoutPresets } from './CondensedCardEditor';
export type { LayoutPresetSelectorProps, LayoutPresetSelectorMode, UseLayoutPresetsReturn } from './CondensedCardEditor';

// Util components (SectionGroup, dialogs, etc.) - in CondensedCardEditor/util folder
export {
  SectionGroup,
  ConfirmDialog,
  LoadPresetConfirmDialog,
  ResetConfirmDialog,
  AddableSectionRow,
  DimensionPresetSelector,
  InfoBox,
} from './CondensedCardEditor';
export type {
  SectionGroupProps,
  ConfirmDialogProps,
  ConfirmDialogVariant,
  LoadPresetConfirmDialogProps,
  ResetConfirmDialogProps,
  AddableSectionRowProps,
  DimensionPresetSelectorProps,
  InfoBoxProps,
} from './CondensedCardEditor';
// Note: AddableSectionInfo exported as CondensedCardAddableSectionInfo above

// =============================================================================
// SECTION EDITOR (unified)
// =============================================================================
export { SectionEditor } from './SectionEditor';
export type { SectionEditorProps } from './SectionEditor';

// Container props editors - in SectionEditor folder
export { ContentContainerPropsEditor } from './SectionEditor';
export type { ContentContainerPropsEditorProps } from './SectionEditor';

export { MapAndContentContainerPropsEditor } from './SectionEditor';
export type { MapAndContentContainerPropsEditorProps } from './SectionEditor';

export { DropshadowContainerPropsEditor } from './SectionEditor';
export type { DropshadowContainerPropsEditorProps } from './SectionEditor';

// Section styling - in SectionEditor folder
export { SectionStylingEditor } from './SectionEditor';
export type { SectionStylingProps, SectionStylingEditorProps } from './SectionEditor';
