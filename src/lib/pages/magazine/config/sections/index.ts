// Type exports
export * from './types';
export * from './utils';
export * from './common';

// Section configuration (from sections.ts)
export { MAGAZINE_SECTIONS, DEFAULT_SECTIONS, MAX_SECTIONS } from './sections.config';

// Import only existing section schemas
// Special sections (the only ones that still exist)
import { eventRoundupSchema } from './special/event-roundup';
import { customSectionSchema } from './special/custom-section';

import { SectionSchema } from './types';

// List of common section types (empty since all common sections were deleted)
export const COMMON_SECTION_TYPES = [] as const;

export type CommonSectionType = typeof COMMON_SECTION_TYPES[number];

// Combine all section schemas (only special sections remain)
export const sectionSchemas: Record<string, SectionSchema> = {
  // Special sections (the only ones that still exist)
  "event-roundup": eventRoundupSchema,
  "custom-section": customSectionSchema,
};

// Helper functions
export function getSectionSchema(sectionId: string): SectionSchema | undefined {
  return sectionSchemas[sectionId];
}

export function getSchemasByCategory(category: string): SectionSchema[] {
  return Object.values(sectionSchemas).filter((schema) => schema.category === category);
}