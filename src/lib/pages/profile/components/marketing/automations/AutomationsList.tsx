/**
 * AutomationsList Component
 *
 * Displays a table of automations with performance metrics
 */

'use client';

import Link from 'next/link';
import { Automation } from '@/lib/features/crm/marketing/types';
import { StatusBadge } from '../shared/StatusBadge';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils/format';

interface AutomationsListProps {
  automations: Automation[];
  loading: boolean;
}

export function AutomationsList({ automations, loading }: AutomationsListProps) {
  if (loading) {
    return (
      <div className="p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  if (automations.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <svg
          className="w-12 h-12 text-gray-300 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <p className="font-medium text-gray-900">No automations yet</p>
        <p className="text-sm mt-1">Create your first automation from a template</p>
        <Link
          href="/profile/marketing/automations/templates"
          className="inline-block mt-4 px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Browse templates
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Marketing automation
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Reach
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Sessions
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Orders
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Conversion rate
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Sales
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Average order value
          </th>
          <th className="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {automations.map((automation) => (
          <tr key={automation.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <Link
                href={`/profile/marketing/automations/${automation.id}`}
                className="font-medium text-gray-900 hover:text-pink-600"
              >
                {automation.name}
              </Link>
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={automation.status} />
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatNumber(automation.metrics.triggered)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatNumber(automation.metrics.emailsOpened)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatNumber(automation.metrics.conversions)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {automation.metrics.triggered > 0
                ? formatPercent(
                    (automation.metrics.conversions / automation.metrics.triggered) * 100
                  )
                : '—'}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {formatCurrency(automation.metrics.revenue)}
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {automation.metrics.conversions > 0
                ? formatCurrency(automation.metrics.revenue / automation.metrics.conversions)
                : '—'}
            </td>
            <td className="px-6 py-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AutomationsList;
