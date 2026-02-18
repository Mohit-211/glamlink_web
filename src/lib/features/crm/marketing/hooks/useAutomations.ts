/**
 * useAutomations Hook
 *
 * Manages automation fetching and CRUD operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Automation, CreateAutomationInput } from '../types';

/**
 * Hook Return Type
 */
interface UseAutomationsReturn {
  automations: Automation[];
  loading: boolean;
  error: string | null;
  createAutomation: (input: CreateAutomationInput) => Promise<Automation>;
  updateAutomation: (id: string, updates: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  refresh: () => void;
}

/**
 * useAutomations Hook
 */
export function useAutomations(brandId: string): UseAutomationsReturn {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch automations
   */
  const fetchAutomations = useCallback(async () => {
    if (!brandId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crm/marketing/automations?brandId=${brandId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch automations');
      }

      const result = await response.json();

      if (result.success) {
        setAutomations(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch automations');
      }
    } catch (err) {
      console.error('Error fetching automations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAutomations([]);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  /**
   * Create automation
   */
  const createAutomation = useCallback(
    async (input: CreateAutomationInput): Promise<Automation> => {
      try {
        const response = await fetch('/api/crm/marketing/automations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(input),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to create automation');
        }

        const newAutomation = result.data;
        setAutomations((prev) => [...prev, newAutomation]);

        return newAutomation;
      } catch (err) {
        console.error('Error creating automation:', err);
        throw err;
      }
    },
    []
  );

  /**
   * Update automation
   */
  const updateAutomation = useCallback(
    async (id: string, updates: Partial<Automation>): Promise<void> => {
      try {
        const response = await fetch(`/api/crm/marketing/automations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updates),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to update automation');
        }

        setAutomations((prev) =>
          prev.map((automation) =>
            automation.id === id ? { ...automation, ...updates } : automation
          )
        );
      } catch (err) {
        console.error('Error updating automation:', err);
        throw err;
      }
    },
    []
  );

  /**
   * Delete automation
   */
  const deleteAutomation = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/crm/marketing/automations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete automation');
      }

      setAutomations((prev) => prev.filter((automation) => automation.id !== id));
    } catch (err) {
      console.error('Error deleting automation:', err);
      throw err;
    }
  }, []);

  /**
   * Refresh
   */
  const refresh = useCallback(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  /**
   * Fetch on mount and brand change
   */
  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  return {
    automations,
    loading,
    error,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    refresh,
  };
}

export default useAutomations;
