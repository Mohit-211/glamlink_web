/**
 * Date Range Helper Functions
 *
 * Utilities for working with date ranges and presets.
 */

interface DateRange {
  start: string;
  end: string;
  preset?: string;
}

/**
 * Get date range from a preset ID
 */
export function getDateRange(presetId: string): DateRange {
  const today = new Date();
  let end = today.toISOString().split('T')[0];
  let start = end;

  switch (presetId) {
    case 'today':
      start = end;
      break;

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      start = yesterday.toISOString().split('T')[0];
      end = start;
      break;

    case 'last_7_days':
      const week = new Date(today);
      week.setDate(week.getDate() - 7);
      start = week.toISOString().split('T')[0];
      break;

    case 'last_30_days':
      const month = new Date(today);
      month.setDate(month.getDate() - 30);
      start = month.toISOString().split('T')[0];
      break;

    case 'last_90_days':
      const quarter = new Date(today);
      quarter.setDate(quarter.getDate() - 90);
      start = quarter.toISOString().split('T')[0];
      break;

    case 'this_month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      start = monthStart.toISOString().split('T')[0];
      break;

    case 'last_month':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      start = lastMonthStart.toISOString().split('T')[0];
      return {
        start,
        end: lastMonthEnd.toISOString().split('T')[0],
        preset: presetId,
      };

    case 'this_year':
      const yearStart = new Date(today.getFullYear(), 0, 1);
      start = yearStart.toISOString().split('T')[0];
      break;

    case 'last_year':
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
      start = lastYearStart.toISOString().split('T')[0];
      return {
        start,
        end: lastYearEnd.toISOString().split('T')[0],
        preset: presetId,
      };

    default:
      // Default to last 30 days
      const defaultStart = new Date(today);
      defaultStart.setDate(defaultStart.getDate() - 30);
      start = defaultStart.toISOString().split('T')[0];
  }

  return { start, end, preset: presetId };
}

/**
 * Calculate the number of days in a date range
 */
export function getDaysInRange(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if two date ranges overlap
 */
export function rangesOverlap(
  range1: { start: string; end: string },
  range2: { start: string; end: string }
): boolean {
  const start1 = new Date(range1.start);
  const end1 = new Date(range1.end);
  const start2 = new Date(range2.start);
  const end2 = new Date(range2.end);

  return start1 <= end2 && end1 >= start2;
}

/**
 * Get comparison date range (previous period)
 */
export function getComparisonRange(startDate: string, endDate: string): DateRange {
  const days = getDaysInRange(startDate, endDate);
  const start = new Date(startDate);
  start.setDate(start.getDate() - days - 1);

  const end = new Date(endDate);
  end.setDate(end.getDate() - days - 1);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}
