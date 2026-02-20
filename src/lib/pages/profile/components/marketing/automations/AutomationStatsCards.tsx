/**
 * AutomationStatsCards Component
 *
 * Displays 6 KPI metric cards for the automations dashboard
 */

'use client';

import { useAutomationStats } from '@/lib/features/crm/marketing/hooks';
import { MetricCard } from '../shared/MetricCard';

interface AutomationStatsCardsProps {
  brandId: string;
  dateRange: { start: string; end: string };
  comparisonRange?: { start: string; end: string };
}

export function AutomationStatsCards({
  brandId,
  dateRange,
  comparisonRange,
}: AutomationStatsCardsProps) {
  const { stats, loading } = useAutomationStats({
    brandId,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  const metrics = [
    { label: 'Total Automations', value: stats?.totalAutomations || 0, format: 'number' as const },
    { label: 'Active', value: stats?.activeAutomations || 0, format: 'number' as const },
    { label: 'Triggered', value: stats?.totalTriggered || 0, format: 'number' as const },
    { label: 'Completed', value: stats?.totalCompleted || 0, format: 'number' as const },
    {
      label: 'Conversion rate',
      value: stats?.conversionRate || 0,
      format: 'percent' as const,
    },
    { label: 'Revenue', value: stats?.revenueGenerated || 0, format: 'currency' as const },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          format={metric.format}
          loading={loading}
        />
      ))}
    </div>
  );
}

export default AutomationStatsCards;
