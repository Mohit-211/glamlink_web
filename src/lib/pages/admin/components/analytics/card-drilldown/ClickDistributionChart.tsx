"use client";

/**
 * ClickDistributionChart - Click distribution chart for digital card drilldown
 */

import React from 'react';
import ClickBar from './ClickBar';
import type { CardAnalyticsStats } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface ClickDistributionChartProps {
  stats: CardAnalyticsStats;
  totalClicks: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ClickDistributionChart({
  stats,
  totalClicks,
}: ClickDistributionChartProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        Click Distribution
      </h3>
      <div className="bg-gray-50 rounded-lg p-4">
        {totalClicks > 0 ? (
          <div className="space-y-3">
            <ClickBar label="Book" value={stats.bookClicks} total={totalClicks} color="bg-pink-500" />
            <ClickBar label="Call" value={stats.callClicks} total={totalClicks} color="bg-blue-500" />
            <ClickBar label="Text" value={stats.textClicks} total={totalClicks} color="bg-green-500" />
            <ClickBar label="Website" value={stats.websiteClicks} total={totalClicks} color="bg-purple-500" />
            <ClickBar label="Instagram" value={stats.instagramClicks} total={totalClicks} color="bg-pink-400" />
            <ClickBar label="TikTok" value={stats.tiktokClicks} total={totalClicks} color="bg-gray-800" />
            <ClickBar label="Save Card" value={stats.saveCardClicks} total={totalClicks} color="bg-yellow-500" />
            <ClickBar label="Copy URL" value={stats.copyUrlClicks} total={totalClicks} color="bg-indigo-500" />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No click data available yet</p>
        )}
      </div>
    </div>
  );
}
