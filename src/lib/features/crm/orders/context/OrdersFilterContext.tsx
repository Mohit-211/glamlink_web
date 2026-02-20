/**
 * OrdersFilterContext
 *
 * Manages filter state for orders dashboard
 * Syncs with URL parameters
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type {
  OrderChannel,
  PaymentStatus,
  FulfillmentStatus,
  DeliveryStatus,
  OrdersFilter,
} from '../types';

/**
 * Date Range Preset Options
 */
export type DateRangePreset = 'today' | 'last7days' | 'last30days' | 'last90days' | 'custom';

/**
 * Filter State Interface
 */
export interface OrdersFilterState {
  // Search
  searchQuery: string;

  // Date Range
  dateRangePreset: DateRangePreset;
  startDate?: string; // ISO string
  endDate?: string; // ISO string

  // Status Filters
  paymentStatuses: PaymentStatus[];
  fulfillmentStatuses: FulfillmentStatus[];
  deliveryStatuses: DeliveryStatus[];

  // Other Filters
  channels: OrderChannel[];
  minTotal?: number;
  maxTotal?: number;
  tags: string[];
}

/**
 * Context Actions Interface
 */
export interface OrdersFilterActions {
  setSearchQuery: (query: string) => void;
  setDateRange: (preset: DateRangePreset, start?: string, end?: string) => void;
  setPaymentStatuses: (statuses: PaymentStatus[]) => void;
  setFulfillmentStatuses: (statuses: FulfillmentStatus[]) => void;
  setDeliveryStatuses: (statuses: DeliveryStatus[]) => void;
  setChannels: (channels: OrderChannel[]) => void;
  setTotalRange: (min?: number, max?: number) => void;
  setTags: (tags: string[]) => void;
  clearFilters: () => void;
  toOrdersFilter: () => OrdersFilter;
}

/**
 * Context Value Type
 */
export interface OrdersFilterContextValue {
  filters: OrdersFilterState;
  actions: OrdersFilterActions;
}

/**
 * Initial Filter State
 */
const initialFilterState: OrdersFilterState = {
  searchQuery: '',
  dateRangePreset: 'last30days',
  paymentStatuses: [],
  fulfillmentStatuses: [],
  deliveryStatuses: [],
  channels: [],
  tags: [],
};

/**
 * Create Context
 */
const OrdersFilterContext = createContext<OrdersFilterContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface OrdersFilterProviderProps {
  children: React.ReactNode;
}

/**
 * Helper: Calculate date range from preset
 */
function calculateDateRange(preset: DateRangePreset): { start?: string; end?: string } {
  const now = new Date();
  const end = now.toISOString();

  switch (preset) {
    case 'today': {
      const start = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      return { start, end };
    }
    case 'last7days': {
      const start = new Date(now.setDate(now.getDate() - 7)).toISOString();
      return { start, end };
    }
    case 'last30days': {
      const start = new Date(now.setDate(now.getDate() - 30)).toISOString();
      return { start, end };
    }
    case 'last90days': {
      const start = new Date(now.setDate(now.getDate() - 90)).toISOString();
      return { start, end };
    }
    case 'custom':
      return {};
    default:
      return {};
  }
}

/**
 * Helper: Parse URL params to filter state
 */
function parseUrlParams(searchParams: URLSearchParams): Partial<OrdersFilterState> {
  const parsed: Partial<OrdersFilterState> = {};

  // Search query
  const query = searchParams.get('query');
  if (query) parsed.searchQuery = query;

  // Date range
  const datePreset = searchParams.get('datePreset') as DateRangePreset;
  if (datePreset) {
    parsed.dateRangePreset = datePreset;
    if (datePreset === 'custom') {
      const start = searchParams.get('startDate');
      const end = searchParams.get('endDate');
      if (start) parsed.startDate = start;
      if (end) parsed.endDate = end;
    }
  }

  // Status filters
  const paymentStatuses = searchParams.get('paymentStatus');
  if (paymentStatuses) {
    parsed.paymentStatuses = paymentStatuses.split(',') as PaymentStatus[];
  }

  const fulfillmentStatuses = searchParams.get('fulfillmentStatus');
  if (fulfillmentStatuses) {
    parsed.fulfillmentStatuses = fulfillmentStatuses.split(',') as FulfillmentStatus[];
  }

  const deliveryStatuses = searchParams.get('deliveryStatus');
  if (deliveryStatuses) {
    parsed.deliveryStatuses = deliveryStatuses.split(',') as DeliveryStatus[];
  }

  // Channels
  const channels = searchParams.get('channels');
  if (channels) {
    parsed.channels = channels.split(',') as OrderChannel[];
  }

  // Total range
  const minTotal = searchParams.get('minTotal');
  const maxTotal = searchParams.get('maxTotal');
  if (minTotal) parsed.minTotal = parseFloat(minTotal);
  if (maxTotal) parsed.maxTotal = parseFloat(maxTotal);

  // Tags
  const tags = searchParams.get('tags');
  if (tags) {
    parsed.tags = tags.split(',');
  }

  return parsed;
}

/**
 * Helper: Serialize filter state to URL params
 */
function serializeToUrlParams(filters: OrdersFilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.searchQuery) params.set('query', filters.searchQuery);
  if (filters.dateRangePreset !== 'last30days') {
    params.set('datePreset', filters.dateRangePreset);
  }

  if (filters.dateRangePreset === 'custom') {
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
  }

  if (filters.paymentStatuses.length > 0) {
    params.set('paymentStatus', filters.paymentStatuses.join(','));
  }
  if (filters.fulfillmentStatuses.length > 0) {
    params.set('fulfillmentStatus', filters.fulfillmentStatuses.join(','));
  }
  if (filters.deliveryStatuses.length > 0) {
    params.set('deliveryStatus', filters.deliveryStatuses.join(','));
  }
  if (filters.channels.length > 0) {
    params.set('channels', filters.channels.join(','));
  }
  if (filters.minTotal !== undefined) {
    params.set('minTotal', filters.minTotal.toString());
  }
  if (filters.maxTotal !== undefined) {
    params.set('maxTotal', filters.maxTotal.toString());
  }
  if (filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }

  return params;
}

/**
 * OrdersFilterProvider Component
 */
export function OrdersFilterProvider({ children }: OrdersFilterProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL or defaults
  const [filters, setFilters] = useState<OrdersFilterState>(() => {
    const urlFilters = parseUrlParams(searchParams);
    return { ...initialFilterState, ...urlFilters };
  });

  /**
   * Sync URL with filter state
   */
  const syncUrl = useCallback(
    (newFilters: OrdersFilterState) => {
      const params = serializeToUrlParams(newFilters);
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname]
  );

  /**
   * Update filters and sync URL
   */
  const updateFilters = useCallback(
    (updates: Partial<OrdersFilterState>) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updates };
        syncUrl(newFilters);
        return newFilters;
      });
    },
    [syncUrl]
  );

  /**
   * Actions
   */
  const actions: OrdersFilterActions = {
    setSearchQuery: useCallback(
      (query: string) => updateFilters({ searchQuery: query }),
      [updateFilters]
    ),

    setDateRange: useCallback(
      (preset: DateRangePreset, start?: string, end?: string) => {
        if (preset === 'custom') {
          updateFilters({ dateRangePreset: preset, startDate: start, endDate: end });
        } else {
          const { start: calculatedStart, end: calculatedEnd } = calculateDateRange(preset);
          updateFilters({
            dateRangePreset: preset,
            startDate: calculatedStart,
            endDate: calculatedEnd,
          });
        }
      },
      [updateFilters]
    ),

    setPaymentStatuses: useCallback(
      (statuses: PaymentStatus[]) => updateFilters({ paymentStatuses: statuses }),
      [updateFilters]
    ),

    setFulfillmentStatuses: useCallback(
      (statuses: FulfillmentStatus[]) => updateFilters({ fulfillmentStatuses: statuses }),
      [updateFilters]
    ),

    setDeliveryStatuses: useCallback(
      (statuses: DeliveryStatus[]) => updateFilters({ deliveryStatuses: statuses }),
      [updateFilters]
    ),

    setChannels: useCallback(
      (channels: OrderChannel[]) => updateFilters({ channels }),
      [updateFilters]
    ),

    setTotalRange: useCallback(
      (min?: number, max?: number) => updateFilters({ minTotal: min, maxTotal: max }),
      [updateFilters]
    ),

    setTags: useCallback((tags: string[]) => updateFilters({ tags }), [updateFilters]),

    clearFilters: useCallback(() => {
      setFilters(initialFilterState);
      syncUrl(initialFilterState);
    }, [syncUrl]),

    toOrdersFilter: useCallback((): OrdersFilter => {
      const ordersFilter: OrdersFilter = {};

      if (filters.searchQuery) ordersFilter.search = filters.searchQuery;
      if (filters.startDate && filters.endDate) {
        ordersFilter.dateRange = { start: filters.startDate, end: filters.endDate };
      }

      if (filters.paymentStatuses.length > 0) {
        ordersFilter.paymentStatus = filters.paymentStatuses;
      }
      if (filters.fulfillmentStatuses.length > 0) {
        ordersFilter.fulfillmentStatus = filters.fulfillmentStatuses;
      }
      if (filters.deliveryStatuses.length > 0) {
        ordersFilter.deliveryStatus = filters.deliveryStatuses;
      }
      if (filters.channels.length > 0) {
        ordersFilter.channel = filters.channels;
      }
      if (filters.minTotal !== undefined) {
        ordersFilter.minTotal = filters.minTotal;
      }
      if (filters.maxTotal !== undefined) {
        ordersFilter.maxTotal = filters.maxTotal;
      }
      if (filters.tags.length > 0) {
        ordersFilter.tags = filters.tags;
      }

      return ordersFilter;
    }, [filters]),
  };

  /**
   * Context Value
   */
  const value: OrdersFilterContextValue = {
    filters,
    actions,
  };

  return <OrdersFilterContext.Provider value={value}>{children}</OrdersFilterContext.Provider>;
}

/**
 * Custom Hook: useOrdersFilterContext
 */
export function useOrdersFilterContext(): OrdersFilterContextValue {
  const context = useContext(OrdersFilterContext);
  if (!context) {
    throw new Error('useOrdersFilterContext must be used within OrdersFilterProvider');
  }
  return context;
}

export default OrdersFilterContext;
