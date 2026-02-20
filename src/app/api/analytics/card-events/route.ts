/**
 * Card Analytics Events API Endpoint
 *
 * Receives batched analytics events from the client and stores them in Firestore.
 *
 * POST /api/analytics/card-events
 * Body: { events: CreateCardAnalyticsEvent[] }
 * Response: { success: boolean, count: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import { cardAnalyticsServerService } from '@/lib/features/analytics/services';
import type { CreateCardAnalyticsEvent } from '@/lib/features/analytics/types';

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate event structure
 */
function isValidEvent(event: unknown): event is CreateCardAnalyticsEvent {
  if (!event || typeof event !== 'object') return false;

  const e = event as Record<string, unknown>;

  // Required fields
  if (typeof e.eventType !== 'string') return false;
  if (typeof e.professionalId !== 'string') return false;
  if (typeof e.timestamp !== 'string') return false;
  if (typeof e.sessionId !== 'string') return false;

  // Valid event types
  const validTypes = [
    'card_view',
    'book_click',
    'call_click',
    'text_click',
    'website_click',
    'instagram_click',
    'tiktok_click',
    'save_card',
    'copy_url',
  ];
  if (!validTypes.includes(e.eventType)) return false;

  return true;
}

/**
 * Sanitize event data (remove any unexpected fields)
 */
function sanitizeEvent(event: CreateCardAnalyticsEvent): CreateCardAnalyticsEvent {
  return {
    eventType: event.eventType,
    professionalId: event.professionalId,
    timestamp: event.timestamp,
    sessionId: event.sessionId,
    utmSource: event.utmSource,
    utmMedium: event.utmMedium,
    utmCampaign: event.utmCampaign,
    utmTerm: event.utmTerm,
    utmContent: event.utmContent,
    referrer: event.referrer,
    userAgent: event.userAgent,
    viewport: event.viewport,
    deviceType: event.deviceType,
    pageUrl: event.pageUrl,
  };
}

// =============================================================================
// POST HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate events array
    if (!body.events || !Array.isArray(body.events)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: events array required' },
        { status: 400 }
      );
    }

    // Limit batch size
    if (body.events.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Batch size exceeds maximum of 50 events' },
        { status: 400 }
      );
    }

    // Validate and sanitize each event
    const validEvents: CreateCardAnalyticsEvent[] = [];

    for (const event of body.events) {
      if (isValidEvent(event)) {
        validEvents.push(sanitizeEvent(event));
      } else {
        console.warn('[CardAnalytics API] Invalid event skipped:', event);
      }
    }

    if (validEvents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid events in request' },
        { status: 400 }
      );
    }

    // Get public Firestore (no auth required for analytics ingestion)
    const { db } = await getPublicFirebaseApp();

    if (!db) {
      console.error('[CardAnalytics API] Failed to initialize Firestore');
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Store events
    console.log('[CardAnalytics API] Storing', validEvents.length, 'events for professionals:', [...new Set(validEvents.map(e => e.professionalId))]);
    const count = await cardAnalyticsServerService.storeEventsBatch(db, validEvents);
    console.log('[CardAnalytics API] Successfully stored', count, 'events');

    return NextResponse.json({
      success: true,
      count,
      message: `Stored ${count} events`,
    });
  } catch (error) {
    console.error('[CardAnalytics API] Error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// OPTIONS HANDLER (CORS)
// =============================================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
