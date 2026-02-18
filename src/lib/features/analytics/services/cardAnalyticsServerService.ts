/**
 * Card Analytics Server Service
 *
 * Server-side Firestore operations for storing and retrieving analytics events.
 * Events are stored in subcollections: professionals/{id}/analytics
 */

import {
  Firestore,
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import type {
  CardAnalyticsEvent,
  CreateCardAnalyticsEvent,
  CardAnalyticsStats,
  CardAnalyticsTimeSeries,
  SourceBreakdown,
  ClickBreakdown,
  CardAnalyticsEventType,
  EMPTY_STATS,
} from '../types';
import { CLICK_EVENT_TYPES, EVENT_TYPE_LABELS } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Top-level analytics collection */
const ANALYTICS_COLLECTION = 'analytics';

/** Digital cards category document */
const DIGITAL_CARDS_DOC = 'digital-cards';

/** Professionals subcollection */
const PROFESSIONALS_SUBCOLLECTION = 'professionals';

/** Events subcollection */
const EVENTS_SUBCOLLECTION = 'events';

/** Maximum events to return in queries */
const DEFAULT_LIMIT = 1000;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Remove undefined values from an object (Firestore doesn't accept undefined)
 */
function removeUndefinedValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key as keyof T] = value as T[keyof T];
    }
  }
  return cleaned;
}

/**
 * Get the analytics collection reference for a professional
 * Path: analytics/digital-cards/professionals/{professionalId}/events
 */
function getAnalyticsCollection(db: Firestore, professionalId: string) {
  return collection(db, ANALYTICS_COLLECTION, DIGITAL_CARDS_DOC, PROFESSIONALS_SUBCOLLECTION, professionalId, EVENTS_SUBCOLLECTION);
}

/**
 * Convert Firestore document to CardAnalyticsEvent
 */
function docToEvent(doc: { id: string; data: () => Record<string, unknown> }): CardAnalyticsEvent {
  const data = doc.data();
  return {
    id: doc.id,
    eventType: data.eventType as CardAnalyticsEventType,
    professionalId: data.professionalId as string,
    timestamp: data.timestamp as string,
    sessionId: data.sessionId as string,
    utmSource: data.utmSource as string | undefined,
    utmMedium: data.utmMedium as string | undefined,
    utmCampaign: data.utmCampaign as string | undefined,
    utmTerm: data.utmTerm as string | undefined,
    utmContent: data.utmContent as string | undefined,
    referrer: data.referrer as string | undefined,
    userAgent: data.userAgent as string | undefined,
    viewport: data.viewport as { width: number; height: number } | undefined,
    deviceType: data.deviceType as 'mobile' | 'tablet' | 'desktop' | undefined,
    pageUrl: data.pageUrl as string | undefined,
    createdAt: data.createdAt,
  };
}

/**
 * Get date range from option
 */
function getDateRange(option: '7d' | '30d' | '90d' | 'all' | 'custom', customRange?: { startDate: string; endDate: string }) {
  const now = new Date();
  let startDate: Date;
  let endDate = new Date(now.setHours(23, 59, 59, 999));

  switch (option) {
    case '7d':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '30d':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '90d':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'custom':
      if (!customRange) {
        throw new Error('Custom range requires startDate and endDate');
      }
      startDate = new Date(customRange.startDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(customRange.endDate);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'all':
    default:
      // Return very old date for "all time"
      startDate = new Date('2020-01-01');
      break;
  }

  return { startDate, endDate };
}

// =============================================================================
// SERVER SERVICE CLASS
// =============================================================================

class CardAnalyticsServerService {
  // ===========================================================================
  // WRITE OPERATIONS
  // ===========================================================================

  /**
   * Store a single analytics event
   */
  async storeEvent(
    db: Firestore,
    professionalId: string,
    event: CreateCardAnalyticsEvent
  ): Promise<string> {
    const analyticsRef = getAnalyticsCollection(db, professionalId);

    // Remove undefined values (Firestore doesn't accept them)
    const cleanedEvent = removeUndefinedValues(event as Record<string, unknown>);
    const docData = {
      ...cleanedEvent,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(analyticsRef, docData);
    return docRef.id;
  }

  /**
   * Store multiple events in a batch
   */
  async storeEventsBatch(
    db: Firestore,
    events: CreateCardAnalyticsEvent[]
  ): Promise<number> {
    if (events.length === 0) return 0;

    const batch = writeBatch(db);
    let count = 0;

    for (const event of events) {
      const analyticsRef = getAnalyticsCollection(db, event.professionalId);
      const docRef = doc(analyticsRef);

      // Remove undefined values (Firestore doesn't accept them)
      const cleanedEvent = removeUndefinedValues(event as Record<string, unknown>);
      batch.set(docRef, {
        ...cleanedEvent,
        createdAt: Timestamp.now(),
      });

      count++;
    }

    await batch.commit();
    return count;
  }

  // ===========================================================================
  // READ OPERATIONS
  // ===========================================================================

  /**
   * Get events for a professional with optional filtering
   */
  async getEvents(
    db: Firestore,
    professionalId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
      eventTypes?: CardAnalyticsEventType[];
      maxResults?: number;
    }
  ): Promise<CardAnalyticsEvent[]> {
    const analyticsRef = getAnalyticsCollection(db, professionalId);
    const constraints: Parameters<typeof query>[1][] = [];

    // Date range filter
    if (options?.dateRange || options?.customRange) {
      const { startDate, endDate } = getDateRange(
        options?.dateRange || 'custom',
        options?.customRange
      );
      constraints.push(where('timestamp', '>=', startDate.toISOString()));
      constraints.push(where('timestamp', '<=', endDate.toISOString()));
    }

    // Event type filter
    if (options?.eventTypes && options.eventTypes.length > 0) {
      constraints.push(where('eventType', 'in', options.eventTypes));
    }

    // Order and limit
    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(limit(options?.maxResults || DEFAULT_LIMIT));

    const q = query(analyticsRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(docToEvent);
  }

  /**
   * Get aggregated stats for a professional
   */
  async getStats(
    db: Firestore,
    professionalId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<CardAnalyticsStats> {
    const events = await this.getEvents(db, professionalId, {
      dateRange: options?.dateRange,
      customRange: options?.customRange,
    });

    // Count unique sessions for unique visitors
    const uniqueSessions = new Set<string>();

    // Initialize stats
    const stats: CardAnalyticsStats = {
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
    };

    // Aggregate events
    for (const event of events) {
      uniqueSessions.add(event.sessionId);

      switch (event.eventType) {
        case 'card_view':
          stats.totalViews++;
          break;
        case 'book_click':
          stats.bookClicks++;
          break;
        case 'call_click':
          stats.callClicks++;
          break;
        case 'text_click':
          stats.textClicks++;
          break;
        case 'website_click':
          stats.websiteClicks++;
          break;
        case 'instagram_click':
          stats.instagramClicks++;
          break;
        case 'tiktok_click':
          stats.tiktokClicks++;
          break;
        case 'save_card':
          stats.saveCardClicks++;
          break;
        case 'copy_url':
          stats.copyUrlClicks++;
          break;
      }
    }

    stats.uniqueVisitors = uniqueSessions.size;

    return stats;
  }

  /**
   * Get time series data for charts
   */
  async getTimeSeries(
    db: Firestore,
    professionalId: string,
    options: {
      dateRange?: '7d' | '30d' | '90d';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<CardAnalyticsTimeSeries[]> {
    const events = await this.getEvents(db, professionalId, options);

    // Group events by date
    const dateMap = new Map<string, { views: number; visitors: Set<string>; clicks: number }>();

    for (const event of events) {
      const date = event.timestamp.split('T')[0]; // YYYY-MM-DD

      if (!dateMap.has(date)) {
        dateMap.set(date, { views: 0, visitors: new Set(), clicks: 0 });
      }

      const dayData = dateMap.get(date)!;
      dayData.visitors.add(event.sessionId);

      if (event.eventType === 'card_view') {
        dayData.views++;
      } else {
        dayData.clicks++;
      }
    }

    // Convert to array and sort by date
    const timeSeries: CardAnalyticsTimeSeries[] = [];

    for (const [date, data] of dateMap) {
      timeSeries.push({
        date,
        views: data.views,
        uniqueVisitors: data.visitors.size,
        totalClicks: data.clicks,
      });
    }

    // Sort ascending by date
    timeSeries.sort((a, b) => a.date.localeCompare(b.date));

    return timeSeries;
  }

  /**
   * Get source breakdown for pie charts
   */
  async getSourceBreakdown(
    db: Firestore,
    professionalId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<SourceBreakdown[]> {
    const events = await this.getEvents(db, professionalId, options);

    // Group by source
    const sourceMap = new Map<string, { count: number; medium?: string }>();

    for (const event of events) {
      const source = event.utmSource || 'direct';
      const key = source;

      if (!sourceMap.has(key)) {
        sourceMap.set(key, { count: 0, medium: event.utmMedium });
      }

      sourceMap.get(key)!.count++;
    }

    // Calculate percentages and convert to array
    const total = events.length;
    const breakdown: SourceBreakdown[] = [];

    for (const [source, data] of sourceMap) {
      breakdown.push({
        source,
        medium: data.medium,
        count: data.count,
        percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      });
    }

    // Sort by count descending
    breakdown.sort((a, b) => b.count - a.count);

    return breakdown;
  }

  /**
   * Get click breakdown by event type
   */
  async getClickBreakdown(
    db: Firestore,
    professionalId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<ClickBreakdown[]> {
    const events = await this.getEvents(db, professionalId, {
      ...options,
      eventTypes: CLICK_EVENT_TYPES,
    });

    // Group by event type
    const typeMap = new Map<CardAnalyticsEventType, number>();

    for (const event of events) {
      const count = typeMap.get(event.eventType) || 0;
      typeMap.set(event.eventType, count + 1);
    }

    // Calculate percentages and convert to array
    const total = events.length;
    const breakdown: ClickBreakdown[] = [];

    for (const [eventType, count] of typeMap) {
      breakdown.push({
        eventType,
        label: EVENT_TYPE_LABELS[eventType],
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      });
    }

    // Sort by count descending
    breakdown.sort((a, b) => b.count - a.count);

    return breakdown;
  }

  /**
   * Get recent events (for activity feed)
   */
  async getRecentEvents(
    db: Firestore,
    professionalId: string,
    maxResults: number = 10
  ): Promise<CardAnalyticsEvent[]> {
    return this.getEvents(db, professionalId, { maxResults });
  }

  // ===========================================================================
  // ADMIN OPERATIONS
  // ===========================================================================

  /**
   * Get stats for multiple professionals (admin view)
   */
  async getMultipleProfessionalsStats(
    db: Firestore,
    professionalIds: string[],
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
    }
  ): Promise<Map<string, CardAnalyticsStats>> {
    const results = new Map<string, CardAnalyticsStats>();

    // Fetch in parallel
    const promises = professionalIds.map(async (id) => {
      const stats = await this.getStats(db, id, options);
      results.set(id, stats);
    });

    await Promise.all(promises);

    return results;
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const cardAnalyticsServerService = new CardAnalyticsServerService();

export default cardAnalyticsServerService;
