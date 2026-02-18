'use client';

import { useState } from 'react';
import { useAuditLog } from '../hooks/useAuditLog';
import { getAuditActionDescription, getAuditActionIcon } from '../utils/auditLog';
import { formatRelativeTime, formatFullDateTime } from '@/lib/shared/utils/dateTime';

interface AuditLogPanelProps {
  conversationId: string;
  /** Whether the panel is initially expanded */
  defaultExpanded?: boolean;
}

export function AuditLogPanel({
  conversationId,
  defaultExpanded = false,
}: AuditLogPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const {
    entries,
    isLoading,
    error,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useAuditLog(conversationId);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded="false"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
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
          Activity Log
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(false)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        aria-expanded="true"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
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
          Activity Log
          {entries.length > 0 && (
            <span className="text-xs text-gray-500 font-normal">
              ({entries.length}{hasMore ? '+' : ''} entries)
            </span>
          )}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <svg
              className="animate-spin h-5 w-5 mx-auto mb-2 text-gray-400"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading activity...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 text-sm">{error}</div>
        ) : entries.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No activity recorded yet
          </div>
        ) : (
          <ul className="divide-y divide-gray-100" role="list">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0" aria-hidden="true">
                    {getAuditActionIcon(entry.action)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{entry.userName}</span>{' '}
                      {getAuditActionDescription(entry)}
                    </p>
                    <div className="relative group inline-block">
                      <p className="text-xs text-gray-500 cursor-default">
                        {formatRelativeTime(entry.timestamp)}
                      </p>
                      {/* Full datetime tooltip on hover */}
                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                          {formatFullDateTime(entry.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="p-2 text-center border-t border-gray-100">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="text-xs text-glamlink-purple hover:text-glamlink-purple-dark hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
