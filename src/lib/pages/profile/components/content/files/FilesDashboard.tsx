/**
 * FilesDashboard Component
 *
 * Main files management dashboard with table, filters, and upload
 */

'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/features/auth/useAuth';
import { useFiles } from '@/lib/features/crm/content/hooks';
import { FilesTable } from './FilesTable';
import { FilesFilters } from './FilesFilters';
import { FileUploadZone } from './FileUploadZone';
import { CreateViewModal } from './CreateViewModal';

export function FilesDashboard() {
  const { user } = useAuth();
  const brandId = (user as any)?.brandId || '';

  const [showUploadZone, setShowUploadZone] = useState(false);
  const [showCreateView, setShowCreateView] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    files,
    loading,
    totalCount,
    page,
    pageSize,
    filter,
    sort,
    setFilter,
    setSort,
    setPage,
    uploadFiles,
    deleteFiles,
  } = useFiles({ brandId });

  const handleUpload = async (filesToUpload: File[]) => {
    try {
      await uploadFiles(filesToUpload);
      setShowUploadZone(false);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    if (confirm(`Delete ${selectedFiles.length} file(s)?`)) {
      await deleteFiles(selectedFiles);
      setSelectedFiles([]);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to manage files</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
            />
          </svg>
          Files
        </h1>

        <div className="flex items-center space-x-3">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Delete ({selectedFiles.length})
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center"
            >
              Upload files
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(Array.from(e.target.files))}
            />
          </div>
        </div>
      </div>

      {/* Views and Filters */}
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg font-medium">All</button>
        <button
          onClick={() => setShowCreateView(true)}
          className="p-1.5 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Filters Row */}
      <FilesFilters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
        onSaveView={() => setShowCreateView(true)}
      />

      {/* Files Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <FilesTable
          files={files}
          loading={loading}
          selectedFiles={selectedFiles}
          onSelectionChange={setSelectedFiles}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Pagination */}
        {totalCount > pageSize && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= totalCount}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && files.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload images, videos, and documents to use across your store
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Upload files
          </button>
        </div>
      )}

      {/* Upload Drop Zone Modal */}
      {showUploadZone && (
        <FileUploadZone onUpload={handleUpload} onClose={() => setShowUploadZone(false)} />
      )}

      {/* Create View Modal */}
      {showCreateView && (
        <CreateViewModal
          onClose={() => setShowCreateView(false)}
          onSave={(name) => {
            // Save view logic
            setShowCreateView(false);
          }}
        />
      )}
    </div>
  );
}

export default FilesDashboard;
