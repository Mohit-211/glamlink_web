/**
 * Admin Analytics Components - Barrel exports
 */

// Main container
export { default as AnalyticsTab } from './AnalyticsTab';

// Panels (from panels/ folder)
export { DigitalCardsPanel, MagazinesPanel } from './panels';

// Drilldowns (from drilldown folders)
export { default as DigitalCardDrilldown } from './card-drilldown';
export { default as MagazineDrilldown } from './magazine-drilldown';

// Shared components
export { default as StatsCard } from './StatsCard';
export { DrilldownModal, SummaryStatsGrid, TabButton } from './shared';

// Config
export { digitalCardsDisplayConfig, magazinesDisplayConfig } from './config';

// Hooks
export { useAnalyticsDashboard } from './useAnalyticsDashboard';
export type {
  ProfessionalAnalyticsSummary,
  UseAnalyticsDashboardReturn,
} from './useAnalyticsDashboard';
