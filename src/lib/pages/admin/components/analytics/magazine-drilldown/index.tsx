"use client";

/**
 * MagazineDrilldown - Detailed analytics view for a single magazine issue
 *
 * Composed from smaller focused components.
 */

import React from 'react';
import { DrilldownModal } from '../shared';
import { useMagazineDrilldown } from './useMagazineDrilldown';
import OverviewStats from './OverviewStats';
import EngagementStats from './EngagementStats';
import PageStatsTable from './PageStatsTable';
import CTAClicksTable from './CTAClicksTable';
import LinkClicksTable from './LinkClicksTable';
import VideoPlaysTable from './VideoPlaysTable';
import type { MagazineAnalyticsSummary } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface MagazineDrilldownProps {
  magazine: MagazineAnalyticsSummary;
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function MagazineDrilldown({
  magazine,
  onClose,
}: MagazineDrilldownProps) {
  const { stats } = magazine;

  const {
    pageStats,
    pageStatsLoading,
    actualPageCount,
    pageCountLoading,
    interactionData,
    interactionLoading,
    completionRate,
  } = useMagazineDrilldown(
    magazine.issueId,
    magazine.pageCount || 0,
    stats.avgPagesPerSession,
    stats.totalViews
  );

  return (
    <DrilldownModal
      title={magazine.title}
      subtitle={`Issue #${magazine.issueNumber}`}
      onClose={onClose}
    >
      {/* Overview Stats */}
      <OverviewStats stats={stats} />

      {/* Engagement Stats */}
      <EngagementStats
        stats={stats}
        actualPageCount={actualPageCount}
        pageCountLoading={pageCountLoading}
        completionRate={completionRate}
      />

      {/* Page Stats Table */}
      <PageStatsTable
        pageStats={pageStats}
        isLoading={pageStatsLoading}
      />

      {/* Interaction Breakdown Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          Interaction Breakdown
        </h3>

        {interactionLoading ? (
          <div className="p-6 text-center text-gray-500">Loading interaction data...</div>
        ) : (
          <div className="space-y-6">
            <CTAClicksTable ctaClicks={interactionData?.ctaClicks} />
            <LinkClicksTable linkClicks={interactionData?.linkClicks} />
            <VideoPlaysTable videoPlays={interactionData?.videoPlays} />
          </div>
        )}
      </div>
    </DrilldownModal>
  );
}
