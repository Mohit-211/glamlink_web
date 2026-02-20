/**
 * Card Analytics Dashboard API Endpoint
 *
 * Returns aggregated analytics for all professionals (admin view).
 *
 * GET /api/analytics/card-dashboard
 * Query: ?dateRange=30d
 * Response: { success: boolean, data: ProfessionalAnalyticsSummary[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, getDocs } from 'firebase/firestore';
import { cardAnalyticsServerService } from '@/lib/features/analytics/services';
import type { CardAnalyticsStats, DateRangeOption, ServiceDateRange } from '@/lib/features/analytics/types';

// =============================================================================
// TYPES
// =============================================================================

interface ProfessionalAnalyticsSummary {
  id: string;
  name: string;
  profileImage?: string;
  title?: string;
  stats: CardAnalyticsStats;
}

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
    // Convert to ServiceDateRange (fallback to '30d' if 'custom' is passed since custom requires additional params)
    const dateRange: ServiceDateRange = dateRangeParam === 'custom' ? '30d' : dateRangeParam as ServiceDateRange;

    // Get all professionals
    const professionalsRef = collection(db, 'professionals');
    const professionalsSnapshot = await getDocs(professionalsRef);

    const professionals = professionalsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      name?: string;
      profileImage?: string;
      title?: string;
    }>;

    // Get analytics for each professional
    const professionalIds = professionals.map(p => p.id);
    const statsMap = await cardAnalyticsServerService.getMultipleProfessionalsStats(
      db,
      professionalIds,
      { dateRange }
    );

    // Build response data
    const data: ProfessionalAnalyticsSummary[] = professionals.map(pro => ({
      id: pro.id,
      name: pro.name || 'Unknown',
      profileImage: pro.profileImage,
      title: pro.title,
      stats: statsMap.get(pro.id) || {
        totalViews: 0,
        uniqueVisitors: 0,
        bookClicks: 0,
        callClicks: 0,
        textClicks: 0,
        websiteClicks: 0,
        instagramClicks: 0,
        tiktokClicks: 0,
        saveCardClicks: 0,
        copyUrlClicks: 0,
      },
    }));

    // Sort by total views descending
    data.sort((a, b) => b.stats.totalViews - a.stats.totalViews);

    return NextResponse.json({
      success: true,
      data,
      dateRange,
      count: data.length,
    });
  } catch (error) {
    console.error('[CardDashboard API] Error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
