import { useEffect, useCallback } from 'react';
import { useAdminDispatch, useAdminSelector } from './useReduxAdmin';
import {
  fetchMagazineAnalytics,
  fetchCardAnalytics,
  setDateRange as setDateRangeAction,
} from '../store/slices/analyticsSlice';
import type { ProfessionalAnalyticsSummary } from '../store/slices/analyticsSlice';
import type { MagazineAnalyticsSummary, DateRangeOption } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

export interface UseAnalyticsReduxReturn {
  // Magazine analytics
  magazines: MagazineAnalyticsSummary[];
  magazinesLoading: boolean;
  magazinesError: string | null;
  magazineLastUpdated: number | null;
  fetchMagazines: () => Promise<void>;

  // Digital cards analytics
  professionals: ProfessionalAnalyticsSummary[];
  professionalsLoading: boolean;
  professionalsError: string | null;
  cardLastUpdated: number | null;
  fetchProfessionals: () => Promise<void>;

  // Shared
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
  refreshAll: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAnalyticsRedux(): UseAnalyticsReduxReturn {
  const dispatch = useAdminDispatch();
  const state = useAdminSelector(state => state.admin.analytics);

  // Auto-fetch on mount if cache is empty
  useEffect(() => {
    if (state.magazineData.length === 0 && !state.magazineLoading) {
      dispatch(fetchMagazineAnalytics(state.dateRange));
    }
    if (state.cardData.length === 0 && !state.cardLoading) {
      dispatch(fetchCardAnalytics(state.dateRange));
    }
  }, []); // Empty deps - run once on mount

  // Manual refresh for magazines
  const fetchMagazines = useCallback(async () => {
    await dispatch(fetchMagazineAnalytics(state.dateRange)).unwrap();
  }, [dispatch, state.dateRange]);

  // Manual refresh for professionals
  const fetchProfessionals = useCallback(async () => {
    await dispatch(fetchCardAnalytics(state.dateRange)).unwrap();
  }, [dispatch, state.dateRange]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      dispatch(fetchMagazineAnalytics(state.dateRange)).unwrap(),
      dispatch(fetchCardAnalytics(state.dateRange)).unwrap(),
    ]);
  }, [dispatch, state.dateRange]);

  // Set date range and trigger refetch
  const setDateRange = useCallback((range: DateRangeOption) => {
    dispatch(setDateRangeAction(range));
    dispatch(fetchMagazineAnalytics(range));
    dispatch(fetchCardAnalytics(range));
  }, [dispatch]);

  return {
    // Magazine analytics
    magazines: state.magazineData,
    magazinesLoading: state.magazineLoading,
    magazinesError: state.magazineError,
    magazineLastUpdated: state.magazineLastUpdated,
    fetchMagazines,

    // Digital cards analytics
    professionals: state.cardData,
    professionalsLoading: state.cardLoading,
    professionalsError: state.cardError,
    cardLastUpdated: state.cardLastUpdated,
    fetchProfessionals,

    // Shared
    dateRange: state.dateRange,
    setDateRange,
    refreshAll,
  };
}
