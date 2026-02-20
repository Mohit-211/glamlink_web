'use client';

/**
 * useGetFeaturedTab - Hook for Get Featured submissions tab
 *
 * Simplified to only handle submissions - form configurations are now managed
 * in the unified Form Configurations tab (useFormConfigurationsTab).
 *
 * Uses Redux for caching - data is fetched only once and cached in Redux state.
 */

import { useState, useMemo, useCallback } from 'react';
import { useGetFeaturedSubmissionsRedux } from './useGetFeaturedSubmissionsRedux';
import type { GetFeaturedSubmission } from '@/lib/pages/apply/featured/types';
import type {
  GetFeaturedSubmissionDisplay,
  SubmissionStatusFilter,
  FormTypeFilter
} from './types';

// =============================================================================
// TYPES
// =============================================================================

export interface UseGetFeaturedTabReturn {
  // Submissions data & state
  submissions: GetFeaturedSubmission[];
  filteredSubmissions: GetFeaturedSubmissionDisplay[];
  isLoadingSubmissions: boolean;
  submissionsError: string | null;
  lastUpdated: number | null;

  // Modal state
  viewingSubmission: GetFeaturedSubmission | null;
  setViewingSubmission: (submission: GetFeaturedSubmission | null) => void;

  // Operations
  fetchSubmissions: () => Promise<void>;
  isSavingSubmission: boolean;
  isDeletingSubmission: boolean;

  // Handlers
  handleViewSubmission: (row: any) => Promise<void>;
  handleDeleteSubmission: (row: any) => Promise<void>;
  handleUpdateStatus: (id: string, reviewed: boolean, status?: string) => Promise<void>;

  // Filters
  statusFilter: SubmissionStatusFilter;
  setStatusFilter: (filter: SubmissionStatusFilter) => void;
  formTypeFilter: FormTypeFilter;
  setFormTypeFilter: (filter: FormTypeFilter) => void;
  submissionSearchQuery: string;
  setSubmissionSearchQuery: (query: string) => void;

  // Stats
  submissionStats: {
    total: number;
    pendingReview: number;
    approved: number;
    rejected: number;
  };
}

// =============================================================================
// HOOK
// =============================================================================

export function useGetFeaturedTab(): UseGetFeaturedTabReturn {
  // Filters
  const [statusFilter, setStatusFilter] = useState<SubmissionStatusFilter>('all');
  const [formTypeFilter, setFormTypeFilter] = useState<FormTypeFilter>('all');
  const [submissionSearchQuery, setSubmissionSearchQuery] = useState('');

  // Modal state
  const [viewingSubmission, setViewingSubmission] = useState<GetFeaturedSubmission | null>(null);

  // Redux hook with caching - auto-fetches only if cache is empty
  const {
    getFeatured,
    fetchSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    deleteSubmission,
  } = useGetFeaturedSubmissionsRedux();

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const filteredSubmissions = useMemo((): GetFeaturedSubmissionDisplay[] => {
    let filtered = [...getFeatured.data];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Filter by form type
    if (formTypeFilter !== 'all') {
      filtered = filtered.filter(sub => sub.formType === formTypeFilter);
    }

    // Filter by search query
    if (submissionSearchQuery.trim()) {
      const query = submissionSearchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.fullName?.toLowerCase().includes(query) ||
        sub.email?.toLowerCase().includes(query) ||
        sub.businessName?.toLowerCase().includes(query)
      );
    }

    // Map to display format
    return filtered.map(sub => ({
      id: sub.id,
      fullName: sub.fullName || 'Unknown',
      email: sub.email || '',
      formType: sub.formType || 'profile-only',
      formTypeLabel: getFormTypeLabel(sub.formType),
      status: sub.status || 'pending_review',
      statusLabel: getStatusLabel(sub.status),
      reviewed: sub.reviewed || false,
      submittedAt: sub.submittedAt || '',
      submittedAtFormatted: formatDate(sub.submittedAt)
    }));
  }, [getFeatured.data, statusFilter, formTypeFilter, submissionSearchQuery]);

  const submissionStats = useMemo(() => {
    const submissions = getFeatured.data;
    return {
      total: submissions.length,
      pendingReview: submissions.filter(s => s.status === 'pending_review').length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length
    };
  }, [getFeatured.data]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleViewSubmission = useCallback(async (row: any) => {
    const fullSubmission = await getSubmissionById(row.id);
    if (fullSubmission) {
      setViewingSubmission(fullSubmission);
    }
  }, [getSubmissionById]);

  const handleDeleteSubmission = useCallback(async (row: any) => {
    if (!confirm(`Delete submission from "${row.fullName}"? This cannot be undone.`)) {
      return;
    }
    await deleteSubmission(row.id);
  }, [deleteSubmission]);

  const handleUpdateStatus = useCallback(async (id: string, reviewed: boolean, status?: string) => {
    await updateSubmissionStatus(id, reviewed, status);
    if (viewingSubmission?.id === id) {
      setViewingSubmission(prev => prev ? { ...prev, status: (status || prev.status) as 'pending_review' | 'approved' | 'rejected' } : null);
    }
  }, [updateSubmissionStatus, viewingSubmission?.id]);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // Submissions
    submissions: getFeatured.data,
    filteredSubmissions,
    isLoadingSubmissions: getFeatured.isLoading,
    submissionsError: getFeatured.error,
    lastUpdated: getFeatured.lastUpdated,

    // Modal state
    viewingSubmission,
    setViewingSubmission,

    // Operations
    fetchSubmissions,
    isSavingSubmission: getFeatured.isSaving,
    isDeletingSubmission: getFeatured.isDeleting,

    // Handlers
    handleViewSubmission,
    handleDeleteSubmission,
    handleUpdateStatus,

    // Filters
    statusFilter,
    setStatusFilter,
    formTypeFilter,
    setFormTypeFilter,
    submissionSearchQuery,
    setSubmissionSearchQuery,

    // Stats
    submissionStats
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getFormTypeLabel(formType: string | undefined): string {
  const labels: Record<string, string> = {
    'cover': 'Cover Feature',
    'local-spotlight': 'Local Spotlight',
    'rising-star': 'Rising Star',
    'top-treatment': 'Top Treatment',
    'profile-only': 'Profile Only'
  };
  return labels[formType || ''] || formType || 'Unknown';
}

function getStatusLabel(status: string | undefined): string {
  const labels: Record<string, string> = {
    'pending_review': 'Pending Review',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  return labels[status || ''] || status || 'Unknown';
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);

    // Get date parts
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    // Get day suffix (st, nd, rd, th)
    const daySuffix = (day: number): string => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    // Get time parts
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${month} ${day}${daySuffix(day)}, ${year} ${time}`;
  } catch {
    return dateString;
  }
}

export default useGetFeaturedTab;
