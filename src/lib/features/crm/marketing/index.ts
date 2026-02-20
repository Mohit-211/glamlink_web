/**
 * Marketing Infrastructure Package
 *
 * Comprehensive marketing system including campaigns, attribution,
 * automations, and subscriber management.
 *
 * @module lib/features/crm/marketing
 */

// ============================================
// TYPE EXPORTS
// ============================================

export type {
  // Status Types
  CampaignStatus,
  CampaignType,
  ChannelType,
  AttributionModel,
  AutomationStatus,
  AutomationTriggerType,

  // Marketing Channels
  MarketingChannel,

  // Sessions & Attribution
  MarketingSession,
  ChannelAttribution,

  // Campaigns
  Campaign,
  CampaignContent,
  EmailSectionType,
  EmailSection,
  CampaignMetrics,

  // Automations
  Automation,
  AutomationTrigger,
  AutomationCondition,
  AutomationAction,
  AutomationMetrics,
  AutomationTemplate,
  AutomationStats,
  CreateAutomationInput,

  // Subscribers
  Subscriber,
  SubscriberSegment,
  SegmentRule,
  SubscriberFilters,

  // Marketing Stats
  MarketingStats,
  TimeSeriesDataPoint,

  // Hook Return Types
  UseCampaignsReturn,
  UseMarketingStatsReturn,
  UseChannelAttributionReturn,
  UseSubscribersReturn,
  UseAutomationsReturn,

  // API Response Types
  MarketingApiResponse,
} from './types';

// ============================================
// CONSTANT EXPORTS
// ============================================

export {
  // Attribution
  ATTRIBUTION_MODELS,
  ATTRIBUTION_WINDOW_DAYS,

  // Channels
  DEFAULT_CHANNELS,
  CHANNEL_TYPE_CONFIG,

  // Campaigns
  CAMPAIGN_STATUSES,
  DEFAULT_EMAIL_COLORS,
  EMAIL_SECTION_TYPES,

  // Automations
  AUTOMATION_TRIGGERS,

  // Date Ranges
  DATE_RANGE_PRESETS,

  // Conversions
  CONVERSION_TYPES,

  // Subscribers
  SUBSCRIBER_SOURCES,

  // Metrics
  METRIC_FORMATS,

  // All constants object
  MARKETING_CONSTANTS,
} from './constants';

// ============================================
// HOOK EXPORTS
// ============================================

export { useCampaigns } from './hooks/useCampaigns';
export { useMarketingStats } from './hooks/useMarketingStats';
export { useChannelAttribution } from './hooks/useChannelAttribution';
// export { useSubscribers } from './hooks/useSubscribers';
// export { useAutomations } from './hooks/useAutomations';

// ============================================
// SERVICE EXPORTS (server-side only)
// ============================================

export { default as marketingServerService } from './server/marketingServerService';
// export { default as campaignService } from './server/campaignService';
// export { default as sessionService } from './server/sessionService';
// export { default as subscriberService } from './server/subscriberService';

// ============================================
// TRACKING EXPORTS
// ============================================

export { MarketingTracker, getTracker, resetTracker } from './tracking';
export type { TrackingConfig, TrackingEvent, UTMParams } from './tracking';

// ============================================
// UTILITY EXPORTS
// ============================================

export {
  getDateRange,
  getDaysInRange,
  rangesOverlap,
  getComparisonRange,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDate,
  formatChannelName,
  formatMetric,
  abbreviateNumber,
  calculatePercentChange,
} from './utils/index';
