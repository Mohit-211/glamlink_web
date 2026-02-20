/**
 * useCampaigns Hook
 *
 * React hook for managing marketing campaigns with full CRUD operations.
 *
 * Features:
 * - Auto-fetch campaigns on mount
 * - Create, update, delete campaigns
 * - Optimistic UI updates
 * - Loading and error states
 * - Prevents stale data with cache: 'no-store'
 *
 * @example
 * ```tsx
 * const { campaigns, loading, error, createCampaign, updateCampaign, deleteCampaign, refetch } = useCampaigns('brand-id');
 *
 * // Create a campaign
 * await createCampaign({
 *   name: 'Summer Sale',
 *   type: 'email',
 *   subject: 'Get 20% off!',
 *   content: {...},
 *   recipientType: 'all',
 *   recipientCount: 1000
 * });
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import type { Campaign, CampaignStatus, UseCampaignsReturn } from '../types';

export function useCampaigns(brandId: string): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch campaigns from the API
   */
  const fetchCampaigns = useCallback(
    async (status?: CampaignStatus) => {
      if (!brandId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ brandId });
        if (status) {
          params.append('status', status);
        }

        const response = await fetch(`/api/marketing/campaigns?${params}`, {
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
          throw new Error(data.error || 'Failed to fetch campaigns');
        }

        setCampaigns(data.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        const error = new Error(errorMessage);
        setError(error);
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    },
    [brandId]
  );

  /**
   * Auto-fetch campaigns on mount and when brandId changes
   */
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  /**
   * Create a new campaign
   */
  const createCampaign = async (campaignData: Partial<Campaign>): Promise<Campaign> => {
    try {
      const response = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ brandId, ...campaignData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      // Optimistic update - add to beginning of list
      setCampaigns((prev) => [data.data, ...prev]);

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(errorMessage);
    }
  };

  /**
   * Update an existing campaign
   */
  const updateCampaign = async (
    campaignId: string,
    updates: Partial<Campaign>
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/marketing/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ brandId, ...updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update campaign');
      }

      // Optimistic update - update in list
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, ...updates } : campaign
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(errorMessage);
    }
  };

  /**
   * Delete a campaign
   */
  const deleteCampaign = async (campaignId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/marketing/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ brandId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete campaign');
      }

      // Optimistic update - remove from list
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(errorMessage);
    }
  };

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
