import type { AnalyticsEventType } from '@/utils/analytics';

export type { AnalyticsEventType };

/* ============================= */
/* 📌 Summary API — access-card/analytics/{id} */
/* ============================= */
export interface AnalyticsBusinessCard {
  id: number;
  name: string;
  business_name: string | null;
  business_card_link: string | null;
}

export interface AnalyticsDateRange {
  from: string;
  to: string;
}

export interface AnalyticsSummary {
  total_views: number;
  unique_visitors: number;
  total_clicks: number;
}

/** Counts keyed by event type. Partial because the backend may add or omit keys. */
export type AnalyticsEventCounts = Partial<Record<AnalyticsEventType, number>> &
  Record<string, number | undefined>;

export interface DailyAnalytics {
  date: string;
  count: number;
}

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

export interface DeviceBreakdown {
  /** Usually a DeviceType, but kept open so new backend values still render. */
  device_type: DeviceType | string | null;
  count: number;
}

export interface BusinessCardAnalytics {
  business_card: AnalyticsBusinessCard;
  date_range: AnalyticsDateRange | null;
  summary: AnalyticsSummary;
  events: AnalyticsEventCounts;
  daily_views: DailyAnalytics[];
  daily_clicks: DailyAnalytics[];
  device_breakdown: DeviceBreakdown[];
}

/* ============================= */
/* 📌 Events API — access-card/analytics/{id}/events */
/* ============================= */
export interface AnalyticsEvent {
  id: number;
  business_card_id: number;
  event_type: AnalyticsEventType | string;
  event_target: string | null;
  visitor_id: string | null;
  session_id: string | null;
  device_type: DeviceType | string | null;
  referrer: string | null;
  /** JSON-encoded string from the API (sometimes already an object, or null). */
  metadata: string | Record<string, unknown> | null;
  created_at: string;
}

export interface AnalyticsEvents {
  count: number;
  rows: AnalyticsEvent[];
}

/** Parsed `metadata`. Known keys are typed; anything else is preserved. */
export interface EventMetadata {
  label?: string;
  title?: string;
  index?: number;
  location_id?: number;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  status?: number;
  message?: string;
  data: T;
}

/** Inclusive date range as YYYY-MM-DD strings. */
export interface DateRangeValue {
  from: string;
  to: string;
}
