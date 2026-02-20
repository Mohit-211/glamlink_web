/**
 * OrdersTable Component
 *
 * Main orders table with sortable columns, status badges, and actions
 */

import React from 'react';
import Link from 'next/link';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '../../types';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Table Header with sorting
 */
interface TableHeaderProps {
  label: string;
  field?: string;
  sortable?: boolean;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

function TableHeader({
  label,
  field,
  sortable = false,
  onSort,
  sortField,
  sortDirection,
  className = '',
}: TableHeaderProps) {
  const isSorted = field && sortField === field;
  const canSort = sortable && field && onSort;

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
        canSort ? 'cursor-pointer hover:bg-gray-100' : ''
      } ${className}`}
      onClick={() => canSort && onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {canSort && (
          <span className="text-gray-400">
            {isSorted ? (
              sortDirection === 'asc' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );
}

/**
 * Loading Skeleton Row
 */
function LoadingRow() {
  return (
    <tr className="bg-white border-b border-gray-200">
      <td className="px-4 py-4" colSpan={11}>
        <div className="animate-pulse flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </td>
    </tr>
  );
}

/**
 * Empty State
 */
function EmptyState() {
  return (
    <tr>
      <td colSpan={11} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <svg
            className="w-12 h-12 mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">No orders found</p>
          <p className="text-sm">Try changing the filters or search terms for this view</p>
        </div>
      </td>
    </tr>
  );
}

/**
 * OrdersTable Component
 */
export function OrdersTable({
  orders,
  isLoading,
  onSort,
  sortField,
  sortDirection,
}: OrdersTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader label="Order" field="orderNumber" sortable onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <TableHeader label="Date" field="createdAt" sortable onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <TableHeader label="Customer" field="customer.name" sortable onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <TableHeader label="Channel" />
              <TableHeader label="Total" field="total" sortable onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <TableHeader label="Payment status" />
              <TableHeader label="Fulfillment status" />
              <TableHeader label="Items" />
              <TableHeader label="Delivery status" />
              <TableHeader label="Delivery method" />
              <TableHeader label="Tags" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <>
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
              </>
            ) : orders.length === 0 ? (
              <EmptyState />
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Order Number */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link
                      href={`/profile/orders/${order.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </td>

                  {/* Channel */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {order.channel.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <OrderStatusBadge type="payment" status={order.paymentStatus} />
                  </td>

                  {/* Fulfillment Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <OrderStatusBadge type="fulfillment" status={order.fulfillmentStatus} />
                  </td>

                  {/* Items */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </div>
                  </td>

                  {/* Delivery Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <OrderStatusBadge type="delivery" status={order.deliveryStatus} />
                  </td>

                  {/* Delivery Method */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {order.deliveryMethod === 'not_required'
                        ? 'Not required'
                        : order.deliveryMethod.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {order.tags.length > 0 ? (
                        order.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                      {order.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{order.tags.length - 2}</span>
                      )}
                    </div>
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

export default OrdersTable;
