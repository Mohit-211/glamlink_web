"use client";

/**
 * useLock Hook - Core Lock Management
 *
 * Primary hook for managing resource locks with automatic lifecycle management.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { tabManager } from "../services/TabManager";
import { LockStatus, LockConfig } from "../types/lock.types";
import { AcquireLockRequest, ExtendLockRequest, ReleaseLockRequest } from "../types/api.types";
import { formatTimeRemaining } from "../utils/timeFormatters";

export interface UseLockOptions {
  resourceId: string;
  collection: string;
  lockGroup?: string;
  lockDuration?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onLockAcquired?: (status: LockStatus) => void;
  onLockLost?: (reason: string) => void;
  onLockExtended?: (status: LockStatus) => void;
  onError?: (error: string) => void;
}

export interface UseLockReturn {
  lockStatus: LockStatus | null;
  isLoading: boolean;
  error: string | null;
  timeRemaining: string | null;
  acquireLock: () => Promise<boolean>;
  releaseLock: () => Promise<boolean>;
  extendLock: (extendByMinutes?: number) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  canEdit: boolean;
  hasLock: boolean;
  isLocked: boolean;
}

export function useLock(options: UseLockOptions): UseLockReturn {
  const {
    resourceId,
    collection,
    lockGroup,
    lockDuration = 5,
    autoRefresh = true,
    refreshInterval = 120000, // 2 minutes
    onLockAcquired,
    onLockLost,
    onLockExtended,
    onError,
  } = options;

  const [lockStatus, setLockStatus] = useState<LockStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeCountdownRef = useRef<NodeJS.Timeout | null>(null);
  const tabId = tabManager.getTabId();

  const clearTimers = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (timeCountdownRef.current) {
      clearInterval(timeCountdownRef.current);
      timeCountdownRef.current = null;
    }
  }, []);

  const updateTimeRemaining = useCallback(() => {
    if (!lockStatus?.lockExpiresAt) {
      setTimeRemaining(null);
      return;
    }

    const expiresAt = new Date(lockStatus.lockExpiresAt);
    const remaining = formatTimeRemaining(expiresAt.getTime());
    setTimeRemaining(remaining);

    if (expiresAt <= new Date()) {
      setTimeRemaining("Expired");
      onLockLost?.("Lock expired");
    }
  }, [lockStatus, onLockLost]);

  const refreshStatus = useCallback(async (): Promise<void> => {
    if (!resourceId || !collection) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/locks/${collection}/${resourceId}/status`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLockStatus(data.status);
      } else {
        throw new Error(data.error || "Failed to get lock status");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId, collection, onError]);

  const acquireLock = useCallback(async (): Promise<boolean> => {
    if (!resourceId || !collection) return false;

    try {
      setIsLoading(true);
      setError(null);

      const request: AcquireLockRequest = {
        userId: "", // Will be populated by server
        userEmail: "", // Will be populated by server
        tabId,
        lockGroup,
      };

      const response = await fetch(`/api/locks/${collection}/${resourceId}/acquire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data.success) {
        setLockStatus(
          data.lockStatus || {
            resourceId,
            collection,
            isLocked: true,
            canEdit: true,
            hasLock: true,
            lockExpiresAt: data.lockExpiresAt,
            lockedBy: data.lockedBy,
            lockGroup: lockGroup,
          }
        );
        onLockAcquired?.(lockStatus!);
        return true;
      } else {
        const errorMessage = data.error || data.message || "Failed to acquire lock";
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resourceId, collection, tabId, lockGroup, onLockAcquired, onError, lockStatus]);

  const releaseLock = useCallback(async (): Promise<boolean> => {
    if (!resourceId || !collection) return false;

    try {
      setIsLoading(true);
      setError(null);

      const request: ReleaseLockRequest = {
        userId: "", // Will be populated by server
        reason: "User initiated release",
      };

      const response = await fetch(`/api/locks/${collection}/${resourceId}/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data.success) {
        setLockStatus((prevStatus) =>
          prevStatus
            ? {
                ...prevStatus,
                isLocked: false,
                canEdit: false,
                hasLock: false,
                lockExpiresAt: undefined,
                lockedBy: undefined,
              }
            : null
        );
        clearTimers();
        return true;
      } else {
        const errorMessage = data.error?.message || data.message || "Failed to release lock";
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resourceId, collection, clearTimers, onError]);

  const extendLock = useCallback(
    async (extendByMinutes?: number): Promise<boolean> => {
      if (!resourceId || !collection) return false;

      try {
        setIsLoading(true);
        setError(null);

        const request = {
          extendByMinutes: extendByMinutes || lockDuration,
        };

        const response = await fetch(`/api/locks/${collection}/${resourceId}/extend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(request),
        });

        const data = await response.json();

        if (data.success) {
          setLockStatus((prevStatus) =>
            prevStatus
              ? {
                  ...prevStatus,
                  lockExpiresAt: data.lockExpiresAt,
                }
              : null
          );
          onLockExtended?.(lockStatus!);
          return true;
        } else {
          const errorMessage = data.message || "Failed to extend lock";
          setError(errorMessage);
          onError?.(errorMessage);
          return false;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [resourceId, collection, lockDuration, onLockExtended, onError, lockStatus]
  );

  // Start auto-refresh timer
  useEffect(() => {
    if (autoRefresh && lockStatus?.hasLock) {
      refreshTimerRef.current = setInterval(() => {
        extendLock();
      }, refreshInterval);

      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, lockStatus?.hasLock, refreshInterval, extendLock]);

  // Start countdown timer
  useEffect(() => {
    if (lockStatus?.lockExpiresAt) {
      updateTimeRemaining();
      timeCountdownRef.current = setInterval(updateTimeRemaining, 1000);

      return () => {
        if (timeCountdownRef.current) {
          clearInterval(timeCountdownRef.current);
        }
      };
    }
  }, [lockStatus?.lockExpiresAt, updateTimeRemaining]);

  // Initial status check
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    lockStatus,
    isLoading,
    error,
    timeRemaining,
    acquireLock,
    releaseLock,
    extendLock,
    refreshStatus,
    canEdit: lockStatus?.canEdit ?? false,
    hasLock: lockStatus?.hasLock ?? false,
    isLocked: lockStatus?.isLocked ?? false,
  };
}
