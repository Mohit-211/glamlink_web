'use client';

/**
 * useDigitalCardSubmissionsRedux - Redux hook for Digital Card submissions with caching
 *
 * Provides access to Digital Card (Professional) submission data with automatic caching.
 * Data is only fetched if the cache is empty, preventing unnecessary DB calls.
 */

import { useEffect, useCallback } from 'react';
import { useAdminDispatch, useAdminSelector } from '@/lib/pages/admin/hooks/useReduxAdmin';
import type { DigitalCardSubmission } from '@/lib/pages/admin/components/form-submissions/types';
import {
  fetchDigitalCardSubmissions as fetchDigitalCardAsync,
  updateDigitalCardStatus as updateDigitalCardStatusAsync,
  deleteDigitalCardSubmission as deleteDigitalCardAsync,
  convertDigitalCardToProfessional as convertToProfessionalAsync,
} from '@/lib/pages/admin/store/slices/form-submissions';

// =============================================================================
// TYPES
// =============================================================================

export interface UseDigitalCardSubmissionsReduxReturn {
  // State
  digitalCard: {
    data: DigitalCardSubmission[];
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
    isDeleting: boolean;
    isConverting: boolean;
  };

  // Operations
  fetchSubmissions: () => Promise<void>;
  getSubmissionById: (id: string) => Promise<DigitalCardSubmission | null>;
  updateSubmissionStatus: (
    id: string,
    reviewed: boolean,
    status?: string,
    hidden?: boolean
  ) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  convertToProfessional: (id: string) => Promise<{ success: boolean; professionalId?: string; error?: string }>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useDigitalCardSubmissionsRedux(): UseDigitalCardSubmissionsReduxReturn {
  const dispatch = useAdminDispatch();

  // Select state from Redux
  const digitalCard = useAdminSelector((state) => state.admin.formSubmissions.digitalCard);

  // ===========================================================================
  // AUTO-FETCH ON MOUNT (only if cache empty)
  // ===========================================================================

  useEffect(() => {
    if (digitalCard.data.length === 0 && !digitalCard.isLoading) {
      dispatch(fetchDigitalCardAsync());
    }
  }, []); // Empty deps - run once on mount

  // ===========================================================================
  // OPERATIONS
  // ===========================================================================

  const fetchSubmissions = useCallback(async () => {
    await dispatch(fetchDigitalCardAsync()).unwrap();
  }, [dispatch]);

  const getSubmissionById = useCallback(
    async (id: string): Promise<DigitalCardSubmission | null> => {
      try {
        const response = await fetch(`/api/apply/digital-card/submissions/${id}`, {
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
    async (id: string, reviewed: boolean, status?: string, hidden?: boolean) => {
      await dispatch(updateDigitalCardStatusAsync({ id, reviewed, status, hidden })).unwrap();
    },
    [dispatch]
  );

  const deleteSubmission = useCallback(
    async (id: string) => {
      await dispatch(deleteDigitalCardAsync(id)).unwrap();
    },
    [dispatch]
  );

  const convertToProfessional = useCallback(
    async (
      id: string
    ): Promise<{ success: boolean; professionalId?: string; error?: string }> => {
      try {
        const result = await dispatch(convertToProfessionalAsync(id)).unwrap();
        return { success: true, professionalId: result.professionalId };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to convert submission';
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    digitalCard,
    fetchSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    deleteSubmission,
    convertToProfessional,
  };
}

export default useDigitalCardSubmissionsRedux;
