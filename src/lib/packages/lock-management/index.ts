'use client';

/**
 * Lock Management Package - Main Export (Client-Safe)
 * 
 * Complete lock management system for multi-user editing scenarios.
 * 
 * For server-side route handlers, import from './server':
 * import { handleAcquireLock } from '@/lib/packages/lock-management/server';
 * 
 * @example
 * import { 
 *   useLock, 
 *   LockIndicator,
 *   LockManager 
 * } from '@/lib/packages/lock-management';
 */

// Core Types
export type {
  LockStatus,
  LockUser,
  LockConfig,
  CleanupOptions,
  BaseLock
} from './types/lock.types';

export type {
  AcquireLockRequest,
  ReleaseLockRequest,
  ExtendLockRequest,
  TransferLockRequest,
  RouteHandlerOptions
} from './types/api.types';

export type {
  LockIndicatorProps,
  LockCountdownProps,
  ActiveEditor,
  MultiTabStatus
} from './types/component.types';

// Services (client-safe only)
export { tabManager } from './services/TabManager';

// Note: lockService and route handlers are server-only
// Import them from '@/lib/packages/lock-management/server'

// React Hooks
export {
  useLock,
  useMultiTabDetection,
  useLockIndicator
} from './hooks';

export type {
  UseLockOptions,
  UseLockReturn,
  UseMultiTabDetectionOptions,
  UseMultiTabDetectionReturn,
  UseLockIndicatorOptions,
  UseLockIndicatorReturn,
  LockIndicatorState
} from './hooks';

// UI Components
export {
  LockIndicator,
  LockCountdown,
  ActiveEditorsPanel,
  LockWarningDialog,
  InlineLockAlert,
  LockStatusAlert,
  LockGatedContent,
  SectionGatedContent
} from './components';

// Utilities
export {
  isLockValid,
  isLockExpired,
  createLockStatus,
  validateLockOwnership,
  isLockExpiringSoon
} from './utils/lockHelpers';

export {
  formatTimeRemaining,
  getLockDurationInMinutes
} from './utils/timeFormatters';

export {
  validateAcquireLockRequest,
  validateReleaseLockRequest,
  validateExtendLockRequest,
  validateTransferLockRequest,
  validateResourceIdentifiers
} from './utils/lockValidators';

export {
  isSameLockGroup,
  getLockGroupForSection,
  requiresLockChange,
  getRelatedSections,
  isSharedLockGroup,
  getLockGroupCacheKey,
  isInLockGroup
} from './utils/lockGroupHelpers';

// Configuration
export { 
  defaultLockConfig,
  collectionConfigs 
} from './config/lockConfig';

export { 
  lockGroups,
  LOCK_GROUP_CONFIGS 
} from './config/lockGroups';

// Note: Server constants moved to server.ts

// NEW SIMPLIFIED LOCK MANAGEMENT API (Recommended)
// =================================================

// Main components for easy setup
export { 
  LockManager, 
  EditableContent, 
  LockIndicator as SimpleLockIndicator,
  LockStatusDisplay,
  useLockManagement,
  useLockContext 
} from './components/LockManager';

// Note: LockStorageService is server-only
// Import from '@/lib/packages/lock-management/server'

// Standardized types (clean data structure)
export type {
  LockData,
  LockInfo,
  ResourceWithLock,
  StandardizedLockStatus,
  LockDocument,
  MigratedResource,
  AcquireLockRequest as StandardAcquireLockRequest,
  ReleaseLockRequest as StandardReleaseLockRequest,
  ExtendLockRequest as StandardExtendLockRequest,
  TransferLockRequest as StandardTransferLockRequest,
  LockEventLog,
  ResourceLockConfig,
  LockManagementConfig,
  LegacyLockFields,
  CleanResource
} from './types/standardized.types';

// Comprehensive hook types
export type {
  LockStatus as ComprehensiveLockStatus,
  LockActions,
  UseLockManagementOptions,
  UseLockManagementReturn,
  LockHolder
} from './hooks/useLockManagement';