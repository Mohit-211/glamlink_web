/**
 * Magazine Analytics Events API Endpoint
 *
 * Receives batched analytics events from the client and stores them in Firestore.
 *
 * POST /api/analytics/magazine-events
 * Body: { events: CreateMagazineAnalyticsEvent[] }
 * Response: { success: boolean, count: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicFirebaseApp } from '@/lib/firebase/serverApp';
import { magazineAnalyticsServerService } from '@/lib/features/analytics/services';
import type { CreateMagazineAnalyticsEvent, MagazineAnalyticsEventType } from '@/lib/features/analytics/types';

// =============================================================================
// VALIDATION
// =============================================================================

/** Valid event types for magazine analytics */
const VALID_EVENT_TYPES: MagazineAnalyticsEventType[] = [
  'issue_view',
  'page_view',
  'navigation',
  'section_click',
  'cta_click',
  'link_click',
  'video_play',
  'pdf_download',
  'share',
];

/**
 * Validate event structure
 */
function isValidEvent(event: unknown): event is CreateMagazineAnalyticsEvent {
  if (!event || typeof event !== 'object') return false;

  const e = event as Record<string, unknown>;

  // Required fields
  if (typeof e.eventType !== 'string') return false;
  if (typeof e.issueId !== 'string') return false;
  if (typeof e.timestamp !== 'string') return false;
  if (typeof e.sessionId !== 'string') return false;

  // Valid event types
  if (!VALID_EVENT_TYPES.includes(e.eventType as MagazineAnalyticsEventType)) return false;

  return true;
}

/**
 * Sanitize event data (remove any unexpected fields)
 */
function sanitizeEvent(event: CreateMagazineAnalyticsEvent): CreateMagazineAnalyticsEvent {
  return {
    eventType: event.eventType,
    issueId: event.issueId,
    timestamp: event.timestamp,
    sessionId: event.sessionId,
    pageId: event.pageId,
    sectionId: event.sectionId,
    sectionType: event.sectionType,
    sectionTitle: event.sectionTitle,
    fromPageId: event.fromPageId,
    toPageId: event.toPageId,
    navigationMethod: event.navigationMethod,
    // CTA click fields
    buttonLabel: event.buttonLabel,
    buttonVariant: event.buttonVariant,
    // Link click fields
    linkType: event.linkType,
    linkUrl: event.linkUrl,
    // Video play fields
    videoSource: event.videoSource,
    // UTM fields
    utmSource: event.utmSource,
    utmMedium: event.utmMedium,
    utmCampaign: event.utmCampaign,
    utmTerm: event.utmTerm,
    utmContent: event.utmContent,
    // Device context
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
    const validEvents: CreateMagazineAnalyticsEvent[] = [];

    for (const event of body.events) {
      if (isValidEvent(event)) {
        validEvents.push(sanitizeEvent(event));
      } else {
        console.warn('[MagazineAnalytics API] Invalid event skipped:', event);
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
      console.error('[MagazineAnalytics API] Failed to initialize Firestore');
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Store events
    console.log('[MagazineAnalytics API] Storing', validEvents.length, 'events for issues:', [...new Set(validEvents.map(e => e.issueId))]);
    const count = await magazineAnalyticsServerService.storeEventsBatch(db, validEvents);
    console.log('[MagazineAnalytics API] Successfully stored', count, 'events');

    return NextResponse.json({
      success: true,
      count,
      message: `Stored ${count} events`,
    });
  } catch (error) {
    console.error('[MagazineAnalytics API] Error:', error);

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
