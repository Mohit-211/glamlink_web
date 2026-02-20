/**
 * Stats Overview Component
 *
 * Displays key marketing metrics in card format.
 */

'use client';

import { MarketingStats } from '@/lib/features/crm/marketing/types';
import { MetricCard } from '../shared/MetricCard';
import { TrendIndicator } from '../shared/TrendIndicator';

interface StatsOverviewProps {
  stats: MarketingStats | null;
  loading: boolean;
  comparison?: MarketingStats | null;
}

export function StatsOverview({ stats, loading, comparison }: StatsOverviewProps) {
  const metrics = [
    {
      label: 'Sessions',
      value: stats?.totalSessions ?? 0,
      previousValue: comparison?.totalSessions,
      format: 'number',
    },
    {
      label: 'Sales attributed to marketing',
      value: stats?.salesAttributedToMarketing ?? 0,
      previousValue: comparison?.salesAttributedToMarketing,
      format: 'currency',
    },
    {
      label: 'Orders attributed to marketing',
      value: stats?.ordersAttributedToMarketing ?? 0,
      previousValue: comparison?.ordersAttributedToMarketing,
      format: 'number',
    },
    {
      label: 'Conversion rate',
      value: stats?.conversionRate ?? 0,
      previousValue: comparison?.conversionRate,
      format: 'percent',
    },
    {
      label: 'AOV attributed to marketing',
      value: stats?.averageOrderValue ?? 0,
      previousValue: comparison?.averageOrderValue,
      format: 'currency',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          format={metric.format as 'number' | 'currency' | 'percent'}
          loading={loading}
          trend={
            metric.previousValue !== undefined ? (
              <TrendIndicator
                current={metric.value}
                previous={metric.previousValue}
              />
            ) : undefined
          }
        />
      ))}
    </div>
  );
}
