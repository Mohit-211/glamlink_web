'use client';

/**
 * useFormSubmissionsTab - Combined hook for Form Submissions admin tab
 *
 * Manages submission type switching, filters, handlers, and effects for both
 * Get Featured and Professional submissions.
 *
 * Uses Redux for caching - data is fetched only once and cached in Redux state.
 * Switching tabs does NOT trigger new DB calls unless manually refreshed.
 */

import { useState, useMemo, useCallback } from 'react';
import { useDigitalCardSubmissionsRedux } from './professionals/useDigitalCardSubmissionsRedux';
import type {
  DigitalCardSubmission,
  DigitalCardSubmissionDisplay,
  SubmissionType,
  SubmissionStatusFilter
} from './types';
import { transformToDisplay } from './types';

// =============================================================================
// TYPES
// =============================================================================

export interface UseFormSubmissionsTabReturn {
  // Submission type
  submissionType: SubmissionType;
  setSubmissionType: (type: SubmissionType) => void;

  // Digital Card Submissions
  digitalCardSubmissions: DigitalCardSubmission[];
  filteredDigitalCardSubmissions: DigitalCardSubmissionDisplay[];
  isLoadingDigitalCard: boolean;
  digitalCardError: string | null;
  digitalCardLastUpdated: number | null;

  // Modal state
  viewingSubmission: DigitalCardSubmission | null;
  setViewingSubmission: (submission: DigitalCardSubmission | null) => void;

  // Operations
  fetchDigitalCardSubmissions: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
  isConverting: boolean;

  // Handlers - Professional Submissions
  handleViewSubmission: (row: DigitalCardSubmissionDisplay) => Promise<void>;
  handleDeleteSubmission: (row: DigitalCardSubmissionDisplay) => Promise<void>;
  handleUpdateStatus: (id: string, reviewed: boolean, status?: string, hidden?: boolean) => Promise<void>;
  handleAddProfessional: (row: DigitalCardSubmissionDisplay) => Promise<void>;
  handleAddProfessionalFromModal: (submission: DigitalCardSubmission) => Promise<void>;

  // Filters
  statusFilter: SubmissionStatusFilter;
  setStatusFilter: (filter: SubmissionStatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showHidden: boolean;
  setShowHidden: (show: boolean) => void;

  // Stats
  digitalCardStats: {
    total: number;
    visible: number;
    hidden: number;
    pendingReview: number;
    approved: number;
    rejected: number;
  };
}

// =============================================================================
// HOOK
// =============================================================================

export function useFormSubmissionsTab(): UseFormSubmissionsTabReturn {
  // Submission type state
  const [submissionType, setSubmissionType] = useState<SubmissionType>('get-featured');

  // Filters
  const [statusFilter, setStatusFilter] = useState<SubmissionStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  // Modal state
  const [viewingSubmission, setViewingSubmission] = useState<DigitalCardSubmission | null>(null);

  // Redux hook with caching - auto-fetches only if cache is empty
  const {
    digitalCard,
    fetchSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    deleteSubmission,
    convertToProfessional,
  } = useDigitalCardSubmissionsRedux();

  // NOTE: No useEffect needed for tab switching - Redux hook auto-fetches
  // if cache is empty, and data persists when switching tabs

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const filteredDigitalCardSubmissions = useMemo((): DigitalCardSubmissionDisplay[] => {
    let filtered = [...digitalCard.data];

    // Filter by hidden status
    if (!showHidden) {
      filtered = filtered.filter(sub => !(sub.hidden ?? false));
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.name?.toLowerCase().includes(query) ||
        sub.email?.toLowerCase().includes(query) ||
        sub.businessName?.toLowerCase().includes(query) ||
        sub.specialty?.toLowerCase().includes(query)
      );
    }

    // Transform to display format
    return filtered.map(transformToDisplay);
  }, [digitalCard.data, statusFilter, searchQuery, showHidden]);

  const digitalCardStats = useMemo(() => {
    const submissions = digitalCard.data;
    return {
      total: submissions.length,
      visible: submissions.filter(s => !(s.hidden ?? false)).length,
      hidden: submissions.filter(s => s.hidden ?? false).length,
      pendingReview: submissions.filter(s => s.status === 'pending_review' && !(s.hidden ?? false)).length,
      approved: submissions.filter(s => s.status === 'approved' && !(s.hidden ?? false)).length,
      rejected: submissions.filter(s => s.status === 'rejected' && !(s.hidden ?? false)).length
    };
  }, [digitalCard.data]);

  // =============================================================================
  // HANDLERS - PROFESSIONAL SUBMISSIONS
  // =============================================================================

  const handleViewSubmission = useCallback(async (row: DigitalCardSubmissionDisplay) => {
    const fullSubmission = await getSubmissionById(row.id);
    if (fullSubmission) {
      setViewingSubmission(fullSubmission);
    }
  }, [getSubmissionById]);

  const handleDeleteSubmission = useCallback(async (row: DigitalCardSubmissionDisplay) => {
    if (!confirm(`Delete submission from "${row.name}"? This cannot be undone.`)) {
      return;
    }
    await deleteSubmission(row.id);
  }, [deleteSubmission]);

  const handleUpdateStatus = useCallback(async (id: string, reviewed: boolean, status?: string, hidden?: boolean) => {
    await updateSubmissionStatus(id, reviewed, status, hidden);
    // Update the viewing submission state if the modal is open
    if (viewingSubmission?.id === id) {
      setViewingSubmission(prev => prev ? {
        ...prev,
        status: (status || prev.status) as 'pending_review' | 'approved' | 'rejected',
        reviewed: reviewed
      } : null);
    }
  }, [updateSubmissionStatus, viewingSubmission?.id]);

  const handleAddProfessional = useCallback(async (row: DigitalCardSubmissionDisplay) => {
    const result = await convertToProfessional(row.id);
    if (result.success) {
      alert('Professional added successfully!');
      // Note: Redux state is automatically updated by the thunk
    } else {
      alert(`Failed to add professional: ${result.error}`);
    }
  }, [convertToProfessional]);

  const handleAddProfessionalFromModal = useCallback(async (submission: DigitalCardSubmission) => {
    const result = await convertToProfessional(submission.id);
    if (result.success) {
      alert('Professional added successfully!');
      // Close modal - Redux state is automatically updated
      setViewingSubmission(null);
    } else {
      alert(`Failed to add professional: ${result.error}`);
    }
  }, [convertToProfessional]);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // Submission type
    submissionType,
    setSubmissionType,

    // Digital Card Submissions
    digitalCardSubmissions: digitalCard.data,
    filteredDigitalCardSubmissions,
    isLoadingDigitalCard: digitalCard.isLoading,
    digitalCardError: digitalCard.error,
    digitalCardLastUpdated: digitalCard.lastUpdated,

    // Modal state
    viewingSubmission,
    setViewingSubmission,

    // Operations
    fetchDigitalCardSubmissions: fetchSubmissions,
    isSaving: digitalCard.isSaving,
    isDeleting: digitalCard.isDeleting,
    isConverting: digitalCard.isConverting,

    // Handlers - Professional Submissions
    handleViewSubmission,
    handleDeleteSubmission,
    handleUpdateStatus,
    handleAddProfessional,
    handleAddProfessionalFromModal,

    // Filters
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    showHidden,
    setShowHidden,

    // Stats
    digitalCardStats
  };
}

export default useFormSubmissionsTab;
