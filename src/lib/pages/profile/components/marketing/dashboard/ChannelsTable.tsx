/**
 * Channels Table Component
 *
 * Sortable table displaying marketing channel performance.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChannelAttribution } from '@/lib/features/crm/marketing/hooks';
import { AttributionModel } from '@/lib/features/crm/marketing/types';
import { ChannelIcon } from '../shared/ChannelIcon';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/features/crm/marketing/utils';

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
          Track your marketing channel performance with {attributionModel.replace(/_/g, ' ')} attribution.{' '}
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
                AOV
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              // Skeleton rows
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4" colSpan={7}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : sortedChannels.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={7}>
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
                  <td className="px-6 py-4 text-gray-500 capitalize">{channel.channelType}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatNumber(channel.sessions)}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(channel.sales)}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatNumber(channel.orders)}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatPercent(channel.conversionRate)}</td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {channel.aov ? formatCurrency(channel.aov) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
