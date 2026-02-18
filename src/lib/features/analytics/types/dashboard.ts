/**
 * Dashboard Types for Card Analytics
 *
 * Types for dashboard data structures, filters, and display options.
 */

import type {
  CardAnalyticsStats,
  CardAnalyticsTimeSeries,
  SourceBreakdown,
  ClickBreakdown,
  CardAnalyticsEvent,
} from './analyticsEvent';

// =============================================================================
// DATE RANGE TYPES
// =============================================================================

/**
 * Predefined date range options
 */
export type DateRangeOption = '7d' | '30d' | '90d' | 'all' | 'custom';

/**
 * Date range options supported by analytics services (excludes 'custom' which requires additional params)
 */
export type ServiceDateRange = Exclude<DateRangeOption, 'custom'>;

/**
 * Custom date range with explicit start and end
 */
export interface DateRange {
  /** Start date in YYYY-MM-DD format */
  startDate: string;

  /** End date in YYYY-MM-DD format */
  endDate: string;
}

/**
 * Date range labels for UI
 */
export const DATE_RANGE_LABELS: Record<DateRangeOption, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  'all': 'All Time',
  'custom': 'Custom Range',
};

// =============================================================================
// FILTER TYPES
// =============================================================================

/**
 * Dashboard filter state
 */
export interface DashboardFilters {
  /** Selected date range preset */
  dateRange: DateRangeOption;

  /** Custom date range (when dateRange is 'custom') */
  customRange?: DateRange;

  /** Filter by specific professional (admin only) */
  professionalId?: string;

  /** Filter by specific event types */
  eventTypes?: string[];
}

/**
 * Default filter values
 */
export const DEFAULT_FILTERS: DashboardFilters = {
  dateRange: '30d',
};

// =============================================================================
// DASHBOARD DATA TYPES
// =============================================================================

/**
 * Complete dashboard data for a professional
 */
export interface CardAnalyticsDashboardData {
  /** Aggregated statistics */
  stats: CardAnalyticsStats;

  /** Time series data for line charts */
  timeSeries: CardAnalyticsTimeSeries[];

  /** Source/medium breakdown for pie charts */
  sourceBreakdown: SourceBreakdown[];

  /** Click type breakdown */
  clickBreakdown: ClickBreakdown[];

  /** Recent events list */
  recentEvents: CardAnalyticsEvent[];

  /** Date range used for this data */
  dateRange: DateRange;

  /** When this data was fetched */
  fetchedAt: string;
}

/**
 * Pro-specific dashboard with period comparison
 */
export interface ProDashboardData extends CardAnalyticsDashboardData {
  /** Professional ID */
  professionalId: string;

  /** Professional name for display */
  professionalName?: string;

  /** Comparison with previous period */
  comparison?: PeriodComparison;
}

/**
 * Period-over-period comparison data
 */
export interface PeriodComparison {
  /** Previous period views */
  previousPeriodViews: number;

  /** View change as percentage */
  viewsChange: number;

  /** Previous period total clicks */
  previousPeriodClicks: number;

  /** Clicks change as percentage */
  clicksChange: number;

  /** Previous period unique visitors */
  previousPeriodVisitors: number;

  /** Visitors change as percentage */
  visitorsChange: number;
}

// =============================================================================
// ADMIN DASHBOARD TYPES
// =============================================================================

/**
 * Summary stats for admin overview
 */
export interface AdminAnalyticsSummary {
  /** Total views across all professionals */
  totalViews: number;

  /** Total unique visitors across all professionals */
  totalVisitors: number;

  /** Total clicks across all professionals */
  totalClicks: number;

  /** Number of professionals with analytics data */
  activeProfessionals: number;

  /** Top performing professionals */
  topProfessionals: ProfessionalRanking[];
}

/**
 * Professional ranking for leaderboard
 */
export interface ProfessionalRanking {
  /** Professional ID */
  professionalId: string;

  /** Professional name */
  name: string;

  /** Profile image URL */
  profileImage?: string;

  /** Total views */
  views: number;

  /** Total clicks */
  clicks: number;

  /** Conversion rate (clicks / views) */
  conversionRate: number;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * API response for dashboard data
 */
export interface DashboardApiResponse {
  success: boolean;
  data?: CardAnalyticsDashboardData;
  error?: string;
}

/**
 * API response for admin dashboard
 */
export interface AdminDashboardApiResponse {
  success: boolean;
  summary?: AdminAnalyticsSummary;
  professionals?: Map<string, CardAnalyticsStats>;
  error?: string;
}
