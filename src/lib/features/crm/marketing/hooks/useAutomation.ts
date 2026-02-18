/**
 * useAutomation Hook
 *
 * Manages single automation fetching and updates
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Automation } from '../types';

/**
 * Hook Return Type
 */
interface UseAutomationReturn {
  automation: Automation | null;
  loading: boolean;
  error: string | null;
  updateAutomation: (updates: Partial<Automation>) => Promise<void>;
  saveAutomation: (automation: Automation) => Promise<void>;
  refresh: () => void;
}

/**
 * useAutomation Hook
 */
export function useAutomation(brandId: string, automationId: string): UseAutomationReturn {
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch automation
   */
  const fetchAutomation = useCallback(async () => {
    if (!brandId || !automationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/crm/marketing/automations/${automationId}?brandId=${brandId}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch automation');
      }

      const result = await response.json();

      if (result.success) {
        setAutomation(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch automation');
      }
    } catch (err) {
      console.error('Error fetching automation:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAutomation(null);
    } finally {
      setLoading(false);
    }
  }, [brandId, automationId]);

  /**
   * Update automation (partial)
   */
  const updateAutomation = useCallback(
    async (updates: Partial<Automation>): Promise<void> => {
      if (!automation) return;

      try {
        const response = await fetch(`/api/crm/marketing/automations/${automationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updates),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to update automation');
        }

        setAutomation((prev) => (prev ? { ...prev, ...updates } : null));
      } catch (err) {
        console.error('Error updating automation:', err);
        throw err;
      }
    },
    [automation, automationId]
  );

  /**
   * Save automation (full update)
   */
  const saveAutomation = useCallback(
    async (updatedAutomation: Automation): Promise<void> => {
      try {
        const response = await fetch(`/api/crm/marketing/automations/${automationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedAutomation),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to save automation');
        }

        setAutomation(result.data);
      } catch (err) {
        console.error('Error saving automation:', err);
        throw err;
      }
    },
    [automationId]
  );

  /**
   * Refresh
   */
  const refresh = useCallback(() => {
    fetchAutomation();
  }, [fetchAutomation]);

  /**
   * Fetch on mount
   */
  useEffect(() => {
    fetchAutomation();
  }, [fetchAutomation]);

  return {
    automation,
    loading,
    error,
    updateAutomation,
    saveAutomation,
    refresh,
  };
}

export default useAutomation;
