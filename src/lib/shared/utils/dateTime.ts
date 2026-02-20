/**
 * Date and time formatting utilities.
 */

/**
 * Format a date as relative time (e.g., "Just now", "5m ago", "3h ago")
 *
 * @param date - Date to format
 * @returns Relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 30000)); // "Just now"
 * formatRelativeTime(new Date(Date.now() - 300000)); // "5m ago"
 * ```
 */
export function formatRelativeTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a date for message timestamps.
 * Shows time only for today, otherwise shows date + time.
 *
 * @param date - Date to format
 * @returns Formatted time string
 *
 * @example
 * ```ts
 * formatMessageTime(new Date()); // "3:45 PM" (if today)
 * formatMessageTime(yesterdayDate); // "Jan 15, 3:45 PM"
 * ```
 */
export function formatMessageTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  if (isToday) {
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a date with full details.
 *
 * @param date - Date to format
 * @returns Full formatted date string (e.g., "Monday, January 15, 2024, 3:45 PM")
 *
 * @example
 * ```ts
 * formatFullDateTime(new Date()); // "Monday, January 15, 2024, 3:45 PM"
 * ```
 */
export function formatFullDateTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
