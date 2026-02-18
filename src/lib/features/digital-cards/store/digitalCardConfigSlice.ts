/**
 * Digital Card Configuration Redux Slice
 *
 * Single source of truth for digital card configuration.
 * Both Access Card Page and Access Card Image previews read from this store.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { CondensedCardSectionInstance } from '../types/sections';
import type { CondensedCardStyles, CondensedCardGradient } from '../types/styles';
import type { CondensedCardDimensions } from '../types/dimensions';
import { SECTION_PROPS_CONFIG } from '../config/sectionPropsConfig';

// =============================================================================
// STATE INTERFACE
// =============================================================================

export interface DigitalCardConfigState {
  sections: CondensedCardSectionInstance[];
  dimensions: CondensedCardDimensions;
  styles: CondensedCardStyles;
  isLoading: boolean;
  isDirty: boolean;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_DIMENSIONS: CondensedCardDimensions = {
  preset: 'instagram-portrait',
  width: 1080,
  height: 1350,
};

const DEFAULT_STYLES: CondensedCardStyles = {
  backgroundColor: '#ffffff',
  headerGradient: {
    from: '#22B8C8',
    to: '#8B5CF6',
    angle: 135,
  },
  padding: 0,
  borderRadius: 24,
};

const initialState: DigitalCardConfigState = {
  sections: [],
  dimensions: DEFAULT_DIMENSIONS,
  styles: DEFAULT_STYLES,
  isLoading: false,
  isDirty: false,
};

// =============================================================================
// SECTION TYPE CONSTANTS
// =============================================================================

/**
 * Section types that belong to the "Styling" group in the editor.
 * These are static sections defined by admin, not synced from Sections tab.
 */
export const STYLING_SECTION_TYPES = [
  'dropshadowContainer',
  'footer',
  'custom',
  'quick-actions-line',
] as const;

/**
 * Section types that belong to the "Content" group in the editor.
 * These are dynamically synced from the Sections tab.
 */
export const CONTENT_SECTION_TYPES = [
  'contentContainer',
  'mapAndContentContainer',
] as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a section type is a "Styling" type
 */
export function isStylingSection(sectionType: string): boolean {
  return STYLING_SECTION_TYPES.includes(sectionType as any);
}

/**
 * Check if a section type is a "Content" type
 */
export function isContentSection(sectionType: string): boolean {
  return CONTENT_SECTION_TYPES.includes(sectionType as any);
}

/**
 * Generate unique instance ID for a section
 */
export function generateSectionInstanceId(
  sectionType: string,
  existingSections: CondensedCardSectionInstance[]
): string {
  const existingCount = existingSections.filter(s => s.sectionType === sectionType).length;
  return `${sectionType}-${existingCount + 1}`;
}

/**
 * Get default props for a section type from SECTION_PROPS_CONFIG
 */
function getDefaultPropsForSection(sectionType: string): Record<string, any> {
  const config = SECTION_PROPS_CONFIG[sectionType];
  if (!config) return {};

  const defaults: Record<string, any> = {};
  for (const field of config) {
    if (field.defaultValue !== undefined) {
      defaults[field.key] = field.defaultValue;
    }
  }
  return defaults;
}

// =============================================================================
// SLICE
// =============================================================================

const digitalCardConfigSlice = createSlice({
  name: 'digitalCardConfig',
  initialState,
  reducers: {
    /**
     * Set the entire config (used on initial load)
     */
    setConfig: (state, action: PayloadAction<{
      sections?: CondensedCardSectionInstance[];
      dimensions?: CondensedCardDimensions;
      styles?: CondensedCardStyles;
    } | null>) => {
      if (!action.payload) {
        // Reset to defaults if null
        state.sections = [];
        state.dimensions = DEFAULT_DIMENSIONS;
        state.styles = DEFAULT_STYLES;
      } else {
        state.sections = action.payload.sections ?? [];
        state.dimensions = action.payload.dimensions ?? DEFAULT_DIMENSIONS;
        state.styles = action.payload.styles ?? DEFAULT_STYLES;
      }
      state.isDirty = false;
      state.isLoading = false;
    },

    /**
     * Update a specific section by ID
     */
    updateSection: (state, action: PayloadAction<{
      sectionId: string;
      updates: Partial<CondensedCardSectionInstance>;
    }>) => {
      const { sectionId, updates } = action.payload;
      const index = state.sections.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        state.sections[index] = { ...state.sections[index], ...updates };
        state.isDirty = true;
      }
    },

    /**
     * Update a section's props (innerSectionProps for wrapper sections)
     */
    updateSectionProps: (state, action: PayloadAction<{
      sectionId: string;
      props: Record<string, any>;
    }>) => {
      const { sectionId, props } = action.payload;
      const index = state.sections.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        const section = state.sections[index];
        // If this is a wrapper section (contentContainer, mapAndContentContainer),
        // update innerSectionProps. Otherwise update props directly.
        const isWrapper = section.sectionType === 'contentContainer' ||
                          section.sectionType === 'mapAndContentContainer';

        if (isWrapper) {
          state.sections[index] = {
            ...section,
            props: {
              ...section.props,
              innerSectionProps: {
                ...(section.props?.innerSectionProps || {}),
                ...props,
              },
            },
          };
        } else {
          state.sections[index] = {
            ...section,
            props: {
              ...section.props,
              ...props,
            },
          };
        }
        state.isDirty = true;
      }
    },

    /**
     * Add a new section
     */
    addSection: (state, action: PayloadAction<CondensedCardSectionInstance>) => {
      state.sections.push(action.payload);
      state.isDirty = true;
    },

    /**
     * Remove a section by ID
     */
    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter(s => s.id !== action.payload);
      state.isDirty = true;
    },

    /**
     * Set all sections (for reordering, bulk updates)
     */
    setSections: (state, action: PayloadAction<CondensedCardSectionInstance[]>) => {
      state.sections = action.payload;
      state.isDirty = true;
    },

    /**
     * Update dimensions
     */
    setDimensions: (state, action: PayloadAction<Partial<CondensedCardDimensions>>) => {
      state.dimensions = { ...state.dimensions, ...action.payload };
      state.isDirty = true;
    },

    /**
     * Update styles
     */
    setStyles: (state, action: PayloadAction<Partial<CondensedCardStyles>>) => {
      state.styles = { ...state.styles, ...action.payload };
      state.isDirty = true;
    },

    /**
     * Update header gradient
     */
    setHeaderGradient: (state, action: PayloadAction<Partial<CondensedCardGradient>>) => {
      state.styles.headerGradient = {
        ...state.styles.headerGradient,
        ...action.payload,
      };
      state.isDirty = true;
    },

    /**
     * Reset config to defaults with default section props
     */
    resetConfig: (state) => {
      state.sections = state.sections.map(section => {
        const innerSectionType = section.props?.innerSectionType || section.sectionType;
        const defaultProps = getDefaultPropsForSection(innerSectionType);

        return {
          ...section,
          props: {
            ...section.props,
            innerSectionProps: defaultProps,
          },
        };
      });
      state.isDirty = true;
    },

    /**
     * Mark config as saved (not dirty)
     */
    markSaved: (state) => {
      state.isDirty = false;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// =============================================================================
// ACTIONS
// =============================================================================

export const {
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
} = digitalCardConfigSlice.actions;

// =============================================================================
// SELECTORS
// =============================================================================

// Stable empty object reference to avoid creating new objects on each selector call
// This prevents the "Selector returned a different result" warning
const EMPTY_PROPS: Record<string, any> = {};

/**
 * Select the entire digital card config
 */
export const selectDigitalCardConfig = (state: RootState) => state.digitalCardConfig;

/**
 * Select all sections
 */
export const selectSections = (state: RootState) => state.digitalCardConfig.sections;

/**
 * Select dimensions
 */
export const selectDimensions = (state: RootState) => state.digitalCardConfig.dimensions;

/**
 * Select styles
 */
export const selectStyles = (state: RootState) => state.digitalCardConfig.styles;

/**
 * Select a section by ID
 */
export const selectSectionById = (sectionId: string) => (state: RootState) =>
  state.digitalCardConfig.sections.find(s => s.id === sectionId);

/**
 * Select section props for a given section ID
 * Returns innerSectionProps for wrapper sections, or props directly
 */
export const selectSectionProps = (sectionId: string) => (state: RootState) => {
  const section = state.digitalCardConfig.sections.find(s => s.id === sectionId);
  if (!section) return EMPTY_PROPS;

  // For wrapper sections, return innerSectionProps
  const isWrapper = section.sectionType === 'contentContainer' ||
                    section.sectionType === 'mapAndContentContainer';

  if (isWrapper) {
    return section.props?.innerSectionProps ?? EMPTY_PROPS;
  }

  return section.props ?? EMPTY_PROPS;
};

/**
 * Select inner section type for a section (for wrapper sections)
 */
export const selectInnerSectionType = (sectionId: string) => (state: RootState) => {
  const section = state.digitalCardConfig.sections.find(s => s.id === sectionId);
  if (!section) return null;
  return section.props?.innerSectionType ?? section.sectionType;
};

/**
 * Select props by inner section type (for preview components)
 * Finds section by its inner section type and returns its props
 */
export const selectPropsByInnerSectionType = (innerSectionType: string) => (state: RootState) => {
  const section = state.digitalCardConfig.sections.find(s => {
    const sectionInnerType = s.props?.innerSectionType ?? s.sectionType;
    return sectionInnerType === innerSectionType;
  });
  if (!section) return EMPTY_PROPS;

  const isWrapper = section.sectionType === 'contentContainer' ||
                    section.sectionType === 'mapAndContentContainer';

  if (isWrapper) {
    return section.props?.innerSectionProps ?? EMPTY_PROPS;
  }

  return section.props ?? EMPTY_PROPS;
};

/**
 * Select if config is dirty (has unsaved changes)
 */
export const selectIsDirty = (state: RootState) => state.digitalCardConfig.isDirty;

/**
 * Select if config is loading
 */
export const selectIsLoading = (state: RootState) => state.digitalCardConfig.isLoading;

// =============================================================================
// REDUCER EXPORT
// =============================================================================

export default digitalCardConfigSlice.reducer;
