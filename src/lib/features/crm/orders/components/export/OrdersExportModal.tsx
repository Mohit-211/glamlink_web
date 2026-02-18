/**
 * OrdersExportModal Component
 *
 * Modal for configuring and exporting orders to CSV
 */

'use client';

import React, { useState } from 'react';
import type { ExportConfig, ExportScope, ExportFormat } from '../../utils/exportUtils';
import {
  generateCsvContent,
  generateExcelCsv,
  downloadCsv,
  generateFilename,
  validateExportConfig,
  estimateExportSize,
  formatFileSize,
} from '../../utils/exportUtils';
import type { Order } from '../../types';

interface OrdersExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  totalOrders: number;
  currentPage: number;
  selectedIds?: string[];
  onExport?: (config: ExportConfig) => Promise<Order[]>;
}

/**
 * Close Icon (X)
 */
const XIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * Download Icon
 */
const DownloadIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

/**
 * OrdersExportModal Component
 */
export function OrdersExportModal({
  isOpen,
  onClose,
  orders,
  totalOrders,
  currentPage,
  selectedIds = [],
  onExport,
}: OrdersExportModalProps) {
  const [scope, setScope] = useState<ExportScope>('current-page');
  const [format, setFormat] = useState<ExportFormat>('csv-excel');
  const [includeItemDetails, setIncludeItemDetails] = useState(false);
  const [includeAddresses, setIncludeAddresses] = useState(false);
  const [includeCustomerDetails, setIncludeCustomerDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date range state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  /**
   * Handle export
   */
  const handleExport = async () => {
    setError(null);

    const config: ExportConfig = {
      scope,
      format,
      selectedIds: scope === 'selected' ? selectedIds : undefined,
      dateRange:
        scope === 'date-range'
          ? {
              start: startDate,
              end: endDate,
            }
          : undefined,
      includeItemDetails,
      includeAddresses,
      includeCustomerDetails,
    };

    // Validate
    const validation = validateExportConfig(config);
    if (!validation.valid) {
      setError(validation.errors.join('. '));
      return;
    }

    setIsExporting(true);

    try {
      let ordersToExport: Order[] = [];

      // Determine which orders to export
      if (scope === 'current-page') {
        ordersToExport = orders;
      } else if (scope === 'selected') {
        ordersToExport = orders.filter((o) => selectedIds.includes(o.id));
      } else if (scope === 'all-orders' || scope === 'filtered' || scope === 'date-range') {
        // Fetch from API
        if (onExport) {
          ordersToExport = await onExport(config);
        } else {
          setError('Export function not provided');
          return;
        }
      }

      // Generate CSV
      const csvContent =
        format === 'csv-excel'
          ? generateExcelCsv(ordersToExport, config)
          : generateCsvContent(ordersToExport, config);

      // Download
      const filename = generateFilename('orders-export');
      downloadCsv(csvContent, filename);

      // Success - close modal
      onClose();
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Failed to export orders');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Get order count for selected scope
   */
  const getOrderCount = (): number => {
    switch (scope) {
      case 'current-page':
        return orders.length;
      case 'selected':
        return selectedIds.length;
      case 'all-orders':
        return totalOrders;
      case 'filtered':
        return totalOrders; // Should be filtered total
      case 'date-range':
        return 0; // Unknown until fetched
      default:
        return 0;
    }
  };

  const orderCount = getOrderCount();
  const estimatedSize = estimateExportSize(orderCount, {
    scope,
    format,
    includeItemDetails,
    includeAddresses,
    includeCustomerDetails,
  });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Export Orders</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Export Scope */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Export scope</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="current-page"
                    checked={scope === 'current-page'}
                    onChange={(e) => setScope(e.target.value as ExportScope)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Current page ({orders.length} orders)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="all-orders"
                    checked={scope === 'all-orders'}
                    onChange={(e) => setScope(e.target.value as ExportScope)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    All orders ({totalOrders} orders)
                  </span>
                </label>

                {selectedIds.length > 0 && (
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="selected"
                      checked={scope === 'selected'}
                      onChange={(e) => setScope(e.target.value as ExportScope)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Selected orders ({selectedIds.length} orders)
                    </span>
                  </label>
                )}

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="filtered"
                    checked={scope === 'filtered'}
                    onChange={(e) => setScope(e.target.value as ExportScope)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Filtered orders (current filters applied)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="date-range"
                    checked={scope === 'date-range'}
                    onChange={(e) => setScope(e.target.value as ExportScope)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Custom date range</span>
                </label>

                {/* Date Range Inputs */}
                {scope === 'date-range' && (
                  <div className="ml-7 mt-2 space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Export format</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv-excel"
                    checked={format === 'csv-excel'}
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    CSV for Excel (recommended)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={format === 'csv'}
                    onChange={(e) => setFormat(e.target.value as ExportFormat)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Plain CSV</span>
                </label>
              </div>
            </div>

            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Include additional details
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeItemDetails}
                    onChange={(e) => setIncludeItemDetails(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Item details (names, quantities)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeAddresses}
                    onChange={(e) => setIncludeAddresses(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Shipping and billing addresses
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeCustomerDetails}
                    onChange={(e) => setIncludeCustomerDetails(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Transaction ID and notes
                  </span>
                </label>
              </div>
            </div>

            {/* Export Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Export summary:</strong> {orderCount} orders · Estimated size:{' '}
                {formatFileSize(estimatedSize)}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || orderCount === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrdersExportModal;
