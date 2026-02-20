/**
 * FinanceOverview Component
 *
 * Main finance dashboard with summary cards and recent payouts
 */

'use client';

import { DollarSign, TrendingUp, CreditCard, Download, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePayouts } from '../hooks/usePayouts';
import { formatCurrency } from '../config';
import PayoutStatusBadge from './PayoutStatusBadge';

export default function FinanceOverview() {
  const { payouts, summary, isLoading } = usePayouts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glamlink-teal" />
      </div>
    );
  }

  const recentPayouts = payouts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Be Paid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">To Be Paid</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary?.toBePaid || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Available for payout</p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary?.thisMonth.grossSales || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Gross sales • {summary?.thisMonth.transactionCount || 0} transactions
          </p>
        </div>

        {/* Last Payout */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Last Payout</h3>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          {summary?.lastPayout ? (
            <>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(summary.lastPayout.amount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(summary.lastPayout.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">$0.00</p>
              <p className="text-xs text-gray-500 mt-1">No payouts yet</p>
            </>
          )}
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Payouts</h2>
          <Link
            href="/profile/finance/payouts"
            className="text-sm text-glamlink-teal hover:text-glamlink-teal/80 font-medium flex items-center gap-1"
          >
            View All Payouts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentPayouts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentPayouts.map((payout) => (
              <Link
                key={payout.id}
                href={`/profile/finance/payouts/${payout.id}`}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(payout.payoutDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payout.transactionCount} transaction{payout.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <PayoutStatusBadge status={payout.status} />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(payout.netAmount)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No payouts yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/profile/finance/transactions"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-glamlink-teal" />
            <div>
              <p className="text-sm font-medium text-gray-900">View Transactions</p>
              <p className="text-xs text-gray-500">See all order transactions</p>
            </div>
          </Link>

          <button
            onClick={() => {/* Export logic */}}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Download className="h-5 w-5 text-glamlink-teal" />
            <div>
              <p className="text-sm font-medium text-gray-900">Export Reports</p>
              <p className="text-xs text-gray-500">Download CSV or PDF</p>
            </div>
          </button>

          <Link
            href="/profile/finance/tax"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-glamlink-teal" />
            <div>
              <p className="text-sm font-medium text-gray-900">Tax Documents</p>
              <p className="text-xs text-gray-500">View 1099-K forms</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
