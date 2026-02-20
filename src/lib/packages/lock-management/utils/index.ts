/**
 * Lock Management Utils - Main Export
 * 
 * Centralized exports for all utility functions.
 */

// Lock helpers exports
export {
  createLockResourceKey,
  parseLockResourceKey,
  isLockExpired,
  getLockRemainingSeconds,
  calculateLockExpiration,
  canUserEdit,
  doesUserHoldLock,
  getLockWarningLevel,
  getLockHolderDisplayName,
  isLockConflict,
  mergeLockConfigs,
  sanitizeLockData,
  createMockLock,
  createLockStatus,
  isLockExpiring,
  describeLockStatus,
  formatSeconds,
  validateLockIdentifiers,
  compareLockStatus
} from './lockHelpers';

// Time formatters exports
export {
  formatLockTimeRemaining,
  formatRelativeTime,
  formatAbsoluteTime,
  formatDuration,
  getTimeZoneInfo,
  formatCountdown,
  calculateTimeProgress,
  getTimeWarningClass,
  getTimeBackgroundClass,
  formatTimeForA11y,
  parseTimeString,
  isInPast,
  isInFuture
} from './timeFormatters';

// Validators exports
export {
  validateAcquireLockRequest,
  validateReleaseLockRequest,
  validateTransferLockRequest,
  validateResourceIdentifiers,
  validateLockConfig,
  validateLockDocument,
  validateTabInfo,
  validateBatchRequest,
  sanitizeUserInput,
  isLockOperationAllowed,
  createValidationReport
} from './lockValidators';

// Re-export types for convenience
export type {
  ValidationResult,
  ValidationError
} from './lockValidators';

// Lock management utilities
export { handleLockContent } from './handleLockContent';
export { checkLockStatus } from './checkLockStatus';
export { acquireLock } from './acquireLock';
export { releaseLock } from './releaseLock';

// Utility constants
export const LOCK_UTILS_VERSION = '1.0.0';
export const DEFAULT_WARNING_THRESHOLD_SECONDS = 60;
export const DEFAULT_URGENT_THRESHOLD_SECONDS = 15;