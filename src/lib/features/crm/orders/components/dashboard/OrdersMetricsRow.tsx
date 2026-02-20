/**
 * OrdersMetricsRow Component
 *
 * Displays 6 KPI metric cards for the orders dashboard
 */

import React from 'react';
import type { OrderMetrics } from '../../types';

interface OrdersMetricsRowProps {
  metrics: OrderMetrics | null;
  isLoading: boolean;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  isLoading: boolean;
  icon?: React.ReactNode;
}

/**
 * Individual Metric Card
 */
function MetricCard({ label, value, change, isLoading, icon }: MetricCardProps) {
  const hasChange = change !== undefined && !isNaN(change);
  const isPositive = hasChange && change > 0;
  const isNegative = hasChange && change < 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-2">{value}</p>

          {hasChange && (
            <div className="flex items-center gap-1">
              {isPositive && (
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              )}
              {isNegative && (
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}

/**
 * Format large numbers with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format time in hours to human-readable format
 */
function formatTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  } else if (hours < 24) {
    return `${Math.round(hours)}h`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
}

/**
 * OrdersMetricsRow Component
 */
export function OrdersMetricsRow({ metrics, isLoading }: OrdersMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {/* Total Orders */}
      <MetricCard
        label="Orders"
        value={metrics ? formatNumber(metrics.totalOrders) : '0'}
        change={metrics?.totalOrdersChange}
        isLoading={isLoading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      />

      {/* Items Ordered */}
      <MetricCard
        label="Items ordered"
        value={metrics ? formatNumber(metrics.itemsOrdered) : '0'}
        change={metrics?.itemsOrderedChange}
        isLoading={isLoading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        }
      />

      {/* Returns */}
      <MetricCard
        label="Returns"
        value={metrics ? formatCurrency(metrics.returnValue) : '$0'}
        change={metrics?.returnValueChange}
        isLoading={isLoading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        }
      />

      {/* Orders Fulfilled */}
      <MetricCard
        label="Orders fulfilled"
        value={metrics ? formatNumber(metrics.ordersFulfilled) : '0'}
        change={metrics?.ordersFulfilledChange}
        isLoading={isLoading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />

      {/* Orders Delivered */}
      <MetricCard
        label="Orders delivered"
        value={metrics ? formatNumber(metrics.ordersDelivered) : '0'}
        change={metrics?.ordersDeliveredChange}
        isLoading={isLoading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        }
      />

      {/* Avg Fulfillment Time */}
      <MetricCard
        label="Order to fulfillment time"
        value={metrics ? formatTime(metrics.avgFulfillmentTime) : '0h'}
        change={metrics?.avgFulfillmentTimeChange}
        isLoading={isLoading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    </div>
  );
}

export default OrdersMetricsRow;
