/**
 * usePayouts Hook
 *
 * Manages payout data fetching and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { Payout, FinanceSummary, PayoutStatus, UsePayoutsReturn } from '../types';

export function usePayouts(): UsePayoutsReturn {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    dateRange: string;
    status: PayoutStatus | 'all';
  }>({
    dateRange: 'all',
    status: 'all',
  });

  const fetchPayouts = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.dateRange !== 'all') {
        queryParams.append('dateRange', filters.dateRange);
      }
      if (filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }

      const response = await fetch(`/api/finance/payouts?${queryParams}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payouts');
      }

      const data = await response.json();
      setPayouts(data.payouts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payouts');
      console.error('Error fetching payouts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, filters]);

  const fetchSummary = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch('/api/finance/summary', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const filterByDateRange = useCallback((start: string, end: string) => {
    setFilters(prev => ({ ...prev, dateRange: `${start}:${end}` }));
  }, []);

  const filterByStatus = useCallback((status: PayoutStatus | 'all') => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const refreshPayouts = useCallback(async () => {
    await Promise.all([fetchPayouts(), fetchSummary()]);
  }, [fetchPayouts, fetchSummary]);

  const getPayoutById = useCallback(async (id: string): Promise<Payout | null> => {
    if (!user?.uid) return null;

    try {
      const response = await fetch(`/api/finance/payouts/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payout');
      }

      const data = await response.json();
      return data.payout;
    } catch (err) {
      console.error('Error fetching payout:', err);
      return null;
    }
  }, [user?.uid]);

  return {
    payouts,
    summary,
    isLoading,
    error,
    filterByDateRange,
    filterByStatus,
    refreshPayouts,
    getPayoutById,
  };
}
