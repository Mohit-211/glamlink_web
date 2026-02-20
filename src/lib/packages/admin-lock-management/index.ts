/**
 * Admin Lock Management Package
 *
 * Simplified lock management system for magazine section editing.
 * This is a lighter alternative to the full lock-management package,
 * designed specifically for admin panel section editing with simpler
 * conflict resolution and no complex state management.
 *
 * Usage:
 * ```typescript
 * import { checkSectionLock, acquireSectionLock, releaseSectionLock, refreshSectionLock } from '@/lib/packages/admin-lock-management';
 *
 * // Check if section is locked
 * const status = await checkSectionLock(sectionId, userId);
 *
 * // Acquire lock
 * const result = await acquireSectionLock({
 *   sectionId,
 *   userId,
 *   userEmail,
 *   userName,
 *   override: false
 * });
 *
 * // Refresh lock (extends expiration by 5 minutes)
 * await refreshSectionLock(sectionId, userId);
 *
 * // Release lock
 * await releaseSectionLock(sectionId, userId);
 * ```
 */

// Type definitions
export type {
  SectionLockStatus,
  AcquireLockRequest,
  AcquireLockResponse,
  ReleaseLockResponse,
} from './types';

// API functions
export {
  checkSectionLock,
  acquireSectionLock,
  releaseSectionLock,
  refreshSectionLock,
} from './api/sectionLocks';

// Utility functions
export {
  isLockExpired,
  getLockExpirationTime,
  formatLockMessage,
  getSecondsUntilExpiration,
  formatLockExpiration,
} from './utils';
