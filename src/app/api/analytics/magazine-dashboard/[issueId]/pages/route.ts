/**
 * Magazine Analytics Per-Page Stats API Endpoint
 *
 * Returns page-level analytics for a specific magazine issue.
 *
 * GET /api/analytics/magazine-dashboard/[issueId]/pages
 * Query: ?dateRange=30d
 * Response: { success: boolean, data: PageAnalyticsStats[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { magazineAnalyticsServerService } from '@/lib/features/analytics/services';
import type { ServiceDateRange } from '@/lib/features/analytics/types';

// =============================================================================
// GET HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const { issueId } = await params;

    // Get authenticated user
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const dateRangeParam = searchParams.get('dateRange') || '30d';
    // Convert to ServiceDateRange (fallback to '30d' if 'custom' is passed)
    const dateRange: ServiceDateRange = dateRangeParam === 'custom' ? '30d' : dateRangeParam as ServiceDateRange;

    // Get page-level stats
    console.log('[MagazinePageStats API] Fetching page stats for issueId:', issueId, 'dateRange:', dateRange);

    const pageStats = await magazineAnalyticsServerService.getPageStats(
      db,
      issueId,
      { dateRange }
    );

    console.log('[MagazinePageStats API] Found', pageStats.length, 'page stats for issueId:', issueId);

    return NextResponse.json({
      success: true,
      data: pageStats,
      issueId,
      dateRange,
    });
  } catch (error) {
    console.error('[MagazinePageStats API] Error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
