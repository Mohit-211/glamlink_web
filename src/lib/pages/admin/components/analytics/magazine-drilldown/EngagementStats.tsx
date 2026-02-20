"use client";

/**
 * EngagementStats - Engagement statistics section for magazine drilldown
 */

import React from 'react';
import StatsCard from '../StatsCard';
import type { MagazineAnalyticsStats } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface EngagementStatsProps {
  stats: MagazineAnalyticsStats;
  actualPageCount: number;
  pageCountLoading: boolean;
  completionRate: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function EngagementStats({
  stats,
  actualPageCount,
  pageCountLoading,
  completionRate,
}: EngagementStatsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        Engagement
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          label="CTA Clicks"
          value={stats.ctaClicks}
        />
        <StatsCard
          label="PDF Downloads"
          value={stats.pdfDownloads}
        />
        <StatsCard
          label="Total Pages"
          value={pageCountLoading ? '...' : actualPageCount}
        />
        <StatsCard
          label="Completion Rate"
          value={`${completionRate}%`}
        />
      </div>
    </div>
  );
}
