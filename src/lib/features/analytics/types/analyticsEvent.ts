/**
 * Analytics Event Types for Digital Business Cards
 *
 * Defines the structure of analytics events stored in Firestore
 * under professionals/{id}/analytics subcollection.
 */

// =============================================================================
// EVENT TYPES
// =============================================================================

/**
 * All trackable event types for digital cards
 */
export type CardAnalyticsEventType =
  | 'card_view'
  | 'book_click'
  | 'call_click'
  | 'text_click'
  | 'website_click'
  | 'instagram_click'
  | 'tiktok_click'
  | 'save_card'
  | 'copy_url';

/**
 * Device type categories
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// =============================================================================
// EVENT STRUCTURES
// =============================================================================

/**
 * Core analytics event structure stored in Firestore
 */
export interface CardAnalyticsEvent {
  /** Firestore document ID (auto-generated) */
  id?: string;

  /** Type of event that occurred */
  eventType: CardAnalyticsEventType;

  /** Professional ID this event belongs to */
  professionalId: string;

  /** ISO timestamp of when event occurred */
  timestamp: string;

  /** Session ID for unique visitor tracking */
  sessionId: string;

  // UTM Parameters
  /** UTM source (e.g., 'instagram', 'qr', 'share') */
  utmSource?: string;

  /** UTM medium (e.g., 'bio', 'pinnedpost', 'digitalcard') */
  utmMedium?: string;

  /** UTM campaign name */
  utmCampaign?: string;

  /** UTM term (for paid search) */
  utmTerm?: string;

  /** UTM content (for A/B testing) */
  utmContent?: string;

  // Context
  /** HTTP referrer URL */
  referrer?: string;

  /** User agent string */
  userAgent?: string;

  /** Device viewport dimensions */
  viewport?: {
    width: number;
    height: number;
  };

  /** Detected device type */
  deviceType?: DeviceType;

  /** Full page URL where event occurred */
  pageUrl?: string;

  /** Firestore server timestamp (set on write) */
  createdAt?: unknown;
}

/**
 * Type for creating new events (id and createdAt auto-generated)
 */
export type CreateCardAnalyticsEvent = Omit<CardAnalyticsEvent, 'id' | 'createdAt'>;

// =============================================================================
// AGGREGATED STATS
// =============================================================================

/**
 * Aggregated statistics for a professional's card
 */
export interface CardAnalyticsStats {
  /** Total number of card views */
  totalViews: number;

  /** Unique visitors (based on sessionId) */
  uniqueVisitors: number;

  /** Number of book button clicks */
  bookClicks: number;

  /** Number of call button clicks */
  callClicks: number;

  /** Number of text/SMS button clicks */
  textClicks: number;

  /** Number of website link clicks */
  websiteClicks: number;

  /** Number of Instagram link clicks */
  instagramClicks: number;

  /** Number of TikTok link clicks */
  tiktokClicks: number;

  /** Number of save as image clicks */
  saveCardClicks: number;

  /** Number of copy URL clicks */
  copyUrlClicks: number;
}

/**
 * Time series data point for charts
 */
export interface CardAnalyticsTimeSeries {
  /** Date in YYYY-MM-DD format */
  date: string;

  /** Total views on this date */
  views: number;

  /** Unique visitors on this date */
  uniqueVisitors: number;

  /** Total clicks (all types) on this date */
  totalClicks: number;
}

/**
 * Source breakdown for pie charts
 */
export interface SourceBreakdown {
  /** UTM source or 'direct' if no source */
  source: string;

  /** UTM medium if available */
  medium?: string;

  /** Number of events from this source */
  count: number;

  /** Percentage of total */
  percentage: number;
}

/**
 * Click breakdown by event type
 */
export interface ClickBreakdown {
  /** Event type */
  eventType: CardAnalyticsEventType;

  /** Display label for UI */
  label: string;

  /** Number of clicks */
  count: number;

  /** Percentage of total clicks */
  percentage: number;
}

// =============================================================================
// HELPER CONSTANTS
// =============================================================================

/**
 * Display labels for event types
 */
export const EVENT_TYPE_LABELS: Record<CardAnalyticsEventType, string> = {
  card_view: 'Card View',
  book_click: 'Book Click',
  call_click: 'Call Click',
  text_click: 'Text Click',
  website_click: 'Website Click',
  instagram_click: 'Instagram Click',
  tiktok_click: 'TikTok Click',
  save_card: 'Save Card',
  copy_url: 'Copy URL',
};

/**
 * Click event types (excludes card_view)
 */
export const CLICK_EVENT_TYPES: CardAnalyticsEventType[] = [
  'book_click',
  'call_click',
  'text_click',
  'website_click',
  'instagram_click',
  'tiktok_click',
  'save_card',
  'copy_url',
];

/**
 * Default empty stats object
 */
export const EMPTY_STATS: CardAnalyticsStats = {
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
