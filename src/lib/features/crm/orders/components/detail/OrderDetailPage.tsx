/**
 * OrderDetailPage Component
 *
 * Comprehensive order detail layout with summary, customer info, timeline, and actions
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { OrderStatusBadge } from '../table/OrderStatusBadge';
import type { Order } from '../../types';

interface OrderDetailPageProps {
  order: Order;
  brandId: string;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateString));
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
 * Back Icon
 */
const ArrowLeftIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

/**
 * Print Icon
 */
const PrintIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
);

/**
 * More Icon (Three Dots)
 */
const DotsIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

/**
 * OrderDetailPage Component
 */
export function OrderDetailPage({ order, brandId }: OrderDetailPageProps) {
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  /**
   * Handle print order
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Placeholder actions
   */
  const handleFulfill = () => {
    alert('Fulfill order action - to be implemented');
  };

  const handleRefund = () => {
    alert('Refund order action - to be implemented');
  };

  const handleArchive = () => {
    alert('Archive order action - to be implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <Link
            href="/admin/crm/orders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="mr-2" />
            Back to Orders
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="mt-1 text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PrintIcon className="mr-2" />
                Print
              </button>

              {/* More Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DotsIcon />
                </button>

                {showActionsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={handleFulfill}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mark as fulfilled
                    </button>
                    <button
                      onClick={handleRefund}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Refund order
                    </button>
                    <button
                      onClick={handleArchive}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Archive order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order items</h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      {item.variantId && (
                        <p className="text-sm text-gray-500 mt-1">Variant: {item.variantId}</p>
                      )}
                      {item.sku && (
                        <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-900">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment information</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment status</span>
                  <OrderStatusBadge type="payment" status={order.paymentStatus} />
                </div>

                {order.paymentMethod && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment method</span>
                    <span className="text-sm text-gray-900 capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping address</h2>
                <address className="not-italic text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p className="mt-2">Phone: {order.shippingAddress.phone}</p>}
                </address>
              </div>
            )}

            {/* Billing Address */}
            {order.billingAddress && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing address</h2>
                <address className="not-italic text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                  <p>{order.billingAddress.address1}</p>
                  {order.billingAddress.address2 && <p>{order.billingAddress.address2}</p>}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{' '}
                    {order.billingAddress.zip}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </address>
              </div>
            )}
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Customer Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">{order.customer.email}</p>
                  {order.customer.phone && <p className="text-sm text-gray-600">{order.customer.phone}</p>}
                </div>

                <Link
                  href={`/admin/crm/customers/${order.customer.id}`}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  View customer profile →
                </Link>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fulfillment</span>
                  <OrderStatusBadge type="fulfillment" status={order.fulfillmentStatus} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Delivery</span>
                  <OrderStatusBadge type="delivery" status={order.deliveryStatus} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Method</span>
                  <span className="text-sm text-gray-900 capitalize">
                    {order.deliveryMethod === 'not_required'
                      ? 'Not required'
                      : order.deliveryMethod.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {order.tags.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Channel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Channel</h2>
              <p className="text-sm text-gray-900 capitalize">{order.channel.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
