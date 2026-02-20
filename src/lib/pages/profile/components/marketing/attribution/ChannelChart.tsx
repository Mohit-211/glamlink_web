/**
 * Channel Chart Component
 *
 * Time-series line chart showing sessions by top channels over time.
 * Uses Recharts library for visualization.
 */

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChannelAttribution } from '@/lib/features/crm/marketing/types';

interface TimeSeriesDataPoint {
  date: string;
  [channelId: string]: number | string;
}

interface ChannelChartProps {
  data: TimeSeriesDataPoint[];
  channels: ChannelAttribution[];
  loading: boolean;
}

const CHANNEL_COLORS = [
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#f97316', // orange
  '#10b981', // green
  '#f43f5e', // rose
];

export function ChannelChart({ data, channels, loading }: ChannelChartProps) {
  const formattedData = useMemo(() => {
    return data.map(point => ({
      ...point,
      date: formatChartDate(point.date),
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
          />

          {channels.map((channel, index) => (
            <Line
              key={channel.channelId}
              type="monotone"
              dataKey={channel.channelId}
              name={channel.channelName}
              stroke={CHANNEL_COLORS[index % CHANNEL_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
