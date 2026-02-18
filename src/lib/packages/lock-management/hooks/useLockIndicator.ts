"use client";

/**
 * useLockIndicator Hook - UI State Management
 *
 * Hook for managing UI state related to lock indicators and displays.
 */

import { useState, useEffect, useMemo } from "react";
import { LockStatus } from "../types/lock.types";
import { formatTimeRemaining } from "../utils/timeFormatters";
import { isLockExpiringSoon } from "../utils/lockHelpers";

export interface LockIndicatorState {
  variant: "locked" | "unlocked" | "editing" | "warning" | "error" | "expired";
  color: "green" | "red" | "yellow" | "blue" | "gray";
  icon: "lock" | "unlock" | "edit" | "warning" | "error" | "clock";
  message: string;
  showCountdown: boolean;
  isActionable: boolean;
  priority: "low" | "medium" | "high" | "critical";
}

export interface UseLockIndicatorOptions {
  lockStatus: LockStatus | null;
  showDetails?: boolean;
  showTimeRemaining?: boolean;
  warningThreshold?: number; // minutes before expiration to show warning
  errorThreshold?: number; // minutes before expiration to show error
}

export interface UseLockIndicatorReturn {
  indicatorState: LockIndicatorState;
  timeRemaining: string | null;
  isExpiringSoon: boolean;
  isExpired: boolean;
  canShowActions: boolean;
  formattedLockInfo: {
    lockedBy?: string;
    lockDuration?: string;
    expiresAt?: string;
    lockGroup?: string;
  };
}

export function useLockIndicator(options: UseLockIndicatorOptions): UseLockIndicatorReturn {
  const {
    lockStatus,
    showDetails = true,
    showTimeRemaining = true,
    warningThreshold = 2, // 2 minutes warning
    errorThreshold = 1, // 1 minute error
  } = options;

  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  // Calculate time remaining
  useEffect(() => {
    if (!showTimeRemaining) {
      setTimeRemaining(null);
      return;
    }

    // Handle both lockExpiresAt (ISO string) and lockExpiresIn (seconds)
    if (!lockStatus?.lockExpiresAt && !lockStatus?.lockExpiresIn) {
      setTimeRemaining(null);
      return;
    }

    const updateTime = () => {
      let remainingSeconds = 0;
      
      // Prefer lockExpiresIn if provided (already in seconds)
      if (lockStatus.lockExpiresIn !== undefined && lockStatus.lockExpiresIn !== null) {
        remainingSeconds = Math.max(0, Math.floor(lockStatus.lockExpiresIn));
      } 
      // Otherwise calculate from lockExpiresAt
      else if (lockStatus.lockExpiresAt) {
        const expiresAt = new Date(lockStatus.lockExpiresAt);
        const now = new Date();
        const remainingMs = expiresAt.getTime() - now.getTime();
        remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
      }
      
      const remaining = formatTimeRemaining(remainingSeconds);
      setTimeRemaining(remaining);
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lockStatus?.lockExpiresAt, lockStatus?.lockExpiresIn, showTimeRemaining]);

  // Calculate indicator state
  const indicatorState = useMemo((): LockIndicatorState => {
    if (!lockStatus) {
      return {
        variant: "unlocked",
        color: "gray",
        icon: "unlock",
        message: "Not connected",
        showCountdown: false,
        isActionable: false,
        priority: "low",
      };
    }

    // Check if expired
    if (lockStatus.lockExpiresAt) {
      const expiresAt = new Date(lockStatus.lockExpiresAt);
      const now = new Date();

      if (expiresAt <= now) {
        return {
          variant: "expired",
          color: "red",
          icon: "error",
          message: "Lock expired",
          showCountdown: false,
          isActionable: true,
          priority: "critical",
        };
      }

      // Check warning thresholds
      const minutesRemaining = (expiresAt.getTime() - now.getTime()) / (1000 * 60);

      if (minutesRemaining <= errorThreshold) {
        return {
          variant: "error",
          color: "red",
          icon: "warning",
          message: `Expires in ${timeRemaining}`,
          showCountdown: true,
          isActionable: true,
          priority: "critical",
        };
      }

      if (minutesRemaining <= warningThreshold) {
        return {
          variant: "warning",
          color: "yellow",
          icon: "clock",
          message: `Expires in ${timeRemaining}`,
          showCountdown: true,
          isActionable: true,
          priority: "high",
        };
      }
    }

    // User has the lock
    if (lockStatus.hasLock) {
      return {
        variant: "editing",
        color: "green",
        icon: "edit",
        message: lockStatus.lockExpiresAt ? `Editing (${timeRemaining} remaining)` : "You are editing",
        showCountdown: showTimeRemaining && !!lockStatus.lockExpiresAt,
        isActionable: true,
        priority: "medium",
      };
    }

    // Resource is locked by someone else
    if (lockStatus.isLocked) {
      const lockedByName = lockStatus.lockedByName || lockStatus.lockedByEmail || "Another user";
      return {
        variant: "locked",
        color: "red",
        icon: "lock",
        message: `Locked by ${lockedByName}`,
        showCountdown: false,
        isActionable: false,
        priority: "medium",
      };
    }

    // Resource is available
    return {
      variant: "unlocked",
      color: "green",
      icon: "unlock",
      message: "Available for editing",
      showCountdown: false,
      isActionable: true,
      priority: "low",
    };
  }, [lockStatus, timeRemaining, showTimeRemaining, warningThreshold, errorThreshold]);

  // Check expiration status
  const isExpiringSoon = useMemo(() => {
    if (!lockStatus?.lockExpiresAt) return false;
    return isLockExpiringSoon(new Date(lockStatus.lockExpiresAt), warningThreshold);
  }, [lockStatus?.lockExpiresAt, warningThreshold]);

  const isExpired = useMemo(() => {
    if (!lockStatus?.lockExpiresAt) return false;
    return new Date(lockStatus.lockExpiresAt) <= new Date();
  }, [lockStatus?.lockExpiresAt]);

  // Format lock information for display
  const formattedLockInfo = useMemo(() => {
    if (!lockStatus) return {};

    const result: any = {};

    if (lockStatus.lockedBy) {
      result.lockedBy = lockStatus.lockedByName || lockStatus.lockedByEmail || lockStatus.lockedBy;
    }

    if (lockStatus.lockExpiresAt) {
      const expiresAt = new Date(lockStatus.lockExpiresAt);
      result.expiresAt = expiresAt.toLocaleString();
    }

    if (lockStatus.lockGroup) {
      result.lockGroup = lockStatus.lockGroup;
    }

    return result;
  }, [lockStatus]);

  const canShowActions = useMemo(() => {
    return indicatorState.isActionable && (lockStatus?.canEdit ?? false);
  }, [indicatorState.isActionable, lockStatus?.canEdit]);

  return {
    indicatorState,
    timeRemaining,
    isExpiringSoon,
    isExpired,
    canShowActions,
    formattedLockInfo,
  };
}
