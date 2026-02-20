/**
 * Lock Management Services - Main Export
 * 
 * Centralized exports for all service classes.
 */

// Main service classes
export { LockService, lockService } from './LockService';
export { TabManager, tabManager, createTabManager } from './TabManager';

// Service types
export type {
  TabManagerConfig,
  ExtendedTabInfo
} from './TabManager';

// Service version
export const LOCK_SERVICES_VERSION = '1.0.0';