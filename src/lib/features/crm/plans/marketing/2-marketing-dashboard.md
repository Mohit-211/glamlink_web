# Marketing Dashboard Plan

> **Priority**: Core Overview - Build after infrastructure
> **Dependencies**: `1-marketing-infrastructure.md`
> **Estimated Scope**: Main dashboard, channels table, filtering, navigation

---

## Overview

The Marketing Dashboard is the central hub for professionals to monitor their marketing performance. It provides at-a-glance metrics, channel attribution data, and quick access to campaigns and automations.

---

## 1. Route Structure

### File: `app/profile/marketing/page.tsx`

```typescript
import { redirect } from 'next/navigation';
import { getAuthenticatedAppForUser } from '@/lib/auth/serverAuth';
import { MarketingDashboard } from '@/lib/pages/profile/components/marketing/dashboard';

export default async function MarketingPage() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect('/login?redirect=/profile/marketing');
  }

  return <MarketingDashboard />;
}
```

### File: `app/profile/marketing/layout.tsx`

```typescript
import { MarketingLayout } from '@/lib/pages/profile/components/marketing/MarketingLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
```

---

## 2. Navigation Structure

### Marketing Sub-Navigation

```
Marketing (main)
├── Overview          /profile/marketing
├── Campaigns         /profile/marketing/campaigns
├── Attribution       /profile/marketing/attribution
└── Automations       /profile/marketing/automations
```

### File: `lib/pages/profile/components/marketing/MarketingLayout.tsx`

```typescript
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const MARKETING_NAV_ITEMS = [
  { href: '/profile/marketing', label: 'Overview', exact: true },
  { href: '/profile/marketing/campaigns', label: 'Campaigns' },
  { href: '/profile/marketing/attribution', label: 'Attribution' },
  { href: '/profile/marketing/automations', label: 'Automations' },
];

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Marketing</h1>
      </div>

      {/* Sub Navigation */}
      <nav className="border-b border-gray-200">
        <div className="flex space-x-8">
          {MARKETING_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${isActive(item.href, item.exact)
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
```

---

## 3. Dashboard Components

### Main Dashboard Container

#### File: `lib/pages/profile/components/marketing/dashboard/MarketingDashboard.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useBrand } from '@/lib/hooks/useBrand';
import { useMarketingStats } from '@/lib/features/crm/marketing/hooks';
import { AttributionModel } from '@/lib/features/crm/marketing/types';
import { StatsOverview } from './StatsOverview';
import { ChannelsTable } from './ChannelsTable';
import { MarketingActivities } from './MarketingActivities';
import { DateRangePicker } from './DateRangePicker';
import { AttributionModelSelector } from './AttributionModelSelector';
import { getDateRange } from '@/lib/features/crm/marketing/utils';

export function MarketingDashboard() {
  const { brand } = useBrand();
  const [dateRange, setDateRange] = useState(() => getDateRange('last_30_days'));
  const [attributionModel, setAttributionModel] = useState<AttributionModel>('last_non_direct_click');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  const { stats, loading, error } = useMarketingStats({
    brandId: brand?.id || '',
    startDate: dateRange.start,
    endDate: dateRange.end,
    attributionModel,
  });

  if (!brand) return null;

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

      {/* Stats Overview Cards */}
      <StatsOverview
        stats={stats}
        loading={loading}
      />

      {/* Top Marketing Channels */}
      <ChannelsTable
        brandId={brand.id}
        startDate={dateRange.start}
        endDate={dateRange.end}
        attributionModel={attributionModel}
      />

      {/* Marketing App Activities */}
      <MarketingActivities brandId={brand.id} />
    </div>
  );
}
```

### Stats Overview Cards

#### File: `lib/pages/profile/components/marketing/dashboard/StatsOverview.tsx`

```typescript
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
      showSparkline: true,
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
```

### Channels Table

#### File: `lib/pages/profile/components/marketing/dashboard/ChannelsTable.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChannelAttribution } from '@/lib/features/crm/marketing/hooks';
import { ChannelAttribution, AttributionModel } from '@/lib/features/crm/marketing/types';
import { ChannelIcon } from '../shared/ChannelIcon';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format';

interface ChannelsTableProps {
  brandId: string;
  startDate: string;
  endDate: string;
  attributionModel: AttributionModel;
}

type SortField = 'sessions' | 'sales' | 'orders' | 'conversionRate';
type SortDirection = 'asc' | 'desc';

export function ChannelsTable({ brandId, startDate, endDate, attributionModel }: ChannelsTableProps) {
  const [sortField, setSortField] = useState<SortField>('sessions');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { channels, loading, error } = useChannelAttribution({
    brandId,
    startDate,
    endDate,
    attributionModel,
  });

  const sortedChannels = [...(channels || [])].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Top marketing channels</h2>
        <Link
          href="/profile/marketing/attribution"
          className="text-sm text-pink-600 hover:text-pink-700"
        >
          View report
        </Link>
      </div>

      {/* Info Banner */}
      <div className="mx-6 mt-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
        <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-blue-700">
          Cost, click, and impression metrics are now available for supported marketing apps.{' '}
          <a href="#" className="underline">Learn more</a>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('sessions')}
              >
                Sessions {sortField === 'sessions' && (sortDirection === 'desc' ? '↓' : '↑')}
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('sales')}
              >
                Sales {sortField === 'sales' && (sortDirection === 'desc' ? '↓' : '↑')}
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('orders')}
              >
                Orders {sortField === 'orders' && (sortDirection === 'desc' ? '↓' : '↑')}
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('conversionRate')}
              >
                Conversion rate {sortField === 'conversionRate' && (sortDirection === 'desc' ? '↓' : '↑')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROAS
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPA
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                CTR
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              // Skeleton rows
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4" colSpan={9}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : sortedChannels.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={9}>
                  No channel data available for this period
                </td>
              </tr>
            ) : (
              sortedChannels.map((channel) => (
                <tr key={channel.channelId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <ChannelIcon channel={channel.channelName} />
                      <span className="font-medium text-gray-900">{channel.channelName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{channel.channelType}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatNumber(channel.sessions)}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(channel.sales)}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{channel.orders}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatPercent(channel.conversionRate)}</td>
                  <td className="px-6 py-4 text-right text-gray-500">{channel.roas ?? '—'}</td>
                  <td className="px-6 py-4 text-right text-gray-500">{channel.cpa ?? '—'}</td>
                  <td className="px-6 py-4 text-right text-gray-500">{channel.ctr ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Date Range Picker

#### File: `lib/pages/profile/components/marketing/dashboard/DateRangePicker.tsx`

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { DATE_RANGE_PRESETS } from '@/lib/features/crm/marketing/constants';
import { formatDate } from '@/lib/utils/format';

interface DateRange {
  start: string;
  end: string;
  preset?: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.start);
  const [customEnd, setCustomEnd] = useState(value.end);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetSelect = (presetId: string) => {
    const range = getDateRangeFromPreset(presetId);
    onChange({ ...range, preset: presetId });
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    onChange({ start: customStart, end: customEnd, preset: 'custom' });
    setIsOpen(false);
  };

  const displayLabel = value.preset
    ? DATE_RANGE_PRESETS.find(p => p.id === value.preset)?.label || 'Custom'
    : `${formatDate(value.start)} - ${formatDate(value.end)}`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{displayLabel}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-[600px] bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex">
            {/* Presets Column */}
            <div className="w-48 border-r border-gray-200 py-2">
              {DATE_RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-gray-50
                    ${value.preset === preset.id ? 'bg-pink-50 text-pink-700' : 'text-gray-700'}
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar Column */}
            <div className="flex-1 p-4">
              <div className="flex space-x-4">
                {/* Start Date Input */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>

                {/* End Date Input */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomApply}
                  className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getDateRangeFromPreset(presetId: string): { start: string; end: string } {
  const today = new Date();
  const end = today.toISOString().split('T')[0];

  const preset = DATE_RANGE_PRESETS.find(p => p.id === presetId);
  if (!preset) return { start: end, end };

  const start = new Date(today);
  start.setDate(start.getDate() - preset.days);

  return {
    start: start.toISOString().split('T')[0],
    end,
  };
}
```

### Attribution Model Selector

#### File: `lib/pages/profile/components/marketing/dashboard/AttributionModelSelector.tsx`

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { ATTRIBUTION_MODELS, ATTRIBUTION_WINDOW_DAYS } from '@/lib/features/crm/marketing/constants';
import { AttributionModel } from '@/lib/features/crm/marketing/types';

interface AttributionModelSelectorProps {
  value: AttributionModel;
  onChange: (model: AttributionModel) => void;
}

export function AttributionModelSelector({ value, onChange }: AttributionModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedModel = ATTRIBUTION_MODELS.find(m => m.id === value);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span>{selectedModel?.name || 'Attribution model'}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">Attribution model</h3>
          </div>

          <div className="py-1">
            {ATTRIBUTION_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id as AttributionModel);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50
                  ${value === model.id ? 'bg-pink-50' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* Visual indicator */}
                  <div className="mt-1 flex space-x-0.5">
                    {model.id === 'linear' ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-gray-300 rounded" />
                      ))
                    ) : model.id === 'first_click' ? (
                      <>
                        <div className="w-1 h-4 bg-pink-500 rounded" />
                        <div className="w-1 h-3 bg-gray-200 rounded" />
                        <div className="w-1 h-2 bg-gray-200 rounded" />
                      </>
                    ) : model.id === 'last_click' || model.id === 'last_non_direct_click' ? (
                      <>
                        <div className="w-1 h-2 bg-gray-200 rounded" />
                        <div className="w-1 h-3 bg-gray-200 rounded" />
                        <div className="w-1 h-4 bg-pink-500 rounded" />
                      </>
                    ) : (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-pink-500 rounded" />
                      ))
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{model.name}</span>
                      {model.isDefault && (
                        <span className="text-xs text-gray-500">(default)</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{model.description}</p>
                  </div>

                  {value === model.id && (
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              A {ATTRIBUTION_WINDOW_DAYS}-day attribution window applies.{' '}
              <a href="#" className="text-pink-600 hover:underline">Learn more</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Marketing Activities Widget

#### File: `lib/pages/profile/components/marketing/dashboard/MarketingActivities.tsx`

```typescript
'use client';

import Link from 'next/link';
import { useCampaigns } from '@/lib/features/crm/marketing/hooks';
import { StatusBadge } from '../shared/StatusBadge';

interface MarketingActivitiesProps {
  brandId: string;
}

export function MarketingActivities({ brandId }: MarketingActivitiesProps) {
  const { campaigns, loading } = useCampaigns(brandId);

  // Group by app type
  const messagingCampaigns = campaigns.filter(c => c.type === 'email' || c.type === 'sms');

  const draftCount = messagingCampaigns.filter(c => c.status === 'draft').length;
  const sendingCount = messagingCampaigns.filter(c => c.status === 'sending').length;
  const activeCount = messagingCampaigns.filter(c => c.status === 'active').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Marketing app activities</h2>
        <Link
          href="/profile/marketing/campaigns"
          className="text-sm text-pink-600 hover:text-pink-700"
        >
          Explore apps
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">App</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activities in progress</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last activity</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="px-6 py-4" colSpan={3}>
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </td>
            </tr>
          ) : (
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Messaging</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {draftCount > 0 && (
                    <StatusBadge status="draft" count={draftCount} />
                  )}
                  {sendingCount > 0 && (
                    <StatusBadge status="sending" count={sendingCount} />
                  )}
                  {activeCount > 0 && (
                    <StatusBadge status="active" count={activeCount} />
                  )}
                  {draftCount === 0 && sendingCount === 0 && activeCount === 0 && (
                    <span className="text-gray-500">No activities</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {messagingCampaigns[0]?.updatedAt
                  ? new Date(messagingCampaigns[0].updatedAt).toLocaleDateString()
                  : '—'
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 4. Shared Components

### File: `lib/pages/profile/components/marketing/shared/MetricCard.tsx`

```typescript
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
```

### File: `lib/pages/profile/components/marketing/shared/StatusBadge.tsx`

```typescript
import { CAMPAIGN_STATUSES } from '@/lib/features/crm/marketing/constants';

interface StatusBadgeProps {
  status: string;
  count?: number;
}

export function StatusBadge({ status, count }: StatusBadgeProps) {
  const config = CAMPAIGN_STATUSES[status as keyof typeof CAMPAIGN_STATUSES] || {
    label: status,
    color: 'gray',
  };

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${colorClasses[config.color as keyof typeof colorClasses]}
    `}>
      {config.label}
      {count !== undefined && count > 0 && ` (${count})`}
    </span>
  );
}
```

### File: `lib/pages/profile/components/marketing/shared/ChannelIcon.tsx`

```typescript
interface ChannelIconProps {
  channel: string;
  size?: 'sm' | 'md' | 'lg';
}

const CHANNEL_ICONS: Record<string, { bg: string; icon: string }> = {
  'Direct': { bg: 'bg-gray-100', icon: '🔗' },
  'Google Search': { bg: 'bg-blue-100', icon: '🔍' },
  'Google Ads': { bg: 'bg-yellow-100', icon: '📢' },
  'Facebook': { bg: 'bg-blue-100', icon: '📘' },
  'Instagram': { bg: 'bg-pink-100', icon: '📷' },
  'TikTok': { bg: 'bg-gray-900', icon: '🎵' },
  'Email': { bg: 'bg-green-100', icon: '✉️' },
  'Referral': { bg: 'bg-purple-100', icon: '👥' },
};

export function ChannelIcon({ channel, size = 'md' }: ChannelIconProps) {
  const config = CHANNEL_ICONS[channel] || { bg: 'bg-gray-100', icon: '📊' };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className={`${config.bg} ${sizeClasses[size]} rounded-lg flex items-center justify-center`}>
      {config.icon}
    </div>
  );
}
```

---

## 5. File Structure Summary

```
app/profile/marketing/
├── page.tsx
├── layout.tsx
├── campaigns/
│   └── page.tsx
├── attribution/
│   └── page.tsx
└── automations/
    └── page.tsx

lib/pages/profile/components/marketing/
├── index.ts
├── MarketingLayout.tsx
├── dashboard/
│   ├── index.ts
│   ├── MarketingDashboard.tsx
│   ├── StatsOverview.tsx
│   ├── ChannelsTable.tsx
│   ├── DateRangePicker.tsx
│   ├── AttributionModelSelector.tsx
│   └── MarketingActivities.tsx
└── shared/
    ├── index.ts
    ├── MetricCard.tsx
    ├── StatusBadge.tsx
    ├── ChannelIcon.tsx
    └── TrendIndicator.tsx
```

---

## 6. Implementation Checklist

- [ ] Create route files (`app/profile/marketing/`)
- [ ] Create `MarketingLayout` with sub-navigation
- [ ] Implement `MarketingDashboard` container
- [ ] Build `StatsOverview` with metric cards
- [ ] Build `ChannelsTable` with sorting
- [ ] Build `DateRangePicker` with presets and custom dates
- [ ] Build `AttributionModelSelector` dropdown
- [ ] Build `MarketingActivities` summary widget
- [ ] Create shared components (MetricCard, StatusBadge, ChannelIcon)
- [ ] Connect to hooks from infrastructure plan
- [ ] Add loading states and error handling
- [ ] Test responsive layout
- [ ] Add empty states for no data scenarios

---

## 7. Design Notes

- Follow existing Glamlink design patterns (pink accent color, rounded corners)
- Use Tailwind CSS classes consistent with rest of app
- Ensure mobile responsiveness for all components
- Date picker should support both presets and custom ranges
- Attribution model selector should explain each model clearly
- Channels table should be sortable by any numeric column
