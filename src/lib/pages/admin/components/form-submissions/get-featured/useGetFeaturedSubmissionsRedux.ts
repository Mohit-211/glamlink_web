'use client';

/**
 * useGetFeaturedSubmissionsRedux - Redux hook for Get Featured submissions with caching
 *
 * Provides access to Get Featured submission data with automatic caching.
 * Data is only fetched if the cache is empty, preventing unnecessary DB calls.
 */

import { useEffect, useCallback } from 'react';
import { useAdminDispatch, useAdminSelector } from '@/lib/pages/admin/hooks/useReduxAdmin';
import type { GetFeaturedSubmission } from '@/lib/pages/apply/featured/types';
import {
  fetchGetFeaturedSubmissions as fetchGetFeaturedAsync,
  updateGetFeaturedStatus as updateGetFeaturedStatusAsync,
  deleteGetFeaturedSubmission as deleteGetFeaturedAsync,
} from '@/lib/pages/admin/store/slices/form-submissions';

// =============================================================================
// TYPES
// =============================================================================

export interface UseGetFeaturedSubmissionsReduxReturn {
  // State
  getFeatured: {
    data: GetFeaturedSubmission[];
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
    isDeleting: boolean;
  };

  // Operations
  fetchSubmissions: () => Promise<void>;
  getSubmissionById: (id: string) => Promise<GetFeaturedSubmission | null>;
  updateSubmissionStatus: (id: string, reviewed: boolean, status?: string) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useGetFeaturedSubmissionsRedux(): UseGetFeaturedSubmissionsReduxReturn {
  const dispatch = useAdminDispatch();

  // Select state from Redux
  const getFeatured = useAdminSelector((state) => state.admin.formSubmissions.getFeatured);

  // ===========================================================================
  // AUTO-FETCH ON MOUNT (only if cache empty)
  // ===========================================================================

  useEffect(() => {
    if (getFeatured.data.length === 0 && !getFeatured.isLoading) {
      dispatch(fetchGetFeaturedAsync());
    }
  }, []); // Empty deps - run once on mount

  // ===========================================================================
  // OPERATIONS
  // ===========================================================================

  const fetchSubmissions = useCallback(async () => {
    await dispatch(fetchGetFeaturedAsync()).unwrap();
  }, [dispatch]);

  const getSubmissionById = useCallback(
    async (id: string): Promise<GetFeaturedSubmission | null> => {
      try {
        const response = await fetch(`/api/get-featured/submissions/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch submission: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.submission) {
          return data.submission;
        }

        return null;
      } catch (err) {
        console.error('Error fetching submission:', err);
        return null;
      }
    },
    []
  );

  const updateSubmissionStatus = useCallback(
    async (id: string, reviewed: boolean, status?: string) => {
      await dispatch(updateGetFeaturedStatusAsync({ id, reviewed, status })).unwrap();
    },
    [dispatch]
  );

  const deleteSubmission = useCallback(
    async (id: string) => {
      await dispatch(deleteGetFeaturedAsync(id)).unwrap();
    },
    [dispatch]
  );

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    getFeatured,
    fetchSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    deleteSubmission,
  };
}

export default useGetFeaturedSubmissionsRedux;
