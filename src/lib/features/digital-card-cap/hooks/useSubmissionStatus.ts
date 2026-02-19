'use client';

import { useState, useEffect, useCallback } from 'react';
import { SubmissionStatus } from '../types';
import { MAX_SUBMISSIONS } from '../config';

interface UseSubmissionStatusReturn {
  status: SubmissionStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSubmissionStatus(): UseSubmissionStatusReturn {
  const [status, setStatus] = useState<SubmissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/apply/digital-card/status', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submission status');
      }

      const data = await response.json();

      if (data.success) {
        setStatus({
          currentCount: data.data.currentCount,
          maxAllowed: data.data.maxAllowed,
          isAccepting: data.data.isAccepting,
          spotsRemaining: data.data.maxAllowed - data.data.currentCount,
          lastUpdated: data.data.lastUpdated ? new Date(data.data.lastUpdated) : undefined,
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching submission status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check availability');
      // Set default status if API fails
      setStatus({
        currentCount: 0,
        maxAllowed: MAX_SUBMISSIONS,
        isAccepting: true,
        spotsRemaining: MAX_SUBMISSIONS,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
