/**
 * useLoadFromSection Hook
 *
 * Core hook for finding and extracting custom block data from existing web sections.
 * Leverages useSectionsRedux to fetch sections and applies component-specific extractors.
 */

import { useCallback } from 'react';
import { useSectionsRedux } from '@/lib/pages/admin/hooks/useSectionsRedux';
import { getComponentInfo } from '@/lib/pages/admin/components/magazine/web/editor/config/content-discovery';
import { extractors, searchContentForFields } from '../../../shared/dataExtractors';
import type { SectionMatch } from '../../../types';

interface UseLoadFromSectionOptions {
  issueId: string;
  blockType: string;      // e.g., "NumberedTips"
  blockCategory: string;  // e.g., "maries-corner"
}

interface UseLoadFromSectionReturn {
  findMatches: () => SectionMatch[];
  isLoading: boolean;
}

/**
 * Hook to find and extract custom block data from web sections
 *
 * @param options - Issue ID and component type to search for
 * @returns findMatches function and loading state
 */
export function useLoadFromSection({
  issueId,
  blockType,
  blockCategory
}: UseLoadFromSectionOptions): UseLoadFromSectionReturn {
  const { sections, isLoading: sectionsLoading } = useSectionsRedux(issueId);

  /**
   * Find all sections containing data for this component
   *
   * Searches through all sections for the issue, attempting to extract
   * component-specific data using extractors or fallback search.
   */
  const findMatches = useCallback((): SectionMatch[] => {
    const matches: SectionMatch[] = [];

    for (const section of sections) {
      // Extract component data from this section
      const componentData = extractComponentData(section, blockType, blockCategory);

      // Only include sections with actual data
      if (componentData && Object.keys(componentData).length > 0) {
        matches.push({
          sectionId: section.id,
          sectionTitle: section.title,
          sectionSubtitle: section.subtitle,
          sectionType: section.type,
          componentData,
          dataPreview: generatePreview(componentData, blockType)
        });
      }
    }

    return matches;
  }, [sections, blockType, blockCategory]);

  return { findMatches, isLoading: sectionsLoading };
}

/**
 * Extract component data from a section
 *
 * Tries three approaches in order:
 * 1. Custom sections with ContentBlocks (direct match)
 * 2. Component-specific extractor function
 * 3. Fallback field name search
 *
 * @param section - Magazine section document
 * @param componentName - Component type to extract (e.g., "NumberedTips")
 * @param category - Component category (e.g., "maries-corner")
 * @returns Extracted data or null if no match
 */
function extractComponentData(
  section: any,
  componentName: string,
  category: string
): Record<string, any> | null {
  // Approach 1: Custom sections with ContentBlocks (easiest)
  if (section.type === 'custom-section' && section.content?.contentBlocks) {
    const block = section.content.contentBlocks.find(
      (b: any) => b.type === componentName && b.category === category
    );
    return block?.props || null;
  }

  // Check if section type matches category
  if (section.type !== category) return null;

  // Approach 2: Use component-specific extractor
  const extractor = extractors[componentName];
  if (extractor) {
    try {
      return extractor(section.content || {});
    } catch (error) {
      console.error(`Extractor failed for ${componentName}:`, error);
      // Fall through to approach 3
    }
  }

  // Approach 3: Fallback - search for matching field names
  const componentInfo = getComponentInfo(componentName, category);
  if (!componentInfo) return null;

  return searchContentForFields(section.content || {}, componentInfo.propFields);
}

/**
 * Generate preview text for a data match
 *
 * Creates a human-readable summary of the extracted data,
 * with component-specific formatting for better UX.
 *
 * @param data - Extracted component data
 * @param componentName - Component type
 * @returns Preview string
 */
function generatePreview(data: Record<string, any>, componentName: string): string {
  const keys = Object.keys(data);
  if (keys.length === 0) return 'Empty';

  // Component-specific previews
  if (componentName === 'NumberedTips' && data.tips) {
    return `${data.tips.length} tips${data.title ? `, "${data.title}"` : ''}`;
  }

  if (componentName === 'PhotoGallery' && data.photos) {
    return `${data.photos.length} photos, ${data.columns || 2} columns`;
  }

  if (componentName === 'MariesPicks' && data.products) {
    return `${data.products.length} products${data.title ? `, "${data.title}"` : ''}`;
  }

  if (componentName === 'Stats' && data.items) {
    return `${data.items.length} stats, ${data.layout || 'grid'} layout`;
  }

  if (componentName === 'BeforeAfter') {
    const hasImages = data.beforeImage && data.afterImage;
    return hasImages ? 'Before & After images set' : 'Partial data';
  }

  // Generic preview - show first 3 field names
  return keys.slice(0, 3).join(', ');
}
