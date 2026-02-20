"use client";

/**
 * OverviewStats - Overview statistics section for magazine drilldown
 */

import React from 'react';
import StatsCard from '../StatsCard';
import type { MagazineAnalyticsStats } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface OverviewStatsProps {
  stats: MagazineAnalyticsStats;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        Overview
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          label="Total Views"
          value={stats.totalViews}
        />
        <StatsCard
          label="Unique Visitors"
          value={stats.uniqueVisitors}
        />
        <StatsCard
          label="Total Page Views"
          value={stats.totalPageViews}
        />
        <StatsCard
          label="Avg Pages/Session"
          value={stats.avgPagesPerSession.toFixed(1)}
        />
      </div>
    </div>
  );
}
