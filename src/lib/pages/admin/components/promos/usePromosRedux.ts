import { useEffect, useCallback } from 'react';
import { PromoItem } from '@/lib/features/promos/config';
import { useAdminDispatch, useAdminSelector } from '../../hooks/useReduxAdmin';
import {
  fetchPromos as fetchPromosAsync,
  createPromo as createPromoAsync,
  updatePromo as updatePromoAsync,
  deletePromo as deletePromoAsync,
  batchUploadPromos as batchUploadPromosAsync,
  toggleFeatured as toggleFeaturedAction,
  toggleVisibility as toggleVisibilityAction,
} from '../../store/slices/promosSlice';

export interface UsePromosReduxReturn {
  // Data & state
  promos: PromoItem[];
  lastUpdated: number | null;  // NEW: Timestamp for cache display
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: boolean;

  // Operations
  fetchPromos: () => Promise<void>;
  createPromo: (data: PromoItem) => Promise<void>;
  updatePromo: (data: PromoItem) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
  toggleFeatured: (promo: PromoItem) => Promise<void>;
  toggleVisibility: (promo: PromoItem) => Promise<void>;
  batchUpload: (promos: PromoItem[]) => Promise<void>;
}

export function usePromosRedux(): UsePromosReduxReturn {
  const dispatch = useAdminDispatch();
  const { data, lastUpdated, isLoading, error, isSaving, isDeleting } = useAdminSelector(
    state => state.admin.promos
  );

  // Auto-fetch ONLY if cache is empty
  useEffect(() => {
    if (data.length === 0 && !isLoading) {
      dispatch(fetchPromosAsync());
    }
  }, []); // Empty deps - run once on mount

  // Manual refresh (always fetches from Firebase)
  const fetchPromos = useCallback(async () => {
    await dispatch(fetchPromosAsync()).unwrap();
  }, [dispatch]);

  // Create promo
  const createPromo = useCallback(async (promoData: PromoItem) => {
    await dispatch(createPromoAsync(promoData)).unwrap();
  }, [dispatch]);

  // Update promo
  const updatePromo = useCallback(async (promoData: PromoItem) => {
    await dispatch(updatePromoAsync(promoData)).unwrap();
  }, [dispatch]);

  // Delete promo
  const deletePromo = useCallback(async (id: string) => {
    await dispatch(deletePromoAsync(id)).unwrap();
  }, [dispatch]);

  // Toggle featured with optimistic update and revert on failure
  const toggleFeatured = useCallback(async (promo: PromoItem) => {
    // Optimistic update
    dispatch(toggleFeaturedAction(promo.id));

    try {
      const response = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured: !promo.featured }),
      });

      if (!response.ok) {
        // Revert on failure
        dispatch(toggleFeaturedAction(promo.id));
        throw new Error('Failed to update featured status');
      }
    } catch (err) {
      // Revert on error
      dispatch(toggleFeaturedAction(promo.id));
      throw err;
    }
  }, [dispatch]);

  // Toggle visibility with optimistic update and revert on failure
  const toggleVisibility = useCallback(async (promo: PromoItem) => {
    // Optimistic update
    dispatch(toggleVisibilityAction(promo.id));

    try {
      const response = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ visible: !promo.visible }),
      });

      if (!response.ok) {
        // Revert on failure
        dispatch(toggleVisibilityAction(promo.id));
        throw new Error('Failed to update visibility');
      }
    } catch (err) {
      // Revert on error
      dispatch(toggleVisibilityAction(promo.id));
      throw err;
    }
  }, [dispatch]);

  // Batch upload
  const batchUpload = useCallback(async (promos: PromoItem[]) => {
    await dispatch(batchUploadPromosAsync(promos)).unwrap();
  }, [dispatch]);

  return {
    promos: data,
    lastUpdated,  // EXPOSE TIMESTAMP
    isLoading,
    error,
    isSaving,
    isDeleting,
    fetchPromos,
    createPromo,
    updatePromo,
    deletePromo,
    toggleFeatured,
    toggleVisibility,
    batchUpload,
  };
}
