/**
 * FileUploadZone Component
 *
 * Drag and drop file upload zone modal
 */

'use client';

import { useState, useCallback } from 'react';

interface FileUploadZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  onClose: () => void;
}

export function FileUploadZone({ onUpload, onClose }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      setUploading(true);
      setProgress(0);

      try {
        await onUpload(files);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      await onUpload(files);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upload files</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600 mx-auto" />
              <p className="text-sm text-gray-500">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 mb-2">Drag and drop files here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label className="inline-block px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 cursor-pointer">
                Browse files
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-xs text-gray-400 mt-4">
                Supports: JPG, PNG, GIF, WEBP, SVG, MP4, PDF, DOC
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploadZone;
