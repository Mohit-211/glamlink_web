'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface RateLimitConfig {
  /** Maximum number of actions allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface UseRateLimitReturn {
  /** Check if under the rate limit (true = allowed) */
  checkLimit: () => boolean;
  /** Record a new action */
  recordAction: () => void;
  /** Number of remaining actions in the current window */
  remainingActions: number;
  /** Whether the rate limit has been exceeded */
  isLimited: boolean;
  /** Reset the rate limit */
  reset: () => void;
}

/**
 * Client-side rate limit tracking hook.
 * Tracks timestamps of recent actions to prevent spam.
 *
 * @param config - Rate limit configuration
 * @returns Rate limit controls and state
 *
 * @example
 * ```tsx
 * function MessageInput() {
 *   const { checkLimit, recordAction, isLimited, remainingActions } = useRateLimit({
 *     limit: 10,
 *     windowMs: 60000, // 1 minute
 *   });
 *
 *   const handleSend = () => {
 *     if (!checkLimit()) {
 *       alert('Rate limit exceeded. Please wait.');
 *       return;
 *     }
 *     recordAction();
 *     sendMessage();
 *   };
 *
 *   return (
 *     <button onClick={handleSend} disabled={isLimited}>
 *       Send ({remainingActions} remaining)
 *     </button>
 *   );
 * }
 * ```
 */
export function useRateLimit({
  limit,
  windowMs,
}: RateLimitConfig): UseRateLimitReturn {
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [remainingActions, setRemainingActions] = useState<number>(limit);

  // Track the cleanup interval
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up old timestamps periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setTimestamps((prev) => {
        const valid = prev.filter((ts) => now - ts < windowMs);
        setRemainingActions(Math.max(0, limit - valid.length));
        return valid;
      });
    };

    // Run cleanup every second
    cleanupIntervalRef.current = setInterval(cleanup, 1000);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [limit, windowMs]);

  const checkLimit = useCallback((): boolean => {
    const now = Date.now();
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);
    return validTimestamps.length < limit;
  }, [timestamps, limit, windowMs]);

  const recordAction = useCallback((): void => {
    const now = Date.now();
    setTimestamps((prev) => {
      const valid = prev.filter((ts) => now - ts < windowMs);
      const newTimestamps = [...valid, now];
      setRemainingActions(Math.max(0, limit - newTimestamps.length));
      return newTimestamps;
    });
  }, [limit, windowMs]);

  const reset = useCallback((): void => {
    setTimestamps([]);
    setRemainingActions(limit);
  }, [limit]);

  const isLimited = remainingActions <= 0;

  return {
    checkLimit,
    recordAction,
    remainingActions,
    isLimited,
    reset,
  };
}
