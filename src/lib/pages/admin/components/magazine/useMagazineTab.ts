'use client';

import { useState, useMemo, useCallback } from 'react';
import { MagazineIssue } from '@/lib/pages/magazine/types/magazine/core';
import { DateFilterState } from '@/lib/pages/admin/components/shared/table/TableHeader';
import { useMagazineRedux } from '@/lib/pages/admin/hooks/useMagazineRedux';

// Issue with computed section count
export interface MagazineIssueWithSectionCount extends MagazineIssue {
  sectionCount: number;
  isActive?: boolean;
}

export interface UseMagazineTabReturn {
  // Data from Redux
  issues: MagazineIssue[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;

  // Filtered/computed data
  filteredIssues: MagazineIssueWithSectionCount[];
  inactiveCount: number;

  // Filter state
  showActiveOnly: boolean;
  setShowActiveOnly: (value: boolean) => void;
  dateFilter: DateFilterState;
  setDateFilter: (filter: DateFilterState) => void;

  // Operations (from Redux)
  fetchIssues: () => Promise<void>;
  createIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  updateIssue: (data: Partial<MagazineIssue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  toggleFeatured: (issue: MagazineIssue) => Promise<void>;
  batchUpload: (issues: Partial<MagazineIssue>[]) => Promise<void>;
}

/**
 * Hook for MagazineTab that combines Redux data with filtering logic.
 *
 * Separates concerns:
 * - useMagazineRedux: Data fetching and caching (Redux layer)
 * - useMagazineTab: Filtering and UI state (presentation layer)
 */
export function useMagazineTab(): UseMagazineTabReturn {
  // Get data and operations from Redux hook
  const {
    issues,
    lastUpdated,
    isLoading,
    error,
    isSaving,
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    toggleFeatured,
    batchUpload
  } = useMagazineRedux();

  // Filter state - default to showing only active issues
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Date filter state - default to showing all
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    option: 'all',
    startDate: undefined,
    endDate: undefined
  });

  // Calculate date range based on filter option
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (dateFilter.option === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = now;
    } else if (dateFilter.option === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      endDate = now;
    } else if (dateFilter.option === 'custom') {
      startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
    }

    return { startDate, endDate };
  }, [dateFilter]);

  // Compute section count for each issue and apply filters
  const { filteredIssues, inactiveCount } = useMemo(() => {
    // Add section count to each issue
    const issuesWithSectionCount: MagazineIssueWithSectionCount[] = issues.map(issue => ({
      ...issue,
      sectionCount: issue.sections?.length || 0
    }));

    // Count inactive issues for the filter badge
    const inactiveCount = issuesWithSectionCount.filter(
      issue => issue.isActive === false
    ).length;

    // Filter issues based on active status and date
    const filtered = issuesWithSectionCount.filter(issue => {
      // Active filter
      if (showActiveOnly && issue.isActive === false) {
        return false;
      }

      // Date filter
      if (dateFilter.option !== 'all' && issue.issueDate) {
        const { startDate, endDate } = getDateRange();
        const issueDate = new Date(issue.issueDate);

        if (startDate && issueDate < startDate) {
          return false;
        }
        if (endDate && issueDate > endDate) {
          return false;
        }
      }

      return true;
    });

    return { filteredIssues: filtered, inactiveCount };
  }, [issues, showActiveOnly, dateFilter, getDateRange]);

  return {
    // Data from Redux
    issues,
    lastUpdated,
    isLoading,
    error,
    isSaving,

    // Filtered/computed data
    filteredIssues,
    inactiveCount,

    // Filter state
    showActiveOnly,
    setShowActiveOnly,
    dateFilter,
    setDateFilter,

    // Operations (from Redux)
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    toggleFeatured,
    batchUpload,
  };
}
