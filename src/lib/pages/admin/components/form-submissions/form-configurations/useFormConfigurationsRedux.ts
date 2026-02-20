'use client';

/**
 * useFormConfigurationsRedux - Redux hook for Form Configurations with caching
 *
 * Provides access to all form configuration data (Get Featured & Digital Card forms)
 * with automatic caching. Data is only fetched if the cache is empty.
 */

import { useEffect, useCallback } from 'react';
import { useAdminDispatch, useAdminSelector } from '@/lib/pages/admin/hooks/useReduxAdmin';
import type {
  UnifiedFormConfig,
  FormCategory,
} from './types';
import {
  fetchFormConfigs as fetchFormConfigsAsync,
  createFormConfig as createFormConfigAsync,
  updateFormConfig as updateFormConfigAsync,
  deleteFormConfig as deleteFormConfigAsync,
  migrateGetFeaturedForms as migrateGetFeaturedAsync,
  migrateDigitalCardForm as migrateDigitalCardAsync,
  toggleFormConfigEnabled,
} from '@/lib/pages/admin/store/slices/form-submissions';

// =============================================================================
// TYPES
// =============================================================================

export interface UseFormConfigurationsReduxReturn {
  // State
  formConfigs: {
    data: UnifiedFormConfig[];
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
    isDeleting: boolean;
    isMigrating: boolean;
  };

  // Operations
  fetchFormConfigs: () => Promise<void>;
  getFormConfigById: (id: string, category: FormCategory) => Promise<UnifiedFormConfig | null>;
  createFormConfig: (data: Partial<UnifiedFormConfig>) => Promise<void>;
  updateFormConfig: (data: Partial<UnifiedFormConfig>) => Promise<void>;
  deleteFormConfig: (id: string, category: FormCategory) => Promise<void>;
  toggleFormConfigEnabledState: (config: UnifiedFormConfig) => Promise<void>;
  migrateGetFeaturedForms: () => Promise<{ success: boolean; message: string }>;
  migrateDigitalCardForm: () => Promise<{ success: boolean; message: string }>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useFormConfigurationsRedux(): UseFormConfigurationsReduxReturn {
  const dispatch = useAdminDispatch();

  // Select state from Redux
  const formConfigs = useAdminSelector((state) => state.admin.formSubmissions.formConfigs);

  // ===========================================================================
  // AUTO-FETCH ON MOUNT (only if cache empty)
  // ===========================================================================

  useEffect(() => {
    if (formConfigs.data.length === 0 && !formConfigs.isLoading) {
      dispatch(fetchFormConfigsAsync());
    }
  }, []); // Empty deps - run once on mount

  // ===========================================================================
  // OPERATIONS
  // ===========================================================================

  const fetchFormConfigs = useCallback(async () => {
    await dispatch(fetchFormConfigsAsync()).unwrap();
  }, [dispatch]);

  const getFormConfigById = useCallback(
    async (id: string, category: FormCategory): Promise<UnifiedFormConfig | null> => {
      try {
        const endpoint =
          category === 'get-featured'
            ? `/api/get-featured/forms/${id}`
            : `/api/form-configs/digital-card/${id}`;

        const response = await fetch(endpoint, { credentials: 'include' });

        if (!response.ok) {
          throw new Error(`Failed to fetch form configuration: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          return { ...data.data, category };
        }

        return null;
      } catch (err) {
        console.error('Error fetching form config:', err);
        return null;
      }
    },
    []
  );

  const createFormConfig = useCallback(
    async (data: Partial<UnifiedFormConfig>) => {
      await dispatch(createFormConfigAsync(data)).unwrap();
    },
    [dispatch]
  );

  const updateFormConfig = useCallback(
    async (data: Partial<UnifiedFormConfig>) => {
      await dispatch(updateFormConfigAsync(data)).unwrap();
    },
    [dispatch]
  );

  const deleteFormConfig = useCallback(
    async (id: string, category: FormCategory) => {
      await dispatch(deleteFormConfigAsync({ id, category })).unwrap();
    },
    [dispatch]
  );

  const toggleFormConfigEnabledState = useCallback(
    async (config: UnifiedFormConfig) => {
      // Optimistic update
      dispatch(toggleFormConfigEnabled({ id: config.id, category: config.category }));

      try {
        await dispatch(
          updateFormConfigAsync({
            id: config.id,
            category: config.category,
            enabled: !config.enabled,
          })
        ).unwrap();
      } catch (err) {
        // Revert on failure
        dispatch(toggleFormConfigEnabled({ id: config.id, category: config.category }));
        throw err;
      }
    },
    [dispatch]
  );

  const migrateGetFeaturedForms = useCallback(async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const message = await dispatch(migrateGetFeaturedAsync()).unwrap();
      // Refetch form configs after migration
      await dispatch(fetchFormConfigsAsync()).unwrap();
      return { success: true, message };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Migration failed',
      };
    }
  }, [dispatch]);

  const migrateDigitalCardForm = useCallback(async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const message = await dispatch(migrateDigitalCardAsync()).unwrap();
      // Refetch form configs after migration
      await dispatch(fetchFormConfigsAsync()).unwrap();
      return { success: true, message };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Migration failed',
      };
    }
  }, [dispatch]);

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    formConfigs,
    fetchFormConfigs,
    getFormConfigById,
    createFormConfig,
    updateFormConfig,
    deleteFormConfig,
    toggleFormConfigEnabledState,
    migrateGetFeaturedForms,
    migrateDigitalCardForm,
  };
}

export default useFormConfigurationsRedux;
