"use client";

/**
 * DigitalCardDrilldown - Detailed analytics view for a single professional
 *
 * Composed from smaller focused components.
 */

import React from 'react';
import { DrilldownModal } from '../shared';
import StatsCard from '../StatsCard';
import ClickBreakdownGrid from './ClickBreakdownGrid';
import ClickDistributionChart from './ClickDistributionChart';
import type { ProfessionalAnalyticsSummary } from '../useAnalyticsDashboard';

// =============================================================================
// TYPES
// =============================================================================

interface DigitalCardDrilldownProps {
  professional: ProfessionalAnalyticsSummary;
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DigitalCardDrilldown({
  professional,
  onClose,
}: DigitalCardDrilldownProps) {
  const { stats } = professional;

  // Calculate total clicks
  const totalClicks =
    stats.bookClicks +
    stats.callClicks +
    stats.textClicks +
    stats.websiteClicks +
    stats.instagramClicks +
    stats.tiktokClicks +
    stats.saveCardClicks +
    stats.copyUrlClicks;

  // Calculate engagement rate (clicks / views * 100)
  const engagementRate = stats.totalViews > 0
    ? ((totalClicks / stats.totalViews) * 100).toFixed(1)
    : '0.0';

  return (
    <DrilldownModal
      title={professional.name}
      subtitle={professional.title}
      onClose={onClose}
    >
      {/* Overview Stats */}
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
            label="Total Clicks"
            value={totalClicks}
          />
          <StatsCard
            label="Engagement Rate"
            value={`${engagementRate}%`}
          />
        </div>
      </div>

      {/* Click Breakdown */}
      <ClickBreakdownGrid stats={stats} />

      {/* Click Distribution Chart */}
      <ClickDistributionChart stats={stats} totalClicks={totalClicks} />
    </DrilldownModal>
  );
}
