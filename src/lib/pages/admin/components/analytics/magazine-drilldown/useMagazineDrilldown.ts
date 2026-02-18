/**
 * useMagazineDrilldown - Data fetching hook for magazine drilldown analytics
 */

import { useState, useEffect } from 'react';
import type {
  PageAnalyticsStats,
  InteractionBreakdown,
} from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface UseMagazineDrilldownReturn {
  // Page stats
  pageStats: PageAnalyticsStats[];
  pageStatsLoading: boolean;

  // Page count
  actualPageCount: number;
  pageCountLoading: boolean;

  // Interactions
  interactionData: InteractionBreakdown | null;
  interactionLoading: boolean;

  // Computed
  completionRate: string;
}

// =============================================================================
// HOOK
// =============================================================================

export function useMagazineDrilldown(
  issueId: string,
  initialPageCount: number,
  avgPagesPerSession: number,
  totalViews: number
): UseMagazineDrilldownReturn {
  const [pageStats, setPageStats] = useState<PageAnalyticsStats[]>([]);
  const [pageStatsLoading, setPageStatsLoading] = useState(false);
  const [actualPageCount, setActualPageCount] = useState<number>(initialPageCount);
  const [pageCountLoading, setPageCountLoading] = useState(false);
  const [interactionData, setInteractionData] = useState<InteractionBreakdown | null>(null);
  const [interactionLoading, setInteractionLoading] = useState(false);

  // Fetch actual page count from issue document
  useEffect(() => {
    const fetchIssueData = async () => {
      setPageCountLoading(true);
      try {
        const response = await fetch(`/api/magazine/issues/${issueId}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          // Page count = sections + cover + TOC
          setActualPageCount((data.sections?.length || 0) + 2);
        }
      } catch (error) {
        console.error('[useMagazineDrilldown] Error fetching issue:', error);
      } finally {
        setPageCountLoading(false);
      }
    };
    fetchIssueData();
  }, [issueId]);

  // Fetch page-level stats
  useEffect(() => {
    const fetchPageStats = async () => {
      setPageStatsLoading(true);
      console.log('[useMagazineDrilldown] Fetching page stats for issueId:', issueId);
      try {
        const response = await fetch(
          `/api/analytics/magazine-dashboard/${issueId}/pages?dateRange=all`,
          { credentials: 'include' }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('[useMagazineDrilldown] API response:', result);
          if (result.success && Array.isArray(result.data)) {
            setPageStats(result.data);
          }
        } else {
          console.error('[useMagazineDrilldown] API error:', response.status);
        }
      } catch (error) {
        console.error('[useMagazineDrilldown] Error fetching page stats:', error);
      } finally {
        setPageStatsLoading(false);
      }
    };

    fetchPageStats();
  }, [issueId]);

  // Fetch interaction breakdown
  useEffect(() => {
    const fetchInteractions = async () => {
      setInteractionLoading(true);
      console.log('[useMagazineDrilldown] Fetching interaction breakdown for issueId:', issueId);
      try {
        const response = await fetch(
          `/api/analytics/magazine-dashboard/${issueId}/interactions?dateRange=all`,
          { credentials: 'include' }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('[useMagazineDrilldown] Interactions API response:', result);
          if (result.success && result.data) {
            setInteractionData(result.data);
          }
        } else {
          console.error('[useMagazineDrilldown] Interactions API error:', response.status);
        }
      } catch (error) {
        console.error('[useMagazineDrilldown] Error fetching interactions:', error);
      } finally {
        setInteractionLoading(false);
      }
    };

    fetchInteractions();
  }, [issueId]);

  // Calculate completion rate
  const completionRate = totalViews > 0 && actualPageCount > 0
    ? ((avgPagesPerSession / actualPageCount) * 100).toFixed(1)
    : '0.0';

  return {
    pageStats,
    pageStatsLoading,
    actualPageCount,
    pageCountLoading,
    interactionData,
    interactionLoading,
    completionRate,
  };
}
