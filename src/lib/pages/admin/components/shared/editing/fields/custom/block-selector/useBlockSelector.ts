/**
 * useBlockSelector Hook
 * Manages sections with content blocks using Redux
 *
 * Uses useSectionsRedux to leverage cached sections data instead of
 * making separate API calls. Auto-fetches if cache is empty.
 */

import { useState, useMemo } from 'react';
import { useSectionsRedux } from '@/lib/pages/admin/hooks/useSectionsRedux';
import type { SectionWithBlocks, UseBlockSelectorReturn } from './types';

/**
 * Hook for managing sections with content blocks
 * Uses Redux for data instead of direct API calls
 */
export function useBlockSelector(issueId?: string): UseBlockSelectorReturn {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Use Redux hook for sections data (auto-fetches if cache is empty)
  const {
    sections: reduxSections,
    isLoading,
    error: reduxError,
    fetchSections: refetch,
  } = useSectionsRedux(issueId || '');

  // Transform Redux sections to SectionWithBlocks format
  // Filter to only sections that have content blocks
  const sections = useMemo((): SectionWithBlocks[] => {
    if (!reduxSections || !Array.isArray(reduxSections)) return [];

    return reduxSections
      .filter((section) => {
        // Check both possible field names for content blocks
        const hasBlocks = section.content?.blocks?.length > 0;
        const hasContentBlocks = section.content?.contentBlocks?.length > 0;
        return hasBlocks || hasContentBlocks;
      })
      .map((section) => {
        // Use whichever block array is available
        const blocksArray = section.content?.blocks || section.content?.contentBlocks || [];

        return {
          id: section.id,
          title: section.title || 'Untitled Section',
          type: section.type,
          blocks: blocksArray.map((block: any, index: number) => ({
            id: block.id || `block-${index}`,
            type: block.type,
            category: block.category,
            props: block.props || {},
            enabled: block.enabled !== false,
            order: block.order || index,
          })),
        };
      });
  }, [reduxSections]);

  // Wrap refetch to match the expected async signature
  const fetchSections = async () => {
    await refetch();
  };

  return {
    sections,
    loading: isLoading,
    error: reduxError,
    expandedSection,
    setExpandedSection,
    fetchSections,
  };
}

export default useBlockSelector;
