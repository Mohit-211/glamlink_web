/**
 * useMarketingStats Hook
 *
 * React hook for fetching marketing statistics and metrics.
 *
 * @example
 * ```tsx
 * const { stats, loading, error, refetch } = useMarketingStats({
 *   brandId: 'brand-id',
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   attributionModel: 'last_non_direct_click'
 * });
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import type { MarketingStats, AttributionModel, UseMarketingStatsReturn } from '../types';

interface UseMarketingStatsOptions {
  brandId: string;
  startDate: string;
  endDate: string;
  attributionModel: AttributionModel;
}

export function useMarketingStats(options: UseMarketingStatsOptions): UseMarketingStatsReturn {
  const { brandId, startDate, endDate, attributionModel } = options;
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!brandId || !startDate || !endDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        brandId,
        startDate,
        endDate,
        attributionModel,
      });

      const response = await fetch(`/api/marketing/stats?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch marketing stats');
      }

      setStats(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const error = new Error(errorMessage);
      setError(error);
      console.error('Error fetching marketing stats:', err);
    } finally {
      setLoading(false);
    }
  }, [brandId, startDate, endDate, attributionModel]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
