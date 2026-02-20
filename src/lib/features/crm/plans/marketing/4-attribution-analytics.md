# Attribution & Analytics Plan

> **Priority**: Reporting - Build after dashboard and messaging
> **Dependencies**: `1-marketing-infrastructure.md`, `2-marketing-dashboard.md`
> **Estimated Scope**: Attribution reports, channel analytics, export functionality

---

## Overview

The Attribution & Analytics system provides detailed insights into marketing channel performance, allowing professionals to understand which channels drive the most value. It includes time-series visualizations, detailed performance tables, and export capabilities.

---

## 1. Route Structure

```
app/profile/marketing/attribution/
├── page.tsx                    # Main attribution report
└── export/
    └── route.ts               # API route for CSV/PDF export
```

### File: `app/profile/marketing/attribution/page.tsx`

```typescript
import { redirect } from 'next/navigation';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { AttributionReport } from '@/lib/pages/profile/components/marketing/attribution';

export default async function AttributionPage() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect('/login?redirect=/profile/marketing/attribution');
  }

  return <AttributionReport />;
}
```

---

## 2. Main Attribution Report

### File: `lib/pages/profile/components/marketing/attribution/AttributionReport.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useBrand } from '@/lib/hooks/useBrand';
import { useChannelAttribution } from '@/lib/features/crm/marketing/hooks';
import { AttributionModel } from '@/lib/features/crm/marketing/types';
import { DateRangePicker } from '../dashboard/DateRangePicker';
import { ChannelChart } from './ChannelChart';
import { AttributionTable } from './AttributionTable';
import { ColumnSelector } from './ColumnSelector';
import { ExportMenu } from './ExportMenu';
import { getDateRange } from '@/lib/features/crm/marketing/utils';

export type ViewMode = 'channels' | 'campaigns';
export type TimeGranularity = 'daily' | 'weekly' | 'monthly';

const DEFAULT_COLUMNS = [
  'sessions', 'sales', 'orders', 'conversionRate',
  'roas', 'cpa', 'ctr', 'aov',
  'newCustomerOrders', 'returningCustomerOrders'
];

export function AttributionReport() {
  const { brand } = useBrand();
  const [dateRange, setDateRange] = useState(() => getDateRange('last_30_days'));
  const [viewMode, setViewMode] = useState<ViewMode>('channels');
  const [granularity, setGranularity] = useState<TimeGranularity>('daily');
  const [attributionModel, setAttributionModel] = useState<AttributionModel>('last_non_direct_click');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const { channels, timeSeriesData, loading, error } = useChannelAttribution({
    brandId: brand?.id || '',
    startDate: dateRange.start,
    endDate: dateRange.end,
    attributionModel,
    granularity,
  });

  if (!brand) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Attribution</h1>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('channels')}
              className={`px-4 py-2 text-sm ${
                viewMode === 'channels'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Channels
            </button>
            <button
              onClick={() => setViewMode('campaigns')}
              className={`px-4 py-2 text-sm border-l border-gray-200 ${
                viewMode === 'campaigns'
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Campaigns
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {/* Print report */}}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Print
          </button>
          <ExportMenu
            brandId={brand.id}
            dateRange={dateRange}
            attributionModel={attributionModel}
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />

          {/* Granularity Selector */}
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as TimeGranularity)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Attribution Model */}
        <div className="flex items-center space-x-3">
          <select
            value={attributionModel}
            onChange={(e) => setAttributionModel(e.target.value as AttributionModel)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
          >
            <option value="last_non_direct_click">Last non-direct click</option>
            <option value="last_click">Last click</option>
            <option value="first_click">First click</option>
            <option value="any_click">Any click</option>
            <option value="linear">Linear</option>
          </select>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Sessions by top 5 channels over time
          </h2>
        </div>

        <ChannelChart
          data={timeSeriesData || []}
          channels={channels?.slice(0, 5) || []}
          loading={loading}
        />
      </div>

      {/* Info Banner */}
      <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-blue-700">
          Cost, click, and impression metrics are now available for supported marketing apps.{' '}
          <a href="#" className="underline">Learn more</a>
        </p>
      </div>

      {/* Attribution Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Column Selector */}
          <div className="relative">
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span>Columns</span>
            </button>

            {showColumnSelector && (
              <ColumnSelector
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
                onClose={() => setShowColumnSelector(false)}
              />
            )}
          </div>
        </div>

        <AttributionTable
          channels={channels || []}
          visibleColumns={visibleColumns}
          loading={loading}
        />
      </div>
    </div>
  );
}
```

---

## 3. Channel Chart Component

### File: `lib/pages/profile/components/marketing/attribution/ChannelChart.tsx`

```typescript
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
```

---

## 4. Attribution Table

### File: `lib/pages/profile/components/marketing/attribution/AttributionTable.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ChannelAttribution } from '@/lib/features/crm/marketing/types';
import { ChannelIcon } from '../shared/ChannelIcon';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format';

interface AttributionTableProps {
  channels: ChannelAttribution[];
  visibleColumns: string[];
  loading: boolean;
}

type SortField = keyof ChannelAttribution;
type SortDirection = 'asc' | 'desc';

const COLUMN_CONFIG: Record<string, { label: string; format: 'number' | 'currency' | 'percent' | 'string' }> = {
  sessions: { label: 'Sessions', format: 'number' },
  sales: { label: 'Sales', format: 'currency' },
  orders: { label: 'Orders', format: 'number' },
  conversionRate: { label: 'Conversion rate', format: 'percent' },
  cost: { label: 'Cost', format: 'currency' },
  roas: { label: 'ROAS', format: 'number' },
  cpa: { label: 'CPA', format: 'currency' },
  ctr: { label: 'CTR', format: 'percent' },
  aov: { label: 'AOV', format: 'currency' },
  newCustomerOrders: { label: 'Orders from new customers', format: 'number' },
  returningCustomerOrders: { label: 'Orders from returning customers', format: 'number' },
};

export function AttributionTable({ channels, visibleColumns, loading }: AttributionTableProps) {
  const [sortField, setSortField] = useState<SortField>('sessions');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedChannels = [...channels].sort((a, b) => {
    const aVal = a[sortField] ?? 0;
    const bVal = b[sortField] ?? 0;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return 0;
  });

  const formatValue = (value: any, format: string): string => {
    if (value === null || value === undefined) return '—';

    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return formatPercent(value);
      case 'number':
        return formatNumber(value);
      default:
        return String(value);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-white">
              Channel
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            {visibleColumns.map((colKey) => {
              const config = COLUMN_CONFIG[colKey];
              if (!config) return null;

              return (
                <th
                  key={colKey}
                  onClick={() => handleSort(colKey as SortField)}
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>{config.label}</span>
                    {sortField === colKey && (
                      <span>{sortDirection === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4" colSpan={visibleColumns.length + 2}>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </td>
              </tr>
            ))
          ) : sortedChannels.length === 0 ? (
            <tr>
              <td className="px-6 py-12 text-center text-gray-500" colSpan={visibleColumns.length + 2}>
                No channel data available
              </td>
            </tr>
          ) : (
            sortedChannels.map((channel) => (
              <tr key={channel.channelId} className="hover:bg-gray-50">
                <td className="px-6 py-4 sticky left-0 bg-white">
                  <div className="flex items-center space-x-3">
                    <ChannelIcon channel={channel.channelName} />
                    <span className="font-medium text-gray-900">{channel.channelName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{channel.channelType}</td>
                {visibleColumns.map((colKey) => {
                  const config = COLUMN_CONFIG[colKey];
                  if (!config) return null;

                  const value = channel[colKey as keyof ChannelAttribution];

                  return (
                    <td key={colKey} className="px-6 py-4 text-right text-gray-900">
                      {formatValue(value, config.format)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>

        {/* Totals Row */}
        {sortedChannels.length > 0 && (
          <tfoot>
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-4 sticky left-0 bg-gray-50">Total</td>
              <td className="px-6 py-4">—</td>
              {visibleColumns.map((colKey) => {
                const config = COLUMN_CONFIG[colKey];
                if (!config) return null;

                // Calculate totals
                const total = sortedChannels.reduce((sum, ch) => {
                  const val = ch[colKey as keyof ChannelAttribution];
                  return sum + (typeof val === 'number' ? val : 0);
                }, 0);

                // For rates, calculate average instead
                const isRate = colKey.includes('Rate') || colKey === 'roas' || colKey === 'ctr';
                const displayValue = isRate ? total / sortedChannels.length : total;

                return (
                  <td key={colKey} className="px-6 py-4 text-right">
                    {formatValue(displayValue, config.format)}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
```

---

## 5. Column Selector

### File: `lib/pages/profile/components/marketing/attribution/ColumnSelector.tsx`

```typescript
'use client';

import { useRef, useEffect } from 'react';

interface ColumnSelectorProps {
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
  onClose: () => void;
}

const COLUMN_GROUPS = [
  {
    label: 'Referrer',
    columns: [
      { id: 'referringCategory', label: 'Referring category' },
      { id: 'referringUrl', label: 'Referring URL' },
      { id: 'channelType', label: 'Channel', disabled: true },
      { id: 'type', label: 'Type', disabled: true },
    ],
  },
  {
    label: 'Orders',
    columns: [
      { id: 'sales', label: 'Sales' },
      { id: 'orders', label: 'Orders' },
      { id: 'aov', label: 'AOV' },
      { id: 'cost', label: 'Cost' },
      { id: 'roas', label: 'ROAS' },
      { id: 'cpa', label: 'CPA' },
    ],
  },
  {
    label: 'Sessions',
    columns: [
      { id: 'sessions', label: 'Sessions' },
      { id: 'conversionRate', label: 'Conversion rate' },
      { id: 'ctr', label: 'CTR' },
      { id: 'newCustomerOrders', label: 'Orders from new customers' },
      { id: 'returningCustomerOrders', label: 'Orders from returning customers' },
    ],
  },
];

export function ColumnSelector({ visibleColumns, onChange, onClose }: ColumnSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId)) {
      onChange(visibleColumns.filter(c => c !== columnId));
    } else {
      onChange([...visibleColumns, columnId]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4">
        <input
          type="search"
          placeholder="Search for columns"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        {COLUMN_GROUPS.map((group) => (
          <div key={group.label} className="px-4 pb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">{group.label}</h4>
            <div className="space-y-1">
              {group.columns.map((col) => (
                <label
                  key={col.id}
                  className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer ${
                    col.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.id) || col.disabled}
                    onChange={() => !col.disabled && toggleColumn(col.id)}
                    disabled={col.disabled}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. Export Menu

### File: `lib/pages/profile/components/marketing/attribution/ExportMenu.tsx`

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { AttributionModel } from '@/lib/features/crm/marketing/types';

interface ExportMenuProps {
  brandId: string;
  dateRange: { start: string; end: string };
  attributionModel: AttributionModel;
}

export function ExportMenu({ brandId, dateRange, attributionModel }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(format);

    try {
      const params = new URLSearchParams({
        brandId,
        startDate: dateRange.start,
        endDate: dateRange.end,
        attributionModel,
        format,
      });

      const response = await fetch(`/api/marketing/attribution/export?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attribution-report-${dateRange.start}-to-${dateRange.end}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report');
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center space-x-2"
      >
        <span>Export</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting !== null}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            {exporting === 'csv' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span>Export as CSV</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting !== null}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            {exporting === 'pdf' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
            <span>Export as PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 7. Export API Route

### File: `app/api/marketing/attribution/export/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { AttributionService } from '@/lib/features/crm/marketing/services';

export async function GET(request: NextRequest) {
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const brandId = searchParams.get('brandId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const attributionModel = searchParams.get('attributionModel') || 'last_non_direct_click';
  const format = searchParams.get('format') || 'csv';

  if (!brandId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const attributionService = new AttributionService(db);
  const data = await attributionService.getChannelAttribution(
    brandId,
    startDate,
    endDate,
    attributionModel as any
  );

  if (format === 'csv') {
    const csv = generateCSV(data);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="attribution-report.csv"`,
      },
    });
  } else if (format === 'pdf') {
    // PDF generation would require a library like pdfmake or jsPDF
    // For now, return a simple text representation
    return NextResponse.json({ error: 'PDF export not yet implemented' }, { status: 501 });
  }

  return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
}

function generateCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = [
    'Channel', 'Type', 'Sessions', 'Sales', 'Orders',
    'Conversion Rate', 'ROAS', 'CPA', 'CTR', 'AOV',
    'New Customer Orders', 'Returning Customer Orders'
  ];

  const rows = data.map(channel => [
    channel.channelName,
    channel.channelType,
    channel.sessions,
    channel.sales,
    channel.orders,
    channel.conversionRate,
    channel.roas || '',
    channel.cpa || '',
    channel.ctr || '',
    channel.aov || '',
    channel.newCustomerOrders,
    channel.returningCustomerOrders,
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}
```

---

## 8. Hook for Channel Attribution

### File: `lib/features/crm/marketing/hooks/useChannelAttribution.ts`

```typescript
import { useState, useEffect } from 'react';
import { ChannelAttribution, AttributionModel } from '../types';

interface UseChannelAttributionOptions {
  brandId: string;
  startDate: string;
  endDate: string;
  attributionModel: AttributionModel;
  granularity?: 'daily' | 'weekly' | 'monthly';
}

interface TimeSeriesDataPoint {
  date: string;
  [channelId: string]: number | string;
}

interface UseChannelAttributionResult {
  channels: ChannelAttribution[] | null;
  timeSeriesData: TimeSeriesDataPoint[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useChannelAttribution(options: UseChannelAttributionOptions): UseChannelAttributionResult {
  const [channels, setChannels] = useState<ChannelAttribution[] | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!options.brandId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        brandId: options.brandId,
        startDate: options.startDate,
        endDate: options.endDate,
        attributionModel: options.attributionModel,
        granularity: options.granularity || 'daily',
      });

      const response = await fetch(`/api/marketing/channels?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch attribution data');

      const data = await response.json();
      setChannels(data.channels);
      setTimeSeriesData(data.timeSeries);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    options.brandId,
    options.startDate,
    options.endDate,
    options.attributionModel,
    options.granularity
  ]);

  return {
    channels,
    timeSeriesData,
    loading,
    error,
    refetch: fetchData,
  };
}
```

---

## 9. File Structure Summary

```
app/profile/marketing/attribution/
├── page.tsx
└── export/
    └── route.ts

lib/pages/profile/components/marketing/attribution/
├── index.ts
├── AttributionReport.tsx
├── ChannelChart.tsx
├── AttributionTable.tsx
├── ColumnSelector.tsx
└── ExportMenu.tsx

lib/features/crm/marketing/hooks/
└── useChannelAttribution.ts
```

---

## 10. Implementation Checklist

- [ ] Create attribution page route
- [ ] Build main `AttributionReport` container
- [ ] Implement `ChannelChart` with Recharts
- [ ] Build `AttributionTable` with sorting
- [ ] Create `ColumnSelector` for customization
- [ ] Build `ExportMenu` with CSV/PDF options
- [ ] Implement export API route
- [ ] Create `useChannelAttribution` hook
- [ ] Add print functionality
- [ ] Support multiple view modes (channels/campaigns)
- [ ] Add time granularity switching
- [ ] Implement sticky first column in table
- [ ] Add totals row calculation
- [ ] Test responsive layout
- [ ] Add loading skeletons

---

## 11. Dependencies

- **recharts**: For time-series line charts
- Existing date utilities from infrastructure plan
- Existing format utilities (currency, number, percent)

---

## 12. Future Enhancements

- Campaign-level attribution view
- Custom attribution windows
- Multi-touch attribution visualization
- Cohort analysis
- Customer journey mapping
- Comparison period overlay on chart
- Benchmark comparisons
