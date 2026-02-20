/**
 * Metric Card Component
 *
 * Displays a metric with label, value, and optional trend indicator.
 */

'use client';

interface MetricCardProps {
  label: string;
  value: number;
  format: 'number' | 'currency' | 'percent';
  loading?: boolean;
  trend?: React.ReactNode;
}

export function MetricCard({ label, value, format, loading, trend }: MetricCardProps) {
  const formattedValue = formatValue(value, format);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      ) : (
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-semibold text-gray-900">{formattedValue}</span>
          {trend}
        </div>
      )}
    </div>
  );
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
}
