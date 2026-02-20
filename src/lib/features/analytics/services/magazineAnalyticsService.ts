/**
 * Magazine Analytics Service (Client-Side)
 *
 * Handles event tracking with batching, deduplication, and reliable delivery.
 * Events are batched and sent to the server API endpoint.
 */

import type {
  MagazineAnalyticsEventType,
  CreateMagazineAnalyticsEvent,
  NavigationMethod,
} from '../types';
import { getSessionContext } from '../utils/sessionManager';
import analytics from '@/lib/services/analytics';

// =============================================================================
// CONSTANTS
// =============================================================================

/** API endpoint for event ingestion */
const EVENTS_API_ENDPOINT = '/api/analytics/magazine-events';

/** Batch delay before sending events (ms) */
const BATCH_DELAY = 1000;

/** Maximum events per batch */
const MAX_BATCH_SIZE = 10;

/** Key for tracking viewed issues in session */
const VIEWED_ISSUES_KEY = 'glamlink_viewed_issues';

/** Key for tracking viewed pages in session (per issue) */
const VIEWED_PAGES_KEY = 'glamlink_viewed_pages';

// =============================================================================
// UTM EXTRACTION
// =============================================================================

/**
 * Extract UTM parameters from cookies or URL
 */
function extractUTMParams(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
} {
  if (typeof window === 'undefined') return {};

  // First try URL params (for direct visits)
  const urlParams = new URLSearchParams(window.location.search);
  const fromUrl = {
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined,
    utmTerm: urlParams.get('utm_term') || undefined,
    utmContent: urlParams.get('utm_content') || undefined,
  };

  // If URL has UTM params, use them
  if (fromUrl.utmSource) {
    return fromUrl;
  }

  // Otherwise try to get from cookie (set by UTM handler)
  try {
    const cookies = document.cookie.split(';');
    const trackingCookie = cookies.find(c => c.trim().startsWith('glamlink_tracking='));
    if (trackingCookie) {
      const value = trackingCookie.split('=')[1];
      const data = JSON.parse(decodeURIComponent(value));
      return {
        utmSource: data.utm_source || undefined,
        utmMedium: data.utm_medium || undefined,
        utmCampaign: data.utm_campaign || undefined,
        utmTerm: data.utm_term || undefined,
        utmContent: data.utm_content || undefined,
      };
    }
  } catch {
    // Ignore cookie parsing errors
  }

  return {};
}

// =============================================================================
// VIEW DEDUPLICATION
// =============================================================================

/**
 * Get issues viewed in current session
 */
function getViewedIssues(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = sessionStorage.getItem(VIEWED_ISSUES_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore storage errors
  }
  return new Set();
}

/**
 * Mark an issue as viewed in current session
 */
function markIssueViewed(issueId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const viewed = getViewedIssues();
    viewed.add(issueId);
    sessionStorage.setItem(VIEWED_ISSUES_KEY, JSON.stringify([...viewed]));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if issue was already viewed in this session
 */
function wasIssueViewed(issueId: string): boolean {
  return getViewedIssues().has(issueId);
}

/**
 * Get pages viewed in current session for a specific issue
 */
function getViewedPages(issueId: string): Set<number> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = sessionStorage.getItem(`${VIEWED_PAGES_KEY}_${issueId}`);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore storage errors
  }
  return new Set();
}

/**
 * Mark a page as viewed in current session
 */
function markPageViewed(issueId: string, pageId: number): void {
  if (typeof window === 'undefined') return;

  try {
    const viewed = getViewedPages(issueId);
    viewed.add(pageId);
    sessionStorage.setItem(`${VIEWED_PAGES_KEY}_${issueId}`, JSON.stringify([...viewed]));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if page was already viewed in this session
 */
function wasPageViewed(issueId: string, pageId: number): boolean {
  return getViewedPages(issueId).has(pageId);
}

// =============================================================================
// MAGAZINE ANALYTICS SERVICE
// =============================================================================

class MagazineAnalyticsService {
  private eventQueue: CreateMagazineAnalyticsEvent[] = [];
  private batchTimeout: ReturnType<typeof setTimeout> | null = null;
  private isUnloading = false;

  constructor() {
    // Setup page unload handler for pending events
    if (typeof window !== 'undefined') {
      this.setupUnloadHandler();
    }
  }

  // ===========================================================================
  // PUBLIC METHODS
  // ===========================================================================

  /**
   * Track any event type
   *
   * @param eventType - The type of event to track
   * @param issueId - The magazine issue ID
   * @param context - Additional event context
   */
  async trackEvent(
    eventType: MagazineAnalyticsEventType,
    issueId: string,
    context?: Partial<CreateMagazineAnalyticsEvent>
  ): Promise<void> {
    // Don't track if we're in the process of unloading
    if (this.isUnloading) return;

    // Build the event with full context
    const event = this.buildEvent(eventType, issueId, context);

    // Add to queue
    this.eventQueue.push(event);

    // Also send to GA4 for compatibility
    this.forwardToGA4(eventType, issueId, event);

    // Schedule batch send
    this.scheduleBatchSend();
  }

  /**
   * Track issue view with session-based deduplication
   *
   * Only tracks one view per issue per session to avoid inflating view counts.
   *
   * @param issueId - The magazine issue ID
   * @returns true if view was tracked, false if deduplicated
   */
  async trackIssueView(issueId: string): Promise<boolean> {
    // Check if already viewed in this session
    if (wasIssueViewed(issueId)) {
      return false;
    }

    // Mark as viewed and track
    markIssueViewed(issueId);
    await this.trackEvent('issue_view', issueId);
    return true;
  }

  /**
   * Track page view with session-based deduplication
   *
   * @param issueId - The magazine issue ID
   * @param pageId - The page index
   * @param sectionId - Optional section ID
   * @param sectionType - Optional section type
   * @param sectionTitle - Optional section title
   * @returns true if view was tracked, false if deduplicated
   */
  async trackPageView(
    issueId: string,
    pageId: number,
    sectionId?: string,
    sectionType?: string,
    sectionTitle?: string
  ): Promise<boolean> {
    // Check if already viewed in this session
    if (wasPageViewed(issueId, pageId)) {
      return false;
    }

    // Mark as viewed and track
    markPageViewed(issueId, pageId);
    await this.trackEvent('page_view', issueId, {
      pageId,
      sectionId,
      sectionType,
      sectionTitle,
    });
    return true;
  }

  /**
   * Track navigation between pages
   */
  async trackNavigation(
    issueId: string,
    fromPageId: number,
    toPageId: number,
    method: NavigationMethod
  ): Promise<void> {
    await this.trackEvent('navigation', issueId, {
      fromPageId,
      toPageId,
      pageId: toPageId,
      navigationMethod: method,
    });
  }

  /**
   * Track section click from Table of Contents
   */
  async trackSectionClick(
    issueId: string,
    pageId: number,
    sectionId?: string,
    sectionType?: string
  ): Promise<void> {
    await this.trackEvent('section_click', issueId, {
      pageId,
      sectionId,
      sectionType,
    });
  }

  /**
   * Track CTA button click
   */
  async trackCTAClick(issueId: string): Promise<void> {
    await this.trackEvent('cta_click', issueId);
  }

  /**
   * Track PDF download
   */
  async trackPdfDownload(issueId: string): Promise<void> {
    await this.trackEvent('pdf_download', issueId);
  }

  /**
   * Track share action
   */
  async trackShare(issueId: string): Promise<void> {
    await this.trackEvent('share', issueId);
  }

  /**
   * Track enhanced CTA click with button label and variant
   *
   * @param issueId - The magazine issue ID
   * @param buttonLabel - The button text/label
   * @param buttonVariant - Primary or secondary button
   * @param context - Additional context (pageId, sectionId, sectionType, sectionTitle)
   */
  async trackEnhancedCTAClick(
    issueId: string,
    buttonLabel: string,
    buttonVariant: 'primary' | 'secondary' = 'primary',
    context?: {
      pageId?: number;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }
  ): Promise<void> {
    console.log('[MagazineAnalytics] trackEnhancedCTAClick:', { issueId, buttonLabel, buttonVariant, context });
    await this.trackEvent('cta_click', issueId, {
      buttonLabel,
      buttonVariant,
      ...context,
    });
  }

  /**
   * Track external link click (social, website, email)
   *
   * @param issueId - The magazine issue ID
   * @param linkType - Type of link (instagram, website, email, etc.)
   * @param linkUrl - The target URL
   * @param context - Additional context (pageId, sectionId, sectionType, sectionTitle)
   */
  async trackLinkClick(
    issueId: string,
    linkType: 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other',
    linkUrl?: string,
    context?: {
      pageId?: number;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }
  ): Promise<void> {
    console.log('[MagazineAnalytics] trackLinkClick:', { issueId, linkType, linkUrl, context });
    await this.trackEvent('link_click', issueId, {
      linkType,
      linkUrl: linkUrl ? this.sanitizeUrl(linkUrl) : undefined,
      ...context,
    });
  }

  /**
   * Track video play event
   *
   * @param issueId - The magazine issue ID
   * @param videoSource - YouTube or uploaded video
   * @param context - Additional context (pageId, sectionId, sectionType, sectionTitle)
   */
  async trackVideoPlay(
    issueId: string,
    videoSource: 'youtube' | 'upload',
    context?: {
      pageId?: number;
      sectionId?: string;
      sectionType?: string;
      sectionTitle?: string;
    }
  ): Promise<void> {
    console.log('[MagazineAnalytics] trackVideoPlay:', { issueId, videoSource, context });
    await this.trackEvent('video_play', issueId, {
      videoSource,
      ...context,
    });
  }

  // ===========================================================================
  // PRIVATE METHODS
  // ===========================================================================

  /**
   * Sanitize URL for storage (remove sensitive params)
   */
  private sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Keep only the origin and pathname
      return `${parsed.origin}${parsed.pathname}`;
    } catch {
      // If URL parsing fails, return as-is but truncated
      return url.substring(0, 200);
    }
  }

  /**
   * Build a complete event with all context
   */
  private buildEvent(
    eventType: MagazineAnalyticsEventType,
    issueId: string,
    context?: Partial<CreateMagazineAnalyticsEvent>
  ): CreateMagazineAnalyticsEvent {
    const sessionContext = getSessionContext();
    const utmParams = extractUTMParams();

    return {
      eventType,
      issueId,
      timestamp: new Date().toISOString(),
      sessionId: sessionContext.sessionId,
      ...utmParams,
      referrer: sessionContext.referrer,
      userAgent: sessionContext.userAgent,
      viewport: sessionContext.viewport,
      deviceType: sessionContext.deviceType,
      pageUrl: sessionContext.pageUrl,
      ...context,
    };
  }

  /**
   * Forward event to Google Analytics for compatibility
   */
  private forwardToGA4(
    eventType: MagazineAnalyticsEventType,
    issueId: string,
    event: CreateMagazineAnalyticsEvent
  ): void {
    try {
      // Use existing analytics service
      analytics.trackEvent(`magazine_${eventType}`, {
        issue_id: issueId,
        page_id: event.pageId,
        section_type: event.sectionType,
        utm_source: event.utmSource,
        utm_medium: event.utmMedium,
        device_type: event.deviceType,
      });
    } catch (error) {
      console.error('[MagazineAnalytics] GA4 forward error:', error);
    }
  }

  /**
   * Schedule a batch send with debouncing
   */
  private scheduleBatchSend(): void {
    // Clear existing timeout
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    // If queue is at max size, send immediately
    if (this.eventQueue.length >= MAX_BATCH_SIZE) {
      this.sendBatch();
      return;
    }

    // Otherwise, schedule for later
    this.batchTimeout = setTimeout(() => {
      this.sendBatch();
    }, BATCH_DELAY);
  }

  /**
   * Send queued events to the server
   */
  private async sendBatch(): Promise<void> {
    // Clear timeout
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    // Get events to send
    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (events.length === 0) return;

    try {
      const response = await fetch(EVENTS_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('[MagazineAnalytics] Failed to send events:', response.status);
        // Re-add failed events to queue for retry
        this.eventQueue.unshift(...events);
      }
    } catch (error) {
      console.error('[MagazineAnalytics] Network error:', error);
      // Re-add failed events to queue for retry
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Setup handler for page unload to send pending events
   */
  private setupUnloadHandler(): void {
    const handleUnload = () => {
      this.isUnloading = true;

      // Clear any pending timeout
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
        this.batchTimeout = null;
      }

      // Send any remaining events using sendBeacon for reliability
      if (this.eventQueue.length > 0) {
        const events = [...this.eventQueue];
        this.eventQueue = [];

        try {
          const blob = new Blob(
            [JSON.stringify({ events })],
            { type: 'application/json' }
          );
          navigator.sendBeacon(EVENTS_API_ENDPOINT, blob);
        } catch (error) {
          console.error('[MagazineAnalytics] Beacon error:', error);
        }
      }
    };

    // Use both events for better coverage
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

/**
 * Singleton instance of the magazine analytics service
 */
export const magazineAnalyticsService = new MagazineAnalyticsService();

export default magazineAnalyticsService;
