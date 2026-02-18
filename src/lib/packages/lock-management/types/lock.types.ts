/**
 * Core Lock Management Types
 * 
 * Defines the fundamental types used throughout the lock management system.
 */

// Base lock interface that all locks extend
export interface BaseLock {
  id: string;
  resourceId: string;
  collection: string;
  lockedBy?: string | null;           // User ID holding the lock
  lockedByEmail?: string | null;      // Email for display purposes
  lockedByName?: string | null;       // Display name for UI
  lockedAt?: string | null;          // ISO timestamp when locked
  lockExpiresAt?: string | null;     // ISO timestamp when lock expires
  lockedTabId?: string | null;       // Tab ID for multi-tab detection
}

// Extended lock interface with additional metadata
export interface LockDocument extends BaseLock {
  lockGroup?: string;                // Optional lock grouping
  lastModified?: string;             // ISO timestamp of last modification
  lastModifiedBy?: string;           // User ID who last modified
  lastModifiedByEmail?: string;      // Email of last modifier
  version?: number;                  // Version for optimistic locking
  createdAt?: string;                // ISO timestamp when resource was created
  createdBy?: string;                // User ID who created the resource
  createdByEmail?: string;           // Email of creator
}

// Lock status for UI components
export interface LockStatus {
  resourceId: string;
  collection: string;
  isLocked: boolean;
  canEdit: boolean;                  // Can current user edit?
  hasLock: boolean;                  // Does current user hold the lock?
  lockedBy?: string;
  lockedByName?: string;
  lockedByEmail?: string;
  lockExpiresAt?: string;
  lockExpiresIn?: number;            // Seconds remaining
  isExpired?: boolean;
  isMultiTabConflict?: boolean;      // Same user, different tab
  allowTransfer?: boolean;           // Can transfer between tabs
  lockedTabId?: string;
  lockGroup?: string;
}

// User information for lock operations
export interface LockUser {
  userId: string;
  userEmail: string;
  userName?: string;
  tabId?: string;
}

// Lock configuration options
export interface LockConfig {
  lockDurationMinutes?: number;      // How long locks last (default: 5)
  refreshIntervalMs?: number;        // How often to refresh (default: 2 minutes)
  autoRefresh?: boolean;             // Auto-extend locks (default: true)
  maxLockAttempts?: number;          // Max attempts before giving up (default: 3)
  warningThresholdMs?: number;       // When to show warning (default: 1 minute)
  cleanupIntervalMs?: number;        // How often to cleanup expired locks
  allowTransfer?: boolean;           // Allow same-user tab transfers (default: true)
  lockGroup?: string;                // Optional lock grouping
}

// Lock operation result
export interface LockResult {
  success: boolean;
  message?: string;
  lockStatus?: LockStatus;
  error?: LockError;
}

// Lock error types
export interface LockError {
  type: 'ALREADY_LOCKED' | 'MULTI_TAB_CONFLICT' | 'EXPIRED' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: any;
  canRetry?: boolean;
  suggestedAction?: 'WAIT' | 'TRANSFER' | 'FORCE_RELEASE' | 'REFRESH';
}

// Lock events for real-time updates
export type LockEventType = 
  | 'lock_acquired'
  | 'lock_released'
  | 'lock_extended'
  | 'lock_transferred'
  | 'lock_expired'
  | 'lock_conflict';

export interface LockEvent {
  type: LockEventType;
  resourceId: string;
  collection: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  timestamp: string;
  lockStatus?: LockStatus;
  metadata?: any;
}

// Lock statistics for monitoring
export interface LockStatistics {
  totalActiveLocks: number;
  expiredLocks: number;
  multiTabConflicts: number;
  locksByUser: Record<string, number>;
  locksByCollection: Record<string, number>;
  averageLockDuration: number;
  timestamp: string;
}

// Tab information for multi-tab detection
export interface TabInfo {
  tabId: string;
  resourceId: string | null;
  collection: string | null;
  editingSection: string | null;
  lastActivity: string;
  isActive: boolean;
  userId?: string;
}

// Lock group definitions
export interface LockGroupConfig {
  [groupName: string]: {
    description: string;
    fields: string[];                // Which fields/tabs share this lock
    priority?: 'high' | 'medium' | 'low';
    maxDuration?: number;           // Override default duration
  };
}

// Cleanup options
export interface CleanupOptions {
  olderThan?: number;                // Minutes
  collection?: string;               // Specific collection to clean
  dryRun?: boolean;                  // Just report what would be cleaned
  force?: boolean;                   // Force cleanup even if recently active
}

// Cleanup result
export interface CleanupResult {
  count: number;                     // Number of locks cleaned
  details: Array<{
    resourceId: string;
    collection: string;
    lockedBy: string;
    expiredAt: string;
  }>;
  timestamp: string;
}

// Export type unions for convenience
export type AnyLockStatus = LockStatus | null | undefined;
export type LockOperation = 'acquire' | 'release' | 'extend' | 'transfer';
export type LockPriority = 'high' | 'medium' | 'low';