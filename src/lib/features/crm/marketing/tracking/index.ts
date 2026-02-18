/**
 * Marketing Tracking Package
 *
 * Central export point for all tracking-related functionality.
 */

export {
  MarketingTracker,
  getTracker,
  resetTracker,
} from './tracker';

export type {
  TrackingConfig,
  TrackingEvent,
  UTMParams,
} from './tracker';
