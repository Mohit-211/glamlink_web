/**
 * useOrders Hook
 *
 * Custom hook for fetching and managing orders data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Order,
  OrdersFilter,
  OrdersPagination,
  OrdersResponse,
  OrderMetrics,
  OrderStatusGroup,
} from '../types';

interface UseOrdersOptions {
  initialFilter?: OrdersFilter;
  initialPagination?: Partial<OrdersPagination>;
  autoFetch?: boolean;
}

interface UseOrdersReturn {
  orders: Order[];
  metrics: OrderMetrics | null;
  isLoading: boolean;
  isLoadingMetrics: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  currentPage: number;
  filters: OrdersFilter;
  activeTab: OrderStatusGroup;
  fetchOrders: () => Promise<void>;
  fetchMetrics: (startDate: string, endDate: string, compareStartDate?: string, compareEndDate?: string) => Promise<void>;
  setFilters: (filters: OrdersFilter) => void;
  setActiveTab: (tab: OrderStatusGroup) => void;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing orders data and state
 */
export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const {
    initialFilter = {},
    initialPagination = { page: 1, limit: 50, orderBy: 'createdAt', direction: 'desc' },
    autoFetch = true,
  } = options;

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(initialPagination.page || 1);
  const [filters, setFiltersState] = useState<OrdersFilter>(initialFilter);
  const [activeTab, setActiveTab] = useState<OrderStatusGroup>('all');
  const [pagination, setPagination] = useState<Partial<OrdersPagination>>(initialPagination);

  /**
   * Fetch orders from API
   */
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();

      // Add filters
      if (filters.search) params.append('search', filters.search);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus.join(','));
      if (filters.fulfillmentStatus) params.append('fulfillmentStatus', filters.fulfillmentStatus.join(','));
      if (filters.deliveryStatus) params.append('deliveryStatus', filters.deliveryStatus.join(','));
      if (filters.channel) params.append('channel', filters.channel.join(','));
      if (filters.tags) params.append('tags', filters.tags.join(','));
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }
      if (filters.minTotal !== undefined) params.append('minTotal', filters.minTotal.toString());
      if (filters.maxTotal !== undefined) params.append('maxTotal', filters.maxTotal.toString());

      // Add pagination
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.limit) params.append('limit', pagination.limit.toString());
      if (pagination.orderBy) params.append('orderBy', pagination.orderBy);
      if (pagination.direction) params.append('direction', pagination.direction);
      if (pagination.cursor) params.append('cursor', pagination.cursor);

      // Fetch from API
      const response = await fetch(`/api/crm/orders?${params.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();

      if (data.success) {
        const ordersResponse: OrdersResponse = data.data;
        setOrders(ordersResponse.orders);
        setTotal(ordersResponse.total);
        setHasMore(ordersResponse.hasMore);
        setCurrentPage(ordersResponse.page);
        setPagination((prev) => ({ ...prev, cursor: ordersResponse.cursor }));
      } else {
        throw new Error(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination]);

  /**
   * Fetch metrics from API
   */
  const fetchMetrics = useCallback(
    async (startDate: string, endDate: string, compareStartDate?: string, compareEndDate?: string) => {
      setIsLoadingMetrics(true);

      try {
        const params = new URLSearchParams();
        params.append('startDate', startDate);
        params.append('endDate', endDate);
        if (compareStartDate) params.append('compareStartDate', compareStartDate);
        if (compareEndDate) params.append('compareEndDate', compareEndDate);

        const response = await fetch(`/api/crm/orders/metrics?${params.toString()}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const data = await response.json();

        if (data.success) {
          setMetrics(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch metrics');
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setMetrics(null);
      } finally {
        setIsLoadingMetrics(false);
      }
    },
    []
  );

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: OrdersFilter) => {
    setFiltersState(newFilters);
    setCurrentPage(1);
    setPagination((prev) => ({ ...prev, page: 1, cursor: undefined }));
  }, []);

  /**
   * Update active tab and apply preset filters
   */
  const setActiveTabWithFilter = useCallback((tab: OrderStatusGroup) => {
    setActiveTab(tab);

    // Apply preset filters based on tab
    const newFilters: OrdersFilter = {};

    switch (tab) {
      case 'unfulfilled':
        newFilters.fulfillmentStatus = ['unfulfilled'];
        break;
      case 'unpaid':
        newFilters.paymentStatus = ['pending'];
        break;
      case 'open':
        newFilters.fulfillmentStatus = ['unfulfilled', 'partially_fulfilled'];
        newFilters.paymentStatus = ['paid'];
        break;
      case 'archived':
        // TODO: Add archived status when implemented
        break;
      case 'all':
      default:
        // No filters
        break;
    }

    setFilters(newFilters);
  }, [setFilters]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (hasMore) {
      setPagination((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [hasMore]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setPagination((prev) => ({ ...prev, page: Math.max((prev.page || 1) - 1, 1), cursor: undefined }));
    }
  }, [currentPage]);

  /**
   * Refresh orders (clear cache and refetch)
   */
  const refresh = useCallback(async () => {
    setPagination((prev) => ({ ...prev, cursor: undefined }));
    await fetchOrders();
  }, [fetchOrders]);

  // Track if initial fetch has been done using ref (persists across renders without causing re-renders)
  const hasFetchedRef = useRef(false);

  // Auto-fetch on mount only
  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchOrders();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    orders,
    metrics,
    isLoading,
    isLoadingMetrics,
    error,
    total,
    hasMore,
    currentPage,
    filters,
    activeTab,
    fetchOrders,
    fetchMetrics,
    setFilters,
    setActiveTab: setActiveTabWithFilter,
    nextPage,
    prevPage,
    refresh,
  };
}

export default useOrders;
