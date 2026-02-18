/**
 * Lock Management Types - Main Export File
 *
 * Centralized exports for all type definitions used in the lock management system.
 */

import { LockStatus, LockError, TabInfo, LockEvent } from "./lock.types";

// Core lock types
export type { BaseLock, LockDocument, LockStatus, LockUser, LockConfig, LockResult, LockError, LockEventType, LockEvent, LockStatistics, TabInfo, LockGroupConfig, CleanupOptions, CleanupResult, AnyLockStatus, LockOperation, LockPriority } from "./lock.types";

// API types
export type {
  ApiResponse,
  AcquireLockRequest,
  AcquireLockResponse,
  ReleaseLockRequest,
  ReleaseLockResponse,
  ExtendLockRequest,
  ExtendLockResponse,
  TransferLockRequest,
  TransferLockResponse,
  GetLockStatusRequest,
  GetLockStatusResponse,
  LockHistoryEntry,
  ConflictInfo,
  BatchLockRequest,
  BatchLockResponse,
  CleanupLocksRequest,
  CleanupLocksResponse,
  GetLockStatsRequest,
  GetLockStatsResponse,
  LockWebSocketMessage,
  RouteHandlerOptions,
  LockApiError,
  ValidationError,
  ValidationErrorResponse,
} from "./api.types";

// Component types
export type {
  BaseComponentProps,
  LockIndicatorProps,
  ActiveEditorsPanelProps,
  ActiveEditor,
  LockWarningDialogProps,
  LockCountdownProps,
  LockStatusBadgeProps,
  LockManagerProviderProps,
  LockManagerContextType,
  UseLockReturn,
  UseMultiTabDetectionReturn,
  UseLockIndicatorReturn,
  LockEventHandler,
  LockActionHandler,
  LockIndicatorVariant,
  LockStatusColor,
  ComponentSize,
  LockAnimationConfig,
  LockTransition,
} from "./component.types";

// Type guards for runtime type checking
export const isLockStatus = (obj: any): obj is LockStatus => {
  return obj && typeof obj === "object" && "resourceId" in obj && "collection" in obj && "isLocked" in obj && "canEdit" in obj;
};

export const isLockError = (obj: any): obj is LockError => {
  return obj && typeof obj === "object" && "type" in obj && "message" in obj;
};

export const isTabInfo = (obj: any): obj is TabInfo => {
  return obj && typeof obj === "object" && "tabId" in obj && "lastActivity" in obj && "isActive" in obj;
};

// Utility types
export type LockResourceKey = `${string}:${string}`; // collection:resourceId
export type LockEventCallback<T = any> = (event: LockEvent, data?: T) => void;
export type LockStateUpdater = (prev: LockStatus | null) => LockStatus | null;

// Configuration defaults
export const LOCK_MANAGEMENT_DEFAULTS = {
  LOCK_DURATION_MINUTES: 5,
  REFRESH_INTERVAL_MS: 120000, // 2 minutes
  WARNING_THRESHOLD_MS: 60000, // 1 minute
  CLEANUP_INTERVAL_MS: 600000, // 10 minutes
  MAX_LOCK_ATTEMPTS: 3,
} as const;

// Export the defaults as a type
export type LockDefaults = typeof LOCK_MANAGEMENT_DEFAULTS;
