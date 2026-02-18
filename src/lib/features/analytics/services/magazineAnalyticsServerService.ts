/**
 * Magazine Analytics Server Service
 *
 * Server-side Firestore operations for storing and retrieving magazine analytics events.
 * Events are stored in subcollections: magazine_issues/{id}/analytics
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
  MagazineAnalyticsEvent,
  MagazineAnalyticsEventType,
  CreateMagazineAnalyticsEvent,
  MagazineAnalyticsStats,
  PageAnalyticsStats,
  MagazineAnalyticsTimeSeries,
  CtaClickStats,
  LinkClickStats,
  VideoPlayStats,
  InteractionBreakdown,
} from '../types';
import { EMPTY_MAGAZINE_STATS } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Top-level analytics collection */
const ANALYTICS_COLLECTION = 'analytics';

/** Magazine category document */
const MAGAZINE_DOC = 'magazine';

/** Issues subcollection */
const ISSUES_SUBCOLLECTION = 'issues';

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
 * Get the analytics collection reference for a magazine issue
 * Path: analytics/magazine/issues/{issueId}/events
 */
function getAnalyticsCollection(db: Firestore, issueId: string) {
  return collection(db, ANALYTICS_COLLECTION, MAGAZINE_DOC, ISSUES_SUBCOLLECTION, issueId, EVENTS_SUBCOLLECTION);
}

/**
 * Convert Firestore document to MagazineAnalyticsEvent
 */
function docToEvent(doc: { id: string; data: () => Record<string, unknown> }): MagazineAnalyticsEvent {
  const data = doc.data();
  return {
    id: doc.id,
    eventType: data.eventType as MagazineAnalyticsEventType,
    issueId: data.issueId as string,
    timestamp: data.timestamp as string,
    sessionId: data.sessionId as string,
    pageId: data.pageId as number | undefined,
    sectionId: data.sectionId as string | undefined,
    sectionType: data.sectionType as string | undefined,
    sectionTitle: data.sectionTitle as string | undefined,
    fromPageId: data.fromPageId as number | undefined,
    toPageId: data.toPageId as number | undefined,
    navigationMethod: data.navigationMethod as 'arrow' | 'thumbnail' | 'toc' | 'keyboard' | 'direct' | undefined,
    // CTA click fields
    buttonLabel: data.buttonLabel as string | undefined,
    buttonVariant: data.buttonVariant as 'primary' | 'secondary' | undefined,
    // Link click fields
    linkType: data.linkType as 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other' | undefined,
    linkUrl: data.linkUrl as string | undefined,
    // Video play fields
    videoSource: data.videoSource as 'youtube' | 'upload' | undefined,
    // UTM fields
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

class MagazineAnalyticsServerService {
  // ===========================================================================
  // WRITE OPERATIONS
  // ===========================================================================

  /**
   * Store a single analytics event
   */
  async storeEvent(
    db: Firestore,
    issueId: string,
    event: CreateMagazineAnalyticsEvent
  ): Promise<string> {
    const analyticsRef = getAnalyticsCollection(db, issueId);

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
    events: CreateMagazineAnalyticsEvent[]
  ): Promise<number> {
    if (events.length === 0) return 0;

    const batch = writeBatch(db);
    let count = 0;

    for (const event of events) {
      const analyticsRef = getAnalyticsCollection(db, event.issueId);
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
   * Get events for an issue with optional filtering
   */
  async getEvents(
    db: Firestore,
    issueId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
      eventTypes?: MagazineAnalyticsEventType[];
      maxResults?: number;
    }
  ): Promise<MagazineAnalyticsEvent[]> {
    const analyticsRef = getAnalyticsCollection(db, issueId);

    console.log('[MagazineAnalytics] getEvents for issueId:', issueId, 'options:', options);

    // For 'all' date range or no date range, just fetch all events with orderBy and limit
    // This avoids compound query issues that require indexes
    const isAllTime = !options?.dateRange || options.dateRange === 'all';

    if (isAllTime && !options?.eventTypes) {
      // Simple query - just order and limit
      try {
        const q = query(
          analyticsRef,
          orderBy('timestamp', 'desc'),
          limit(options?.maxResults || DEFAULT_LIMIT)
        );
        const snapshot = await getDocs(q);
        console.log('[MagazineAnalytics] Found', snapshot.docs.length, 'events (simple query)');
        return snapshot.docs.map(docToEvent);
      } catch (error) {
        console.error('[MagazineAnalytics] Simple query error:', error);
        // If orderBy fails (no index), try without orderBy
        try {
          const q = query(analyticsRef, limit(options?.maxResults || DEFAULT_LIMIT));
          const snapshot = await getDocs(q);
          console.log('[MagazineAnalytics] Found', snapshot.docs.length, 'events (fallback query)');
          // Sort in memory
          const events = snapshot.docs.map(docToEvent);
          events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          return events;
        } catch (fallbackError) {
          console.error('[MagazineAnalytics] Fallback query error:', fallbackError);
          throw fallbackError;
        }
      }
    }

    // Build constraints for filtered queries
    const constraints: Parameters<typeof query>[1][] = [];

    // Date range filter (only for non-all ranges)
    if (options?.dateRange && options.dateRange !== 'all') {
      const { startDate, endDate } = getDateRange(options.dateRange, options?.customRange);
      console.log('[MagazineAnalytics] Date range:', startDate.toISOString(), 'to', endDate.toISOString());
      constraints.push(where('timestamp', '>=', startDate.toISOString()));
      constraints.push(where('timestamp', '<=', endDate.toISOString()));
    } else if (options?.customRange) {
      const { startDate, endDate } = getDateRange('custom', options.customRange);
      constraints.push(where('timestamp', '>=', startDate.toISOString()));
      constraints.push(where('timestamp', '<=', endDate.toISOString()));
    }

    // Event type filter
    if (options?.eventTypes && options.eventTypes.length > 0) {
      console.log('[MagazineAnalytics] Event types filter:', options.eventTypes);
      constraints.push(where('eventType', 'in', options.eventTypes));
    }

    // Order and limit
    constraints.push(orderBy('timestamp', 'desc'));
    constraints.push(limit(options?.maxResults || DEFAULT_LIMIT));

    try {
      const q = query(analyticsRef, ...constraints);
      const snapshot = await getDocs(q);
      console.log('[MagazineAnalytics] Found', snapshot.docs.length, 'events');
      return snapshot.docs.map(docToEvent);
    } catch (error) {
      console.error('[MagazineAnalytics] Query error:', error);
      throw error;
    }
  }

  /**
   * Get aggregated stats for an issue
   */
  async getStats(
    db: Firestore,
    issueId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<MagazineAnalyticsStats> {
    const events = await this.getEvents(db, issueId, {
      dateRange: options?.dateRange,
      customRange: options?.customRange,
    });

    // Count unique sessions for unique visitors
    const uniqueSessions = new Set<string>();
    const sessionPageViews = new Map<string, number>();

    // Initialize stats
    const stats: MagazineAnalyticsStats = { ...EMPTY_MAGAZINE_STATS };

    // Aggregate events
    for (const event of events) {
      uniqueSessions.add(event.sessionId);

      switch (event.eventType) {
        case 'issue_view':
          stats.totalViews++;
          break;
        case 'page_view':
          stats.totalPageViews++;
          // Track pages per session
          const currentCount = sessionPageViews.get(event.sessionId) || 0;
          sessionPageViews.set(event.sessionId, currentCount + 1);
          break;
        case 'cta_click':
          stats.ctaClicks++;
          break;
        case 'pdf_download':
          stats.pdfDownloads++;
          break;
        case 'share':
          stats.shareClicks++;
          break;
      }
    }

    stats.uniqueVisitors = uniqueSessions.size;

    // Calculate average pages per session
    if (sessionPageViews.size > 0) {
      const totalPageViewsPerSession = Array.from(sessionPageViews.values()).reduce((a, b) => a + b, 0);
      stats.avgPagesPerSession = Math.round((totalPageViewsPerSession / sessionPageViews.size) * 10) / 10;
    }

    return stats;
  }

  /**
   * Get per-page stats for an issue
   */
  async getPageStats(
    db: Firestore,
    issueId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<PageAnalyticsStats[]> {
    // Fetch all events without eventTypes filter to avoid Firestore index issues
    // Then filter for page_view in memory
    const allEvents = await this.getEvents(db, issueId, {
      dateRange: options?.dateRange,
      customRange: options?.customRange,
      // Don't pass eventTypes to avoid compound query issues
    });

    // Filter for page_view events in memory
    const events = allEvents.filter(e => e.eventType === 'page_view');
    console.log('[MagazineAnalytics] getPageStats: filtered', events.length, 'page_view events from', allEvents.length, 'total');

    // Group by pageId
    const pageMap = new Map<number, {
      views: number;
      visitors: Set<string>;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }>();

    for (const event of events) {
      if (event.pageId === undefined) continue;

      if (!pageMap.has(event.pageId)) {
        pageMap.set(event.pageId, {
          views: 0,
          visitors: new Set(),
          sectionId: event.sectionId,
          sectionType: event.sectionType,
          sectionTitle: event.sectionTitle,
        });
      }

      const pageData = pageMap.get(event.pageId)!;
      pageData.views++;
      pageData.visitors.add(event.sessionId);
    }

    // Get total unique visitors for percentage calculation
    const allVisitors = new Set<string>();
    events.forEach(e => allVisitors.add(e.sessionId));
    const totalVisitors = allVisitors.size;

    // Convert to array and sort by pageId
    const pageStats: PageAnalyticsStats[] = [];

    for (const [pageId, data] of pageMap) {
      pageStats.push({
        pageId,
        sectionId: data.sectionId,
        sectionType: data.sectionType,
        sectionTitle: data.sectionTitle,
        views: data.views,
        uniqueVisitors: data.visitors.size,
        viewPercentage: totalVisitors > 0
          ? Math.round((data.visitors.size / totalVisitors) * 100)
          : 0,
      });
    }

    // Sort by pageId ascending
    pageStats.sort((a, b) => a.pageId - b.pageId);

    return pageStats;
  }

  /**
   * Get time series data for charts
   */
  async getTimeSeries(
    db: Firestore,
    issueId: string,
    options: {
      dateRange?: '7d' | '30d' | '90d';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<MagazineAnalyticsTimeSeries[]> {
    const events = await this.getEvents(db, issueId, options);

    // Group events by date
    const dateMap = new Map<string, {
      views: number;
      visitors: Set<string>;
      pageViews: number;
    }>();

    for (const event of events) {
      const date = event.timestamp.split('T')[0]; // YYYY-MM-DD

      if (!dateMap.has(date)) {
        dateMap.set(date, { views: 0, visitors: new Set(), pageViews: 0 });
      }

      const dayData = dateMap.get(date)!;
      dayData.visitors.add(event.sessionId);

      if (event.eventType === 'issue_view') {
        dayData.views++;
      } else if (event.eventType === 'page_view') {
        dayData.pageViews++;
      }
    }

    // Convert to array and sort by date
    const timeSeries: MagazineAnalyticsTimeSeries[] = [];

    for (const [date, data] of dateMap) {
      timeSeries.push({
        date,
        views: data.views,
        uniqueVisitors: data.visitors.size,
        pageViews: data.pageViews,
      });
    }

    // Sort ascending by date
    timeSeries.sort((a, b) => a.date.localeCompare(b.date));

    return timeSeries;
  }

  /**
   * Get recent events (for activity feed)
   */
  async getRecentEvents(
    db: Firestore,
    issueId: string,
    maxResults: number = 10
  ): Promise<MagazineAnalyticsEvent[]> {
    return this.getEvents(db, issueId, { maxResults });
  }

  // ===========================================================================
  // ADMIN OPERATIONS
  // ===========================================================================

  /**
   * Get stats for multiple issues (admin view)
   */
  async getMultipleIssuesStats(
    db: Firestore,
    issueIds: string[],
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
    }
  ): Promise<Map<string, MagazineAnalyticsStats>> {
    const results = new Map<string, MagazineAnalyticsStats>();

    // Fetch in parallel
    const promises = issueIds.map(async (id) => {
      try {
        const stats = await this.getStats(db, id, options);
        results.set(id, stats);
      } catch (error) {
        console.error(`[MagazineAnalytics] Error fetching stats for ${id}:`, error);
        results.set(id, { ...EMPTY_MAGAZINE_STATS });
      }
    });

    await Promise.all(promises);

    return results;
  }

  // ===========================================================================
  // INTERACTION BREAKDOWN METHODS
  // ===========================================================================

  /**
   * Get CTA click breakdown for an issue
   */
  async getCtaClickBreakdown(
    db: Firestore,
    issueId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<CtaClickStats[]> {
    // Fetch all events and filter in memory
    const allEvents = await this.getEvents(db, issueId, {
      dateRange: options?.dateRange,
      customRange: options?.customRange,
    });

    // Filter for cta_click events
    const ctaEvents = allEvents.filter(e => e.eventType === 'cta_click');
    console.log('[MagazineAnalytics] getCtaClickBreakdown: found', ctaEvents.length, 'CTA click events');

    // Group by button label + pageId + section (composite key for unique combinations)
    const labelMap = new Map<string, {
      buttonLabel: string;
      clicks: number;
      clickers: Set<string>;
      variant?: 'primary' | 'secondary';
      pageId?: number;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }>();

    for (const event of ctaEvents) {
      const label = event.buttonLabel || 'Unknown';
      const pageId = event.pageId ?? -1;
      const sectionId = event.sectionId || '';
      const compositeKey = `${label}::${pageId}::${sectionId}`;

      if (!labelMap.has(compositeKey)) {
        labelMap.set(compositeKey, {
          buttonLabel: label,
          clicks: 0,
          clickers: new Set(),
          variant: event.buttonVariant,
          pageId: event.pageId,
          sectionId: event.sectionId,
          sectionType: event.sectionType,
          sectionTitle: event.sectionTitle,
        });
      }

      const data = labelMap.get(compositeKey)!;
      data.clicks++;
      data.clickers.add(event.sessionId);
    }

    // Convert to array and sort by clicks
    const results: CtaClickStats[] = [];
    for (const [, data] of labelMap) {
      results.push({
        buttonLabel: data.buttonLabel,
        buttonVariant: data.variant,
        pageId: data.pageId,
        sectionId: data.sectionId,
        sectionType: data.sectionType,
        sectionTitle: data.sectionTitle,
        clicks: data.clicks,
        uniqueClickers: data.clickers.size,
      });
    }

    // Sort by pageId first, then by clicks descending
    results.sort((a, b) => {
      const pageA = a.pageId ?? 999;
      const pageB = b.pageId ?? 999;
      if (pageA !== pageB) return pageA - pageB;
      return b.clicks - a.clicks;
    });

    return results;
  }

  /**
   * Get link click breakdown for an issue
   */
  async getLinkClickBreakdown(
    db: Firestore,
    issueId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<LinkClickStats[]> {
    // Fetch all events and filter in memory
    const allEvents = await this.getEvents(db, issueId, {
      dateRange: options?.dateRange,
      customRange: options?.customRange,
    });

    // Filter for link_click events
    const linkEvents = allEvents.filter(e => e.eventType === 'link_click');
    console.log('[MagazineAnalytics] getLinkClickBreakdown: found', linkEvents.length, 'link click events');

    // Group by link type + pageId + section (composite key)
    const typeMap = new Map<string, {
      linkType: string;
      clicks: number;
      clickers: Set<string>;
      pageId?: number;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }>();

    for (const event of linkEvents) {
      const type = event.linkType || 'other';
      const pageId = event.pageId ?? -1;
      const sectionId = event.sectionId || '';
      const compositeKey = `${type}::${pageId}::${sectionId}`;

      if (!typeMap.has(compositeKey)) {
        typeMap.set(compositeKey, {
          linkType: type,
          clicks: 0,
          clickers: new Set(),
          pageId: event.pageId,
          sectionId: event.sectionId,
          sectionType: event.sectionType,
          sectionTitle: event.sectionTitle,
        });
      }

      const data = typeMap.get(compositeKey)!;
      data.clicks++;
      data.clickers.add(event.sessionId);
    }

    // Convert to array and sort by clicks
    const results: LinkClickStats[] = [];
    for (const [, data] of typeMap) {
      results.push({
        linkType: data.linkType,
        pageId: data.pageId,
        sectionId: data.sectionId,
        sectionType: data.sectionType,
        sectionTitle: data.sectionTitle,
        clicks: data.clicks,
        uniqueClickers: data.clickers.size,
      });
    }

    // Sort by pageId first, then by clicks descending
    results.sort((a, b) => {
      const pageA = a.pageId ?? 999;
      const pageB = b.pageId ?? 999;
      if (pageA !== pageB) return pageA - pageB;
      return b.clicks - a.clicks;
    });

    return results;
  }

  /**
   * Get video play breakdown for an issue
   */
  async getVideoPlayBreakdown(
    db: Firestore,
    issueId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<VideoPlayStats[]> {
    // Fetch all events and filter in memory
    const allEvents = await this.getEvents(db, issueId, {
      dateRange: options?.dateRange,
      customRange: options?.customRange,
    });

    // Filter for video_play events
    const videoEvents = allEvents.filter(e => e.eventType === 'video_play');
    console.log('[MagazineAnalytics] getVideoPlayBreakdown: found', videoEvents.length, 'video play events');

    // Group by source type + pageId + section (composite key)
    const sourceMap = new Map<string, {
      videoSource: 'youtube' | 'upload';
      plays: number;
      viewers: Set<string>;
      pageId?: number;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }>();

    for (const event of videoEvents) {
      const source = event.videoSource || 'upload';
      const pageId = event.pageId ?? -1;
      const sectionId = event.sectionId || '';
      const compositeKey = `${source}::${pageId}::${sectionId}`;

      if (!sourceMap.has(compositeKey)) {
        sourceMap.set(compositeKey, {
          videoSource: source,
          plays: 0,
          viewers: new Set(),
          pageId: event.pageId,
          sectionId: event.sectionId,
          sectionType: event.sectionType,
          sectionTitle: event.sectionTitle,
        });
      }

      const data = sourceMap.get(compositeKey)!;
      data.plays++;
      data.viewers.add(event.sessionId);
    }

    // Convert to array
    const results: VideoPlayStats[] = [];
    for (const [, data] of sourceMap) {
      results.push({
        videoSource: data.videoSource,
        pageId: data.pageId,
        sectionId: data.sectionId,
        sectionType: data.sectionType,
        sectionTitle: data.sectionTitle,
        plays: data.plays,
        uniqueViewers: data.viewers.size,
      });
    }

    // Sort by pageId first, then by plays descending
    results.sort((a, b) => {
      const pageA = a.pageId ?? 999;
      const pageB = b.pageId ?? 999;
      if (pageA !== pageB) return pageA - pageB;
      return b.plays - a.plays;
    });

    return results;
  }

  /**
   * Get complete interaction breakdown for an issue
   */
  async getInteractionBreakdown(
    db: Firestore,
    issueId: string,
    options?: {
      dateRange?: '7d' | '30d' | '90d' | 'all';
      customRange?: { startDate: string; endDate: string };
    }
  ): Promise<InteractionBreakdown> {
    // Fetch all data in parallel
    const [ctaClicks, linkClicks, videoPlays] = await Promise.all([
      this.getCtaClickBreakdown(db, issueId, options),
      this.getLinkClickBreakdown(db, issueId, options),
      this.getVideoPlayBreakdown(db, issueId, options),
    ]);

    return {
      ctaClicks,
      linkClicks,
      videoPlays,
    };
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const magazineAnalyticsServerService = new MagazineAnalyticsServerService();

export default magazineAnalyticsServerService;
