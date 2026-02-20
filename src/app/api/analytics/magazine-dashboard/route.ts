/**
 * Magazine Analytics Dashboard API Endpoint
 *
 * Returns aggregated analytics for all magazine issues (admin view).
 *
 * GET /api/analytics/magazine-dashboard
 * Query: ?dateRange=30d
 * Response: { success: boolean, data: MagazineAnalyticsSummary[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { magazineAnalyticsServerService } from '@/lib/features/analytics/services';
import type { MagazineAnalyticsStats, MagazineAnalyticsSummary, ServiceDateRange } from '@/lib/features/analytics/types';
import { EMPTY_MAGAZINE_STATS } from '@/lib/features/analytics/types';

// =============================================================================
// GET HANDLER
// =============================================================================

export async function GET(request: NextRequest) {
  try {
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

    // Get all magazine issues
    const issuesRef = collection(db, 'magazine_issues');
    const issuesQuery = query(issuesRef, orderBy('issueNumber', 'desc'));
    const issuesSnapshot = await getDocs(issuesQuery);

    const issues = issuesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      title?: string;
      issueNumber?: number;
      issueDate?: string;
      sections?: Array<unknown>;
    }>;

    // Get analytics for each issue
    const issueIds = issues.map(i => i.id);
    const statsMap = await magazineAnalyticsServerService.getMultipleIssuesStats(
      db,
      issueIds,
      { dateRange }
    );

    // Build response data (pageCount removed - fetched in drilldown modal)
    const data: MagazineAnalyticsSummary[] = issues.map(issue => ({
      issueId: issue.id,
      title: issue.title || 'Untitled Issue',
      issueNumber: issue.issueNumber || 0,
      issueDate: issue.issueDate || '',
      stats: statsMap.get(issue.id) || { ...EMPTY_MAGAZINE_STATS },
    }));

    // Sort by issue number descending (most recent first)
    data.sort((a, b) => b.issueNumber - a.issueNumber);

    return NextResponse.json({
      success: true,
      data,
      dateRange,
      count: data.length,
    });
  } catch (error) {
    console.error('[MagazineDashboard API] Error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
