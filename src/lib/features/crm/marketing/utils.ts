/**
 * Marketing Utilities
 *
 * Helper functions for marketing calculations and date handling
 */

// Re-export format helpers from utils directory
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatChannelName,
  formatMetric,
  abbreviateNumber,
} from './utils/formatHelpers';

export interface DateRange {
  start: string;
  end: string;
  preset?: string;
}

/**
 * Get date range based on preset ID
 */
export function getDateRange(presetId: string): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start: Date;
  let end: Date = new Date(today);

  switch (presetId) {
    case 'today':
      start = new Date(today);
      break;

    case 'yesterday':
      start = new Date(today);
      start.setDate(start.getDate() - 1);
      end = new Date(start);
      break;

    case 'last_7_days':
      start = new Date(today);
      start.setDate(start.getDate() - 6);
      break;

    case 'last_30_days':
      start = new Date(today);
      start.setDate(start.getDate() - 29);
      break;

    case 'last_90_days':
      start = new Date(today);
      start.setDate(start.getDate() - 89);
      break;

    case 'this_month':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;

    case 'last_month':
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    case 'previous_30_days':
      start = new Date(today);
      start.setDate(start.getDate() - 59);
      end = new Date(today);
      end.setDate(end.getDate() - 30);
      break;

    case 'previous_60_days':
      start = new Date(today);
      start.setDate(start.getDate() - 89);
      end = new Date(today);
      end.setDate(end.getDate() - 30);
      break;

    case 'this_year':
      start = new Date(today.getFullYear(), 0, 1);
      break;

    case 'last_year':
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear() - 1, 11, 31);
      break;

    default:
      // Default to last 30 days
      start = new Date(today);
      start.setDate(start.getDate() - 29);
  }

  return {
    start: formatDate(start),
    end: formatDate(end),
    preset: presetId,
  };
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Get human-readable date range label
 */
export function getDateRangeLabel(dateRange: DateRange): string {
  if (dateRange.preset) {
    switch (dateRange.preset) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'last_7_days':
        return 'Last 7 days';
      case 'last_30_days':
        return 'Last 30 days';
      case 'last_90_days':
        return 'Last 90 days';
      case 'this_month':
        return 'This month';
      case 'last_month':
        return 'Last month';
      case 'this_year':
        return 'This year';
      case 'last_year':
        return 'Last year';
      case 'custom':
        return `${dateRange.start} to ${dateRange.end}`;
    }
  }
  return `${dateRange.start} to ${dateRange.end}`;
}
