/**
 * Form Submissions Redux Module
 *
 * Centralized exports for form submissions state management.
 */

// Export reducer as default
export { default } from './slice';

// Export actions
export {
  clearGetFeaturedError,
  clearDigitalCardError,
  clearFormConfigsError,
  toggleFormConfigEnabled,
  resetFormSubmissionsState,
} from './slice';

// Export types
export type {
  GetFeaturedState,
  DigitalCardState,
  FormConfigsState,
  FormSubmissionsState,
} from './types';

// Export Get Featured thunks
export {
  fetchGetFeaturedSubmissions,
  updateGetFeaturedStatus,
  deleteGetFeaturedSubmission,
} from './getFeaturedThunks';

// Export Digital Card thunks
export {
  fetchDigitalCardSubmissions,
  updateDigitalCardStatus,
  deleteDigitalCardSubmission,
  convertDigitalCardToProfessional,
} from './digitalCardThunks';

// Export Form Configs thunks
export {
  fetchFormConfigs,
  createFormConfig,
  updateFormConfig,
  deleteFormConfig,
  migrateGetFeaturedForms,
  migrateDigitalCardForm,
} from './formConfigsThunks';
