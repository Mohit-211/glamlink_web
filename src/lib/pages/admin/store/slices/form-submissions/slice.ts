/**
 * Form Submissions Redux Slice
 *
 * Main slice combining all form submissions state management.
 * Handles Get Featured, Digital Card, and Form Configurations.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FormCategory } from '@/lib/pages/admin/components/form-submissions/form-configurations/types';
import { initialState } from './types';

// Import thunks
import {
  fetchGetFeaturedSubmissions,
  updateGetFeaturedStatus,
  deleteGetFeaturedSubmission,
} from './getFeaturedThunks';

import {
  fetchDigitalCardSubmissions,
  updateDigitalCardStatus,
  deleteDigitalCardSubmission,
  convertDigitalCardToProfessional,
} from './digitalCardThunks';

import {
  fetchFormConfigs,
  createFormConfig,
  updateFormConfig,
  deleteFormConfig,
  migrateGetFeaturedForms,
  migrateDigitalCardForm,
} from './formConfigsThunks';

// =============================================================================
// SLICE
// =============================================================================

const formSubmissionsSlice = createSlice({
  name: 'formSubmissions',
  initialState,
  reducers: {
    // Clear errors
    clearGetFeaturedError: (state) => {
      state.getFeatured.error = null;
    },
    clearDigitalCardError: (state) => {
      state.digitalCard.error = null;
    },
    clearFormConfigsError: (state) => {
      state.formConfigs.error = null;
    },

    // Optimistic toggle for form config enabled status
    toggleFormConfigEnabled: (
      state,
      action: PayloadAction<{ id: string; category: FormCategory }>
    ) => {
      const config = state.formConfigs.data.find(
        (c) => c.id === action.payload.id && c.category === action.payload.category
      );
      if (config) {
        config.enabled = !config.enabled;
      }
    },

    // Reset state
    resetFormSubmissionsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ========================================================================
      // GET FEATURED SUBMISSIONS
      // ========================================================================
      .addCase(fetchGetFeaturedSubmissions.pending, (state) => {
        state.getFeatured.isLoading = true;
        state.getFeatured.error = null;
      })
      .addCase(fetchGetFeaturedSubmissions.fulfilled, (state, action) => {
        state.getFeatured.isLoading = false;
        state.getFeatured.data = action.payload;
        state.getFeatured.lastUpdated = Date.now();
        state.getFeatured.error = null;
      })
      .addCase(fetchGetFeaturedSubmissions.rejected, (state, action) => {
        state.getFeatured.isLoading = false;
        state.getFeatured.error = action.error.message || 'Failed to fetch submissions';
      })

      .addCase(updateGetFeaturedStatus.pending, (state) => {
        state.getFeatured.isSaving = true;
        state.getFeatured.error = null;
      })
      .addCase(updateGetFeaturedStatus.fulfilled, (state, action) => {
        state.getFeatured.isSaving = false;
        const index = state.getFeatured.data.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.getFeatured.data[index] = action.payload;
        }
      })
      .addCase(updateGetFeaturedStatus.rejected, (state, action) => {
        state.getFeatured.isSaving = false;
        state.getFeatured.error = action.error.message || 'Failed to update submission';
      })

      .addCase(deleteGetFeaturedSubmission.pending, (state) => {
        state.getFeatured.isDeleting = true;
        state.getFeatured.error = null;
      })
      .addCase(deleteGetFeaturedSubmission.fulfilled, (state, action) => {
        state.getFeatured.isDeleting = false;
        state.getFeatured.data = state.getFeatured.data.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteGetFeaturedSubmission.rejected, (state, action) => {
        state.getFeatured.isDeleting = false;
        state.getFeatured.error = action.error.message || 'Failed to delete submission';
      })

      // ========================================================================
      // DIGITAL CARD SUBMISSIONS
      // ========================================================================
      .addCase(fetchDigitalCardSubmissions.pending, (state) => {
        state.digitalCard.isLoading = true;
        state.digitalCard.error = null;
      })
      .addCase(fetchDigitalCardSubmissions.fulfilled, (state, action) => {
        state.digitalCard.isLoading = false;
        state.digitalCard.data = action.payload;
        state.digitalCard.lastUpdated = Date.now();
        state.digitalCard.error = null;
      })
      .addCase(fetchDigitalCardSubmissions.rejected, (state, action) => {
        state.digitalCard.isLoading = false;
        state.digitalCard.error = action.error.message || 'Failed to fetch submissions';
      })

      .addCase(updateDigitalCardStatus.pending, (state) => {
        state.digitalCard.isSaving = true;
        state.digitalCard.error = null;
      })
      .addCase(updateDigitalCardStatus.fulfilled, (state, action) => {
        state.digitalCard.isSaving = false;
        const index = state.digitalCard.data.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.digitalCard.data[index] = action.payload;
        }
      })
      .addCase(updateDigitalCardStatus.rejected, (state, action) => {
        state.digitalCard.isSaving = false;
        state.digitalCard.error = action.error.message || 'Failed to update submission';
      })

      .addCase(deleteDigitalCardSubmission.pending, (state) => {
        state.digitalCard.isDeleting = true;
        state.digitalCard.error = null;
      })
      .addCase(deleteDigitalCardSubmission.fulfilled, (state, action) => {
        state.digitalCard.isDeleting = false;
        state.digitalCard.data = state.digitalCard.data.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteDigitalCardSubmission.rejected, (state, action) => {
        state.digitalCard.isDeleting = false;
        state.digitalCard.error = action.error.message || 'Failed to delete submission';
      })

      .addCase(convertDigitalCardToProfessional.pending, (state) => {
        state.digitalCard.isConverting = true;
        state.digitalCard.error = null;
      })
      .addCase(convertDigitalCardToProfessional.fulfilled, (state, action) => {
        state.digitalCard.isConverting = false;
        const index = state.digitalCard.data.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.digitalCard.data[index] = {
            ...state.digitalCard.data[index],
            hidden: true,
            convertedToProfessionalId: action.payload.professionalId,
          };
        }
      })
      .addCase(convertDigitalCardToProfessional.rejected, (state, action) => {
        state.digitalCard.isConverting = false;
        state.digitalCard.error = action.error.message || 'Failed to convert submission';
      })

      // ========================================================================
      // FORM CONFIGS
      // ========================================================================
      .addCase(fetchFormConfigs.pending, (state) => {
        state.formConfigs.isLoading = true;
        state.formConfigs.error = null;
      })
      .addCase(fetchFormConfigs.fulfilled, (state, action) => {
        state.formConfigs.isLoading = false;
        state.formConfigs.data = action.payload;
        state.formConfigs.lastUpdated = Date.now();
        state.formConfigs.error = null;
      })
      .addCase(fetchFormConfigs.rejected, (state, action) => {
        state.formConfigs.isLoading = false;
        state.formConfigs.error = action.error.message || 'Failed to fetch form configurations';
      })

      .addCase(createFormConfig.pending, (state) => {
        state.formConfigs.isSaving = true;
        state.formConfigs.error = null;
      })
      .addCase(createFormConfig.fulfilled, (state, action) => {
        state.formConfigs.isSaving = false;
        state.formConfigs.data.push(action.payload);
      })
      .addCase(createFormConfig.rejected, (state, action) => {
        state.formConfigs.isSaving = false;
        state.formConfigs.error = action.error.message || 'Failed to create form configuration';
      })

      .addCase(updateFormConfig.pending, (state) => {
        state.formConfigs.isSaving = true;
        state.formConfigs.error = null;
      })
      .addCase(updateFormConfig.fulfilled, (state, action) => {
        state.formConfigs.isSaving = false;
        const index = state.formConfigs.data.findIndex(
          (c) => c.id === action.payload.id && c.category === action.payload.category
        );
        if (index !== -1) {
          state.formConfigs.data[index] = action.payload;
        }
      })
      .addCase(updateFormConfig.rejected, (state, action) => {
        state.formConfigs.isSaving = false;
        state.formConfigs.error = action.error.message || 'Failed to update form configuration';
      })

      .addCase(deleteFormConfig.pending, (state) => {
        state.formConfigs.isDeleting = true;
        state.formConfigs.error = null;
      })
      .addCase(deleteFormConfig.fulfilled, (state, action) => {
        state.formConfigs.isDeleting = false;
        state.formConfigs.data = state.formConfigs.data.filter(
          (c) => !(c.id === action.payload.id && c.category === action.payload.category)
        );
      })
      .addCase(deleteFormConfig.rejected, (state, action) => {
        state.formConfigs.isDeleting = false;
        state.formConfigs.error = action.error.message || 'Failed to delete form configuration';
      })

      .addCase(migrateGetFeaturedForms.pending, (state) => {
        state.formConfigs.isMigrating = true;
        state.formConfigs.error = null;
      })
      .addCase(migrateGetFeaturedForms.fulfilled, (state) => {
        state.formConfigs.isMigrating = false;
      })
      .addCase(migrateGetFeaturedForms.rejected, (state, action) => {
        state.formConfigs.isMigrating = false;
        state.formConfigs.error = action.error.message || 'Migration failed';
      })

      .addCase(migrateDigitalCardForm.pending, (state) => {
        state.formConfigs.isMigrating = true;
        state.formConfigs.error = null;
      })
      .addCase(migrateDigitalCardForm.fulfilled, (state) => {
        state.formConfigs.isMigrating = false;
      })
      .addCase(migrateDigitalCardForm.rejected, (state, action) => {
        state.formConfigs.isMigrating = false;
        state.formConfigs.error = action.error.message || 'Migration failed';
      });
  },
});

// Export actions
export const {
  clearGetFeaturedError,
  clearDigitalCardError,
  clearFormConfigsError,
  toggleFormConfigEnabled,
  resetFormSubmissionsState,
} = formSubmissionsSlice.actions;

// Export reducer
export default formSubmissionsSlice.reducer;
