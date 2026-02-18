import { useEffect, useCallback } from 'react';
import { useAdminDispatch, useAdminSelector } from '@/lib/pages/admin/hooks/useReduxAdmin';
import type { DigitalPage, CreateDigitalPageData, UpdateDigitalPageData } from './editor/types';
import {
  fetchDigitalPages as fetchDigitalPagesAsync,
  createDigitalPage as createDigitalPageAsync,
  updateDigitalPage as updateDigitalPageAsync,
  deleteDigitalPage as deleteDigitalPageAsync,
  reorderDigitalPages as reorderDigitalPagesAsync,
  batchUploadDigitalPages as batchUploadDigitalPagesAsync,
  clearError,
  clearIssueCache,
} from '@/lib/pages/admin/store/slices/digitalPagesSlice';

export interface UseDigitalPagesReduxReturn {
  // Data & state
  pages: DigitalPage[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;

  // Operations
  fetchPages: () => Promise<void>;
  createPage: (data: CreateDigitalPageData) => Promise<DigitalPage>;
  updatePage: (data: UpdateDigitalPageData) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  reorderPages: (pageIds: string[]) => Promise<void>;
  batchUpload: (pages: Partial<DigitalPage>[]) => Promise<void>;
  clearCache: () => void;
}

export function useDigitalPagesRedux(issueId: string): UseDigitalPagesReduxReturn {
  const dispatch = useAdminDispatch();
  const {
    pagesByIssueId,
    loadingByIssueId,
    lastUpdatedByIssueId,
    error,
    isSaving,
    isDeleting,
  } = useAdminSelector(state => state.admin.digitalPages);

  // Get pages for this specific issue
  const pages = pagesByIssueId[issueId] || [];
  const isLoading = loadingByIssueId[issueId] || false;
  const lastUpdated = lastUpdatedByIssueId[issueId] || null;

  // Auto-fetch ONLY if cache is empty for this issue
  useEffect(() => {
    if (issueId && pages.length === 0 && !isLoading) {
      dispatch(fetchDigitalPagesAsync(issueId));
    }
  }, [issueId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Manual refresh (always fetches from API)
  const fetchPages = useCallback(async () => {
    if (issueId) {
      await dispatch(fetchDigitalPagesAsync(issueId)).unwrap();
    }
  }, [dispatch, issueId]);

  // Create a new page
  const createPage = useCallback(async (data: CreateDigitalPageData): Promise<DigitalPage> => {
    const result = await dispatch(createDigitalPageAsync(data)).unwrap();
    return result;
  }, [dispatch]);

  // Update a page
  const updatePage = useCallback(async (data: UpdateDigitalPageData): Promise<void> => {
    await dispatch(updateDigitalPageAsync(data)).unwrap();
  }, [dispatch]);

  // Delete a page
  const deletePage = useCallback(async (id: string): Promise<void> => {
    await dispatch(deleteDigitalPageAsync({ id, issueId })).unwrap();
  }, [dispatch, issueId]);

  // Reorder pages
  const reorderPages = useCallback(async (pageIds: string[]): Promise<void> => {
    await dispatch(reorderDigitalPagesAsync({ issueId, pageIds })).unwrap();
  }, [dispatch, issueId]);

  // Batch upload pages (replaces all pages for the issue)
  const batchUpload = useCallback(async (pages: Partial<DigitalPage>[]): Promise<void> => {
    await dispatch(batchUploadDigitalPagesAsync({ issueId, pages })).unwrap();
  }, [dispatch, issueId]);

  // Clear cache for this issue
  const clearCache = useCallback(() => {
    if (issueId) {
      dispatch(clearIssueCache(issueId));
      dispatch(clearError());
    }
  }, [dispatch, issueId]);

  return {
    pages,
    lastUpdated,
    isLoading,
    error,
    isSaving,
    isDeleting,
    fetchPages,
    createPage,
    updatePage,
    deletePage,
    reorderPages,
    batchUpload,
    clearCache,
  };
}
