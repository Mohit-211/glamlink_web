/**
 * Lock Helpers - Utility functions for lock management
 * 
 * Common utility functions used across the lock management system.
 * 
 * Note: No 'use client' directive - this utility works on both client and server.
 */

import { LockStatus, LockDocument, LockConfig } from '../types/lock.types';

/**
 * Generate a unique lock resource key
 */
export function createLockResourceKey(collection: string, resourceId: string): string {
  return `${collection}:${resourceId}`;
}

/**
 * Parse a lock resource key back into collection and resourceId
 */
export function parseLockResourceKey(key: string): { collection: string; resourceId: string } | null {
  const parts = key.split(':');
  if (parts.length !== 2) return null;
  
  return {
    collection: parts[0],
    resourceId: parts[1]
  };
}

/**
 * Check if a lock is expired based on current time
 */
export function isLockExpired(lockData: Partial<LockDocument>): boolean {
  if (!lockData.lockExpiresAt) return true;
  
  const now = new Date();
  const lockExpires = new Date(lockData.lockExpiresAt);
  return lockExpires <= now;
}

/**
 * Calculate remaining time for a lock in seconds
 */
export function getLockRemainingSeconds(lockExpiresAt?: string | null): number {
  if (!lockExpiresAt) return 0;
  
  const now = new Date();
  const expires = new Date(lockExpiresAt);
  return Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000));
}

/**
 * Calculate when a lock will expire given duration in minutes
 */
export function calculateLockExpiration(durationMinutes: number): string {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMinutes * 60000);
  return expiresAt.toISOString();
}

/**
 * Check if a user can edit a resource based on lock status
 */
export function canUserEdit(lockStatus: LockStatus | null, userId: string): boolean {
  if (!lockStatus) return true;
  if (!lockStatus.isLocked) return true;
  
  return lockStatus.hasLock && lockStatus.lockedBy === userId;
}

/**
 * Check if a user holds a specific lock
 */
export function doesUserHoldLock(lockStatus: LockStatus | null, userId: string): boolean {
  if (!lockStatus) return false;
  
  return lockStatus.hasLock && lockStatus.lockedBy === userId;
}

/**
 * Determine lock warning level based on remaining time
 */
export function getLockWarningLevel(
  remainingSeconds: number,
  warningThresholdSeconds: number = 60
): 'none' | 'warning' | 'urgent' | 'expired' {
  if (remainingSeconds <= 0) return 'expired';
  if (remainingSeconds <= 15) return 'urgent';
  if (remainingSeconds <= warningThresholdSeconds) return 'warning';
  return 'none';
}

/**
 * Create a display name for a lock holder
 */
export function getLockHolderDisplayName(lockData: Partial<LockDocument>): string {
  if (!lockData.lockedBy) return 'Unknown';
  
  if (lockData.lockedByName) return lockData.lockedByName;
  if (lockData.lockedByEmail) return lockData.lockedByEmail;
  
  return `User ${lockData.lockedBy.slice(-4)}`;
}

/**
 * Check if two lock statuses represent a conflict
 */
export function isLockConflict(
  currentLock: LockStatus | null,
  requestingUserId: string
): { hasConflict: boolean; conflictType?: 'user_conflict' | 'multi_tab_conflict' } {
  if (!currentLock || !currentLock.isLocked) {
    return { hasConflict: false };
  }
  
  if (currentLock.lockedBy === requestingUserId) {
    return { 
      hasConflict: currentLock.isMultiTabConflict || false,
      conflictType: 'multi_tab_conflict'
    };
  }
  
  return {
    hasConflict: true,
    conflictType: 'user_conflict'
  };
}

/**
 * Merge lock configurations with proper precedence
 */
export function mergeLockConfigs(...configs: Array<Partial<LockConfig> | undefined>): LockConfig {
  const merged: LockConfig = {};
  
  for (const config of configs) {
    if (config) {
      Object.assign(merged, config);
    }
  }
  
  return merged;
}

/**
 * Sanitize lock data for safe storage/transmission
 */
export function sanitizeLockData(lockData: Partial<LockDocument>): Partial<LockDocument> {
  const sanitized: Partial<LockDocument> = {};
  
  // Only include known lock fields
  const allowedFields: (keyof LockDocument)[] = [
    'id', 'resourceId', 'collection',
    'lockedBy', 'lockedByEmail', 'lockedByName',
    'lockedAt', 'lockExpiresAt', 'lockedTabId',
    'lockGroup', 'lastModified', 'lastModifiedBy',
    'lastModifiedByEmail', 'version'
  ];
  
  for (const field of allowedFields) {
    if (lockData[field] !== undefined && lockData[field] !== null) {
      (sanitized as any)[field] = lockData[field];
    }
  }
  
  return sanitized;
}

/**
 * Generate a mock lock for testing purposes
 */
export function createMockLock(overrides: Partial<LockDocument> = {}): LockDocument {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60000); // 5 minutes
  
  return {
    id: `mock-${Math.random().toString(36).substr(2, 9)}`,
    resourceId: 'mock-resource',
    collection: 'mock-collection',
    lockedBy: 'mock-user-123',
    lockedByEmail: 'mock@example.com',
    lockedByName: 'Mock User',
    lockedAt: now.toISOString(),
    lockExpiresAt: expiresAt.toISOString(),
    lockedTabId: 'mock-tab-123',
    lastModified: now.toISOString(),
    lastModifiedBy: 'mock-user-123',
    lastModifiedByEmail: 'mock@example.com',
    version: 1,
    ...overrides
  };
}

/**
 * Create a lock status from lock document data
 */
export function createLockStatus(
  resourceId: string,
  collection: string,
  lockData: Partial<LockDocument>,
  currentUserId: string
): LockStatus {
  const isLocked = !!lockData.lockedBy && !!lockData.lockExpiresAt && !isLockExpired(lockData);
  const hasLock = isLocked && lockData.lockedBy === currentUserId;
  const remainingSeconds = getLockRemainingSeconds(lockData.lockExpiresAt);

  return {
    resourceId,
    collection,
    isLocked,
    canEdit: !isLocked || hasLock,
    hasLock,
    lockedBy: lockData.lockedBy || undefined,
    lockedByName: lockData.lockedByName || undefined,
    lockedByEmail: lockData.lockedByEmail || undefined,
    lockExpiresAt: lockData.lockExpiresAt || undefined,
    lockExpiresIn: remainingSeconds,
    isExpired: isLockExpired(lockData),
    isMultiTabConflict: false, // This should be determined by caller
    allowTransfer: true, // This should be determined by configuration
    lockedTabId: lockData.lockedTabId || undefined,
    lockGroup: lockData.lockGroup || undefined
  };
}

/**
 * Check if a lock is about to expire (within warning threshold)
 */
export function isLockExpiring(
  lockStatus: LockStatus | null,
  warningThresholdSeconds: number = 60
): boolean {
  if (!lockStatus || !lockStatus.isLocked) return false;
  
  return lockStatus.lockExpiresIn !== undefined && 
         lockStatus.lockExpiresIn <= warningThresholdSeconds &&
         lockStatus.lockExpiresIn > 0;
}

/**
 * Get a human-readable description of lock status
 */
export function describeLockStatus(lockStatus: LockStatus | null): string {
  if (!lockStatus) return 'No lock information available';
  
  if (!lockStatus.isLocked) return 'Resource is not locked';
  
  if (lockStatus.hasLock) {
    const timeLeft = formatSeconds(lockStatus.lockExpiresIn || 0);
    return `You have the lock (expires in ${timeLeft})`;
  }
  
  if (lockStatus.isExpired) {
    return 'Lock has expired';
  }
  
  if (lockStatus.isMultiTabConflict) {
    return 'You are editing this in another tab';
  }
  
  const holder = lockStatus.lockedByName || lockStatus.lockedByEmail || 'another user';
  const timeLeft = formatSeconds(lockStatus.lockExpiresIn || 0);
  return `Locked by ${holder} (expires in ${timeLeft})`;
}

/**
 * Format seconds into a human-readable time string
 */
export function formatSeconds(seconds: number): string {
  if (seconds <= 0) return 'now';
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Validate lock resource identifiers
 */
export function validateLockIdentifiers(
  resourceId: string,
  collection: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!resourceId || typeof resourceId !== 'string') {
    errors.push('Resource ID is required and must be a string');
  } else if (resourceId.length > 255) {
    errors.push('Resource ID cannot exceed 255 characters');
  }
  
  if (!collection || typeof collection !== 'string') {
    errors.push('Collection name is required and must be a string');
  } else if (collection.length > 100) {
    errors.push('Collection name cannot exceed 100 characters');
  }
  
  // Check for invalid characters
  const invalidChars = /[\/\\\[\]]/;
  if (invalidChars.test(resourceId)) {
    errors.push('Resource ID contains invalid characters');
  }
  
  if (invalidChars.test(collection)) {
    errors.push('Collection name contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Compare two lock statuses for changes
 */
export function compareLockStatus(
  oldStatus: LockStatus | null,
  newStatus: LockStatus | null
): {
  hasChanged: boolean;
  changes: string[];
} {
  const changes: string[] = [];
  
  if (!oldStatus && !newStatus) {
    return { hasChanged: false, changes };
  }
  
  if (!oldStatus && newStatus) {
    changes.push('Lock status created');
    if (newStatus.isLocked) changes.push('Resource became locked');
    return { hasChanged: true, changes };
  }
  
  if (oldStatus && !newStatus) {
    changes.push('Lock status removed');
    return { hasChanged: true, changes };
  }
  
  if (!oldStatus || !newStatus) {
    return { hasChanged: false, changes };
  }
  
  // Compare specific fields
  if (oldStatus.isLocked !== newStatus.isLocked) {
    changes.push(newStatus.isLocked ? 'Resource became locked' : 'Resource became unlocked');
  }
  
  if (oldStatus.lockedBy !== newStatus.lockedBy) {
    changes.push('Lock holder changed');
  }
  
  if (oldStatus.lockExpiresAt !== newStatus.lockExpiresAt) {
    changes.push('Lock expiration time changed');
  }
  
  if (oldStatus.isMultiTabConflict !== newStatus.isMultiTabConflict) {
    changes.push(newStatus.isMultiTabConflict ? 'Multi-tab conflict detected' : 'Multi-tab conflict resolved');
  }
  
  return {
    hasChanged: changes.length > 0,
    changes
  };
}

// Wrapper functions for backward compatibility with expected function names

/**
 * Check if a lock is valid (not expired)
 */
export function isLockValid(lockData: Partial<LockDocument>): boolean {
  return !isLockExpired(lockData);
}

/**
 * Wrapper for validateLockIdentifiers for backward compatibility
 */
export const validateLockOwnership = validateLockIdentifiers;

/**
 * Check if a lock is expiring soon (wrapper for isLockExpiring)
 */
export function isLockExpiringSoon(expireTime: Date, warningMinutes: number = 2): boolean {
  const now = new Date();
  const warningTime = warningMinutes * 60 * 1000; // Convert to milliseconds
  return (expireTime.getTime() - now.getTime()) <= warningTime && expireTime > now;
}