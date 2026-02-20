'use client';

import React from 'react';

interface LockStatusRendererProps {
  row: any;
  column: any;
  value: any;
}

/**
 * LockStatusRenderer - Displays lock status for table rows
 *
 * Shows:
 * - "Available" (green badge) if not locked or lock expired
 * - "Locked" (red badge) with user info and expiration time if locked
 */
export default function LockStatusRenderer({ row }: LockStatusRendererProps) {
  const isLocked = row.lockedBy && row.lockExpiresAt;
  const lockExpired = isLocked && new Date(row.lockExpiresAt) < new Date();

  // DEBUG: Log lock data received
  console.log('[DEBUG LockStatusRenderer]', {
    rowId: row.id,
    rowTitle: row.title,
    lockedBy: row.lockedBy,
    lockedByName: row.lockedByName,
    lockExpiresAt: row.lockExpiresAt,
    isLocked,
    lockExpired
  });

  // If not locked or lock expired, show "Available"
  if (!isLocked || lockExpired) {
    return (
      <div className="flex items-center">
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
          Available
        </span>
      </div>
    );
  }

  // Locked by someone - show details
  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 inline-block w-fit">
        Locked
      </span>
      {row.lockedByName && (
        <span className="text-xs text-gray-600">
          by {row.lockedByName}
        </span>
      )}
      {row.lockExpiresAt && (
        <span className="text-xs text-gray-500">
          {formatTimeRemaining(row.lockExpiresAt)}
        </span>
      )}
    </div>
  );
}

/**
 * Format time remaining until lock expires
 *
 * @param expiresAt - ISO timestamp when lock expires
 * @returns Formatted time remaining (e.g., "Expires in 4m 30s")
 */
function formatTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires.getTime() - now.getTime();

  if (diffMs <= 0) return 'Expired';

  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Less than 1 minute - show seconds only
  if (minutes < 1) {
    return `Expires in ${seconds}s`;
  }

  // 1 or more minutes - show minutes and seconds
  return `Expires in ${minutes}m ${seconds}s`;
}
