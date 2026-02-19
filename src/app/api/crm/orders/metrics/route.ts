/**
 * Order Metrics API Route
 *
 * GET /api/crm/orders/metrics - Get order metrics for dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { OrdersService } from '@/lib/features/crm/orders/services/ordersService';
import type { ApiResponse, OrderMetrics, MetricsRequest } from '@/lib/features/crm/orders/types';

/**
 * GET /api/crm/orders/metrics
 * Get order metrics for the dashboard
 *
 * Query parameters:
 * - startDate: Start date for current period (ISO string)
 * - endDate: End date for current period (ISO string)
 * - compareStartDate: Start date for comparison period (optional, ISO string)
 * - compareEndDate: End date for comparison period (optional, ISO string)
 */
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Get brandId from user
    const brandId = (currentUser as any).brandId || currentUser.uid;

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parameters',
          details: 'startDate and endDate are required',
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const compareStartDate = searchParams.get('compareStartDate');
    const compareEndDate = searchParams.get('compareEndDate');

    const metricsRequest: MetricsRequest = {
      startDate,
      endDate,
      compareStartDate: compareStartDate || undefined,
      compareEndDate: compareEndDate || undefined,
    };

    // Fetch metrics
    const metrics = await OrdersService.getOrderMetrics(db, brandId, metricsRequest);

    return NextResponse.json({
      success: true,
      data: metrics,
    } as ApiResponse<OrderMetrics>);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
