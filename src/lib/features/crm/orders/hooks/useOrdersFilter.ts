/**
 * useOrdersFilter Hook
 *
 * Simplified interface for working with order filters
 */

'use client';

import { useOrdersFilterContext } from '../context/OrdersFilterContext';
import type {
  OrdersFilterState,
  OrdersFilterActions,
  DateRangePreset,
} from '../context/OrdersFilterContext';
import type { OrdersFilter } from '../types';

/**
 * Return Type
 */
export interface UseOrdersFilterReturn {
  // Filter State
  filters: OrdersFilterState;

  // Actions
  actions: OrdersFilterActions;

  // Computed Properties
  hasActiveFilters: boolean;
  activeFilterCount: number;

  // Helper Methods
  getDateRangeLabel: () => string;
  isFilterActive: (filterKey: keyof OrdersFilterState) => boolean;
}

/**
 * Date Range Preset Labels
 */
const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
  today: 'Today',
  last7days: 'Last 7 days',
  last30days: 'Last 30 days',
  last90days: 'Last 90 days',
  custom: 'Custom range',
};

/**
 * useOrdersFilter Hook
 */
export function useOrdersFilter(): UseOrdersFilterReturn {
  const { filters, actions } = useOrdersFilterContext();

  /**
   * Check if a specific filter is active
   */
  const isFilterActive = (filterKey: keyof OrdersFilterState): boolean => {
    const value = filters[filterKey];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    if (typeof value === 'number') {
      return true;
    }

    return false;
  };

  /**
   * Check if any filters are active (excluding date range default)
   */
  const hasActiveFilters = (): boolean => {
    return (
      filters.searchQuery !== '' ||
      filters.dateRangePreset !== 'last30days' ||
      filters.paymentStatuses.length > 0 ||
      filters.fulfillmentStatuses.length > 0 ||
      filters.deliveryStatuses.length > 0 ||
      filters.channels.length > 0 ||
      filters.minTotal !== undefined ||
      filters.maxTotal !== undefined ||
      filters.tags.length > 0
    );
  };

  /**
   * Count active filters
   */
  const activeFilterCount = (): number => {
    let count = 0;

    if (filters.searchQuery) count++;
    if (filters.dateRangePreset !== 'last30days') count++;
    if (filters.paymentStatuses.length > 0) count++;
    if (filters.fulfillmentStatuses.length > 0) count++;
    if (filters.deliveryStatuses.length > 0) count++;
    if (filters.channels.length > 0) count++;
    if (filters.minTotal !== undefined || filters.maxTotal !== undefined) count++;
    if (filters.tags.length > 0) count++;

    return count;
  };

  /**
   * Get human-readable date range label
   */
  const getDateRangeLabel = (): string => {
    if (filters.dateRangePreset === 'custom' && filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const end = new Date(filters.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${start} - ${end}`;
    }

    return DATE_RANGE_LABELS[filters.dateRangePreset] || 'Last 30 days';
  };

  return {
    filters,
    actions,
    hasActiveFilters: hasActiveFilters(),
    activeFilterCount: activeFilterCount(),
    getDateRangeLabel,
    isFilterActive,
  };
}

export default useOrdersFilter;
