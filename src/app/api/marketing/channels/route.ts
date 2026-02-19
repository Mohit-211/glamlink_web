/**
 * Marketing Channels API Route
 *
 * Handles fetching channel attribution data.
 *
 * Routes:
 * - GET /api/marketing/channels - Get channel attribution for a date range
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import marketingServerService from '@/lib/features/crm/marketing/server/marketingServerService';

/**
 * GET /api/marketing/channels
 *
 * Get channel attribution data for a brand
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
    const channels = await marketingServerService.getChannelAttribution(
      db,
      brandId,
      startDate,
      endDate
    );

    return NextResponse.json({
      success: true,
      data: {
        channels: channels || [],
        timeSeries: [], // TODO: Implement time series data
      },
    });
  } catch (error) {
    console.error('Error in GET /api/marketing/channels:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
