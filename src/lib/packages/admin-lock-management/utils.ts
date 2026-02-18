/**
 * Admin Lock Management - Utility Functions
 *
 * Helper functions for lock status checking and formatting.
 */

import type { SectionLockStatus } from './types';

/**
 * Check if a lock has expired
 * @param lockExpiresAt ISO timestamp string when lock expires
 * @returns true if lock is expired or no expiration time
 */
export function isLockExpired(lockExpiresAt?: string): boolean {
  if (!lockExpiresAt) return true;

  const expirationTime = new Date(lockExpiresAt).getTime();
  const now = Date.now();

  return now >= expirationTime;
}

/**
 * Calculate lock expiration time (5 minutes from now)
 * @returns ISO timestamp string
 */
export function getLockExpirationTime(): string {
  const now = new Date();
  const expirationTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
  return expirationTime.toISOString();
}

/**
 * Format a user-friendly lock message
 * @param status Lock status object
 * @returns Formatted message string
 */
export function formatLockMessage(status: SectionLockStatus): string {
  if (!status.isLocked) {
    return 'Section is available';
  }

  const lockedByName = status.lockedByName || status.lockedByEmail || 'another user';

  if (status.canOverride) {
    return `You have this section open elsewhere. Override your lock?`;
  }

  if (status.expiresInSeconds !== undefined && status.expiresInSeconds > 0) {
    const minutes = Math.ceil(status.expiresInSeconds / 60);
    return `This section is locked by ${lockedByName}. Lock expires in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
  }

  return `This section is locked by ${lockedByName}.`;
}

/**
 * Calculate seconds until lock expires
 * @param lockExpiresAt ISO timestamp string when lock expires
 * @returns Number of seconds remaining, or 0 if expired
 */
export function getSecondsUntilExpiration(lockExpiresAt?: string): number {
  if (!lockExpiresAt) return 0;

  const expirationTime = new Date(lockExpiresAt).getTime();
  const now = Date.now();
  const difference = expirationTime - now;

  return Math.max(0, Math.floor(difference / 1000));
}

/**
 * Format lock expiration for display
 * @param lockExpiresAt ISO timestamp string when lock expires
 * @returns Formatted string like "2m 30s" or "Expired"
 */
export function formatLockExpiration(lockExpiresAt?: string): string {
  if (!lockExpiresAt) return 'No lock';

  const seconds = getSecondsUntilExpiration(lockExpiresAt);

  if (seconds <= 0) return 'Expired';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}
