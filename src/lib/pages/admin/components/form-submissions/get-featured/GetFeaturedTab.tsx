'use client';

/**
 * GetFeaturedTab - Admin tab for Get Featured submissions management
 *
 * Simplified to only show submissions - form configurations are now managed
 * in the unified Form Configurations tab (FormConfigurationsTab).
 */

import React from 'react';
import { useGetFeaturedTab } from './useGetFeaturedTab';
import { TableHeader, SimpleTable } from '@/lib/pages/admin/components/shared/table';
import { DisplayFilters } from '@/lib/pages/admin/components/shared/common';
import { submissionsDisplayConfig } from '@/lib/pages/admin/config/displayTables';
import { SubmissionViewModal } from './view';
import {
  SUBMISSIONS_SEARCH_PLACEHOLDER,
  SUBMISSIONS_ACCENT_COLOR,
  getSubmissionsSelectFilters,
  getSubmissionsStatBadges
} from './types';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function GetFeaturedTab() {
  // Hook for all data, state, and operations
  const {
    // Submissions
    filteredSubmissions,
    isLoadingSubmissions,
    submissionsError,
    lastUpdated,
    fetchSubmissions,
    isSavingSubmission,

    // Modal state
    viewingSubmission,
    setViewingSubmission,

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
  } = useGetFeaturedTab();

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <TableHeader
          title="Get Featured Submissions"
          onRefresh={fetchSubmissions}
          isRefreshing={isLoadingSubmissions}
          lastUpdated={lastUpdated}
        />

        {/* Error Display */}
        {submissionsError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submissionsError}</p>
          </div>
        )}

        {/* Filters */}
        <DisplayFilters
          searchQuery={submissionSearchQuery}
          onSearchChange={setSubmissionSearchQuery}
          searchPlaceholder={SUBMISSIONS_SEARCH_PLACEHOLDER}
          accentColor={SUBMISSIONS_ACCENT_COLOR}
          // @ts-expect-error - Filter type mismatch between SubmissionStatusFilter and string
          selectFilters={getSubmissionsSelectFilters(statusFilter, setStatusFilter, formTypeFilter, setFormTypeFilter)}
          statBadges={getSubmissionsStatBadges(submissionStats)}
        />

        {/* Table */}
        <SimpleTable
          data={filteredSubmissions}
          config={submissionsDisplayConfig}
          isLoading={isLoadingSubmissions}
          onView={handleViewSubmission}
          onDelete={handleDeleteSubmission}
        />
      </div>

      {/* Submission View Modal */}
      <SubmissionViewModal
        isOpen={!!viewingSubmission}
        onClose={() => setViewingSubmission(null)}
        submission={viewingSubmission}
        onUpdateStatus={handleUpdateStatus}
        isSaving={isSavingSubmission}
      />
    </div>
  );
}
