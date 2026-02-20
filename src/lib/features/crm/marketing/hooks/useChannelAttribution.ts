/**
 * useChannelAttribution Hook
 *
 * React hook for fetching channel attribution data and time series.
 *
 * @example
 * ```tsx
 * const { channels, timeSeriesData, loading, error, refetch } = useChannelAttribution({
 *   brandId: 'brand-id',
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   attributionModel: 'last_non_direct_click'
 * });
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  ChannelAttribution,
  AttributionModel,
  TimeSeriesDataPoint,
  UseChannelAttributionReturn,
} from '../types';

interface UseChannelAttributionOptions {
  brandId: string;
  startDate: string;
  endDate: string;
  attributionModel: AttributionModel;
}

export function useChannelAttribution(
  options: UseChannelAttributionOptions
): UseChannelAttributionReturn {
  const { brandId, startDate, endDate, attributionModel } = options;
  const [channels, setChannels] = useState<ChannelAttribution[] | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[] | null>(null);
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

      const response = await fetch(`/api/marketing/channels?${params}`, {
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
        throw new Error(data.error || 'Failed to fetch channel attribution');
      }

      setChannels(data.data.channels || []);
      setTimeSeriesData(data.data.timeSeries || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const error = new Error(errorMessage);
      setError(error);
      console.error('Error fetching channel attribution:', err);
    } finally {
      setLoading(false);
    }
  }, [brandId, startDate, endDate, attributionModel]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    channels,
    timeSeriesData,
    loading,
    error,
    refetch,
  };
}
