/**
 * Marketing Stats API Route
 *
 * Handles fetching aggregated marketing statistics.
 *
 * Routes:
 * - GET /api/marketing/stats - Get marketing stats for a date range
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import marketingServerService from '@/lib/features/crm/marketing/server/marketingServerService';

/**
 * GET /api/marketing/stats
 *
 * Get marketing statistics for a brand
 *
 * Query params:
 * - brandId: string (required)
 * - startDate: string (required)
 * - endDate: string (required)
 * - attributionModel: string (optional)
 */
export async function GET(request: NextRequest) {
  // Auth check
  const { db, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser || !db) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Extract query params
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const attributionModel = searchParams.get('attributionModel');

  if (!brandId || !startDate || !endDate) {
    return NextResponse.json(
      { success: false, error: 'Brand ID, start date, and end date required' },
      { status: 400 }
    );
  }

  try {
    const stats = await marketingServerService.getMarketingStats(
      db,
      brandId,
      startDate,
      endDate
    );

    // If no stats yet, return empty stats
    if (!stats) {
      return NextResponse.json({
        success: true,
        data: {
          brandId,
          period: 'custom',
          date: startDate,
          totalSessions: 0,
          uniqueVisitors: 0,
          salesAttributedToMarketing: 0,
          ordersAttributedToMarketing: 0,
          conversionRate: 0,
          averageOrderValue: 0,
          channelStats: [],
          emailsSent: 0,
          emailOpenRate: 0,
          emailClickRate: 0,
          updatedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in GET /api/marketing/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
