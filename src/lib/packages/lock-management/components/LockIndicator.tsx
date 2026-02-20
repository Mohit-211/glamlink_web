'use client';

/**
 * LockIndicator Component - Visual Lock Status Display
 * 
 * Displays the current lock status with appropriate visual indicators.
 */

import React from 'react';
import { LockStatus } from '../types/lock.types';
import { useLockIndicator } from '../hooks/useLockIndicator';
import { LockCountdown } from './LockCountdown';

export interface LockIndicatorProps {
  lockStatus: LockStatus | null;
  showDetails?: boolean;
  showTimeRemaining?: boolean;
  showActions?: boolean;
  warningThreshold?: number;
  errorThreshold?: number;
  onAcquireLock?: () => void;
  onReleaseLock?: () => void;
  onExtendLock?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  lock: '🔒',
  unlock: '🔓',
  edit: '✏️',
  warning: '⚠️',
  error: '❌',
  clock: '⏰'
};

const colorClasses = {
  green: 'bg-green-100 text-green-800 border-green-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200'
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export function LockIndicator({
  lockStatus,
  showDetails = true,
  showTimeRemaining = true,
  showActions = false,
  warningThreshold = 2,
  errorThreshold = 1,
  onAcquireLock,
  onReleaseLock,
  onExtendLock,
  className = '',
  size = 'md'
}: LockIndicatorProps) {
  const {
    indicatorState,
    timeRemaining,
    isExpiringSoon,
    isExpired,
    canShowActions,
    formattedLockInfo
  } = useLockIndicator({
    lockStatus,
    showDetails,
    showTimeRemaining,
    warningThreshold,
    errorThreshold
  });

  const baseClasses = `inline-flex items-center gap-2 rounded-full border font-medium ${sizeClasses[size]} ${colorClasses[indicatorState.color]} ${className}`;

  return (
    <div className="flex items-center gap-2">
      {/* Main Indicator */}
      <div className={baseClasses}>
        <span className="text-base leading-none">
          {iconMap[indicatorState.icon]}
        </span>
        <span>{indicatorState.message}</span>
        
        {indicatorState.showCountdown && timeRemaining && (
          <LockCountdown 
            timeRemaining={timeRemaining}
            isWarning={isExpiringSoon}
            isError={isExpired}
            size={size}
          />
        )}
      </div>

      {/* Action Buttons */}
      {showActions && canShowActions && (
        <div className="flex items-center gap-1">
          {/* Acquire Lock Button */}
          {!lockStatus?.hasLock && lockStatus?.canEdit && (
            <button
              onClick={onAcquireLock}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              title="Acquire lock to start editing"
            >
              Lock
            </button>
          )}

          {/* Extend Lock Button */}
          {lockStatus?.hasLock && (isExpiringSoon || isExpired) && (
            <button
              onClick={onExtendLock}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              title="Extend lock duration"
            >
              Extend
            </button>
          )}

          {/* Release Lock Button */}
          {lockStatus?.hasLock && (
            <button
              onClick={onReleaseLock}
              className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              title="Release lock"
            >
              Release
            </button>
          )}
        </div>
      )}

      {/* Detailed Info (Expandable) */}
      {showDetails && Object.keys(formattedLockInfo).length > 0 && (
        <div className="text-xs text-gray-600">
          {formattedLockInfo.lockedBy && (
            <div>By: {formattedLockInfo.lockedBy}</div>
          )}
          {formattedLockInfo.lockGroup && (
            <div>Group: {formattedLockInfo.lockGroup}</div>
          )}
          {formattedLockInfo.expiresAt && (
            <div>Expires: {formattedLockInfo.expiresAt}</div>
          )}
        </div>
      )}
    </div>
  );
}