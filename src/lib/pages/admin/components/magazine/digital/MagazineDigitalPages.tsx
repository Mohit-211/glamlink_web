"use client";

import SimpleTable from '@/lib/pages/admin/components/shared/table/SimpleTable';
import TableHeader from '@/lib/pages/admin/components/shared/table/TableHeader';
import { digitalPagesDisplayConfig } from '@/lib/pages/admin/config/displayTables';
import BatchUploadModal from '@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal';
import { sampleDigitalPagesData } from '@/lib/pages/admin/config/records/digitalPages';
import DigitalPageEditor from './editor';
import PdfManager from './pdf-manager';
import { useMagazineDigitalPages } from './useMagazineDigitalPages';

interface MagazineDigitalPagesProps {
  issueId: string;
  issueTitle: string;
  onBack: () => void;
}

export default function MagazineDigitalPages({
  issueId,
  issueTitle,
  onBack
}: MagazineDigitalPagesProps) {
  const {
    pages,
    pagesWithCanvasStatus,
    lastUpdated,
    isLoading,
    error,
    showPdfManager,
    showEditor,
    editingPageIndex,
    showBatchUpload,
    setShowPdfManager,
    setShowBatchUpload,
    fetchPages,
    batchUpload,
    handleDeleteWithConfirm,
    handleEdit,
    handleMoveUp,
    handleMoveDown,
    handleCreatePDFs,
    handleBackFromEditor,
    handleEditFromPdfManager,
  } = useMagazineDigitalPages({ issueId });

  // Show PDF Manager
  if (showPdfManager) {
    return (
      <PdfManager
        issueId={issueId}
        issueTitle={issueTitle}
        pages={pages}
        onBack={() => setShowPdfManager(false)}
        onEditPage={handleEditFromPdfManager}
      />
    );
  }

  // Show Editor (create or edit)
  if (showEditor) {
    return (
      <DigitalPageEditor
        issueId={issueId}
        pages={pages}
        initialPageIndex={editingPageIndex}
        onBack={handleBackFromEditor}
      />
    );
  }

  // Main table view
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <TableHeader
          title={`Digital Pages: ${issueTitle}`}
          onRefresh={fetchPages}
          isRefreshing={isLoading}
          onBack={onBack}
          backButtonText="Back to Issues"
          onBatchUpload={() => setShowBatchUpload(true)}
          batchUploadText="Manage Batch"
          onManagePDFs={() => setShowPdfManager(true)}
          managePDFsText="Manage PDFs"
          onCreatePDFs={handleCreatePDFs}
          createPDFsText="Create PDFs"
          lastUpdated={lastUpdated}
        />

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg mx-6 mt-4" role="alert">
            {error}
          </div>
        )}

        <SimpleTable
          data={pagesWithCanvasStatus}
          config={digitalPagesDisplayConfig}
          onEdit={handleEdit}
          onDelete={handleDeleteWithConfirm}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          isLoading={isLoading}
        />

        {/* Empty state */}
        {!isLoading && pages.length === 0 && (
          <div className="text-center py-12 px-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No digital pages</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first digital page.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreatePDFs}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create First Page
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Batch Upload Modal */}
      <BatchUploadModal
        isOpen={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        title="Manage Digital Pages Batch"
        itemTypeName="Digital Pages"
        sampleData={sampleDigitalPagesData}
        onUpload={batchUpload}
        maxFileSize={5}
        currentData={pages}
      />
    </div>
  );
}
