/**
 * Lock Management Package - Server Export
 * 
 * Server-safe exports for API routes and server-side code.
 * Excludes client components, hooks, and browser-specific services.
 * 
 * @example
 * import { lockRouteHandlers, lockService } from '@/lib/packages/lock-management/server';
 */

// Core Types (all types are server-safe)
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

// Services (server-safe only)
export { lockService } from './services/LockService';
export { LockStorageService } from './services/LockStorageService';

// Route Handlers (all server-safe)
export {
  handleAcquireLock,
  createAcquireLockHandler,
  acquireLockHandlers
} from './routes/acquire';

export {
  handleReleaseLock,
  createReleaseLockHandler
} from './routes/release';

export {
  handleExtendLock,
  createExtendLockHandler
} from './routes/extend';

export {
  handleTransferLock,
  createTransferLockHandler
} from './routes/transfer';

export {
  handleCleanupExpiredLocks,
  cleanupHandlers
} from './routes/cleanup';

export {
  createStatusLockHandler
} from './routes/status';

export {
  createLockRouteHandlers,
  lockRouteHandlers
} from './routes/index';

// Utilities (server-safe)
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

// Configuration (server-safe)
export { 
  defaultLockConfig,
  collectionConfigs 
} from './config/lockConfig';

export { 
  lockGroups,
  LOCK_GROUP_CONFIGS 
} from './config/lockGroups';

// Constants
export { LOCK_ROUTES_VERSION } from './routes/index';

// Note: Excluded from server exports:
// - React hooks (useLock, useMultiTabDetection, useLockIndicator)
// - UI Components (LockIndicator, LockCountdown, ActiveEditorsPanel, LockWarningDialog) 
// - TabManager (uses browser APIs like localStorage)
// - Component prop types