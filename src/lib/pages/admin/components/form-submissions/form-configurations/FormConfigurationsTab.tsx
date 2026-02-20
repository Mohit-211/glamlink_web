'use client';

/**
 * FormConfigurationsTab - Unified form configuration management
 *
 * Manages all form types: Get Featured forms + Digital Card forms
 * Displays grid of all configs with category filtering.
 */

import React from 'react';
import { useFormConfigurationsTab } from './useFormConfigurationsTab';
import { TableHeader, SimpleTable } from '@/lib/pages/admin/components/shared/table';
import { DisplayFilters } from '@/lib/pages/admin/components/shared/common';
import { unifiedFormConfigsDisplayConfig } from '@/lib/pages/admin/config/displayTables';
import {
  SEARCH_PLACEHOLDER,
  ACCENT_COLOR,
  getSelectFilters,
  getCheckboxFilters,
  getStatBadges
} from './types';
import { FormConfigModal } from './edit';
import BatchUploadModal from '@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal';
import { digitalCardFormConfig } from './data';
import type { UnifiedFormConfig } from './types';

// Sample configs for batch upload
const sampleConfigs: UnifiedFormConfig[] = [digitalCardFormConfig];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FormConfigurationsTab() {
  const {
    // Data
    allConfigs,
    filteredConfigs,

    // State
    isLoading,
    error,
    isSaving,
    isMigrating,
    lastUpdated,

    // Modal state
    showModal,
    setShowModal,
    editingConfig,
    setEditingConfig,
    showBatchUpload,
    setShowBatchUpload,

    // Filters
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    showDisabled,
    setShowDisabled,

    // Stats
    stats,

    // Handlers
    handleRefresh,
    handleAdd,
    handleEdit,
    handleDelete,
    handleToggleEnabled,
    handleSave,
    handleBatchUpload,
    handleMigrateGetFeatured,
    handleMigrateDigitalCard
  } = useFormConfigurationsTab();

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <TableHeader
          title="Form Configurations"
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
          lastUpdated={lastUpdated}
          onBatchUpload={() => setShowBatchUpload(true)}
          batchUploadText="Upload Batch"
          onAdd={handleAdd}
          addButtonText="Add Form"
        />

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Migration Buttons (show when empty or for convenience) */}
        {allConfigs.length === 0 && !isLoading && (
          <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 mb-3">
              No form configurations found. You can migrate from static files:
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleMigrateGetFeatured}
                disabled={isMigrating}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {isMigrating ? 'Migrating...' : 'Migrate Get Featured Forms'}
              </button>
              <button
                onClick={handleMigrateDigitalCard}
                disabled={isMigrating}
                className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 disabled:opacity-50"
              >
                {isMigrating ? 'Migrating...' : 'Migrate Digital Card Form'}
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <DisplayFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={SEARCH_PLACEHOLDER}
          accentColor={ACCENT_COLOR}
          selectFilters={getSelectFilters(categoryFilter, setCategoryFilter)}
          checkboxFilters={getCheckboxFilters(showDisabled, setShowDisabled)}
          statBadges={getStatBadges(stats)}
        />

        {/* Grid */}
        <SimpleTable
          data={filteredConfigs}
          config={unifiedFormConfigsDisplayConfig}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleEnabled={handleToggleEnabled}
        />
      </div>

      {/* Form Config Modal */}
      <FormConfigModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingConfig(null);
        }}
        // @ts-expect-error - UnifiedFormConfig includes DigitalCardFormConfig
        initialData={editingConfig}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Batch Upload Modal */}
      <BatchUploadModal
        isOpen={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        title="Manage Form Configurations Batch"
        itemTypeName="Form Configs"
        sampleData={sampleConfigs}
        onUpload={handleBatchUpload}
        maxFileSize={5}
        currentData={allConfigs}
      />
    </div>
  );
}
