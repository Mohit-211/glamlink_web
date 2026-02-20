/**
 * Marketing Tracker
 *
 * Client-side tracking system for marketing sessions, pageviews, and events.
 *
 * Features:
 * - Persistent visitor ID (localStorage)
 * - Session management with UTM tracking
 * - Fire-and-forget event tracking
 * - Keepalive for page unload events
 * - Conversion tracking
 *
 * @example
 * ```tsx
 * // Initialize tracker
 * const tracker = new MarketingTracker({
 *   brandId: 'brand-123',
 *   apiEndpoint: '/api/marketing/track'
 * });
 *
 * // Track page view
 * tracker.trackPageView('/products/lipstick');
 *
 * // Track conversion
 * tracker.trackConversion('purchase', 129.99, 'order-123');
 * ```
 */

export interface TrackingConfig {
  brandId: string;
  apiEndpoint?: string;
}

export interface TrackingEvent {
  type: string;
  sessionId: string | null;
  visitorId: string;
  userId?: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/**
 * Marketing Tracker Class
 *
 * Handles all client-side marketing tracking operations.
 */
export class MarketingTracker {
  private config: TrackingConfig;
  private sessionId: string | null = null;
  private visitorId: string;
  private userId?: string;

  constructor(config: TrackingConfig) {
    this.config = {
      apiEndpoint: '/api/marketing/track',
      ...config,
    };

    this.visitorId = this.getOrCreateVisitorId();
    this.initSession();
    this.setupPageUnloadTracking();
  }

  /**
   * Get or create persistent visitor ID
   * Stored in localStorage to persist across sessions
   */
  private getOrCreateVisitorId(): string {
    const storageKey = 'glam_visitor_id';

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;

      const newId = crypto.randomUUID();
      localStorage.setItem(storageKey, newId);
      return newId;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return crypto.randomUUID();
    }
  }

  /**
   * Set user ID after login
   */
  public setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Clear user ID after logout
   */
  public clearUserId() {
    this.userId = undefined;
  }

  /**
   * Initialize session with UTM tracking
   */
  private initSession() {
    try {
      // Parse URL for UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = this.extractUTMParams(urlParams);

      // Get referrer information
      const referrer = document.referrer;
      const referrerDomain = referrer ? new URL(referrer).hostname : undefined;

      // Create session ID
      this.sessionId = crypto.randomUUID();

      // Determine channel type
      const channelType = this.determineChannelType(utmParams, referrer);

      // Track session start
      this.trackEvent('session_start', {
        channel: utmParams.utm_source || channelType,
        channelType,
        source: utmParams.utm_source,
        medium: utmParams.utm_medium,
        campaign: utmParams.utm_campaign,
        content: utmParams.utm_content,
        term: utmParams.utm_term,
        referrer,
        referrerDomain,
        landingPage: window.location.pathname,
      });
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }

  /**
   * Extract UTM parameters from URL
   */
  private extractUTMParams(params: URLSearchParams): UTMParams {
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_content: params.get('utm_content') || undefined,
      utm_term: params.get('utm_term') || undefined,
    };
  }

  /**
   * Determine channel type based on UTM and referrer
   */
  private determineChannelType(
    utmParams: UTMParams,
    referrer: string
  ): 'direct' | 'organic' | 'paid' | 'referral' | 'social' | 'email' | 'unknown' {
    // Direct traffic
    if (!referrer && !utmParams.utm_source) {
      return 'direct';
    }

    // Email traffic
    if (utmParams.utm_medium === 'email') {
      return 'email';
    }

    // Paid traffic
    if (utmParams.utm_medium === 'cpc' || utmParams.utm_medium === 'paid') {
      return 'paid';
    }

    // Organic search
    if (utmParams.utm_medium === 'organic') {
      return 'organic';
    }

    // Social traffic
    const socialDomains = ['facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'pinterest.com'];
    if (referrer && socialDomains.some(domain => referrer.includes(domain))) {
      return 'social';
    }

    // Referral traffic
    if (referrer) {
      return 'referral';
    }

    return 'unknown';
  }

  /**
   * Track page view
   */
  public trackPageView(path?: string) {
    this.trackEvent('pageview', {
      path: path || window.location.pathname,
      url: window.location.href,
    });
  }

  /**
   * Track conversion (purchase, signup, etc.)
   */
  public trackConversion(
    type: 'purchase' | 'signup' | 'booking' | 'inquiry',
    value?: number,
    orderId?: string
  ) {
    this.trackEvent('conversion', {
      conversionType: type,
      conversionValue: value,
      orderId,
    });
  }

  /**
   * Track custom event
   */
  public trackEvent(eventType: string, data: Record<string, any> = {}) {
    if (!this.sessionId) {
      console.warn('Session not initialized');
      return;
    }

    const event: TrackingEvent = {
      type: eventType,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      userId: this.userId,
      data,
      timestamp: new Date().toISOString(),
    };

    // Fire and forget - don't await
    this.sendEvent(event).catch((err) => {
      // Silent fail - tracking shouldn't block UI
      console.error('Tracking failed:', err);
    });
  }

  /**
   * Send event to server
   * Uses keepalive for page unload events
   */
  private async sendEvent(event: TrackingEvent) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: this.config.brandId,
          event,
        }),
        credentials: 'include',
        // Use keepalive for page unload - ensures request completes
        keepalive: true,
      });

      if (!response.ok) {
        console.warn('Tracking request failed:', response.status);
      }
    } catch (error) {
      // Silent fail - don't throw
      console.error('Error sending tracking event:', error);
    }
  }

  /**
   * Setup page unload tracking
   * Tracks session end when user leaves
   */
  private setupPageUnloadTracking() {
    // Use beforeunload for session end
    window.addEventListener('beforeunload', () => {
      if (this.sessionId) {
        this.trackEvent('session_end', {
          endedAt: new Date().toISOString(),
        });
      }
    });

    // Use visibilitychange as backup
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.sessionId) {
        this.trackEvent('session_pause', {
          pausedAt: new Date().toISOString(),
        });
      }
    });
  }

  /**
   * Get current session ID
   */
  public getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Get visitor ID
   */
  public getVisitorId(): string {
    return this.visitorId;
  }
}

// Export singleton instance helper
let trackerInstance: MarketingTracker | null = null;

export function getTracker(config: TrackingConfig): MarketingTracker {
  if (!trackerInstance) {
    trackerInstance = new MarketingTracker(config);
  }
  return trackerInstance;
}

export function resetTracker() {
  trackerInstance = null;
}
