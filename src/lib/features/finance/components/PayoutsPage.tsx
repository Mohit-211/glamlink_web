/**
 * PayoutsPage Component
 *
 * List of all payouts with filtering
 */

'use client';

import { useState } from 'react';
import { Download, FileText, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { usePayouts } from '../hooks/usePayouts';
import { useFinanceExport } from '../hooks/useFinanceExport';
import { formatCurrency, FINANCE_DATE_RANGES } from '../config';
import PayoutStatusBadge from './PayoutStatusBadge';
import type { PayoutStatus } from '../types';

export default function PayoutsPage() {
  const { payouts, summary, isLoading, filterByStatus } = usePayouts();
  const { isExporting, exportPayouts } = useFinanceExport();
  const [selectedFilter, setSelectedFilter] = useState<'all' | PayoutStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (status: 'all' | PayoutStatus) => {
    setSelectedFilter(status);
    filterByStatus(status);
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      await exportPayouts(format);
    } catch (err) {
      alert('Failed to export payouts');
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        payout.id.toLowerCase().includes(searchLower) ||
        payout.payoutDate.includes(searchLower) ||
        payout.netAmount.toString().includes(searchLower)
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glamlink-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your payouts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link
            href="/profile/finance/transactions"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            View Transactions
          </Link>
        </div>
      </div>

      {/* To Be Paid */}
      <div className="bg-gradient-to-br from-glamlink-teal to-glamlink-teal/80 rounded-lg p-6 text-white">
        <h2 className="text-sm font-medium mb-2">To be paid</h2>
        <p className="text-3xl font-bold">{formatCurrency(summary?.toBePaid || 0)}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {FINANCE_DATE_RANGES.slice(1, 4).map(range => (
              <button
                key={range.value}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payouts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payout date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayouts.length > 0 ? (
              filteredPayouts.map((payout) => (
                <tr
                  key={payout.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/profile/finance/payouts/${payout.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/profile/finance/payouts/${payout.id}`}
                      className="text-sm font-medium text-glamlink-teal hover:text-glamlink-teal/80"
                    >
                      {new Date(payout.payoutDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payout.transactionStartDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PayoutStatusBadge status={payout.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(payout.netAmount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500">No payouts found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try changing the filters or search term
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
