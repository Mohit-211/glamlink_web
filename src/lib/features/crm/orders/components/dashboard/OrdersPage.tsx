/**
 * OrdersPage Component
 *
 * Main container for the orders dashboard with metrics, filters, and table
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrders } from '../../hooks/useOrders';
import { OrdersMetricsRow } from './OrdersMetricsRow';
import { OrdersTable } from '../table/OrdersTable';
import { OrdersSearchBar } from '../search/OrdersSearchBar';
import { OrdersExportModal } from '../export/OrdersExportModal';
import type { OrderStatusGroup, Order } from '../../types';
import type { ExportConfig } from '../../utils/exportUtils';

/**
 * Tab Filter Button
 */
interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

function TabButton({ label, isActive, onClick, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-2 text-xs opacity-75">({count})</span>
      )}
    </button>
  );
}

/**
 * OrdersPage Component
 */
export function OrdersPage() {
  const {
    orders,
    metrics,
    isLoading,
    isLoadingMetrics,
    error,
    total,
    hasMore,
    currentPage,
    activeTab,
    fetchMetrics,
    setActiveTab,
    setFilters,
    nextPage,
    prevPage,
    refresh,
  } = useOrders({
    autoFetch: true,
  });

  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch metrics on mount (today vs yesterday)
  useEffect(() => {
    const today = new Date();
    const endDate = today.toISOString();
    const startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const compareEndDate = yesterday.toISOString();
    const compareStartDate = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();

    fetchMetrics(startDate, endDate, compareStartDate, compareEndDate);
  }, [fetchMetrics]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    // TODO: Implement actual sorting by refetching with new params
  };

  // Handle tab change
  const handleTabChange = (tab: OrderStatusGroup) => {
    setActiveTab(tab);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query });
  };

  // Handle export
  const handleExport = async (config: ExportConfig): Promise<Order[]> => {
    try {
      const response = await fetch('/api/crm/orders/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to export orders');
      }

      return result.data;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };

  // Calculate tab counts (approximate from current data)
  const unfulfilledCount = orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length;
  const unpaidCount = orders.filter((o) => o.paymentStatus === 'pending').length;
  const openCount = orders.filter(
    (o) =>
      (o.fulfillmentStatus === 'unfulfilled' || o.fulfillmentStatus === 'partially_fulfilled') &&
      o.paymentStatus === 'paid'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your orders, fulfillment, and delivery
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>
            <Link
              href="/profile/orders/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create order
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <OrdersMetricsRow metrics={metrics} isLoading={isLoadingMetrics} />

        {/* Search Bar */}
        <div className="mb-6">
          <OrdersSearchBar onSearch={handleSearch} />
        </div>

        {/* Tab Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
            <TabButton
              label="All"
              isActive={activeTab === 'all'}
              onClick={() => handleTabChange('all')}
              count={total}
            />
            <TabButton
              label="Unfulfilled"
              isActive={activeTab === 'unfulfilled'}
              onClick={() => handleTabChange('unfulfilled')}
              count={unfulfilledCount}
            />
            <TabButton
              label="Unpaid"
              isActive={activeTab === 'unpaid'}
              onClick={() => handleTabChange('unpaid')}
              count={unpaidCount}
            />
            <TabButton
              label="Open"
              isActive={activeTab === 'open'}
              onClick={() => handleTabChange('open')}
              count={openCount}
            />
            <TabButton
              label="Archived"
              isActive={activeTab === 'archived'}
              onClick={() => handleTabChange('archived')}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        {/* Pagination */}
        {!isLoading && orders.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * 50 + 1}</span> to{' '}
              <span className="font-medium">{(currentPage - 1) * 50 + orders.length}</span> of{' '}
              <span className="font-medium">{total}</span> orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={!hasMore}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <OrdersExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        orders={orders}
        totalOrders={total}
        currentPage={currentPage}
        onExport={handleExport}
      />
    </div>
  );
}

export default OrdersPage;
