/**
 * useCampaign Hook
 *
 * React hook for managing a single marketing campaign with local state and save functionality.
 *
 * Features:
 * - Auto-fetch campaign on mount
 * - Local state management for unsaved changes
 * - Save changes to server
 * - Loading and error states
 * - Prevents stale data with cache: 'no-store'
 *
 * @example
 * ```tsx
 * const { campaign, loading, error, updateCampaign, saveCampaign, hasUnsavedChanges } = useCampaign('brand-id', 'campaign-id');
 *
 * // Update local state (doesn't save to server)
 * updateCampaign({ subject: 'New Subject' });
 *
 * // Save changes to server
 * await saveCampaign();
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import type { Campaign, UseCampaignReturn } from '../types';

export function useCampaign(brandId: string, campaignId: string): UseCampaignReturn {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [originalCampaign, setOriginalCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch a single campaign from the API
   */
  const fetchCampaign = useCallback(async () => {
    if (!brandId || !campaignId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ brandId });

      const response = await fetch(`/api/marketing/campaigns/${campaignId}?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store', // CRITICAL: Prevent stale data
        credentials: 'include', // CRITICAL: Auth cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch campaign');
      }

      setCampaign(data.data);
      setOriginalCampaign(data.data); // Keep original for comparison
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const error = new Error(errorMessage);
      setError(error);
      console.error('Error fetching campaign:', err);
    } finally {
      setLoading(false);
    }
  }, [brandId, campaignId]);

  /**
   * Auto-fetch campaign on mount and when IDs change
   */
  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  /**
   * Update local campaign state (doesn't save to server)
   */
  const updateCampaign = useCallback((updates: Partial<Campaign>) => {
    setCampaign((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  /**
   * Save campaign changes to the server
   */
  const saveCampaign = async (): Promise<void> => {
    if (!campaign) {
      throw new Error('No campaign to save');
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/marketing/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...campaign, brandId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save campaign');
      }

      // Update both current and original state
      setCampaign(data.data);
      setOriginalCampaign(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const error = new Error(errorMessage);
      setError(error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Check if there are unsaved changes
   */
  const hasUnsavedChanges = campaign !== null && originalCampaign !== null
    ? JSON.stringify(campaign) !== JSON.stringify(originalCampaign)
    : false;

  return {
    campaign,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    updateCampaign,
    saveCampaign,
    refetch: fetchCampaign,
  };
}
