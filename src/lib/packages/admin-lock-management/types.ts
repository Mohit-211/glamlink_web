/**
 * Admin Lock Management - Type Definitions
 *
 * Simplified lock management types for admin section editing.
 * This is a lighter alternative to the full lock-management package.
 */

/**
 * Lock status information returned from lock checks
 */
export interface SectionLockStatus {
  /** Whether the section is currently locked */
  isLocked: boolean;

  /** User ID who holds the lock */
  lockedBy?: string;

  /** Display name of user who holds the lock */
  lockedByName?: string;

  /** Email of user who holds the lock */
  lockedByEmail?: string;

  /** ISO timestamp when lock expires */
  lockExpiresAt?: string;

  /** Whether current user can override this lock (true if they own it) */
  canOverride: boolean;

  /** Time remaining in seconds (calculated) */
  expiresInSeconds?: number;
}

/**
 * Request payload for acquiring a lock
 */
export interface AcquireLockRequest {
  /** Section ID to lock */
  sectionId: string;

  /** User ID acquiring the lock */
  userId: string;

  /** User email for display */
  userEmail: string;

  /** User display name for display */
  userName: string;

  /** Whether to override an existing lock (only works for same user) */
  override?: boolean;
}

/**
 * Response from acquire lock operation
 */
export interface AcquireLockResponse {
  /** Whether lock was acquired successfully */
  success: boolean;

  /** Error message if acquisition failed */
  error?: string;

  /** Lock status after acquisition attempt */
  lockStatus?: SectionLockStatus;
}

/**
 * Response from release lock operation
 */
export interface ReleaseLockResponse {
  /** Whether lock was released successfully */
  success: boolean;

  /** Error message if release failed */
  error?: string;
}
