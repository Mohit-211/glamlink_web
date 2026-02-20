/**
 * Digital Card Store
 *
 * Redux store for digital card configuration.
 * Single source of truth for both Access Card Page and Access Card Image.
 */

export {
  default as digitalCardConfigReducer,
  // Actions
  setConfig,
  updateSection,
  updateSectionProps,
  addSection,
  removeSection,
  setSections,
  setDimensions,
  setStyles,
  setHeaderGradient,
  resetConfig,
  markSaved,
  setLoading,
  // Selectors
  selectDigitalCardConfig,
  selectSections,
  selectDimensions,
  selectStyles,
  selectSectionById,
  selectSectionProps,
  selectInnerSectionType,
  selectPropsByInnerSectionType,
  selectIsDirty,
  selectIsLoading,
  // Constants
  STYLING_SECTION_TYPES,
  CONTENT_SECTION_TYPES,
  // Utility Functions
  isStylingSection,
  isContentSection,
  generateSectionInstanceId,
} from './digitalCardConfigSlice';

export type { DigitalCardConfigState } from './digitalCardConfigSlice';
