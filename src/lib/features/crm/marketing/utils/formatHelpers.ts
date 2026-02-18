/**
 * Formatting Helper Functions
 *
 * Utilities for formatting numbers, currencies, percentages, and dates.
 */

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format as currency (USD)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format as percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date string
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format channel name
 */
export function formatChannelName(channel: string): string {
  // Replace underscores with spaces and title case
  return channel
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format metric based on type
 */
export function formatMetric(
  value: number,
  type: 'number' | 'currency' | 'percent' | 'rate'
): string {
  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    case 'rate':
      return formatPercent(value, 2);
    default:
      return formatNumber(value);
  }
}

/**
 * Abbreviate large numbers (e.g., 1.2K, 3.4M)
 */
export function abbreviateNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

/**
 * Calculate percentage change
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
