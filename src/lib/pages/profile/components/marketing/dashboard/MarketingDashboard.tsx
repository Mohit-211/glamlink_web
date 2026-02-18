/**
 * Marketing Dashboard Component
 *
 * Main dashboard container for marketing overview.
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useMarketingStats } from '@/lib/features/crm/marketing/hooks';
import { AttributionModel } from '@/lib/features/crm/marketing/types';
import { StatsOverview } from './StatsOverview';
import { ChannelsTable } from './ChannelsTable';
import { MarketingActivities } from './MarketingActivities';
import { DateRangePicker } from './DateRangePicker';
import { AttributionModelSelector } from './AttributionModelSelector';
import { getDateRange } from '@/lib/features/crm/marketing/utils';

export function MarketingDashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(() => getDateRange('last_30_days'));
  const [attributionModel, setAttributionModel] = useState<AttributionModel>('last_non_direct_click');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  // Get brandId from user (assuming user.brandId exists)
  const brandId = (user as any)?.brandId || 'test-brand-123';

  const { stats, loading, error } = useMarketingStats({
    brandId,
    startDate: dateRange.start,
    endDate: dateRange.end,
    attributionModel,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view marketing dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <button
            onClick={() => setComparisonEnabled(!comparisonEnabled)}
            className={`
              px-3 py-2 text-sm rounded-lg border
              ${comparisonEnabled
                ? 'bg-pink-50 border-pink-200 text-pink-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            {comparisonEnabled ? 'Comparing' : 'No comparison'}
          </button>
        </div>

        <AttributionModelSelector
          value={attributionModel}
          onChange={setAttributionModel}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading marketing data: {error.message}</p>
        </div>
      )}

      {/* Stats Overview Cards */}
      <StatsOverview
        stats={stats}
        loading={loading}
      />

      {/* Top Marketing Channels */}
      <ChannelsTable
        brandId={brandId}
        startDate={dateRange.start}
        endDate={dateRange.end}
        attributionModel={attributionModel}
      />

      {/* Marketing App Activities */}
      <MarketingActivities brandId={brandId} />
    </div>
  );
}
