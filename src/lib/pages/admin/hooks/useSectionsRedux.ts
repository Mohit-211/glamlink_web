import { useEffect, useCallback, useState } from 'react';
import { MagazineSectionDocument } from '@/lib/pages/magazine/types/collaboration';
import { useAdminDispatch, useAdminSelector } from './useReduxAdmin';
import {
  fetchSections as fetchSectionsAsync,
  clearSectionsCache as clearSectionsCacheAction,
  clearSectionsError,
} from '../store/slices/magazineSlice';

export interface UseSectionsReduxReturn {
  // Data & state
  sections: MagazineSectionDocument[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;

  // Operations
  fetchSections: () => Promise<void>;
  createSection: (sectionData: Partial<MagazineSectionDocument>) => Promise<MagazineSectionDocument | null>;
  updateSection: (sectionId: string, sectionData: Partial<MagazineSectionDocument>) => Promise<void>;
  clearCache: () => void;
}

export function useSectionsRedux(issueId: string): UseSectionsReduxReturn {
  const dispatch = useAdminDispatch();
  const { sectionsByIssueId, sectionsLoadingByIssueId, sectionsLastUpdated, sectionsError } = useAdminSelector(
    state => state.admin.magazine
  );

  // Local state for saving operations
  const [isSaving, setIsSaving] = useState(false);

  // Get sections for this specific issue
  const sections = sectionsByIssueId[issueId] || [];
  const isLoading = sectionsLoadingByIssueId[issueId] || false;
  const lastUpdated = sectionsLastUpdated[issueId] || null;

  // Auto-fetch ONLY if cache is empty for this issue
  useEffect(() => {
    if (issueId && sections.length === 0 && !isLoading) {
      dispatch(fetchSectionsAsync(issueId));
    }
  }, [issueId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Manual refresh (always fetches from API)
  const fetchSections = useCallback(async () => {
    if (issueId) {
      await dispatch(fetchSectionsAsync(issueId)).unwrap();
    }
  }, [dispatch, issueId]);

  // Create a new section
  const createSection = useCallback(async (sectionData: Partial<MagazineSectionDocument>): Promise<MagazineSectionDocument | null> => {
    if (!issueId) return null;

    setIsSaving(true);
    try {
      const response = await fetch('/api/magazine/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          issueId,
          sectionData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create section');
      }

      const result = await response.json();

      // Refresh sections list to include the new section
      await dispatch(fetchSectionsAsync(issueId)).unwrap();

      return result.section;
    } catch (error) {
      console.error('Failed to create section:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [issueId, dispatch]);

  // Update an existing section
  const updateSection = useCallback(async (sectionId: string, sectionData: Partial<MagazineSectionDocument>): Promise<void> => {
    if (!issueId || !sectionId) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/magazine/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update section');
      }

      // Refresh sections list to include the updated section
      await dispatch(fetchSectionsAsync(issueId)).unwrap();
    } catch (error) {
      console.error('Failed to update section:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [issueId, dispatch]);

  // Clear cache for this issue
  const clearCache = useCallback(() => {
    if (issueId) {
      dispatch(clearSectionsCacheAction(issueId));
      dispatch(clearSectionsError());
    }
  }, [dispatch, issueId]);

  return {
    sections,
    lastUpdated,
    isLoading,
    error: sectionsError,
    isSaving,
    fetchSections,
    createSection,
    updateSection,
    clearCache,
  };
}
