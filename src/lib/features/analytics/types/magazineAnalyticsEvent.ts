/**
 * Magazine Analytics Event Types
 *
 * Defines the structure of analytics events for magazine viewing.
 * Events are stored in Firestore subcollection: magazine_issues/{id}/analytics
 */

// =============================================================================
// EVENT TYPES
// =============================================================================

/**
 * All trackable event types for magazine content
 */
export type MagazineAnalyticsEventType =
  | 'issue_view'           // Issue page loaded (entry point)
  | 'page_view'            // Specific page/section viewed
  | 'navigation'           // Arrow/thumbnail navigation between pages
  | 'section_click'        // Clicked on section from Table of Contents
  | 'cta_click'            // CTA button clicked
  | 'link_click'           // External link clicked (social, website, email)
  | 'video_play'           // Video started playing
  | 'pdf_download'         // PDF downloaded
  | 'share';               // Issue shared

/**
 * Labels for event types (for display in dashboards)
 */
export const MAGAZINE_EVENT_TYPE_LABELS: Record<MagazineAnalyticsEventType, string> = {
  issue_view: 'Issue View',
  page_view: 'Page View',
  navigation: 'Navigation',
  section_click: 'Section Click',
  cta_click: 'CTA Click',
  link_click: 'Link Click',
  video_play: 'Video Play',
  pdf_download: 'PDF Download',
  share: 'Share',
};

/**
 * Navigation methods for tracking how users move between pages
 */
export type NavigationMethod = 'arrow' | 'thumbnail' | 'toc' | 'keyboard' | 'direct';

/**
 * Link types for external link click tracking
 */
export type LinkType = 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other';

// =============================================================================
// EVENT STRUCTURE
// =============================================================================

/**
 * Full magazine analytics event (stored in Firestore)
 */
export interface MagazineAnalyticsEvent {
  /** Firestore document ID (auto-generated) */
  id?: string;

  /** Type of event being tracked */
  eventType: MagazineAnalyticsEventType;

  /** Magazine issue ID */
  issueId: string;

  /** ISO timestamp when event occurred */
  timestamp: string;

  /** Session ID for unique visitor tracking */
  sessionId: string;

  // Page/Section context
  /** Page index (pid from URL param) */
  pageId?: number;

  /** Section ID for section-specific events */
  sectionId?: string;

  /** Section type (e.g., 'cover-pro-feature', 'top-treatment') */
  sectionType?: string;

  /** Section title for display purposes */
  sectionTitle?: string;

  // Navigation context (for navigation events)
  /** Previous page index */
  fromPageId?: number;

  /** Destination page index */
  toPageId?: number;

  /** How the user navigated */
  navigationMethod?: NavigationMethod;

  // CTA Click context
  /** Button label for CTA clicks */
  buttonLabel?: string;

  /** Button variant for CTA clicks */
  buttonVariant?: 'primary' | 'secondary';

  // Link Click context
  /** Type of link clicked */
  linkType?: 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other';

  /** Target URL (sanitized) */
  linkUrl?: string;

  // Video context
  /** Video source type */
  videoSource?: 'youtube' | 'upload';

  // UTM Parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  // Device context
  referrer?: string;
  userAgent?: string;
  viewport?: { width: number; height: number };
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  pageUrl?: string;

  /** Firestore server timestamp */
  createdAt?: unknown;
}

/**
 * Event structure for creating new events (without id and createdAt)
 */
export type CreateMagazineAnalyticsEvent = Omit<MagazineAnalyticsEvent, 'id' | 'createdAt'>;

// =============================================================================
// AGGREGATED STATS
// =============================================================================

/**
 * Aggregated stats for a magazine issue
 */
export interface MagazineAnalyticsStats {
  /** Total issue views (may include repeat views) */
  totalViews: number;

  /** Unique visitors (based on session ID) */
  uniqueVisitors: number;

  /** Total page views across all pages */
  totalPageViews: number;

  /** Average pages viewed per session */
  avgPagesPerSession: number;

  /** Number of CTA button clicks */
  ctaClicks: number;

  /** Number of PDF downloads */
  pdfDownloads: number;

  /** Number of share actions */
  shareClicks: number;
}

/**
 * Default empty stats object
 */
export const EMPTY_MAGAZINE_STATS: MagazineAnalyticsStats = {
  totalViews: 0,
  uniqueVisitors: 0,
  totalPageViews: 0,
  avgPagesPerSession: 0,
  ctaClicks: 0,
  pdfDownloads: 0,
  shareClicks: 0,
};

/**
 * Stats for an individual page/section within an issue
 */
export interface PageAnalyticsStats {
  /** Page index */
  pageId: number;

  /** Section ID (if applicable) */
  sectionId?: string;

  /** Section type */
  sectionType?: string;

  /** Section title for display */
  sectionTitle?: string;

  /** Total views of this page */
  views: number;

  /** Unique visitors to this page */
  uniqueVisitors: number;

  /** Percentage of total issue visitors who viewed this page */
  viewPercentage?: number;
}

// =============================================================================
// TIME SERIES DATA
// =============================================================================

/**
 * Time series data point for charts
 */
export interface MagazineAnalyticsTimeSeries {
  /** Date in YYYY-MM-DD format */
  date: string;

  /** Issue views on this date */
  views: number;

  /** Unique visitors on this date */
  uniqueVisitors: number;

  /** Total page views on this date */
  pageViews: number;
}

// =============================================================================
// DASHBOARD TYPES
// =============================================================================

/**
 * Summary data for a single magazine issue (used in admin list)
 */
export interface MagazineAnalyticsSummary {
  /** Issue ID */
  issueId: string;

  /** Issue title */
  title: string;

  /** Issue number */
  issueNumber: number;

  /** Issue date */
  issueDate: string;

  /** Number of sections/pages (optional - fetched in drilldown modal) */
  pageCount?: number;

  /** Aggregated stats */
  stats: MagazineAnalyticsStats;
}

/**
 * Full dashboard data for a single magazine issue
 */
export interface MagazineDashboardData {
  /** Issue metadata */
  issueId: string;
  title: string;
  issueNumber: number;
  issueDate: string;

  /** Aggregated stats */
  stats: MagazineAnalyticsStats;

  /** Per-page breakdown */
  pageStats: PageAnalyticsStats[];

  /** Time series for charts */
  timeSeries: MagazineAnalyticsTimeSeries[];

  /** Recent events for activity feed */
  recentEvents: MagazineAnalyticsEvent[];
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Response from magazine dashboard API
 */
export interface MagazineDashboardResponse {
  success: boolean;
  data?: MagazineAnalyticsSummary[];
  error?: string;
}

/**
 * Response from single issue dashboard API
 */
export interface MagazineIssueDashboardResponse {
  success: boolean;
  data?: MagazineDashboardData;
  error?: string;
}

// =============================================================================
// INTERACTION BREAKDOWN TYPES
// =============================================================================

/**
 * CTA click breakdown stats
 */
export interface CtaClickStats {
  /** Button label */
  buttonLabel: string;

  /** Button variant */
  buttonVariant?: 'primary' | 'secondary';

  /** Page ID where the click occurred */
  pageId?: number;

  /** Section ID where the click occurred */
  sectionId?: string;

  /** Section type where the click occurred */
  sectionType?: string;

  /** Section title (human readable) */
  sectionTitle?: string;

  /** Total clicks */
  clicks: number;

  /** Unique clickers (based on session ID) */
  uniqueClickers: number;
}

/**
 * Link click breakdown stats
 */
export interface LinkClickStats {
  /** Link type/platform */
  linkType: string;

  /** Page ID where the click occurred */
  pageId?: number;

  /** Section ID where the click occurred */
  sectionId?: string;

  /** Section type where the click occurred */
  sectionType?: string;

  /** Section title (human readable) */
  sectionTitle?: string;

  /** Total clicks */
  clicks: number;

  /** Unique clickers (based on session ID) */
  uniqueClickers: number;
}

/**
 * Video play breakdown stats
 */
export interface VideoPlayStats {
  /** Video source type */
  videoSource: 'youtube' | 'upload';

  /** Page ID where the play occurred */
  pageId?: number;

  /** Section ID where the play occurred */
  sectionId?: string;

  /** Section type where the play occurred */
  sectionType?: string;

  /** Section title (human readable) */
  sectionTitle?: string;

  /** Total plays */
  plays: number;

  /** Unique viewers (based on session ID) */
  uniqueViewers: number;
}

/**
 * Full interaction breakdown for an issue
 */
export interface InteractionBreakdown {
  /** CTA click breakdown */
  ctaClicks: CtaClickStats[];

  /** Link click breakdown */
  linkClicks: LinkClickStats[];

  /** Video play breakdown */
  videoPlays: VideoPlayStats[];
}

/**
 * Response from interactions API endpoint
 */
export interface InteractionsResponse {
  success: boolean;
  data?: InteractionBreakdown;
  error?: string;
}
