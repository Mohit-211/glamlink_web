'use client';

import { formatElapsedTime } from './utils';

interface RefreshBarProps {
  lastUpdated: number | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function RefreshBar({ lastUpdated, isRefreshing, onRefresh }: RefreshBarProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
      <span className="text-sm text-gray-600">
        {formatElapsedTime(lastUpdated)}
      </span>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`
          flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          ${isRefreshing
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        {isRefreshing ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Refreshing...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </>
        )}
      </button>
    </div>
  );
}
