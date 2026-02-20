/**
 * Attribution Table Component
 *
 * Sortable table displaying channel performance metrics.
 * Features customizable columns, sticky first column, and totals row.
 */

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
