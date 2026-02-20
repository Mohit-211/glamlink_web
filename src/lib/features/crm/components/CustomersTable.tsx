'use client';

import React from 'react';
import { Customer } from '../types/customer';
import { formatCurrency } from '@/lib/features/crm/marketing/utils/formatHelpers';

interface CustomersTableProps {
  customers: Customer[];
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (customerId: string, checked: boolean) => void;
  onCustomerClick: (customerId: string) => void;
}

export function CustomersTable({
  customers,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onCustomerClick,
}: CustomersTableProps) {
  const allSelected = customers.length > 0 && selectedIds.size === customers.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email subscription
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount spent
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => {
              const displayName = `${customer.firstName} ${customer.lastName}`;
              const location = customer.analytics.location
                ? `${customer.analytics.location.city || ''}, ${customer.analytics.location.state || ''}, ${customer.analytics.location.country || ''}`.replace(/^,\s*|,\s*$/g, '')
                : '—';
              const subscriptionStatus = customer.marketing.emailSubscribed ? 'subscribed' : 'not_subscribed';

              return (
                <tr
                  key={customer.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedIds.has(customer.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onCustomerClick(customer.id)}
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(customer.id)}
                      onChange={(e) => onSelectOne(customer.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{displayName}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscriptionStatus === 'subscribed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {subscriptionStatus === 'subscribed' ? 'Subscribed' : 'Not subscribed'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{location}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {customer.analytics.totalOrders === 0
                      ? '0 orders'
                      : customer.analytics.totalOrders === 1
                      ? '1 order'
                      : `${customer.analytics.totalOrders} orders`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(customer.analytics.totalSpent)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
