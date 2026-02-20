'use client';

/**
 * Lock Management Package - Client-Side Exports
 * 
 * This file exports only client-safe components, hooks, types, and utilities.
 * It excludes all route handlers and server-side code to prevent "next/headers" 
 * import errors in client components.
 * 
 * Use this import in client components:
 * import { LockIndicator, useLock } from '@/lib/packages/lock-management/client';
 * 
 * Use the main export in API routes and server components:
 * import { handleAcquireLock } from '@/lib/packages/lock-management';
 */

// Core Types (client-safe)
export type {
  LockStatus,
  LockDocument,
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

// Services (client-safe - no server dependencies)
export { tabManager } from './services/TabManager';

// Store (for persistent lock state)
export { lockStore } from './store/lockStore';

// React Hooks (client-safe)
export {
  useLock,
  useMultiTabDetection,
  useLockIndicator,
  useLockAcquisition
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

// UI Components (client-safe)
export {
  LockIndicator,
  LockCountdown,
  ActiveEditorsPanel,
  LockWarningDialog,
  InlineLockAlert,
  LockStatusAlert,
  LockGatedContent,
  SectionGatedContent,
  LockDisplay,
  LockGatedEditor,
  SectionLockGatedEditor
} from './components';

// Utilities (client-safe)
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

// Configuration (client-safe)
export { 
  defaultLockConfig,
  collectionConfigs 
} from './config/lockConfig';

export { 
  lockGroups,
  LOCK_GROUP_CONFIGS 
} from './config/lockGroups';

// Main components for easy setup (NEW SIMPLIFIED API)
export { 
  LockManager, 
  EditableContent, 
  LockStatusDisplay,
  useLockManagement,
  useLockContext 
} from './components/LockManager';

// Providers and Context (NEW PROVIDER-BASED API)
export { 
  LockProvider, 
  DevLockProvider 
} from './providers/LockProvider';

export { 
  LockConfigProvider,
  useLockConfig,
  useLockEndpoints,
  buildLockEndpointUrl
} from './contexts/LockConfigContext';

export type {
  LockEndpoints,
  LockConfig as LockProviderConfig,
  LockConfigProviderProps
} from './contexts/LockConfigContext';

export type {
  LockProviderProps
} from './providers/LockProvider';

export type {
  LockDisplayRef
} from './components/LockDisplay';

// Standardized types (clean data structure)
export type {
  LockData,
  LockInfo,
  ResourceWithLock,
  StandardizedLockStatus,
  MigratedResource,
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

// Utility functions for lock management
export { handleLockContent } from './utils/handleLockContent';
export { checkLockStatus } from './utils/checkLockStatus';
export { releaseLock } from './utils/releaseLock';
export { canEditContent } from './utils/canEditContent';

// Note: Route handlers and lockService are NOT exported here
// as they depend on server-side code (getAuthenticatedAppForUser)
// which imports 'next/headers' and can't be used in client components.