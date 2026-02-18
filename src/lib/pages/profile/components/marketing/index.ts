/**
 * Marketing Components Package
 *
 * Central export for all marketing profile components.
 */

// Layout
export { MarketingLayout } from './MarketingLayout';

// Dashboard
export {
  MarketingDashboard,
  StatsOverview,
  ChannelsTable,
  DateRangePicker,
  AttributionModelSelector,
  MarketingActivities,
} from './dashboard';

// Shared
export {
  MetricCard,
  StatusBadge,
  ChannelIcon,
  TrendIndicator,
} from './shared';

// Campaigns
export {
  CampaignList,
  CreateCampaignModal,
  CampaignEditor,
  CampaignSidebar,
  EmailBuilder,
  EmailPreview,
  SectionEditor,
  AddSectionMenu,
} from './campaigns';

// Attribution
export {
  AttributionReport,
  ChannelChart,
  AttributionTable,
  ColumnSelector,
  ExportMenu,
} from './attribution';
