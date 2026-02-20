/**
 * API Types for Lock Management
 * 
 * Defines request/response types for the lock management API endpoints.
 */

import { LockStatus, LockError, LockConfig } from './lock.types';

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Lock acquisition request
export interface AcquireLockRequest {
  userId: string;
  userEmail: string;
  userName?: string;
  tabId?: string;                    // For multi-tab detection
  lockGroup?: string;                // Optional lock grouping
  config?: Partial<LockConfig>;      // Override default config
}

// Lock acquisition response
export interface AcquireLockResponse extends Omit<ApiResponse, 'error'> {
  success: boolean;
  lockStatus?: LockStatus;
  lockExpiresAt?: string;
  
  // Conflict information
  lockedBy?: string;
  lockedByName?: string;
  lockedByEmail?: string;
  lockedTabId?: string;
  isMultiTabConflict?: boolean;
  allowTransfer?: boolean;
  remainingSeconds?: number;
  
  // Error details
  error?: LockError;
  canRetry?: boolean;
  suggestedAction?: 'wait' | 'transfer' | 'force';
}

// Lock release request
export interface ReleaseLockRequest {
  userId: string;
  tabId?: string;                    // Tab ID for multi-tab validation
  force?: boolean;                   // Admin override
  reason?: string;                   // Why releasing (for audit)
  userOverride?: boolean;            // Allow same-user release across tabs
}

// Lock release response
export interface ReleaseLockResponse extends ApiResponse {
  success: boolean;
  message?: string;
  releasedAt?: string;
}

// Lock extension request
export interface ExtendLockRequest {
  userId: string;
  extendByMinutes?: number;          // Override default extension
}

// Lock extension response
export interface ExtendLockResponse extends ApiResponse {
  success: boolean;
  lockExpiresAt?: string;
  extendedByMinutes?: number;
}

// Lock transfer request
export interface TransferLockRequest {
  userId: string;
  newTabId: string;
  forceTransfer?: boolean;
  reason?: string;
}

// Lock transfer response
export interface TransferLockResponse extends ApiResponse {
  success: boolean;
  lockExpiresAt?: string;
  transferredTo?: string;
}

// Lock status request (GET endpoint)
export interface GetLockStatusRequest {
  userId: string;
  includeHistory?: boolean;          // Include recent lock history
  includeConflicts?: boolean;        // Include potential conflicts
}

// Lock status response
export interface GetLockStatusResponse extends ApiResponse {
  lockStatus: LockStatus;
  history?: LockHistoryEntry[];
  conflicts?: ConflictInfo[];
}

// Lock history entry
export interface LockHistoryEntry {
  action: 'acquired' | 'released' | 'extended' | 'transferred' | 'expired';
  userId: string;
  userEmail: string;
  timestamp: string;
  duration?: number;                 // Minutes lock was held
  reason?: string;
}

// Conflict information
export interface ConflictInfo {
  type: 'user_conflict' | 'multi_tab_conflict';
  conflictingUserId?: string;
  conflictingUserEmail?: string;
  conflictingTabId?: string;
  since: string;                     // When conflict started
  canResolve: boolean;
  resolutionOptions: string[];       // Available actions
}

// Batch lock operations
export interface BatchLockRequest {
  operations: Array<{
    operation: 'acquire' | 'release';
    resourceId: string;
    collection: string;
    userId: string;
    userEmail: string;
    tabId?: string;
  }>;
  stopOnFirstError?: boolean;
}

export interface BatchLockResponse extends ApiResponse {
  results: Array<{
    resourceId: string;
    success: boolean;
    lockStatus?: LockStatus;
    error?: string;
  }>;
  successCount: number;
  errorCount: number;
}

// Lock cleanup request (admin endpoint)
export interface CleanupLocksRequest {
  collection?: string;               // Specific collection or all
  olderThanMinutes?: number;         // Clean locks older than X minutes
  userId?: string;                   // Clean locks for specific user
  dryRun?: boolean;                  // Just return what would be cleaned
  force?: boolean;                   // Force cleanup active locks
}

export interface CleanupLocksResponse extends ApiResponse {
  cleanedCount: number;
  cleanedLocks: Array<{
    resourceId: string;
    collection: string;
    lockedBy: string;
    lockedAt: string;
    expiredAt: string;
  }>;
  dryRun: boolean;
}

// Lock statistics request (monitoring endpoint)
export interface GetLockStatsRequest {
  collection?: string;
  fromDate?: string;
  toDate?: string;
  groupBy?: 'user' | 'collection' | 'hour' | 'day';
}

export interface GetLockStatsResponse extends ApiResponse {
  stats: {
    totalLocks: number;
    activeLocks: number;
    expiredLocks: number;
    averageDurationMinutes: number;
    locksByCollection: Record<string, number>;
    locksByUser: Record<string, number>;
    multiTabConflicts: number;
  };
  period: {
    from: string;
    to: string;
  };
}

// WebSocket message types for real-time updates
export interface LockWebSocketMessage {
  type: 'lock_update' | 'lock_conflict' | 'lock_expired';
  resourceId: string;
  collection: string;
  lockStatus?: LockStatus;
  conflict?: ConflictInfo;
  timestamp: string;
}

// Route handler configuration options
export interface RouteHandlerOptions {
  collection: string;
  lockDuration?: number;             // Minutes
  lockGroup?: string;
  allowTransfer?: boolean;
  requireAuth?: boolean;
  adminOnly?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

// Error response structure
export interface LockApiError extends Omit<ApiResponse, 'error'> {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    statusCode: number;
  };
  requestId?: string;
}

// Validation error details
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  receivedValue?: any;
}

export interface ValidationErrorResponse extends LockApiError {
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: ValidationError[];
    statusCode: 400;
  };
}