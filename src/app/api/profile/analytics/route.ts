import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { cardAnalyticsServerService } from '@/lib/features/analytics/services';
import type { ServiceDateRange } from '@/lib/features/analytics/types';

// GET /api/profile/analytics - Get analytics for the current user's professional profile
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Convert to ServiceDateRange format
    const dateRange: ServiceDateRange = ['7d', '30d', '90d', 'all'].includes(range)
      ? range as ServiceDateRange
      : '30d';

    // Find professional where ownerId matches current user
    const professionalsRef = collection(db, 'professionals');
    const q = query(professionalsRef, where('ownerId', '==', currentUser.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ analytics: null }, { status: 404 });
    }

    const professionalDoc = snapshot.docs[0];
    const professionalId = professionalDoc.id;

    // Use cardAnalyticsServerService to get stats from correct Firestore path
    const stats = await cardAnalyticsServerService.getStats(db, professionalId, { dateRange });

    // Calculate total clicks from all click types
    const totalClicks = stats.bookClicks + stats.callClicks + stats.textClicks +
                        stats.websiteClicks + stats.instagramClicks + stats.tiktokClicks +
                        stats.saveCardClicks + stats.copyUrlClicks;

    const engagementRate = stats.totalViews > 0 ? (totalClicks / stats.totalViews) * 100 : 0;

    return NextResponse.json({
      analytics: {
        totalViews: stats.totalViews,
        uniqueVisitors: stats.uniqueVisitors,
        totalClicks,
        engagementRate,
        clickBreakdown: {
          book: stats.bookClicks,
          call: stats.callClicks,
          text: stats.textClicks,
          website: stats.websiteClicks,
          instagram: stats.instagramClicks,
          tiktok: stats.tiktokClicks,
          save: stats.saveCardClicks,
          copyUrl: stats.copyUrlClicks,
        },
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
