"use client";

import { useEffect } from 'react';
import SimpleTable from '@/lib/pages/admin/components/shared/table/SimpleTable';
import TableHeader from '@/lib/pages/admin/components/shared/table/TableHeader';
import { sectionsDisplayConfig } from '@/lib/pages/admin/config/displayTables';
import BatchModal from '@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal';
import WebSectionEditor from './web/WebSectionEditor';
import { useMagazineSections } from './useMagazineSections';
import { useAuth } from '@/lib/features/auth/useAuth';

interface MagazineSectionsProps {
  issueId: string;
  issueTitle: string;
  issue?: any;
  onBack: () => void;
}

export default function MagazineSections({ issueId, issueTitle, onBack }: MagazineSectionsProps) {
  // Get current user for lock management
  const { user } = useAuth();

  // Use the custom hook for all logic
  const {
    sections,
    lastUpdated,
    isLoading,
    error,
    fetchSections,
    editingSection,
    isAddingSection,
    showBatchUpload,
    loadingSectionId,
    handleEdit,
    handleDelete,
    handleAddSection,
    handleBatchUpload,
    handleBackFromWebEditor,
    handleBackFromAddSection,
    handleSaveNewSection,
    handleSaveExistingSection,
    setShowBatchUpload,
    fromSectionDocument,
  } = useMagazineSections({ issueId, issueTitle });

  // Render Web Section Editor when adding a new section
  if (isAddingSection) {
    return (
      <WebSectionEditor
        section={null}
        issueId={issueId}
        issueTitle={issueTitle}
        onBack={handleBackFromAddSection}
        onSave={handleSaveNewSection}
      />
    );
  }

  // Render Web Section Editor when editing a section
  if (editingSection) {
    // Convert document format to WebSectionData format for the editor
    const sectionAsWebData = fromSectionDocument(editingSection);
    return (
      <WebSectionEditor
        section={sectionAsWebData}
        issueId={issueId}
        issueTitle={issueTitle}
        onBack={handleBackFromWebEditor}
        onSave={handleSaveExistingSection}
      />
    );
  }

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <TableHeader
          title={`Sections: ${issueTitle}`}
          onRefresh={fetchSections}
          isRefreshing={isLoading}
          onBack={onBack}
          backButtonText="Back to Issues"
          lastUpdated={lastUpdated}
          onAdd={handleAddSection}
          addButtonText="Add Section"
          onBatchUpload={() => setShowBatchUpload(true)}
          batchUploadText="Manage Batch"
        />

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg mx-6 mt-4" role="alert">
            {error}
          </div>
        )}

        <SimpleTable
          data={sections}
          config={sectionsDisplayConfig}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          currentUserId={user?.uid || undefined}
          loadingRowId={loadingSectionId || undefined}
        />
      </div>

      {/* Batch Upload Modal */}
      <BatchModal
        isOpen={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        title="Manage Magazine Sections Batch"
        itemTypeName="Sections"
        sampleData={[]}
        onUpload={handleBatchUpload}
        maxFileSize={5}
        currentData={sections}
      />
    </div>
  );
}
