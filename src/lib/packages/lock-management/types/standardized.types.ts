'use client';

/**
 * Standardized Lock Management Types
 * 
 * These types define the clean, separated lock data structure
 * that keeps lock information separate from business data.
 */

// Standardized lock information structure (based on schema/lock_for_section.json)
export interface LockInfo {
  lockedAt: string;           // ISO timestamp when lock was acquired
  lockExpiresAt: string;      // ISO timestamp when lock expires
  lockPath: string[];         // Path to resource ["magazine_issues", "2025-09-06"]
  lockedTabId: string;        // Tab ID that holds the lock
  userName?: string;          // Display name of lock holder
  userEmail?: string;         // Email of lock holder
  lockGroup?: string;         // Optional lock grouping (e.g., "issue-metadata")
}

// Complete lock data structure
export interface LockData {
  userId: string;             // User ID that holds the lock
  info: LockInfo;            // Detailed lock information
}

// Resource with standardized lock structure
export interface ResourceWithLock<T = any> {
  data: T;                   // Business data (clean, no lock fields)
  lock?: LockData;           // Separate lock object
}

// Lock status for UI components
export interface StandardizedLockStatus {
  exists: boolean;           // Does a lock exist?
  isOwnedByCurrentUser: boolean;    // Is lock owned by current user?
  isOwnedByCurrentTab: boolean;     // Is lock owned by current tab?
  isExpired: boolean;        // Has the lock expired?
  holder?: {
    userId: string;
    userName?: string;
    userEmail?: string;
    tabId: string;
  };
  expiresAt?: string;        // When lock expires
  expiresIn?: number;        // Seconds until expiration
  lockGroup?: string;        // Lock grouping
  canTransfer: boolean;      // Can transfer between tabs (multi-tab scenario)
  canEdit: boolean;          // Can current user edit this resource?
}

// Lock operation request types
export interface AcquireLockRequest {
  userId: string;
  tabId: string;
  lockGroup?: string;
  tabName?: string;          // For UI display
  lockDurationMinutes?: number;
}

export interface ReleaseLockRequest {
  userId: string;
  reason?: string;
}

export interface ExtendLockRequest {
  userId: string;
  extendByMinutes?: number;
}

export interface TransferLockRequest {
  userId: string;
  newTabId: string;
  tabName?: string;
  forceTransfer?: boolean;
}

// Lock storage document structure (for dedicated locks collection)
export interface LockDocument {
  id: string;                // Unique lock ID
  resourceType: string;      // Collection name (e.g., "magazine_issues")
  resourceId: string;        // Resource identifier
  lockPath: string[];        // Path to resource
  lock: LockData;           // The actual lock data
  createdAt: string;        // When lock document was created
  updatedAt: string;        // When lock was last updated
}

// Configuration for different resource types
export interface ResourceLockConfig {
  collection: string;
  defaultDurationMinutes: number;
  maxDurationMinutes: number;
  autoExtendEnabled: boolean;
  autoExtendIntervalMinutes: number;
  lockGroups?: Record<string, string[]>; // Groups that share locks
}

// Lock event types for monitoring/logging
export type LockEvent = 
  | 'acquired'
  | 'released'
  | 'extended'
  | 'expired'
  | 'transferred'
  | 'conflict'
  | 'error';

export interface LockEventLog {
  event: LockEvent;
  resourceType: string;
  resourceId: string;
  userId: string;
  tabId?: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Helper types for clean data migration
export interface MigratedResource<T> {
  // Clean business data without any lock fields
  cleanData: Omit<T, 'lockExpiresAt' | 'lockedAt' | 'lockedBy' | 'lockedByName' | 'lockedByEmail' | 'lockedTab' | 'lockedTabId' | 'lockGroup'>;
  
  // Extracted lock information (if any existed)
  lockData?: LockData;
}

// Lock package configuration
export interface LockManagementConfig {
  // Storage configuration
  usesSeparateCollection: boolean;  // Store locks in separate collection?
  locksCollectionName: string;      // Name of locks collection
  
  // Default settings
  defaultLockDurationMinutes: number;
  autoRefreshIntervalMs: number;
  countdownIntervalMs: number;
  
  // Resource-specific configurations
  resourceConfigs: Record<string, ResourceLockConfig>;
  
  // UI configuration
  showCountdowns: boolean;
  showLockHolderInfo: boolean;
  allowTransfers: boolean;
}

// Export helper for backward compatibility during migration
export type LegacyLockFields = {
  lockExpiresAt?: string;
  lockedAt?: string;
  lockedBy?: string;
  lockedByName?: string;
  lockedByEmail?: string;
  lockedTab?: string;
  lockedTabId?: string;
  lockGroup?: string;
};

// Utility type to check if a resource has legacy lock fields
export type HasLegacyLock<T> = T & LegacyLockFields;

// Clean utility type to remove legacy lock fields
export type CleanResource<T> = Omit<T, keyof LegacyLockFields>;