/**
 * Magazine Analytics Interaction Breakdown API Endpoint
 *
 * Returns CTA click, link click, and video play breakdowns for a specific magazine issue.
 *
 * GET /api/analytics/magazine-dashboard/[issueId]/interactions
 * Query: ?dateRange=30d
 * Response: { success: boolean, data: InteractionBreakdown }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { magazineAnalyticsServerService } from '@/lib/features/analytics/services';
import type { DateRangeOption, ServiceDateRange, InteractionBreakdown } from '@/lib/features/analytics/types';

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

    // Get interaction breakdown
    console.log('[MagazineInteractions API] Fetching interaction breakdown for issueId:', issueId, 'dateRange:', dateRange);

    const breakdown = await magazineAnalyticsServerService.getInteractionBreakdown(
      db,
      issueId,
      { dateRange }
    );

    console.log('[MagazineInteractions API] Found breakdown for issueId:', issueId, {
      ctaClicks: breakdown.ctaClicks.length,
      linkClicks: breakdown.linkClicks.length,
      videoPlays: breakdown.videoPlays.length,
    });

    return NextResponse.json({
      success: true,
      data: breakdown,
      issueId,
      dateRange,
    });
  } catch (error) {
    console.error('[MagazineInteractions API] Error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
