/**
 * Time Formatters - Utility functions for formatting time and dates in lock UI
 * 
 * Specialized time formatting functions for lock-related displays.
 * 
 * Note: No 'use client' directive - this utility works on both client and server.
 */

/**
 * Format time remaining for lock expiration
 */
export function formatLockTimeRemaining(
  remainingSeconds: number,
  format: 'short' | 'long' | 'minimal' = 'short'
): string {
  if (remainingSeconds <= 0) {
    return format === 'minimal' ? '0s' : 'Expired';
  }

  if (format === 'minimal') {
    return formatMinimal(remainingSeconds);
  }

  if (format === 'long') {
    return formatLong(remainingSeconds);
  }

  return formatShort(remainingSeconds);
}

/**
 * Format minimal time (e.g., "2m", "45s")
 */
function formatMinimal(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

/**
 * Format short time (e.g., "2m 15s", "45s")
 */
function formatShort(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${hours}h`;
}

/**
 * Format long time (e.g., "2 minutes 15 seconds", "1 hour")
 */
function formatLong(seconds: number): string {
  if (seconds < 60) {
    return seconds === 1 ? '1 second' : `${seconds} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    const minuteText = minutes === 1 ? '1 minute' : `${minutes} minutes`;
    if (remainingSeconds > 0) {
      const secondText = remainingSeconds === 1 ? '1 second' : `${remainingSeconds} seconds`;
      return `${minuteText} ${secondText}`;
    }
    return minuteText;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourText = hours === 1 ? '1 hour' : `${hours} hours`;
  if (remainingMinutes > 0) {
    const minuteText = remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
    return `${hourText} ${minuteText}`;
  }

  return hourText;
}

/**
 * Format relative time (e.g., "2 minutes ago", "in 5 minutes")
 */
export function formatRelativeTime(timestamp: string, baseTime?: Date): string {
  const base = baseTime || new Date();
  const target = new Date(timestamp);
  const diffMs = target.getTime() - base.getTime();
  const diffSeconds = Math.abs(Math.floor(diffMs / 1000));

  const isPast = diffMs < 0;
  const suffix = isPast ? 'ago' : '';
  const prefix = isPast ? '' : 'in ';

  if (diffSeconds < 60) {
    const text = diffSeconds === 1 ? '1 second' : `${diffSeconds} seconds`;
    return `${prefix}${text}${suffix}`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    const text = diffMinutes === 1 ? '1 minute' : `${diffMinutes} minutes`;
    return `${prefix}${text}${suffix}`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    const text = diffHours === 1 ? '1 hour' : `${diffHours} hours`;
    return `${prefix}${text}${suffix}`;
  }

  const diffDays = Math.floor(diffHours / 24);
  const text = diffDays === 1 ? '1 day' : `${diffDays} days`;
  return `${prefix}${text}${suffix}`;
}

/**
 * Format absolute timestamp for display (e.g., "2:30 PM", "Mar 15, 2:30 PM")
 */
export function formatAbsoluteTime(
  timestamp: string,
  format: 'time' | 'date' | 'datetime' | 'full' = 'datetime'
): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  };

  const fullOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  switch (format) {
    case 'time':
      return date.toLocaleTimeString('en-US', timeOptions);
    
    case 'date':
      return date.toLocaleDateString('en-US', dateOptions);
    
    case 'datetime':
      if (isToday) {
        return date.toLocaleTimeString('en-US', timeOptions);
      } else {
        return `${date.toLocaleDateString('en-US', dateOptions)}, ${date.toLocaleTimeString('en-US', timeOptions)}`;
      }
    
    case 'full':
      return date.toLocaleString('en-US', fullOptions);
    
    default:
      return date.toLocaleString();
  }
}

/**
 * Format duration between two timestamps
 */
export function formatDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const durationMs = end.getTime() - start.getTime();
  const durationSeconds = Math.floor(durationMs / 1000);

  return formatLockTimeRemaining(durationSeconds, 'long');
}

/**
 * Get time zone information for display
 */
export function getTimeZoneInfo(): string {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date();
    const offset = -date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetSign = offset >= 0 ? '+' : '-';
    
    const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    return `${timeZone} (UTC${offsetString})`;
  } catch (error) {
    return 'Local Time';
  }
}

/**
 * Format countdown text with different styles
 */
export function formatCountdown(
  remainingSeconds: number,
  style: 'clock' | 'text' | 'compact' = 'text'
): string {
  if (remainingSeconds <= 0) {
    return style === 'clock' ? '00:00' : 'Expired';
  }

  if (style === 'clock') {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  if (style === 'compact') {
    return formatMinimal(remainingSeconds);
  }

  // Default 'text' style
  return formatShort(remainingSeconds);
}

/**
 * Create a progress percentage for time-based progress bars
 */
export function calculateTimeProgress(
  startTime: string,
  endTime: string,
  currentTime?: Date
): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const current = (currentTime || new Date()).getTime();

  if (current <= start) return 0;
  if (current >= end) return 100;

  const total = end - start;
  const elapsed = current - start;

  return Math.round((elapsed / total) * 100);
}

/**
 * Get warning color class based on remaining time
 */
export function getTimeWarningClass(
  remainingSeconds: number,
  warningThresholdSeconds: number = 60
): string {
  if (remainingSeconds <= 0) return 'text-red-600';
  if (remainingSeconds <= 15) return 'text-red-500';
  if (remainingSeconds <= warningThresholdSeconds) return 'text-yellow-500';
  return 'text-gray-600';
}

/**
 * Get background color class for time-based indicators
 */
export function getTimeBackgroundClass(
  remainingSeconds: number,
  warningThresholdSeconds: number = 60
): string {
  if (remainingSeconds <= 0) return 'bg-red-100 border-red-300';
  if (remainingSeconds <= 15) return 'bg-red-50 border-red-200';
  if (remainingSeconds <= warningThresholdSeconds) return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-200';
}

/**
 * Format time for accessibility (screen readers)
 */
export function formatTimeForA11y(remainingSeconds: number): string {
  if (remainingSeconds <= 0) {
    return 'Lock has expired';
  }

  if (remainingSeconds < 60) {
    return `Lock expires in ${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`;
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  if (minutes < 60) {
    let text = `Lock expires in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    if (seconds > 0) {
      text += ` and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
    }
    return text;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let text = `Lock expires in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  if (remainingMinutes > 0) {
    text += ` and ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
  }

  return text;
}

/**
 * Parse and validate time strings
 */
export function parseTimeString(timeString: string): Date | null {
  try {
    const date = new Date(timeString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
}

/**
 * Check if a timestamp is in the past
 */
export function isInPast(timestamp: string, baseTime?: Date): boolean {
  const base = baseTime || new Date();
  const target = new Date(timestamp);
  return target.getTime() < base.getTime();
}

/**
 * Check if a timestamp is in the future
 */
export function isInFuture(timestamp: string, baseTime?: Date): boolean {
  const base = baseTime || new Date();
  const target = new Date(timestamp);
  return target.getTime() > base.getTime();
}

// Wrapper functions for backward compatibility with expected function names

/**
 * Wrapper for formatLockTimeRemaining for backward compatibility
 */
export const formatTimeRemaining = formatLockTimeRemaining;

/**
 * Calculate duration between two timestamps in minutes
 */
export function getLockDurationInMinutes(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.floor((end - start) / (1000 * 60));
}