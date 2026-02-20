/**
 * Section Component Map
 *
 * Maps section type IDs to their React component implementations.
 * Separated from types/ because it imports actual React components.
 */

import type { CondensedCardSectionId } from '../types/sections';
import * as SectionComponents from '../components/condensed/sections';

/**
 * Maps section type IDs to their React component implementations
 *
 * Usage:
 * const SectionComponent = SECTION_COMPONENT_MAP[section.sectionType];
 * return <SectionComponent professional={professional} section={section} />;
 */
export const SECTION_COMPONENT_MAP: Record<CondensedCardSectionId, React.ComponentType<any>> = {
  // Existing sections
  header: SectionComponents.Header,
  nameTitle: SectionComponents.NameTitle,
  rating: SectionComponents.Rating,
  specialties: SectionComponents.Specialties,
  importantInfo: SectionComponents.ImportantInfo,
  contact: SectionComponents.Contact,
  cardUrl: SectionComponents.CardUrl,
  branding: SectionComponents.Branding,

  // New sections (Phase 2)
  headerAndBio: SectionComponents.HeaderAndBio,
  map: SectionComponents.MapSection,
  mapWithHours: SectionComponents.MapWithHours,
  footer: SectionComponents.FooterSection,
  custom: SectionComponents.CustomSection,
  contentContainer: SectionComponents.ContentContainer,
};
