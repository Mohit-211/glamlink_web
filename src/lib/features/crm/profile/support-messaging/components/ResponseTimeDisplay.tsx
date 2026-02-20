'use client';

import type { ConversationMetrics } from '../types';

interface ResponseTimeDisplayProps {
  metrics?: ConversationMetrics;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Format milliseconds to a human-readable time string
 * e.g., "2h 15m", "45m", "< 1m"
 */
function formatResponseTime(ms: number): string {
  if (ms < 60000) {
    return '< 1m';
  }

  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

/**
 * Get a color class based on response time
 * Quick (< 1 hour): green
 * Normal (1-4 hours): yellow
 * Slow (> 4 hours): red
 */
function getResponseTimeColor(ms: number): string {
  const hours = ms / (1000 * 60 * 60);

  if (hours < 1) {
    return 'text-green-600';
  }

  if (hours < 4) {
    return 'text-yellow-600';
  }

  return 'text-red-600';
}

/**
 * Display response time metrics for a conversation
 */
export function ResponseTimeDisplay({
  metrics,
  showLabel = true,
  size = 'sm',
}: ResponseTimeDisplayProps) {
  if (!metrics?.firstResponseTimeMs) {
    return null;
  }

  const formattedTime = formatResponseTime(metrics.firstResponseTimeMs);
  const colorClass = getResponseTimeColor(metrics.firstResponseTimeMs);
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-1 ${sizeClasses}`}>
      <svg
        className={`w-3.5 h-3.5 ${colorClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {showLabel && <span className="text-gray-500">First response:</span>}
      <span className={`font-medium ${colorClass}`}>{formattedTime}</span>
    </div>
  );
}

/**
 * Full metrics display including total admin replies
 */
export function ResponseMetricsSummary({
  metrics,
}: {
  metrics?: ConversationMetrics;
}) {
  if (!metrics) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 text-xs text-gray-500">
      {metrics.firstResponseTimeMs && (
        <ResponseTimeDisplay metrics={metrics} size="sm" />
      )}
      {metrics.totalAdminReplies > 0 && (
        <div className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>Admin replies: {metrics.totalAdminReplies}</span>
        </div>
      )}
    </div>
  );
}
