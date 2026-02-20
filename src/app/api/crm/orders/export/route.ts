/**
 * Orders Export API Endpoint
 *
 * POST /api/crm/orders/export - Export orders based on configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { OrdersService } from '@/lib/features/crm/orders/services/ordersService';
import type { Order, OrdersFilter } from '@/lib/features/crm/orders/types';
import type { ExportConfig } from '@/lib/features/crm/orders/utils/exportUtils';

/**
 * API Response Type
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * POST - Export orders
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    const brandId = (currentUser as any).brandId || currentUser.uid;

    // Parse request body
    const config: ExportConfig = await request.json();

    let orders: Order[] = [];

    // Fetch orders based on scope
    switch (config.scope) {
      case 'all-orders': {
        // Fetch all orders (batched)
        const batchSize = 100;
        let hasMore = true;
        let cursor: string | undefined;

        while (hasMore) {
          const result = await OrdersService.getOrders(db, brandId, {}, { page: 1, limit: batchSize, orderBy: 'createdAt', direction: 'desc', cursor });
          orders = orders.concat(result.orders);
          hasMore = result.hasMore;
          cursor = result.cursor;

          // Safety limit - max 10,000 orders
          if (orders.length >= 10000) {
            break;
          }
        }
        break;
      }

      case 'filtered': {
        // Apply current filters from config
        const filters: OrdersFilter = {};

        if (config.dateRange) {
          filters.dateRange = {
            start: config.dateRange.start,
            end: config.dateRange.end
          };
        }

        // Fetch with filters (batched)
        const batchSize = 100;
        let hasMore = true;
        let cursor: string | undefined;

        while (hasMore) {
          const result = await OrdersService.getOrders(
            db,
            brandId,
            filters,
            { page: 1, limit: batchSize, orderBy: 'createdAt', direction: 'desc', cursor }
          );
          orders = orders.concat(result.orders);
          hasMore = result.hasMore;
          cursor = result.cursor;

          // Safety limit
          if (orders.length >= 10000) {
            break;
          }
        }
        break;
      }

      case 'date-range': {
        // Fetch orders within date range
        if (!config.dateRange) {
          return NextResponse.json(
            { success: false, error: 'Date range required' } as ApiResponse<never>,
            { status: 400 }
          );
        }

        const filters: OrdersFilter = {
          dateRange: {
            start: config.dateRange.start,
            end: config.dateRange.end,
          }
        };

        const batchSize = 100;
        let hasMore = true;
        let cursor: string | undefined;

        while (hasMore) {
          const result = await OrdersService.getOrders(
            db,
            brandId,
            filters,
            { page: 1, limit: batchSize, orderBy: 'createdAt', direction: 'desc', cursor }
          );
          orders = orders.concat(result.orders);
          hasMore = result.hasMore;
          cursor = result.cursor;

          if (orders.length >= 10000) {
            break;
          }
        }
        break;
      }

      case 'selected': {
        // Fetch specific orders by ID
        if (!config.selectedIds || config.selectedIds.length === 0) {
          return NextResponse.json(
            { success: false, error: 'No orders selected' } as ApiResponse<never>,
            { status: 400 }
          );
        }

        // Fetch each selected order
        const orderPromises = config.selectedIds.map((id) =>
          OrdersService.getOrderById(db, brandId, id)
        );

        const fetchedOrders = await Promise.all(orderPromises);
        orders = fetchedOrders.filter((o): o is Order => o !== null);
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export scope' } as ApiResponse<never>,
          { status: 400 }
        );
    }

    // Return orders to client for CSV generation
    return NextResponse.json({
      success: true,
      data: orders,
    } as ApiResponse<Order[]>);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export orders',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
