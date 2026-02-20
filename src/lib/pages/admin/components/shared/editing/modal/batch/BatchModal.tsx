"use client";

import { Dialog } from "@headlessui/react";
import { WarningIcon } from '@/lib/pages/admin/components/shared/common';
import { useBatchModal } from './useBatchModal';
import { BatchModalContent } from './BatchModalContent';

export interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemTypeName: string; // e.g., "Promos", "Professionals"
  sampleData?: any[]; // Sample data to show as example (optional)
  onUpload: (data: any[]) => Promise<void>;
  maxFileSize?: number; // in MB, default 5
  currentData?: any[]; // Current data to allow loading for reference/export
}

export default function BatchModal({
  isOpen,
  onClose,
  title,
  itemTypeName,
  sampleData,
  onUpload,
  maxFileSize = 5,
  currentData
}: BatchModalProps) {
  const {
    activeTab,
    jsonInput,
    uploadedFile,
    validation,
    isUploading,
    uploadResult,
    formatAsTypeScript,
    fileInputRef,
    setActiveTab,
    setFormatAsTypeScript,
    handleFileUpload,
    handleJsonInputChange,
    loadSampleData,
    loadCurrentData,
    copyToClipboard,
    handleUpload,
    handleClose,
  } = useBatchModal({
    itemTypeName,
    sampleData,
    currentData,
    maxFileSize,
    onUpload,
    onClose,
  });

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-xl">
            {/* Header */}
            <div className="bg-glamlink-teal text-white px-6 py-4 rounded-t-xl">
              <Dialog.Title className="text-xl font-semibold">
                {title}
              </Dialog.Title>
              <p className="text-white mt-1">
                {currentData && currentData.length > 0
                  ? `View, export, or replace ${itemTypeName.toLowerCase()} data`
                  : `Upload multiple ${itemTypeName.toLowerCase()} at once to replace the entire list`
                }
              </p>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 px-4 py-3 m-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <WarningIcon className="text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> This will <strong>replace all existing {itemTypeName.toLowerCase()}</strong> with the uploaded data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'upload'
                      ? 'border-glamlink-teal text-glamlink-teal'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'editor'
                      ? 'border-glamlink-teal text-glamlink-teal'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  JSON Editor
                </button>
              </div>
            </div>

            {/* Content */}
            <BatchModalContent
              activeTab={activeTab}
              jsonInput={jsonInput}
              uploadedFile={uploadedFile}
              validation={validation}
              isUploading={isUploading}
              uploadResult={uploadResult}
              formatAsTypeScript={formatAsTypeScript}
              fileInputRef={fileInputRef}
              itemTypeName={itemTypeName}
              maxFileSize={maxFileSize}
              currentData={currentData}
              setFormatAsTypeScript={setFormatAsTypeScript}
              handleFileUpload={handleFileUpload}
              handleJsonInputChange={handleJsonInputChange}
              loadSampleData={loadSampleData}
              loadCurrentData={loadCurrentData}
              copyToClipboard={copyToClipboard}
            />

            {/* Footer */}
            {!isUploading && !uploadResult?.success && (
              <div className="bg-gray-50 px-6 py-3 rounded-b-xl border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!validation?.isValid}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glamlink-teal disabled:opacity-50 disabled:cursor-not-allowed ${
                      validation?.isValid
                        ? 'bg-glamlink-teal hover:bg-glamlink-teal-dark'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Replace All {itemTypeName}
                    {validation?.itemCount && ` (${validation.itemCount} items)`}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
