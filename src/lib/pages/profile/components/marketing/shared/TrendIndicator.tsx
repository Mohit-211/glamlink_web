/**
 * Trend Indicator Component
 *
 * Shows percentage change with up/down arrow and color coding.
 */

'use client';

interface TrendIndicatorProps {
  current: number;
  previous: number;
}

export function TrendIndicator({ current, previous }: TrendIndicatorProps) {
  const change = previous === 0
    ? (current > 0 ? 100 : 0)
    : ((current - previous) / previous) * 100;

  const isPositive = change >= 0;
  const isNeutral = Math.abs(change) < 0.1;

  if (isNeutral) {
    return (
      <span className="text-sm text-gray-500">
        —
      </span>
    );
  }

  return (
    <span className={`
      text-sm font-medium flex items-center
      ${isPositive ? 'text-green-600' : 'text-red-600'}
    `}>
      {isPositive ? (
        <svg className="w-4 h-4 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {Math.abs(change).toFixed(1)}%
    </span>
  );
}
