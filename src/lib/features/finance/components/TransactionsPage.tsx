/**
 * TransactionsPage Component
 *
 * Detailed transaction list with filtering
 */

'use client';

import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import Link from 'next/link';
import { useTransactions } from '../hooks/useTransactions';
import { useFinanceExport } from '../hooks/useFinanceExport';
import { formatCurrency, getTransactionTypeConfig, FINANCE_DATE_RANGES } from '../config';
import PayoutStatusBadge from './PayoutStatusBadge';
import PaymentMethodIcon from './PaymentMethodIcon';

export default function TransactionsPage() {
  const { transactions, isLoading } = useTransactions();
  const { isExporting, exportTransactions } = useFinanceExport();
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      await exportTransactions(format);
    } catch (err) {
      alert('Failed to export transactions');
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        txn.id.toLowerCase().includes(searchLower) ||
        txn.orderId?.toLowerCase().includes(searchLower) ||
        txn.description.toLowerCase().includes(searchLower)
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
          <h1 className="text-2xl font-bold text-gray-900">Order Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all transaction details
          </p>
        </div>
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-900 text-white">
              All
            </button>
            {FINANCE_DATE_RANGES.slice(3, 5).map(range => (
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
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payout date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => {
                  const typeConfig = getTransactionTypeConfig(txn.type);
                  return (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(txn.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {txn.payoutDate ? (
                          <Link
                            href={`/profile/finance/payouts/${txn.payoutId}`}
                            className="text-glamlink-teal hover:text-glamlink-teal/80"
                          >
                            {new Date(txn.payoutDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PayoutStatusBadge status={txn.payoutStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {txn.orderId ? (
                          <Link
                            href={`/profile/orders/${txn.orderId}`}
                            className="text-glamlink-teal hover:text-glamlink-teal/80 font-medium"
                          >
                            #{txn.orderId.slice(-4)}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeConfig.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.paymentMethod ? (
                          <PaymentMethodIcon
                            method={txn.paymentMethod}
                            last4={txn.last4}
                          />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(txn.fee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(txn.netAmount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">No transactions found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Transactions will appear here once you start receiving orders
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
