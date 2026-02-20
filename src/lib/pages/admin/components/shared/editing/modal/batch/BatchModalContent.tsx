'use client';

import React from 'react';
import { Loading, SuccessIcon, ErrorIcon, CodeIcon, ClipboardIcon } from '@/lib/pages/admin/components/shared/common';
import type { ValidationResult, UploadResult } from './useBatchModal';

export interface BatchModalContentProps {
  // State
  activeTab: 'upload' | 'editor';
  jsonInput: string;
  uploadedFile: File | null;
  validation: ValidationResult | null;
  isUploading: boolean;
  uploadResult: UploadResult | null;
  formatAsTypeScript: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  itemTypeName: string;
  maxFileSize: number;
  currentData?: any[];

  // Handlers
  setFormatAsTypeScript: (value: boolean) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleJsonInputChange: (value: string) => void;
  loadSampleData: () => void;
  loadCurrentData: () => void;
  copyToClipboard: () => Promise<void>;
}

/**
 * BatchModalContent - Renders the content area of BatchModal
 *
 * Handles:
 * - Loading state display
 * - Success state display
 * - Upload tab content
 * - Editor tab content
 * - Validation results display
 */
export function BatchModalContent({
  activeTab,
  jsonInput,
  uploadedFile,
  validation,
  isUploading,
  uploadResult,
  formatAsTypeScript,
  fileInputRef,
  itemTypeName,
  maxFileSize,
  currentData,
  setFormatAsTypeScript,
  handleFileUpload,
  handleJsonInputChange,
  loadSampleData,
  loadCurrentData,
  copyToClipboard,
}: BatchModalContentProps) {
  return (
    <div className="p-6">
      {isUploading ? (
        <Loading
          message={`Uploading ${itemTypeName.toLowerCase()}...`}
          size="lg"
          className="py-8"
          height="h-96"
        />
      ) : uploadResult?.success ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <SuccessIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Successful!</h3>
          <p className="text-sm text-gray-600">{uploadResult.message}</p>
        </div>
      ) : (
        <>
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose JSON File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-glamlink-teal file:text-white hover:file:bg-glamlink-teal-dark"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum file size: {maxFileSize}MB
                </p>
              </div>

              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    Selected: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Editor Tab */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  JSON Data
                </label>
                <div className="flex gap-2">
                  {currentData && currentData.length > 0 && (
                    <button
                      onClick={loadCurrentData}
                      className="px-3 py-1 text-xs font-medium text-white bg-glamlink-teal rounded hover:bg-glamlink-teal-dark transition-colors"
                    >
                      Load Current Data ({currentData.length})
                    </button>
                  )}
                  <button
                    onClick={loadSampleData}
                    className="px-3 py-1 text-xs font-medium text-glamlink-teal border border-glamlink-teal rounded hover:bg-glamlink-teal hover:text-white transition-colors"
                  >
                    Load Sample Data
                  </button>
                </div>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => handleJsonInputChange(e.target.value)}
                placeholder={formatAsTypeScript ? 'export const sampleData = [{"id": "item-1", "title": "Example", ...}];' : '[{"id": "item-1", "title": "Example Item", ...}]'}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                spellCheck={false}
                readOnly={formatAsTypeScript}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFormatAsTypeScript(!formatAsTypeScript)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                      formatAsTypeScript
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'text-gray-600 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <CodeIcon />
                    {formatAsTypeScript ? 'TypeScript Mode' : 'Format as .ts'}
                  </button>
                  {formatAsTypeScript && (
                    <span className="text-xs text-gray-500">
                      (Read-only - Click "Load Current Data" to generate)
                    </span>
                  )}
                </div>
                {jsonInput && (
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                  >
                    <ClipboardIcon />
                    Copy to Clipboard
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Validation Results */}
          {validation && (
            <div className={`mt-4 rounded-lg p-3 ${
              validation.isValid
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {validation.isValid ? (
                    <SuccessIcon className="text-green-400" />
                  ) : (
                    <ErrorIcon className="text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    validation.isValid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {validation.isValid
                      ? `Valid JSON: Found ${validation.itemCount} ${itemTypeName.toLowerCase()}`
                      : validation.error
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Result Error */}
          {uploadResult && !uploadResult.success && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ErrorIcon className="text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{uploadResult.message}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BatchModalContent;
