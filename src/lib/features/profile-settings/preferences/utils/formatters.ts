/**
 * Formatting Utilities
 * Date, time, and currency formatting based on user preferences
 */

import type { UserPreferences, DateFormatType, TimeFormatType, CurrencyCode } from '../types';

export class PreferencesFormatter {
  constructor(private preferences: UserPreferences) {}

  /**
   * Format date according to user preference
   */
  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
      return '';
    }

    const { dateFormat, timezone } = this.preferences;

    try {
      // Use Intl.DateTimeFormat with user's timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      const parts = formatter.formatToParts(d);
      const year = parts.find(p => p.type === 'year')?.value;
      const month = parts.find(p => p.type === 'month')?.value;
      const day = parts.find(p => p.type === 'day')?.value;

      if (!year || !month || !day) {
        return d.toLocaleDateString();
      }

      switch (dateFormat) {
        case 'MM/DD/YYYY':
          return `${month}/${day}/${year}`;
        case 'DD/MM/YYYY':
          return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
          return `${year}-${month}-${day}`;
        default:
          return d.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return d.toLocaleDateString();
    }
  }

  /**
   * Format time according to user preference
   */
  formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
      return '';
    }

    const { timeFormat, timezone } = this.preferences;

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12h'
      });

      return formatter.format(d);
    } catch (error) {
      console.error('Error formatting time:', error);
      return d.toLocaleTimeString();
    }
  }

  /**
   * Format currency according to user preference
   */
  formatCurrency(amount: number): string {
    const { currency } = this.preferences;

    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      });

      return formatter.format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  /**
   * Format number with locale
   */
  formatNumber(value: number): string {
    try {
      return new Intl.NumberFormat('en-US').format(value);
    } catch (error) {
      console.error('Error formatting number:', error);
      return value.toString();
    }
  }
}
