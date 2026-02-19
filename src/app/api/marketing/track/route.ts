/**
 * Marketing Tracking API Route
 *
 * Handles tracking events from the client-side MarketingTracker.
 *
 * Routes:
 * - POST /api/marketing/track - Track marketing events and sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import marketingServerService from '@/lib/features/crm/marketing/server/marketingServerService';
import type { MarketingSession } from '@/lib/features/crm/marketing/types';

/**
 * POST /api/marketing/track
 *
 * Track a marketing event or session
 *
 * Body:
 * - brandId: string (required)
 * - event: TrackingEvent (required)
 *   - type: string (session_start, pageview, conversion, etc.)
 *   - sessionId: string
 *   - visitorId: string
 *   - userId?: string
 *   - data: Record<string, any>
 *   - timestamp: string
 */
export async function POST(request: NextRequest) {
  try {
    // Note: Tracking doesn't require auth - can track anonymous visitors
    // But we still get the auth context if available
    const { db } = await getAuthenticatedAppForUser();

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database unavailable' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { brandId, event } = body;

    if (!brandId || !event) {
      return NextResponse.json(
        { success: false, error: 'Missing brandId or event' },
        { status: 400 }
      );
    }

    const { type, sessionId, visitorId, userId, data, timestamp } = event;

    if (!type || !sessionId || !visitorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required event fields' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (type) {
      case 'session_start':
        await handleSessionStart(db, brandId, sessionId, visitorId, userId, data, timestamp);
        break;

      case 'pageview':
        await handlePageView(db, brandId, sessionId, data);
        break;

      case 'conversion':
        await handleConversion(db, brandId, sessionId, data);
        break;

      case 'session_end':
        await handleSessionEnd(db, brandId, sessionId, data);
        break;

      case 'session_pause':
        // Optional: Track session pause for analytics
        break;

      default:
        // Track custom events - could be stored in a separate collection
        console.log('Custom tracking event:', type, data);
    }

    return NextResponse.json({
      success: true,
      data: { tracked: true },
    });
  } catch (error) {
    console.error('Error in POST /api/marketing/track:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle session start event
 */
async function handleSessionStart(
  db: any,
  brandId: string,
  sessionId: string,
  visitorId: string,
  userId: string | undefined,
  data: Record<string, any>,
  timestamp: string
) {
  const session: MarketingSession = {
    id: sessionId,
    visitorId,
    userId,
    brandId,

    // Source tracking
    channel: data.channel || 'direct',
    channelType: data.channelType || 'direct',
    source: data.source,
    medium: data.medium,
    campaign: data.campaign,
    content: data.content,
    term: data.term,
    referrer: data.referrer,
    referrerDomain: data.referrerDomain,

    // Session data
    landingPage: data.landingPage || '/',
    startedAt: timestamp,
    pageViews: 1,

    // Conversion tracking
    converted: false,
  };

  await marketingServerService.createSession(db, brandId, session);
}

/**
 * Handle page view event
 */
async function handlePageView(
  db: any,
  brandId: string,
  sessionId: string,
  data: Record<string, any>
) {
  // Increment page view count
  await marketingServerService.updateSession(db, brandId, sessionId, {
    pageViews: (data.pageViews || 0) + 1,
  });
}

/**
 * Handle conversion event
 */
async function handleConversion(
  db: any,
  brandId: string,
  sessionId: string,
  data: Record<string, any>
) {
  await marketingServerService.updateSession(db, brandId, sessionId, {
    converted: true,
    conversionType: data.conversionType,
    conversionValue: data.conversionValue,
    orderId: data.orderId,
  });
}

/**
 * Handle session end event
 */
async function handleSessionEnd(
  db: any,
  brandId: string,
  sessionId: string,
  data: Record<string, any>
) {
  await marketingServerService.updateSession(db, brandId, sessionId, {
    endedAt: data.endedAt || new Date().toISOString(),
  });
}
