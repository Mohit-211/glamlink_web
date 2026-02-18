'use client';

import { useRef, useEffect } from 'react';

interface ConnectionIndicatorProps {
  isOnline: boolean;
  pendingCount?: number;
}

/**
 * Component that displays connection status to users.
 * Shows when offline with optional pending message count.
 * Includes accessibility features for screen readers.
 *
 * @example
 * ```tsx
 * <ConnectionIndicator isOnline={navigator.onLine} pendingCount={3} />
 * ```
 */
export function ConnectionIndicator({ isOnline, pendingCount = 0 }: ConnectionIndicatorProps) {
  const wasOfflineRef = useRef(false);

  // Track when we come back online to announce it
  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
    }
  }, [isOnline]);

  // Generate aria-label for the status
  const getAriaLabel = () => {
    if (isOnline) {
      return wasOfflineRef.current ? 'Connected. You are back online.' : 'Connected';
    }
    return pendingCount > 0
      ? `Offline. ${pendingCount} message${pendingCount === 1 ? '' : 's'} queued.`
      : 'Offline. Messages will be sent when you reconnect.';
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={getAriaLabel()}
    >
      {!isOnline && (
        <div
          className="connection-indicator bg-yellow-100 text-yellow-800 text-sm px-4 py-2 text-center flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656m-7.072 7.072a4 4 0 010-5.656m-3.536 3.536a9 9 0 010-12.728"
            />
          </svg>
          <span>
            You&apos;re offline.
            {pendingCount > 0
              ? ` ${pendingCount} message${pendingCount === 1 ? '' : 's'} will be sent when you reconnect.`
              : ' Messages will be sent when you reconnect.'}
          </span>
        </div>
      )}
    </div>
  );
}
