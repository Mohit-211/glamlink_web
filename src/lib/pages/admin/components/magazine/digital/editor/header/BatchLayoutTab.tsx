'use client';

/**
 * BatchLayoutTab Component
 *
 * Inline batch upload UI for layout templates (no modal wrapper).
 * Allows users to upload, export, and replace all layouts for an issue.
 * Includes "Load Current Data" button to export existing layouts.
 */

import { useState, useEffect } from 'react';
import { useBatchModal } from '@/lib/pages/admin/components/shared/editing/modal/batch/useBatchModal';
import { BatchModalContent } from '@/lib/pages/admin/components/shared/editing/modal/batch/BatchModalContent';
import { WarningIcon } from '@/lib/pages/admin/components/shared/common';
import type { DigitalLayout } from '@/lib/pages/admin/types/digitalLayouts';

// =============================================================================
// TYPES
// =============================================================================

interface BatchLayoutTabProps {
  issueId: string;
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function BatchLayoutTab({
  issueId,
  onClose
}: BatchLayoutTabProps) {
  const [currentLayouts, setCurrentLayouts] = useState<DigitalLayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current layouts on mount
  useEffect(() => {
    fetchLayouts();
  }, [issueId]);

  const fetchLayouts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/digital-layouts?issueId=${issueId}`, {
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setCurrentLayouts(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch layouts:', err);
      setCurrentLayouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchUpload = async (layouts: any[]) => {
    const response = await fetch('/api/digital-layouts/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ layouts })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload layouts');
    }

    // Refresh layouts after upload
    await fetchLayouts();
  };

  // Sample data for the "Load Example" button
  const sampleData = [
    {
      id: 'example-layout-1',
      issueId,
      layoutName: 'Example Hero Layout',
      layoutDescription: 'Hero article with large image',
      layoutCategory: 'Articles',
      previewImage: '',
      layoutData: {
        pageType: 'article-start-hero',
        pdfSettings: {
          ratio: 'a4-portrait',
          backgroundColor: '#ffffff',
          margin: 10
        },
        pageData: {
          id: 'example-1',
          type: 'article-start-hero',
          title: 'Example Article',
          articleContent: '<p>Article content here...</p>'
        }
      }
    }
  ];

  // Use batch modal hook for state management
  const batchModal = useBatchModal({
    itemTypeName: 'Layout Templates',
    sampleData,
    currentData: currentLayouts,
    maxFileSize: 10,
    onUpload: handleBatchUpload,
    onClose: () => {} // We don't use the close handler since we're inline
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <WarningIcon className="text-amber-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> This will <strong>replace all existing layout templates</strong> with the uploaded data. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => batchModal.setActiveTab('upload')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              batchModal.activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            File Upload
          </button>
          <button
            onClick={() => batchModal.setActiveTab('editor')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              batchModal.activeTab === 'editor'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            JSON Editor
          </button>
        </div>
      </div>

      {/* Content */}
      <BatchModalContent
        activeTab={batchModal.activeTab}
        jsonInput={batchModal.jsonInput}
        uploadedFile={batchModal.uploadedFile}
        validation={batchModal.validation}
        isUploading={batchModal.isUploading}
        uploadResult={batchModal.uploadResult}
        formatAsTypeScript={batchModal.formatAsTypeScript}
        fileInputRef={batchModal.fileInputRef}
        itemTypeName="Layout Templates"
        maxFileSize={10}
        currentData={currentLayouts}
        setFormatAsTypeScript={batchModal.setFormatAsTypeScript}
        handleFileUpload={batchModal.handleFileUpload}
        handleJsonInputChange={batchModal.handleJsonInputChange}
        loadSampleData={batchModal.loadSampleData}
        loadCurrentData={batchModal.loadCurrentData}
        copyToClipboard={batchModal.copyToClipboard}
      />

      {/* Footer */}
      {!batchModal.isUploading && !batchModal.uploadResult?.success && (
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={batchModal.handleUpload}
            disabled={!batchModal.validation?.isValid}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              batchModal.validation?.isValid
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Replace All Layout Templates
            {batchModal.validation?.itemCount && ` (${batchModal.validation.itemCount} items)`}
          </button>
        </div>
      )}
    </div>
  );
}
