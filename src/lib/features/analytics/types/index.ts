/**
 * Analytics Types - Central Export
 */

// Card Event types
export type {
  CardAnalyticsEventType,
  DeviceType,
  CardAnalyticsEvent,
  CreateCardAnalyticsEvent,
  CardAnalyticsStats,
  CardAnalyticsTimeSeries,
  SourceBreakdown,
  ClickBreakdown,
} from './analyticsEvent';

export {
  EVENT_TYPE_LABELS,
  CLICK_EVENT_TYPES,
  EMPTY_STATS,
} from './analyticsEvent';

// Magazine Event types
export type {
  MagazineAnalyticsEventType,
  NavigationMethod,
  LinkType,
  MagazineAnalyticsEvent,
  CreateMagazineAnalyticsEvent,
  MagazineAnalyticsStats,
  PageAnalyticsStats,
  MagazineAnalyticsTimeSeries,
  MagazineAnalyticsSummary,
  MagazineDashboardData,
  MagazineDashboardResponse,
  MagazineIssueDashboardResponse,
  CtaClickStats,
  LinkClickStats,
  VideoPlayStats,
  InteractionBreakdown,
} from './magazineAnalyticsEvent';

export {
  MAGAZINE_EVENT_TYPE_LABELS,
  EMPTY_MAGAZINE_STATS,
} from './magazineAnalyticsEvent';

// UTM types
export type {
  UTMPreset,
  GeneratedUTMLink,
  CustomUTMParams,
  ExtractedUTMParams,
} from './utmConfig';

// Dashboard types
export type {
  DateRangeOption,
  ServiceDateRange,
  DateRange,
  DashboardFilters,
  CardAnalyticsDashboardData,
  ProDashboardData,
  PeriodComparison,
  AdminAnalyticsSummary,
  ProfessionalRanking,
  DashboardApiResponse,
  AdminDashboardApiResponse,
} from './dashboard';

export {
  DATE_RANGE_LABELS,
  DEFAULT_FILTERS,
} from './dashboard';
