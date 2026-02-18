import { useEffect, useCallback } from 'react';
import { MagazineIssue } from '@/lib/pages/magazine/types/magazine/core';
import { useAdminDispatch, useAdminSelector } from './useReduxAdmin';
import {
  fetchMagazine as fetchMagazineAsync,
  createIssue as createIssueAsync,
  updateIssue as updateIssueAsync,
  deleteIssue as deleteIssueAsync,
  batchUploadIssues as batchUploadIssuesAsync,
  toggleFeatured as toggleFeaturedAction,
} from '../store/slices/magazineSlice';

export interface UseMagazineReduxReturn {
  // Data & state
  issues: MagazineIssue[];
  lastUpdated: number | null;  // NEW: Timestamp for cache display
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;

  // Operations
  fetchIssues: () => Promise<void>;
  createIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  updateIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  toggleFeatured: (issue: MagazineIssue) => Promise<void>;
  batchUpload: (issues: Partial<MagazineIssue>[]) => Promise<void>;
}

export function useMagazineRedux(): UseMagazineReduxReturn {
  const dispatch = useAdminDispatch();
  const { data, lastUpdated, isLoading, error, isSaving, isDeleting } = useAdminSelector(
    state => state.admin.magazine
  );

  // Auto-fetch ONLY if cache is empty
  useEffect(() => {
    if (data.length === 0 && !isLoading) {
      dispatch(fetchMagazineAsync());
    }
  }, []); // Empty deps - run once on mount

  // Manual refresh (always fetches from Firebase)
  const fetchIssues = useCallback(async () => {
    await dispatch(fetchMagazineAsync()).unwrap();
  }, [dispatch]);

  // Create magazine issue
  const createIssue = useCallback(async (issueData: Partial<MagazineIssue>) => {
    await dispatch(createIssueAsync(issueData)).unwrap();
  }, [dispatch]);

  // Update magazine issue
  const updateIssue = useCallback(async (issueData: Partial<MagazineIssue>) => {
    await dispatch(updateIssueAsync(issueData)).unwrap();
  }, [dispatch]);

  // Delete magazine issue
  const deleteIssue = useCallback(async (id: string) => {
    await dispatch(deleteIssueAsync(id)).unwrap();
  }, [dispatch]);

  // Toggle featured with optimistic update and revert on failure
  const toggleFeatured = useCallback(async (issue: MagazineIssue) => {
    // Optimistic update
    dispatch(toggleFeaturedAction(issue.id));

    try {
      const response = await fetch(`/api/magazine/issues/${issue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured: !issue.featured }),
      });

      if (!response.ok) {
        // Revert on failure
        dispatch(toggleFeaturedAction(issue.id));
        throw new Error('Failed to update featured status');
      }
    } catch (err) {
      // Revert on error
      dispatch(toggleFeaturedAction(issue.id));
      throw err;
    }
  }, [dispatch]);

  // Batch upload magazine issues
  const batchUpload = useCallback(async (issues: Partial<MagazineIssue>[]) => {
    await dispatch(batchUploadIssuesAsync(issues)).unwrap();
  }, [dispatch]);

  return {
    issues: data,
    lastUpdated,  // EXPOSE TIMESTAMP
    isLoading,
    error,
    isSaving,
    isDeleting,
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    toggleFeatured,
    batchUpload,
  };
}
