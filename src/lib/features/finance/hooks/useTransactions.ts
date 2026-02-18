/**
 * useTransactions Hook
 *
 * Manages transaction data fetching and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
import type { Transaction, TransactionType, PayoutStatus, UseTransactionsReturn } from '../types';

export function useTransactions(): UseTransactionsReturn {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    dateRange: string;
    type: TransactionType | 'all';
    payoutStatus: PayoutStatus | 'all';
    orderId: string;
  }>({
    dateRange: 'all',
    type: 'all',
    payoutStatus: 'all',
    orderId: '',
  });

  const fetchTransactions = useCallback(async () => {
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
      if (filters.type !== 'all') {
        queryParams.append('type', filters.type);
      }
      if (filters.payoutStatus !== 'all') {
        queryParams.append('payoutStatus', filters.payoutStatus);
      }
      if (filters.orderId) {
        queryParams.append('orderId', filters.orderId);
      }

      const response = await fetch(`/api/finance/transactions?${queryParams}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filterByDateRange = useCallback((start: string, end: string) => {
    setFilters(prev => ({ ...prev, dateRange: `${start}:${end}` }));
  }, []);

  const filterByType = useCallback((type: TransactionType | 'all') => {
    setFilters(prev => ({ ...prev, type }));
  }, []);

  const filterByPayoutStatus = useCallback((payoutStatus: PayoutStatus | 'all') => {
    setFilters(prev => ({ ...prev, payoutStatus }));
  }, []);

  const filterByOrder = useCallback((orderId: string) => {
    setFilters(prev => ({ ...prev, orderId }));
  }, []);

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  const getTransactionsByPayout = useCallback(async (payoutId: string): Promise<Transaction[]> => {
    if (!user?.uid) return [];

    try {
      const response = await fetch(`/api/finance/transactions/payout/${payoutId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      return data.transactions || [];
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return [];
    }
  }, [user?.uid]);

  return {
    transactions,
    isLoading,
    error,
    filterByDateRange,
    filterByType,
    filterByPayoutStatus,
    filterByOrder,
    refreshTransactions,
    getTransactionsByPayout,
  };
}
