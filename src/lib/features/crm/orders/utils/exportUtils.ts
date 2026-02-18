/**
 * Export Utilities
 *
 * CSV generation and export helpers for orders
 */

import type { Order, Address } from '../types';

/**
 * Export Format Options
 */
export type ExportFormat = 'csv' | 'csv-excel';

/**
 * Export Scope Options
 */
export type ExportScope = 'current-page' | 'all-orders' | 'selected' | 'filtered' | 'date-range';

/**
 * Export Configuration
 */
export interface ExportConfig {
  scope: ExportScope;
  format: ExportFormat;
  selectedIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  includeCustomerDetails?: boolean;
  includeItemDetails?: boolean;
  includeAddresses?: boolean;
}

/**
 * CSV Column Definitions
 */
const CSV_COLUMNS: Array<{ key: string; label: string }> = [
  { key: 'orderNumber', label: 'Order Number' },
  { key: 'createdAt', label: 'Date' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'customerEmail', label: 'Customer Email' },
  { key: 'customerPhone', label: 'Customer Phone' },
  { key: 'channel', label: 'Channel' },
  { key: 'itemCount', label: 'Items' },
  { key: 'subtotal', label: 'Subtotal' },
  { key: 'tax', label: 'Tax' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'discount', label: 'Discount' },
  { key: 'total', label: 'Total' },
  { key: 'paymentStatus', label: 'Payment Status' },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'fulfillmentStatus', label: 'Fulfillment Status' },
  { key: 'deliveryStatus', label: 'Delivery Status' },
  { key: 'deliveryMethod', label: 'Delivery Method' },
  { key: 'tags', label: 'Tags' },
];

/**
 * Additional columns for detailed export
 */
const DETAILED_COLUMNS: Array<{ key: string; label: string }> = [
  { key: 'itemNames', label: 'Items (Names)' },
  { key: 'itemQuantities', label: 'Items (Quantities)' },
  { key: 'shippingAddress', label: 'Shipping Address' },
  { key: 'billingAddress', label: 'Billing Address' },
  { key: 'notes', label: 'Notes' },
];

/**
 * Format date for CSV
 */
function formatDateForExport(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format currency for CSV
 */
function formatCurrencyForExport(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Format address for CSV
 */
function formatAddress(address?: Address): string {
  if (!address) return '';

  const parts = [
    address.firstName + ' ' + address.lastName,
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Escape CSV value (handle quotes and commas)
 */
function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Convert order to CSV row
 */
function orderToCsvRow(order: Order, config: ExportConfig): Record<string, any> {
  const row: Record<string, any> = {
    orderNumber: `#${order.orderNumber}`,
    createdAt: formatDateForExport(order.createdAt),
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone || '',
    channel: order.channel.replace('_', ' '),
    itemCount: order.itemCount,
    subtotal: formatCurrencyForExport(order.subtotal),
    tax: formatCurrencyForExport(order.tax),
    shipping: formatCurrencyForExport(order.shipping),
    discount: formatCurrencyForExport(order.discount),
    total: formatCurrencyForExport(order.total),
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod || '',
    fulfillmentStatus: order.fulfillmentStatus,
    deliveryStatus: order.deliveryStatus,
    deliveryMethod: order.deliveryMethod.replace('_', ' '),
    tags: order.tags.join('; '),
  };

  // Add detailed columns if requested
  if (config.includeItemDetails) {
    row.itemNames = order.items.map((item) => item.name).join('; ');
    row.itemQuantities = order.items.map((item) => `${item.quantity}`).join('; ');
  }

  if (config.includeAddresses) {
    row.shippingAddress = formatAddress(order.shippingAddress);
    row.billingAddress = formatAddress(order.billingAddress);
  }

  if (config.includeCustomerDetails) {
    row.notes = order.notes || '';
  }

  return row;
}

/**
 * Generate CSV content from orders
 */
export function generateCsvContent(orders: Order[], config: ExportConfig): string {
  if (orders.length === 0) {
    return 'No orders to export';
  }

  // Determine columns to include
  let columns = [...CSV_COLUMNS];

  if (config.includeItemDetails) {
    columns = columns.concat(DETAILED_COLUMNS.filter((col) => col.key.startsWith('item')));
  }

  if (config.includeAddresses) {
    columns = columns.concat(
      DETAILED_COLUMNS.filter((col) => col.key.includes('Address'))
    );
  }

  if (config.includeCustomerDetails) {
    columns = columns.concat(
      DETAILED_COLUMNS.filter((col) => col.key === 'notes')
    );
  }

  // Generate header row
  const header = columns.map((col) => escapeCsvValue(col.label)).join(',');

  // Generate data rows
  const rows = orders.map((order) => {
    const rowData = orderToCsvRow(order, config);
    return columns
      .map((col) => escapeCsvValue(rowData[col.key]))
      .join(',');
  });

  // Combine header and rows
  return [header, ...rows].join('\n');
}

/**
 * Generate Excel-compatible CSV (with BOM)
 */
export function generateExcelCsv(orders: Order[], config: ExportConfig): string {
  const csv = generateCsvContent(orders, config);

  // Add UTF-8 BOM for Excel compatibility
  return '\uFEFF' + csv;
}

/**
 * Download CSV file
 */
export function downloadCsv(content: string, filename: string = 'orders-export.csv'): void {
  // Create blob
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string = 'orders'): string {
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}-${timestamp}.csv`;
}

/**
 * Batch export for large datasets
 */
export interface BatchExportProgress {
  total: number;
  processed: number;
  currentBatch: number;
  totalBatches: number;
}

/**
 * Export orders in batches
 */
export async function exportOrdersInBatches(
  fetchOrders: (offset: number, limit: number) => Promise<Order[]>,
  totalOrders: number,
  config: ExportConfig,
  onProgress?: (progress: BatchExportProgress) => void,
  batchSize: number = 100
): Promise<string> {
  const totalBatches = Math.ceil(totalOrders / batchSize);
  let allOrders: Order[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const offset = i * batchSize;
    const batch = await fetchOrders(offset, batchSize);

    allOrders = allOrders.concat(batch);

    // Report progress
    if (onProgress) {
      onProgress({
        total: totalOrders,
        processed: allOrders.length,
        currentBatch: i + 1,
        totalBatches,
      });
    }
  }

  // Generate CSV from all orders
  const format = config.format === 'csv-excel' ? 'excel' : 'plain';
  return format === 'excel'
    ? generateExcelCsv(allOrders, config)
    : generateCsvContent(allOrders, config);
}

/**
 * Validate export configuration
 */
export function validateExportConfig(config: ExportConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.scope === 'selected' && (!config.selectedIds || config.selectedIds.length === 0)) {
    errors.push('No orders selected for export');
  }

  if (
    config.scope === 'date-range' &&
    (!config.dateRange || !config.dateRange.start || !config.dateRange.end)
  ) {
    errors.push('Date range is required for date range export');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Estimate export size (approximate CSV file size in bytes)
 */
export function estimateExportSize(orderCount: number, config: ExportConfig): number {
  // Base columns: ~200 bytes per order
  let bytesPerOrder = 200;

  // Additional bytes for detailed columns
  if (config.includeItemDetails) bytesPerOrder += 100;
  if (config.includeAddresses) bytesPerOrder += 150;
  if (config.includeCustomerDetails) bytesPerOrder += 50;

  return orderCount * bytesPerOrder;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
