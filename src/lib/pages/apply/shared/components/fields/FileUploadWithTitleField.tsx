"use client";

import { useState, useCallback } from 'react';
import { BaseFieldProps } from './index';
import { SubmittedFile } from '@/lib/pages/apply/shared/types';
import storageService from '@/lib/services/firebase/storageService';

interface FileUploadWithTitleFieldProps extends BaseFieldProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  showTitle?: boolean;
}

export default function FileUploadWithTitleField({
  fieldKey,
  config,
  value,
  onChange,
  error,
  disabled,
  maxFiles = 1,
  maxSize = 100 * 1024 * 1024, // 100MB default for large files
  accept = 'image/*',
  showTitle = true
}: FileUploadWithTitleFieldProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const files = Array.isArray(value) ? value : [];
  const currentFileCount = files.length;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || currentFileCount >= maxFiles) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [disabled, currentFileCount, maxFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);

    // Reset input
    e.target.value = '';
  }, [disabled]);

  const processFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      // Check file type
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        return false;
      }
      // Check file size
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const newFiles = [...files];
      const filesToAdd = validFiles.slice(0, maxFiles - currentFileCount);

      for (const file of filesToAdd) {
        try {
          // Create a unique submission ID for temporary storage
          const tempSubmissionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // Create storage path
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const path = `get-featured-temp/${tempSubmissionId}/${fileName}`;

          // Upload file directly to Firebase Storage
          const downloadURL = await storageService.uploadImage(file, path, {
            contentType: file.type,
            customMetadata: {
              originalName: file.name,
              uploadedAt: new Date().toISOString(),
              fieldKey,
              tempSubmissionId
            }
          });

          // Store only the Firebase Storage URL and metadata (no base64 data)
          const submittedFile: SubmittedFile = {
            name: file.name,
            type: file.type,
            size: file.size,
            url: downloadURL
          };

          newFiles.push(submittedFile);
        } catch (uploadError) {
          console.error(`Failed to upload file ${file.name}:`, uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }

      onChange(fieldKey, newFiles);
    } catch (err) {
      console.error('File processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process files';
      alert(`Upload failed: ${errorMessage}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(fieldKey, newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="transition-all duration-200">
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {config.description && (
        <p className="mt-1 text-sm text-gray-500">{config.description}</p>
      )}

      {/* Upload Area */}
      {currentFileCount < maxFiles && (
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-glamlink-teal bg-glamlink-teal/5'
              : disabled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-glamlink-teal/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={handleFileInput}
            disabled={disabled || uploading}
            className="hidden"
            id={`${fieldKey}-file-input`}
          />

          <label
            htmlFor={`${fieldKey}-file-input`}
            className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              {uploading ? (
                <>
                  <div className="mx-auto h-8 w-8 text-glamlink-teal animate-spin mb-2">
                    <svg fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Uploading to Glamlink...</p>
                  <p className="text-xs text-gray-500">Large files may take a moment</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-glamlink-teal">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {maxFiles > 1 ? `Up to ${maxFiles} files` : '1 file'} • Max {formatFileSize(maxSize)} • 67MB+ files supported
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center flex-1 min-w-0">
                {file.url && file.type?.startsWith('image/') ? (
                  <div className="relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                      onError={(e) => {
                        console.error('Failed to load image preview:', file.name, 'URL:', file.url);
                        // Show fallback when image fails to load
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'w-10 h-10 bg-red-50 rounded-md mr-3 flex items-center justify-center';
                          errorDiv.innerHTML = `
                            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                          `;
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                    {file.url && file.type?.startsWith('image/') ? (
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {showTitle ? file.name : `File ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.size ? formatFileSize(file.size) : 'Unknown size'}
                    {file.url && (
                      <span className="ml-1 text-green-600">✓</span>
                    )}
                  </p>
                </div>
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}