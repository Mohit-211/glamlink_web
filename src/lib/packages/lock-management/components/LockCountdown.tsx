'use client';

/**
 * LockCountdown Component - Time Remaining Display
 * 
 * Displays countdown timer for lock expiration with visual warnings.
 */

import React from 'react';

export interface LockCountdownProps {
  timeRemaining: string;
  isWarning?: boolean;
  isError?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5'
};

export function LockCountdown({
  timeRemaining,
  isWarning = false,
  isError = false,
  showIcon = true,
  size = 'md',
  className = ''
}: LockCountdownProps) {
  const getStyles = () => {
    if (isError) {
      return 'bg-red-100 text-red-800 border border-red-200 animate-pulse';
    }
    if (isWarning) {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
    return 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const getIcon = () => {
    if (isError) return '🚨';
    if (isWarning) return '⚠️';
    return '⏱️';
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded ${sizeClasses[size]} ${getStyles()} ${className}`}>
      {showIcon && (
        <span className="leading-none">
          {getIcon()}
        </span>
      )}
      <span className="font-mono font-medium">
        {timeRemaining}
      </span>
    </div>
  );
}