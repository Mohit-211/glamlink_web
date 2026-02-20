/**
 * Services Module
 *
 * SEO-optimized services/treatments page module.
 *
 * Usage:
 * ```tsx
 * // Browse All Services page
 * import { ServicesPage } from '@/lib/pages/services';
 * export default function Page() {
 *   return <ServicesPage />;
 * }
 *
 * // Treatment-specific page
 * import { TreatmentPage } from '@/lib/pages/services';
 * export default function Page({ params }) {
 *   return <TreatmentPage treatmentSlug={params.treatment} />;
 * }
 *
 * // Treatment + Location page
 * import { TreatmentLocationPage } from '@/lib/pages/services';
 * export default function Page({ params }) {
 *   return <TreatmentLocationPage treatmentSlug={params.treatment} locationSlug={params.location} />;
 * }
 * ```
 */

// Main page components
export { ServicesPage, TreatmentPage, TreatmentLocationPage, LocationPrompt } from './components';
export type { TreatmentPageProps, TreatmentLocationPageProps } from './components';

// Individual components
export { TreatmentCard, CityCard, ProCard } from './components';
export type { TreatmentCardProps, CityCardProps, ProCardProps } from './components';

// Treatment page sub-components
export {
  TreatmentHero,
  TreatmentStats,
  CityLinks,
  TreatmentFAQs,
  RelatedTreatments,
} from './components';
export type {
  TreatmentHeroProps,
  TreatmentStatsProps,
  CityLinksProps,
  TreatmentFAQsProps,
  RelatedTreatmentsProps,
} from './components';

// Hooks
export { useServicesData, useTreatmentData, useUserLocation, useTreatmentLocationData } from './hooks';
export type {
  UseServicesDataReturn,
  UseTreatmentDataReturn,
  TreatmentStats as TreatmentStatsType,
  UseUserLocationReturn,
  UserLocation,
  UseTreatmentLocationDataReturn,
  TreatmentLocationStats,
  LocationInfo,
} from './hooks';

// Types
export type {
  Treatment,
  TreatmentCategory,
  TreatmentCategoryInfo,
  TreatmentOffering,
  FAQ,
  Location,
  LocationCardData,
  PopularCity,
  Professional,
  ProfessionalService,
  LocationData,
  GalleryItem,
} from './types';

// Config
export {
  TREATMENT_CATEGORIES,
  VALID_TREATMENT_SLUGS,
  TREATMENT_SLUG_TO_NAME,
  POPULAR_CITIES,
  isValidTreatmentSlug,
  getTreatmentName,
  getCategoryForTreatment,
  getTreatmentsInCategory,
  TREATMENT_CONTENT,
  getTreatmentContent,
  getTreatmentsByCategory,
  getRelatedTreatmentContent,
} from './config';
export type { TreatmentContent } from './config';
