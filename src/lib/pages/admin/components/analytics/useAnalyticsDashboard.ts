/**
 * useAnalyticsDashboard - Data fetching hook for admin analytics
 *
 * Provides unified data fetching for both digital cards and magazine analytics.
 */

import { useState, useEffect, useCallback } from 'react';
import type { CardAnalyticsStats, MagazineAnalyticsSummary, DateRangeOption } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

export interface ProfessionalAnalyticsSummary {
  id: string;
  name: string;
  profileImage?: string;
  title?: string;
  stats: CardAnalyticsStats;
}

export interface UseAnalyticsDashboardReturn {
  // Digital Cards
  professionals: ProfessionalAnalyticsSummary[];
  professionalsLoading: boolean;
  professionalsError: string | null;
  fetchProfessionals: () => Promise<void>;

  // Magazines
  magazines: MagazineAnalyticsSummary[];
  magazinesLoading: boolean;
  magazinesError: string | null;
  fetchMagazines: () => Promise<void>;

  // Shared
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
  refreshAll: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAnalyticsDashboard(): UseAnalyticsDashboardReturn {
  // State - Digital Cards
  const [professionals, setProfessionals] = useState<ProfessionalAnalyticsSummary[]>([]);
  const [professionalsLoading, setProfessionalsLoading] = useState(false);
  const [professionalsError, setProfessionalsError] = useState<string | null>(null);

  // State - Magazines
  const [magazines, setMagazines] = useState<MagazineAnalyticsSummary[]>([]);
  const [magazinesLoading, setMagazinesLoading] = useState(false);
  const [magazinesError, setMagazinesError] = useState<string | null>(null);

  // Shared state
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');

  // Fetch digital cards analytics
  const fetchProfessionals = useCallback(async () => {
    setProfessionalsLoading(true);
    setProfessionalsError(null);

    try {
      const response = await fetch(`/api/analytics/card-dashboard?dateRange=${dateRange}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setProfessionals(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('[useAnalyticsDashboard] Error fetching professionals:', error);
      setProfessionalsError(error instanceof Error ? error.message : 'Failed to fetch professionals analytics');
    } finally {
      setProfessionalsLoading(false);
    }
  }, [dateRange]);

  // Fetch magazine analytics
  const fetchMagazines = useCallback(async () => {
    setMagazinesLoading(true);
    setMagazinesError(null);

    try {
      const response = await fetch(`/api/analytics/magazine-dashboard?dateRange=${dateRange}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setMagazines(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('[useAnalyticsDashboard] Error fetching magazines:', error);
      setMagazinesError(error instanceof Error ? error.message : 'Failed to fetch magazine analytics');
    } finally {
      setMagazinesLoading(false);
    }
  }, [dateRange]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchProfessionals(), fetchMagazines()]);
  }, [fetchProfessionals, fetchMagazines]);

  // Fetch on mount and when date range changes
  useEffect(() => {
    refreshAll();
  }, [dateRange]); // refreshAll changes when dateRange changes

  return {
    // Digital Cards
    professionals,
    professionalsLoading,
    professionalsError,
    fetchProfessionals,

    // Magazines
    magazines,
    magazinesLoading,
    magazinesError,
    fetchMagazines,

    // Shared
    dateRange,
    setDateRange,
    refreshAll,
  };
}
