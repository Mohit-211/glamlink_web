/**
 * Attribution Report Component
 *
 * Main attribution analytics page with:
 * - Time-series charts
 * - Attribution table with customizable columns
 * - Export functionality (CSV/PDF)
 * - View mode switching (channels/campaigns)
 */

'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
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
  const { user } = useAuth();
  const brandId = (user as any)?.brandId || 'test-brand-123';

  const [dateRange, setDateRange] = useState(() => getDateRange('last_30_days'));
  const [viewMode, setViewMode] = useState<ViewMode>('channels');
  const [granularity, setGranularity] = useState<TimeGranularity>('daily');
  const [attributionModel, setAttributionModel] = useState<AttributionModel>('last_non_direct_click');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const { channels, timeSeriesData, loading, error } = useChannelAttribution({
    brandId,
    startDate: dateRange.start,
    endDate: dateRange.end,
    attributionModel,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view attribution analytics</p>
      </div>
    );
  }

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
            onClick={() => window.print()}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Print
          </button>
          <ExportMenu
            brandId={brandId}
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
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Attribution Model */}
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600">Attribution model:</label>
          <select
            value={attributionModel}
            onChange={(e) => setAttributionModel(e.target.value as AttributionModel)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="last_non_direct_click">Last non-direct click</option>
            <option value="last_click">Last click</option>
            <option value="first_click">First click</option>
            <option value="any_click">Any click</option>
            <option value="linear">Linear</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading attribution data: {error.message}</p>
        </div>
      )}

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {viewMode === 'channels' ? 'Sessions by top 5 channels over time' : 'Sessions by top 5 campaigns over time'}
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
