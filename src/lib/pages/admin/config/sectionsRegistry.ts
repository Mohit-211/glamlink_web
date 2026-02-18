/**
 * Sections Registry - Minimal backward compatibility layer
 *
 * This file provides minimal exports for legacy code that still references sectionsConfig.
 * The actual section management is now done via condensedCardConfig (single source of truth).
 *
 * @deprecated Use condensedCardConfig for section management. This file provides
 * backward-compatible defaults for legacy code paths.
 */

import type { ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';

// Type definitions for backward compatibility
export interface SubSectionMetadata {
  id: string;
  label: string;
  description?: string;
}

export interface SectionMetadata {
  id: string;
  label: string;
  description?: string;
  subSections?: SubSectionMetadata[];
}

export interface SubSectionConfig {
  id: string;
  visible: boolean;
}

/**
 * Default column assignments for sections (used for fallback/migration)
 * @deprecated Column placement is now derived from condensedCardConfig x/y position
 */
export const DEFAULT_SECTION_COLUMNS: Record<string, 'left' | 'right' | 'full'> = {
  'bio-simple': 'left',
  'bio-preview': 'left',
  'signature-work': 'left',
  'signature-work-actions': 'left',
  'video-display': 'left',
  'map-section': 'right',
  'specialties': 'right',
  'important-info': 'right',
  'current-promotions': 'right',
  'current-promotions-detailed': 'right',
  'business-hours': 'right',
};

/**
 * Default sections configuration
 * @deprecated Use condensedCardConfig for section management
 */
export const DEFAULT_SECTIONS_CONFIG: ProfessionalSectionConfig[] = [
  // Left column sections
  {
    id: 'bio-simple',
    visible: true,
    column: 'left',
    desktopOrder: 1,
    mobileOrder: 1,
  },
  {
    id: 'signature-work',
    visible: true,
    column: 'left',
    desktopOrder: 2,
    mobileOrder: 2,
  },
  // Right column sections
  {
    id: 'map-section',
    visible: true,
    column: 'right',
    desktopOrder: 1,
    mobileOrder: 3,
  },
  {
    id: 'specialties',
    visible: true,
    column: 'right',
    desktopOrder: 2,
    mobileOrder: 4,
  },
  {
    id: 'important-info',
    visible: false,
    column: 'right',
    desktopOrder: 3,
    mobileOrder: 5,
  },
  {
    id: 'current-promotions',
    visible: true,
    column: 'right',
    desktopOrder: 4,
    mobileOrder: 6,
  },
  {
    id: 'business-hours',
    visible: false,
    column: 'right',
    desktopOrder: 5,
    mobileOrder: 7,
  },
];

// Minimal registry for backward compatibility
export const SECTION_REGISTRY: Record<string, SectionMetadata> = {
  'bio-simple': { id: 'bio-simple', label: 'Bio' },
  'signature-work': { id: 'signature-work', label: 'Signature Work' },
  'map-section': { id: 'map-section', label: 'Location Map' },
  'specialties': { id: 'specialties', label: 'Specialties' },
  'important-info': { id: 'important-info', label: 'Important Info' },
  'current-promotions': { id: 'current-promotions', label: 'Promotions' },
  'business-hours': { id: 'business-hours', label: 'Business Hours' },
};

/**
 * @deprecated No longer needed - signature work is managed via condensedCardConfig
 */
export const SIGNATURE_WORK_DEFAULT_SUBSECTIONS: SubSectionConfig[] = [];

// Utility functions (minimal stubs for backward compatibility)
export function getSectionMetadata(sectionId: string): SectionMetadata | undefined {
  return SECTION_REGISTRY[sectionId];
}

export function getAvailableSectionIds(): string[] {
  return Object.keys(SECTION_REGISTRY);
}

export function getAvailableSectionsToAdd(currentSections: ProfessionalSectionConfig[]): SectionMetadata[] {
  const currentIds = new Set(currentSections.map(s => s.id));
  return Object.values(SECTION_REGISTRY).filter(s => !currentIds.has(s.id));
}

export function getDefaultSubSections(_sectionId: string): SubSectionConfig[] {
  return [];
}

export function getSubSectionMetadata(_sectionId: string, _subSectionId: string): SubSectionMetadata | undefined {
  return undefined;
}

export function getRelatedFieldsForSection(_sectionId: string): string[] {
  return [];
}

export function getSectionIcon(_sectionId: string): string {
  return '📄';
}

export function sectionHasSubSections(_sectionId: string): boolean {
  return false;
}
