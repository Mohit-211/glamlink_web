/**
 * Card Analytics Service (Client-Side)
 *
 * Handles event tracking with batching, deduplication, and reliable delivery.
 * Events are batched and sent to the server API endpoint.
 */

import type { CardAnalyticsEventType, CreateCardAnalyticsEvent } from '../types';
import { getSessionContext } from '../utils/sessionManager';
import analytics from '@/lib/services/analytics';

// =============================================================================
// CONSTANTS
// =============================================================================

/** API endpoint for event ingestion */
const EVENTS_API_ENDPOINT = '/api/analytics/card-events';

/** Batch delay before sending events (ms) */
const BATCH_DELAY = 1000;

/** Maximum events per batch */
const MAX_BATCH_SIZE = 10;

/** Key for tracking viewed cards in session */
const VIEWED_CARDS_KEY = 'glamlink_viewed_cards';

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
 * Get cards viewed in current session
 */
function getViewedCards(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = sessionStorage.getItem(VIEWED_CARDS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore storage errors
  }
  return new Set();
}

/**
 * Mark a card as viewed in current session
 */
function markCardViewed(professionalId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const viewed = getViewedCards();
    viewed.add(professionalId);
    sessionStorage.setItem(VIEWED_CARDS_KEY, JSON.stringify([...viewed]));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if card was already viewed in this session
 */
function wasCardViewed(professionalId: string): boolean {
  return getViewedCards().has(professionalId);
}

// =============================================================================
// CARD ANALYTICS SERVICE
// =============================================================================

class CardAnalyticsService {
  private eventQueue: CreateCardAnalyticsEvent[] = [];
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
   * @param professionalId - The professional's ID
   */
  async trackEvent(eventType: CardAnalyticsEventType, professionalId: string): Promise<void> {
    // Don't track if we're in the process of unloading
    if (this.isUnloading) return;

    // Build the event with full context
    const event = this.buildEvent(eventType, professionalId);

    // Add to queue
    this.eventQueue.push(event);

    // Also send to GA4 for compatibility
    this.forwardToGA4(eventType, professionalId, event);

    // Schedule batch send
    this.scheduleBatchSend();
  }

  /**
   * Track card view with session-based deduplication
   *
   * Only tracks one view per card per session to avoid inflating view counts.
   *
   * @param professionalId - The professional's ID
   * @returns true if view was tracked, false if deduplicated
   */
  async trackCardView(professionalId: string): Promise<boolean> {
    // Check if already viewed in this session
    if (wasCardViewed(professionalId)) {
      return false;
    }

    // Mark as viewed and track
    markCardViewed(professionalId);
    await this.trackEvent('card_view', professionalId);
    return true;
  }

  /**
   * Convenience methods for specific event types
   */
  trackBookClick = (professionalId: string) => this.trackEvent('book_click', professionalId);
  trackCallClick = (professionalId: string) => this.trackEvent('call_click', professionalId);
  trackTextClick = (professionalId: string) => this.trackEvent('text_click', professionalId);
  trackWebsiteClick = (professionalId: string) => this.trackEvent('website_click', professionalId);
  trackInstagramClick = (professionalId: string) => this.trackEvent('instagram_click', professionalId);
  trackTiktokClick = (professionalId: string) => this.trackEvent('tiktok_click', professionalId);
  trackSaveCard = (professionalId: string) => this.trackEvent('save_card', professionalId);
  trackCopyUrl = (professionalId: string) => this.trackEvent('copy_url', professionalId);

  // ===========================================================================
  // PRIVATE METHODS
  // ===========================================================================

  /**
   * Build a complete event with all context
   */
  private buildEvent(eventType: CardAnalyticsEventType, professionalId: string): CreateCardAnalyticsEvent {
    const context = getSessionContext();
    const utmParams = extractUTMParams();

    return {
      eventType,
      professionalId,
      timestamp: new Date().toISOString(),
      sessionId: context.sessionId,
      ...utmParams,
      referrer: context.referrer,
      userAgent: context.userAgent,
      viewport: context.viewport,
      deviceType: context.deviceType,
      pageUrl: context.pageUrl,
    };
  }

  /**
   * Forward event to Google Analytics for compatibility
   */
  private forwardToGA4(
    eventType: CardAnalyticsEventType,
    professionalId: string,
    event: CreateCardAnalyticsEvent
  ): void {
    try {
      // Use existing analytics service
      analytics.trackEvent(`card_${eventType}`, {
        professional_id: professionalId,
        utm_source: event.utmSource,
        utm_medium: event.utmMedium,
        utm_campaign: event.utmCampaign,
        device_type: event.deviceType,
      });
    } catch (error) {
      console.error('[CardAnalytics] GA4 forward error:', error);
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
        console.error('[CardAnalytics] Failed to send events:', response.status);
        // Re-add failed events to queue for retry
        this.eventQueue.unshift(...events);
      }
    } catch (error) {
      console.error('[CardAnalytics] Network error:', error);
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
          console.error('[CardAnalytics] Beacon error:', error);
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
 * Singleton instance of the card analytics service
 */
export const cardAnalyticsService = new CardAnalyticsService();

export default cardAnalyticsService;
