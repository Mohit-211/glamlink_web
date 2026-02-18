'use client';

import React, { useState } from 'react';
import { Customer } from '../types/customer';
import { formatDate, formatCurrency } from '@/lib/features/crm/marketing/utils/formatHelpers';

interface ExportCustomersButtonProps {
  customers: Customer[];
  disabled?: boolean;
}

export function ExportCustomersButton({
  customers,
  disabled = false,
}: ExportCustomersButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (customers.length === 0) return;

    setLoading(true);

    try {
      // Generate CSV content
      const headers = [
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Email Subscribed',
        'SMS Subscribed',
        'Total Orders',
        'Total Spent',
        'Tags',
        'City',
        'State',
        'Country',
        'Created At',
      ];

      const rows = customers.map(customer => {
        const defaultAddress = customer.addresses.find(a => a.isDefault) || customer.addresses[0];

        return [
          escapeCSV(customer.firstName),
          escapeCSV(customer.lastName),
          escapeCSV(customer.email),
          escapeCSV(customer.phone || ''),
          customer.marketing.emailSubscribed ? 'yes' : 'no',
          customer.marketing.smsSubscribed ? 'yes' : 'no',
          customer.analytics.totalOrders,
          customer.analytics.totalSpent,
          escapeCSV(customer.tags.join(', ')),
          escapeCSV(defaultAddress?.city || ''),
          escapeCSV(defaultAddress?.state || ''),
          escapeCSV(defaultAddress?.country || ''),
          escapeCSV(formatDate(customer.createdAt)),
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || loading}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Exporting...' : 'Export'}
    </button>
  );
}

function escapeCSV(value: string | number): string {
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}
