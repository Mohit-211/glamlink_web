'use client';

/**
 * useDerivedSections - Hook for managing condensed card sections in profile editor
 *
 * This hook manages the sections displayed in the profile condensed card editor.
 * It separates Styling sections (auto-included) from Content sections (manually added).
 *
 * Behavior:
 * - "Styling" sections (dropshadowContainer, footer, custom, quick-actions-line)
 *   come directly from condensedCardConfig and are auto-included
 * - "Content" sections (contentContainer, mapAndContentContainer) must be explicitly
 *   added via the "Add Section" button. They only appear if:
 *   1. The section is visible in Sections tab AND
 *   2. The section has been added to condensedCardConfig.sections
 *
 * The "addableSections" list shows sections that are visible in Sections tab but
 * haven't been added to the condensed card yet.
 */

import { useCallback, useMemo } from 'react';
import type { CondensedCardSectionInstance, CondensedCardConfig } from '@/lib/features/digital-cards/types/condensedCardConfig';
import type { ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';
import {
  STYLING_SECTION_TYPES,
  CONTENT_SECTION_TYPES,
} from '@/lib/features/digital-cards/store';
import {
  hasCondensedMapping,
  createCondensedCardSection,
  getCondensedSectionId,
  getCondensedMapping,
} from '@/lib/features/digital-cards/utils/sectionMapping';

// =============================================================================
// TYPES
// =============================================================================

export interface AddableSectionInfo {
  /** Section ID from sectionsConfig */
  sectionId: string;
  /** Display label for the section */
  label: string;
  /** The inner section type (e.g., 'specialties', 'businessHours') */
  innerSectionType: string;
}

export interface UseDerivedSectionsOptions {
  /** Current condensed card configuration */
  condensedCardConfig?: CondensedCardConfig;
  /** Sections configuration from the Sections tab (used for deriving Content sections) */
  sectionsConfig?: ProfessionalSectionConfig[];
  /** Callback when sections are updated */
  onSectionsChange: (sections: CondensedCardSectionInstance[]) => void;
}

export interface UseDerivedSectionsReturn {
  /** Sections available for editing (merged styling + content) */
  sections: CondensedCardSectionInstance[];
  /** Sections that can be added (visible in Sections tab but not yet added) */
  addableSections: AddableSectionInfo[];
  /** Add a section to the condensed card with default position */
  addSection: (sectionId: string) => string | null;
  /** Remove a section from the condensed card */
  removeSection: (sectionId: string) => void;
  /** Update a specific section */
  updateSection: (sectionId: string, updates: Partial<CondensedCardSectionInstance>) => void;
  /** Reset all content sections (removes them, keeps styling) */
  resetContentSections: () => void;
  /** Whether there are any sections to edit */
  hasSections: boolean;
  /** Whether there are any content sections */
  hasContentSections: boolean;
}

// =============================================================================
// HOOK
// =============================================================================

export function useDerivedSections({
  condensedCardConfig,
  sectionsConfig,
  onSectionsChange,
}: UseDerivedSectionsOptions): UseDerivedSectionsReturn {
  // Get static "Styling" sections from condensedCardConfig (auto-included)
  const stylingSections = useMemo(() => {
    if (!condensedCardConfig?.sections || !Array.isArray(condensedCardConfig.sections)) {
      return [];
    }
    return condensedCardConfig.sections.filter(
      (s) => STYLING_SECTION_TYPES.includes(s.sectionType as any)
    );
  }, [condensedCardConfig?.sections]);

  // Get "Content" sections that are already in condensedCardConfig
  // These are sections that have been explicitly added via "Add Section"
  const contentSections = useMemo(() => {
    if (!condensedCardConfig?.sections || !Array.isArray(condensedCardConfig.sections)) {
      return [];
    }

    // Get content sections from condensedCardConfig
    const existingContentSections = condensedCardConfig.sections.filter(
      (s) => CONTENT_SECTION_TYPES.includes(s.sectionType as any)
    );

    // If we have sectionsConfig, only keep content sections whose source section is still visible
    if (sectionsConfig && Array.isArray(sectionsConfig)) {
      return existingContentSections.filter((contentSection) => {
        // Extract original section ID from condensed ID (e.g., "map-section-content" -> "map-section")
        const originalId = contentSection.id.replace(/-content$/, '');
        const sourceSection = sectionsConfig.find((s) => s.id === originalId);
        // Keep if source section exists and is visible
        return sourceSection?.visible === true;
      });
    }

    return existingContentSections;
  }, [condensedCardConfig?.sections, sectionsConfig]);

  // Get sections that can be added (visible in Sections tab, have mapping, not yet added)
  const addableSections = useMemo((): AddableSectionInfo[] => {
    if (!sectionsConfig || !Array.isArray(sectionsConfig)) {
      return [];
    }

    // Get IDs of sections already in condensedCardConfig
    const existingIds = new Set(
      (condensedCardConfig?.sections || [])
        .filter((s) => CONTENT_SECTION_TYPES.includes(s.sectionType as any))
        .map((s) => s.id)
    );

    // Filter to visible sections with mappings that aren't already added
    return sectionsConfig
      .filter((s) => {
        if (!s.visible) return false;
        if (!hasCondensedMapping(s.id)) return false;
        const condensedId = getCondensedSectionId(s.id);
        return !existingIds.has(condensedId);
      })
      .map((s) => {
        const mapping = getCondensedMapping(s.id);
        return {
          sectionId: s.id,
          label: mapping?.defaultLabel || s.id,
          // Use the human-readable innerSectionLabel for display
          innerSectionType: mapping?.innerSectionLabel || mapping?.innerSectionType || 'unknown',
        };
      });
  }, [sectionsConfig, condensedCardConfig?.sections]);

  // Merge styling + content sections
  const sections = useMemo(() => {
    return [...stylingSections, ...contentSections];
  }, [stylingSections, contentSections]);

  // Add a new section with default add position
  const addSection = useCallback(
    (sectionId: string): string | null => {
      // Create the new section with default add position
      const newSection = createCondensedCardSection(
        sectionId,
        true, // visible
        undefined, // no existing section
        true // use DEFAULT_ADD_SECTION_POSITION
      );

      if (!newSection) {
        console.warn(`Failed to create section for ${sectionId} - no mapping found`);
        return null;
      }

      // Add to existing sections
      const updatedSections = [...sections, newSection];
      onSectionsChange(updatedSections);

      return newSection.id;
    },
    [sections, onSectionsChange]
  );

  // Remove a section from the condensed card
  const removeSection = useCallback(
    (sectionId: string) => {
      const updatedSections = sections.filter((s) => s.id !== sectionId);
      onSectionsChange(updatedSections);
    },
    [sections, onSectionsChange]
  );

  // Update a specific section
  const updateSection = useCallback(
    (sectionId: string, updates: Partial<CondensedCardSectionInstance>) => {
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            ...updates,
            // Deep merge props if provided
            props: updates.props
              ? { ...section.props, ...updates.props }
              : section.props,
          };
        }
        return section;
      });
      onSectionsChange(updatedSections);
    },
    [sections, onSectionsChange]
  );

  // Reset all content sections (remove them, keep styling)
  const resetContentSections = useCallback(() => {
    // Only keep styling sections
    onSectionsChange(stylingSections);
  }, [stylingSections, onSectionsChange]);

  return {
    sections,
    addableSections,
    addSection,
    removeSection,
    updateSection,
    resetContentSections,
    hasSections: sections.length > 0,
    hasContentSections: contentSections.length > 0,
  };
}

export default useDerivedSections;
