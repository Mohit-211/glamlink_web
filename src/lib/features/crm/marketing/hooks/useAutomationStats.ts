/**
 * useAutomationStats Hook
 *
 * Fetches automation performance statistics
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AutomationStats } from '../types';

/**
 * Hook Options
 */
interface UseAutomationStatsOptions {
  brandId: string;
  startDate: string;
  endDate: string;
}

/**
 * Hook Return Type
 */
interface UseAutomationStatsReturn {
  stats: AutomationStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * useAutomationStats Hook
 */
export function useAutomationStats(
  options: UseAutomationStatsOptions
): UseAutomationStatsReturn {
  const { brandId, startDate, endDate } = options;
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch stats
   */
  const fetchStats = useCallback(async () => {
    if (!brandId || !startDate || !endDate) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        brandId,
        startDate,
        endDate,
      });

      const response = await fetch(`/api/crm/marketing/automations/stats?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch automation stats');
      }

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch automation stats');
      }
    } catch (err) {
      console.error('Error fetching automation stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [brandId, startDate, endDate]);

  /**
   * Refresh
   */
  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  /**
   * Fetch on mount and option changes
   */
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}

export default useAutomationStats;
