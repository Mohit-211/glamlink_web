/**
 * Services Module Config Exports
 */

export {
  TREATMENT_CATEGORIES,
  VALID_TREATMENT_SLUGS,
  TREATMENT_SLUG_TO_NAME,
  POPULAR_CITIES,
  isValidTreatmentSlug,
  getTreatmentName,
  getCategoryForTreatment,
  getTreatmentsInCategory,
} from './treatments';

export type { TreatmentContent } from './treatmentContent';
export {
  TREATMENT_CONTENT,
  getTreatmentContent,
  getTreatmentsByCategory,
  getRelatedTreatmentContent,
} from './treatmentContent';
