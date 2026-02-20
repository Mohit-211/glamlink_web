'use client';

/**
 * FormSubmissionsTab - Unified admin tab for all form submissions
 *
 * Three tab types:
 * 1. Get Featured - Get Featured form submissions
 * 2. Professional - Digital card application submissions with conversion to professionals
 * 3. Form Configurations - Unified form configuration management (Get Featured + Digital Card forms)
 */

import React, { useMemo } from 'react';
import { useFormSubmissionsTab } from './useFormSubmissionsTab';
import { useGetFeaturedTab } from './get-featured/useGetFeaturedTab';
import { TableHeader, SimpleTable } from '@/lib/pages/admin/components/shared/table';
import { DisplayFilters, TabsNavigation, TabItem } from '../shared/common';
import { professionalSubmissionsDisplayConfig } from '@/lib/pages/admin/config/displayTables';
import ProfessionalSubmissionModal from './professionals/ProfessionalSubmissionModal';
import {
  PROFESSIONAL_SEARCH_PLACEHOLDER,
  PROFESSIONAL_ACCENT_COLOR,
  getProfessionalSelectFilters,
  getProfessionalCheckboxFilters,
  getProfessionalStatBadges
} from './professionals/types';
import GetFeaturedTab from './get-featured/GetFeaturedTab';
import { FormConfigurationsTab } from './form-configurations';
import type { SubmissionType } from './types';
import { SUBMISSION_TYPE_LABELS } from './types';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FormSubmissionsTab() {
  // =============================================================================
  // HOOK DATA
  // =============================================================================

  const {
    // Submission type
    submissionType,
    setSubmissionType,

    // Digital Card Submissions
    filteredDigitalCardSubmissions,
    isLoadingDigitalCard,
    digitalCardError,
    digitalCardLastUpdated,

    // Modal state
    viewingSubmission,
    setViewingSubmission,

    // Operations
    fetchDigitalCardSubmissions,
    isSaving,
    isConverting,

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
  } = useFormSubmissionsTab();

  // Get Featured stats for tab badge
  const { submissionStats: getFeaturedStats } = useGetFeaturedTab();

  // =============================================================================
  // TABS CONFIGURATION
  // =============================================================================

  const tabs: TabItem<SubmissionType>[] = useMemo(() => [
    { id: 'get-featured', label: SUBMISSION_TYPE_LABELS['get-featured'], count: getFeaturedStats.pendingReview || undefined },
    { id: 'professional', label: SUBMISSION_TYPE_LABELS['professional'], count: digitalCardStats.pendingReview || undefined },
    { id: 'form-configs', label: SUBMISSION_TYPE_LABELS['form-configs'], count: undefined }
  ], [getFeaturedStats.pendingReview, digitalCardStats.pendingReview]);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage form submissions and configurations
        </p>
      </div>

      {/* Submission Type Tabs */}
      <TabsNavigation
        tabs={tabs}
        activeTab={submissionType}
        onTabChange={setSubmissionType}
        ariaLabel="Submission Types"
        variant="indigo"
        className="mb-6"
      />

      {/* Get Featured Tab */}
      {submissionType === 'get-featured' && (
        <GetFeaturedTab />
      )}

      {/* Professional Submissions View */}
      {submissionType === 'professional' && (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <TableHeader
            title="Professional Submissions"
            onRefresh={fetchDigitalCardSubmissions}
            isRefreshing={isLoadingDigitalCard}
            lastUpdated={digitalCardLastUpdated}
          />

          {/* Error Display */}
          {digitalCardError && (
            <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{digitalCardError}</p>
            </div>
          )}

          {/* Filters */}
          <DisplayFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={PROFESSIONAL_SEARCH_PLACEHOLDER}
            accentColor={PROFESSIONAL_ACCENT_COLOR}
            selectFilters={getProfessionalSelectFilters(statusFilter, setStatusFilter)}
            checkboxFilters={getProfessionalCheckboxFilters(showHidden, setShowHidden, digitalCardStats.hidden)}
            statBadges={getProfessionalStatBadges(digitalCardStats)}
          />

          {/* Table */}
          <SimpleTable
            data={filteredDigitalCardSubmissions}
            config={professionalSubmissionsDisplayConfig}
            isLoading={isLoadingDigitalCard}
            onView={handleViewSubmission}
            onDelete={handleDeleteSubmission}
            onAddProfessional={handleAddProfessional}
          />
        </div>
      )}

      {/* Form Configurations Tab */}
      {submissionType === 'form-configs' && (
        <FormConfigurationsTab />
      )}

      {/* Professional Submission Modal */}
      <ProfessionalSubmissionModal
        isOpen={!!viewingSubmission}
        onClose={() => setViewingSubmission(null)}
        submission={viewingSubmission}
        onUpdateStatus={handleUpdateStatus}
        onAddProfessional={handleAddProfessionalFromModal}
        isSaving={isSaving}
        isConverting={isConverting}
      />
    </div>
  );
}
