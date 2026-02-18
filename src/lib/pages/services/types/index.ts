/**
 * Services Module Types
 *
 * Exports all types needed for the services/treatments pages.
 */

// Treatment types
export type {
  Treatment,
  TreatmentCategory,
  TreatmentCategoryInfo,
  TreatmentOffering,
  FAQ,
} from './treatment';

// Location types
export type {
  Location,
  LocationCardData,
  PopularCity,
} from './location';

// Re-export Professional type from for-professionals module
export type {
  Professional,
  ProfessionalService,
  LocationData,
  GalleryItem,
} from '@/lib/pages/for-professionals/types/professional';
