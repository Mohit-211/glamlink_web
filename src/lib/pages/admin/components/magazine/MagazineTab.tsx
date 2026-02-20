"use client";

import { useState } from "react";
import { MagazineIssue } from "@/lib/pages/magazine/types/magazine/core";
import MagazineModal from "@/lib/pages/admin/components/magazine/MagazineModal";
import MagazineSections from "@/lib/pages/admin/components/magazine/MagazineSections";
import MagazineDigitalPages from "@/lib/pages/admin/components/magazine/digital/MagazineDigitalPages";
import { ManageIssuesModal } from "@/lib/pages/admin/components/magazine/manage-issues";
import BatchUploadModal from "@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal";
import { getDefaultMagazineValues, magazineModalTabs } from "@/lib/pages/admin/config/fields";
import SimpleTable from "@/lib/pages/admin/components/shared/table/SimpleTable";
import { magazineDisplayConfig } from "@/lib/pages/admin/config/displayTables";
import TableHeader from "@/lib/pages/admin/components/shared/table/TableHeader";
import { useMagazineTab } from './useMagazineTab';

export default function MagazineTab() {
  // Use combined hook for data, filtering, and operations
  const {
    issues,
    lastUpdated,
    isLoading,
    error,
    filteredIssues,
    inactiveCount,
    showActiveOnly,
    setShowActiveOnly,
    dateFilter,
    setDateFilter,
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    toggleFeatured,
    batchUpload
  } = useMagazineTab();

  // UI state (modals)
  const [showManageIssues, setShowManageIssues] = useState(false);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [editingIssue, setEditingIssue] = useState<MagazineIssue | null>(null);

  // View switching state - store full issue for sections view
  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null);
  // View switching state - store full issue for digital pages view
  const [digitalIssue, setDigitalIssue] = useState<MagazineIssue | null>(null);

  // Wrapper handlers for confirmations and modal closing
  const handleDeleteWithConfirm = async (issue: MagazineIssue) => {
    if (!confirm(`Are you sure you want to delete "${issue.title}"? This will also delete all sections.`)) return;
    await deleteIssue(issue.id);
  };

  const handleUpdateWithClose = async (data: Partial<MagazineIssue>) => {
    await updateIssue(data);
    setEditingIssue(null);
  };

  // Section view handlers
  const handleEditSections = (issue: MagazineIssue) => {
    setSelectedIssue(issue);
  };

  const handleBackToIssues = () => {
    setSelectedIssue(null);
  };

  // Digital pages view handlers
  const handleDigitalView = (issue: MagazineIssue) => {
    setDigitalIssue(issue);
  };

  const handleBackFromDigitalPages = () => {
    setDigitalIssue(null);
  };

  // If viewing digital pages, show MagazineDigitalPages component
  if (digitalIssue) {
    return (
      <MagazineDigitalPages
        issueId={digitalIssue.id}
        issueTitle={digitalIssue.title}
        onBack={handleBackFromDigitalPages}
      />
    );
  }

  // If viewing sections, show MagazineSections component
  if (selectedIssue) {
    return (
      <MagazineSections
        issueId={selectedIssue.id}
        issueTitle={selectedIssue.title}
        issue={selectedIssue}
        onBack={handleBackToIssues}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <TableHeader
          title="Magazine Issues"
          onRefresh={fetchIssues}
          isRefreshing={isLoading}
          onBatchUpload={() => setShowBatchUpload(true)}
          batchUploadText="Batch"
          onAdd={() => setShowManageIssues(true)}
          addButtonText="Manage Issues"
          lastUpdated={lastUpdated}
          showActiveOnly={showActiveOnly}
          onToggleActiveFilter={setShowActiveOnly}
          activeFilterLabel="Active Only"
          inactiveCount={inactiveCount}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          dateFilterLabel="Issue Date"
        />

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <SimpleTable
          data={filteredIssues}
          config={magazineDisplayConfig}
          onEdit={(issue) => setEditingIssue(issue)}
          onDelete={handleDeleteWithConfirm}
          onToggleFeatured={toggleFeatured}
          onEditSections={handleEditSections}
          onDigitalView={handleDigitalView}
          isLoading={isLoading}
        />
      </div>

      {/* Edit Issue Modal (Quick edit from table) */}
      <MagazineModal
        isOpen={!!editingIssue}
        onClose={() => setEditingIssue(null)}
        onSave={handleUpdateWithClose}
        title="Edit Magazine Issue"
        initialData={editingIssue || getDefaultMagazineValues()}
        customTabs={magazineModalTabs}
      />

      {/* Manage Issues Modal (Create/Update/Download with sections & digital pages) */}
      <ManageIssuesModal
        isOpen={showManageIssues}
        onClose={() => setShowManageIssues(false)}
        issues={issues}
        onIssueCreated={fetchIssues}
        onIssueUpdated={fetchIssues}
      />

      {/* Batch Upload Modal (Bulk JSON upload) */}
      <BatchUploadModal
        isOpen={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        title="Batch Upload Magazine Issues"
        itemTypeName="Magazine Issues"
        sampleData={[]}
        onUpload={batchUpload}
        maxFileSize={5}
        currentData={issues}
      />
    </div>
  );
}
