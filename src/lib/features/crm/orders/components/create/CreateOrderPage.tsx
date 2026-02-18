/**
 * CreateOrderPage Component
 *
 * Manual order creation form with customer, items, payment, and delivery sections
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import type { OrderItem } from '../../types';

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
 * Back Arrow Icon
 */
const ArrowLeftIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

/**
 * Plus Icon
 */
const PlusIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

/**
 * Trash Icon
 */
const TrashIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

/**
 * CreateOrderPage Component
 */
export function CreateOrderPage() {
  const {
    draft,
    isDirty,
    lastSaved,
    updateCustomer,
    addItem,
    updateItem,
    removeItem,
    updatePricing,
    updatePayment,
    updateDelivery,
    updateMetadata,
    saveDraft,
    submitOrder,
    isSubmitting,
    error,
    validationErrors,
  } = useCreateOrder();

  // Simple add item form state
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<OrderItem>>({
    name: '',
    price: 0,
    quantity: 1,
  });

  /**
   * Handle add item
   */
  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.quantity) {
      return;
    }

    const item: OrderItem = {
      id: `item-${Date.now()}`,
      productId: newItem.productId || `manual-${Date.now()}`,
      name: newItem.name,
      price: newItem.price,
      quantity: newItem.quantity,
      total: newItem.price * newItem.quantity,
      sku: newItem.sku,
      variantId: newItem.variantId,
      fulfillmentStatus: 'unfulfilled',
    };

    addItem(item);
    setNewItem({ name: '', price: 0, quantity: 1 });
    setShowAddItem(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/profile/orders"
            className="inline-flex items-center whitespace-nowrap px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            Back to Orders
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>
              <p className="mt-1 text-sm text-gray-500">
                {isDirty && 'Unsaved changes'}
                {lastSaved && !isDirty && `Last saved ${lastSaved.toLocaleTimeString()}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={saveDraft}
                disabled={!isDirty}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Draft
              </button>
              <button
                onClick={submitOrder}
                disabled={isSubmitting || draft.items.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Customer Information + Pricing Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draft.customerName}
                    onChange={(e) => updateCustomer({ customerName: e.target.value })}
                    className={`block w-full px-3 py-2 border rounded-md text-sm ${
                      validationErrors.customerName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {validationErrors.customerName && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={draft.customerEmail}
                    onChange={(e) => updateCustomer({ customerEmail: e.target.value })}
                    className={`block w-full px-3 py-2 border rounded-md text-sm ${
                      validationErrors.customerEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {validationErrors.customerEmail && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.customerEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={draft.customerPhone || ''}
                    onChange={(e) => updateCustomer({ customerPhone: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(draft.subtotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tax Rate (%)</span>
                  <input
                    type="number"
                    value={draft.taxRate}
                    onChange={(e) => updatePricing({ taxRate: parseFloat(e.target.value) })}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(draft.tax)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <input
                    type="number"
                    value={draft.shipping}
                    onChange={(e) => updatePricing({ shipping: parseFloat(e.target.value) })}
                    step="0.01"
                    min="0"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <input
                    type="number"
                    value={draft.discount}
                    onChange={(e) => updatePricing({ discount: parseFloat(e.target.value) })}
                    step="0.01"
                    min="0"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  />
                </div>

                <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrency(draft.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>
              <button
                onClick={() => setShowAddItem(!showAddItem)}
                className="inline-flex items-center whitespace-nowrap px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Add Item
              </button>
            </div>

            {validationErrors.items && (
              <p className="mb-4 text-sm text-red-600">{validationErrors.items}</p>
            )}

            {/* Add Item Form */}
            {showAddItem && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Product name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={newItem.price || 0}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                      placeholder="Price"
                      step="0.01"
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={newItem.quantity || 1}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                      placeholder="Qty"
                      min="1"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.name || !newItem.price || !newItem.quantity}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({ name: '', price: 0, quantity: 1 });
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Items List */}
            {draft.items.length > 0 ? (
              <div className="space-y-2">
                {draft.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No items added yet</p>
            )}
          </div>

          {/* Payment + Delivery Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={draft.paymentStatus}
                    onChange={(e) => updatePayment({ paymentStatus: e.target.value as any })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                    <option value="voided">Voided</option>
                  </select>
                </div>

                {draft.paymentStatus === 'paid' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={draft.paymentMethod || ''}
                      onChange={(e) => updatePayment({ paymentMethod: e.target.value })}
                      placeholder="Credit card, Cash, etc."
                      className={`block w-full px-3 py-2 border rounded-md text-sm ${
                        validationErrors.paymentMethod ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.paymentMethod && (
                      <p className="mt-1 text-xs text-red-600">{validationErrors.paymentMethod}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                  <select
                    value={draft.deliveryMethod}
                    onChange={(e) => updateDelivery({ deliveryMethod: e.target.value as any })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="shipping">Shipping</option>
                    <option value="pickup">Pickup</option>
                    <option value="local_delivery">Local Delivery</option>
                    <option value="not_required">Not Required</option>
                  </select>
                </div>

                {draft.deliveryMethod === 'shipping' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      (Simplified address form - full implementation would have separate fields)
                    </p>
                    {validationErrors.shippingAddress && (
                      <p className="mt-1 text-xs text-red-600">{validationErrors.shippingAddress}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;
