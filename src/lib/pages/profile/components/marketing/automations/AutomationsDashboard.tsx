/**
 * Automations Dashboard Component
 *
 * Main dashboard for marketing automations with stats, list, and essential templates
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useAutomations } from '@/lib/features/crm/marketing/hooks';
import { DateRangePicker } from '../dashboard/DateRangePicker';
import { AutomationStatsCards } from './AutomationStatsCards';
import { AutomationsList } from './AutomationsList';
import { EssentialTemplates } from './EssentialTemplates';
import { getDateRange } from '@/lib/features/crm/marketing/utils';

export function AutomationsDashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(() => getDateRange('last_30_days'));
  const [comparisonRange, setComparisonRange] = useState(() => getDateRange('previous_30_days'));

  // Get brandId from user
  const brandId = (user as any)?.brandId || '';

  const { automations, loading } = useAutomations(brandId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view automations</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Automations</h1>
        <Link
          href="/profile/marketing/automations/templates"
          className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          View templates
        </Link>
      </div>

      {/* Date Range Selectors */}
      <div className="flex items-center space-x-3">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        <DateRangePicker
          value={comparisonRange}
          onChange={setComparisonRange}
        />
      </div>

      {/* Stats Overview */}
      <AutomationStatsCards
        brandId={brandId}
        dateRange={dateRange}
        comparisonRange={comparisonRange}
      />

      {/* Automations List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-pink-600">All</button>
          </div>
        </div>

        <AutomationsList
          automations={automations}
          loading={loading}
        />
      </div>

      {/* Shopify Flow Integration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Manage automations in Flow</h3>
            <p className="text-sm text-gray-500 mt-1">
              View, edit, import, export, and duplicate automations by installing Flow.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">Glamlink Flow</span>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Install
            </button>
          </div>
        </div>
      </div>

      {/* Essential Templates */}
      <EssentialTemplates brandId={brandId} />

      {/* Footer Link */}
      <div className="text-center">
        <a href="#" className="text-sm text-pink-600 hover:underline">
          Learn more about automations
        </a>
      </div>
    </div>
  );
}

export default AutomationsDashboard;
