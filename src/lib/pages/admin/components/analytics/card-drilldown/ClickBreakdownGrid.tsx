"use client";

/**
 * ClickBreakdownGrid - Click breakdown stats grid for digital card drilldown
 */

import React from 'react';
import StatsCard from '../StatsCard';
import type { CardAnalyticsStats } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface ClickBreakdownGridProps {
  stats: CardAnalyticsStats;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ClickBreakdownGrid({ stats }: ClickBreakdownGridProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        Click Breakdown
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          label="Book Appointment"
          value={stats.bookClicks}
        />
        <StatsCard
          label="Call"
          value={stats.callClicks}
        />
        <StatsCard
          label="Text"
          value={stats.textClicks}
        />
        <StatsCard
          label="Website"
          value={stats.websiteClicks}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <StatsCard
          label="Instagram"
          value={stats.instagramClicks}
        />
        <StatsCard
          label="TikTok"
          value={stats.tiktokClicks}
        />
        <StatsCard
          label="Save Card"
          value={stats.saveCardClicks}
        />
        <StatsCard
          label="Copy URL"
          value={stats.copyUrlClicks}
        />
      </div>
    </div>
  );
}
