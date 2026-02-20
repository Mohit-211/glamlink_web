"use client";

/**
 * AnalyticsTab - Main analytics dashboard with tabs for Digital Cards and Magazines
 */

import React, { useState } from 'react';
import TableHeader from '@/lib/pages/admin/components/shared/table/TableHeader';
import { TabButton } from './shared';
import { DigitalCardsPanel, MagazinesPanel } from './panels';
import { useAnalyticsRedux } from '@/lib/pages/admin/hooks/useAnalyticsRedux';
import type { DateRangeOption } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

type AnalyticsTabType = 'digital-cards' | 'magazines';

const DATE_RANGE_OPTIONS: { value: DateRangeOption; label: string }[] = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'all', label: 'All Time' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function AnalyticsTab() {
  const [activeTab, setActiveTab] = useState<AnalyticsTabType>('digital-cards');

  const {
    // Digital Cards
    professionals,
    professionalsLoading,
    professionalsError,
    cardLastUpdated,

    // Magazines
    magazines,
    magazinesLoading,
    magazinesError,
    magazineLastUpdated,

    // Shared
    dateRange,
    setDateRange,
    refreshAll,
  } = useAnalyticsRedux();

  const isRefreshing = professionalsLoading || magazinesLoading;

  // Use activeTab to determine which lastUpdated to show
  const lastUpdated = activeTab === 'digital-cards' ? cardLastUpdated : magazineLastUpdated;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <TableHeader
          title="Analytics Dashboard"
          onRefresh={refreshAll}
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
        />

        {/* Date Range Filter & Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-3 flex items-center justify-between">
            {/* Tab Navigation */}
            <nav className="flex space-x-8">
              <TabButton
                label="Digital Cards"
                count={professionals.length}
                active={activeTab === 'digital-cards'}
                onClick={() => setActiveTab('digital-cards')}
              />
              <TabButton
                label="Magazines"
                count={magazines.length}
                active={activeTab === 'magazines'}
                onClick={() => setActiveTab('magazines')}
              />
            </nav>

            {/* Date Range Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Date Range:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {DATE_RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'digital-cards' ? (
          <DigitalCardsPanel
            professionals={professionals}
            isLoading={professionalsLoading}
            error={professionalsError}
          />
        ) : (
          <MagazinesPanel
            magazines={magazines}
            isLoading={magazinesLoading}
            error={magazinesError}
          />
        )}
      </div>
    </div>
  );
}
