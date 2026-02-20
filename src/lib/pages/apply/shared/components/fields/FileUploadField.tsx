"use client";

import { useRef, useState, useEffect } from 'react';
import { BaseFieldProps } from './index';
import { SubmittedFile } from '@/lib/pages/apply/shared/types';
import storageService from '@/lib/services/firebase/storageService';

export default function FileUploadField({
  fieldKey,
  config,
  value,
  onChange,
  error,
  disabled
}: BaseFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});

  // Generate unique ID for files to avoid index-based issues
  const getFileId = (file: File | SubmittedFile): string => {
    if ('data' in file && file.data) {
      // For SubmittedFile objects, use a combination of name and data hash
      return `${file.name}-${file.data.substring(0, 10)}`;
    } else {
      // For File objects, use name and size
      return `${file.name}-${file.size}-${Date.now()}`;
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const maxFiles = config.maxFiles || 5;
    const maxSize = config.maxSize || 100 * 1024 * 1024; // 100MB default to support large files
    const accept = config.accept || 'image/*';
    const currentFiles = Array.isArray(value) ? value : [];

    // Check if adding new files would exceed the limit
    if (currentFiles.length + files.length > maxFiles) {
      alert(`Maximum file limit of ${maxFiles} files reached. Please remove some files first.`);
      return;
    }

    const validFiles = Array.from(files).filter(file => {
      console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

      // Check file type
      if (accept !== '*') {
        const isAccepted = accept.split(',').some((acceptType: string) => {
          const trimmedType = acceptType.trim();
          if (trimmedType.includes('*')) {
            // Handle wildcard patterns like 'image/*' and 'video/*'
            const prefix = trimmedType.replace('*', '');
            return file.type.startsWith(prefix);
          } else {
            // Handle exact MIME types
            return file.type === trimmedType;
          }
        });

        if (!isAccepted) {
          console.warn('File rejected - invalid type:', file.name, 'Type:', file.type, 'Accepted:', accept);
          return false;
        }
      }

      // Check file size
      if (file.size > maxSize) {
        console.warn('File rejected - too large:', file.name, 'Size:', file.size, 'Max:', maxSize);
        return false;
      }

      console.log('File accepted:', file.name);
      return true;
    });

    if (validFiles.length === 0) {
      const totalFiles = files.length;
      if (totalFiles > 0) {
        alert(`No valid files were selected. Please check:\n` +
          `• File types: ${accept}\n` +
          `• Maximum file size: ${(maxSize / (1024 * 1024)).toFixed(0)}MB\n` +
          `• Maximum file count: ${maxFiles}\n\n` +
          `Selected files: ${Array.from(files).map(f => `${f.name} (${f.type})`).join(', ')}`);
      }
      return;
    }

    setIsProcessing(true);

    try {
      // Upload files directly to Firebase Storage
      const uploadedFiles: SubmittedFile[] = [];
      const fileIdPrefix = `upload_${Date.now()}`;

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileId = `${fileIdPrefix}_${i}`;

        try {
          // Set upload status to uploading
          setUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
          setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

          // Create a unique submission ID for temporary storage
          const tempSubmissionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // Create storage path
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const path = `get-featured-temp/${tempSubmissionId}/${fileName}`;

          // Simulate progress for better UX (Firebase Storage doesn't provide progress callbacks in this setup)
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const current = prev[fileId] || 0;
              if (current < 90) {
                return { ...prev, [fileId]: current + 10 };
              }
              return prev;
            });
          }, 200);

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

          // Clear progress interval and set to complete
          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));

          // Store only the URL and metadata (no base64 data)
          const submittedFile: SubmittedFile = {
            name: file.name,
            type: file.type,
            size: file.size,
            url: downloadURL
          };

          uploadedFiles.push(submittedFile);
        } catch (uploadError) {
          console.error(`Failed to upload file ${file.name}:`, uploadError);
          setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
          throw new Error(`Failed to upload ${file.name}: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }

      // Append new files to existing files
      const updatedFiles = [...currentFiles, ...uploadedFiles];
      console.log('Updated files for form state:', updatedFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
        hasUrl: !!f.url,
        hasData: !!f.data,
        url: f.url ? f.url.substring(0, 100) + '...' : 'none'
      })));
      onChange(fieldKey, updatedFiles);

      // Clear upload status after successful upload
      setTimeout(() => {
        setUploadStatus({});
        setUploadProgress({});
      }, 2000);
    } catch (error) {
      console.error('Error processing files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process files';

      // Provide specific error feedback
      if (errorMessage.includes('size') || errorMessage.includes('large')) {
        alert('Some files are too large. Please choose smaller files (max 100MB each).');
      } else if (errorMessage.includes('type') || errorMessage.includes('format')) {
        alert('Some files are not in a supported format. Please use image files only.');
      } else {
        alert(`Failed to process files: ${errorMessage}. Please try again.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (fileToRemove: File | SubmittedFile) => {
    const currentFiles = Array.isArray(value) ? value : [];
    const fileId = getFileId(fileToRemove);

    // Remove file from array
    const updatedFiles = currentFiles.filter((file) => getFileId(file) !== fileId);

    // Remove file preview
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileId];
      return newPreviews;
    });

    onChange(fieldKey, updatedFiles);
  };

  const createFilePreview = (file: File | SubmittedFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('Creating preview for file:', file.name, 'Type:', file.type, 'Has URL:', 'url' in file, 'Has Data:', 'data' in file);

      // If it's a SubmittedFile with URL, use that
      if ('url' in file && file.url) {
        console.log('Using Firebase Storage URL for preview:', file.url);
        resolve(file.url);
        return;
      }

      // If it's a SubmittedFile with base64 data (legacy), use that
      if ('data' in file && file.data) {
        console.log('Using base64 data for preview');
        resolve(`data:${file.type};base64,${file.data}`);
        return;
      }

      // If it's a raw File object, convert it
      if ('size' in file && 'type' in file && 'name' in file && !('data' in file) && !('url' in file)) {
        console.log('Converting File object to data URL for preview');
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file as File);
        return;
      }

      console.error('Invalid file format for preview:', file);
      reject(new Error('Invalid file format'));
    });
  };

  const currentFiles = Array.isArray(value) ? value : [];

  // Generate previews for files when they are added
  useEffect(() => {
    const generatePreviews = async () => {
      for (const file of currentFiles) {
        const fileId = getFileId(file);

        if (!filePreviews[fileId] && file.type && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
          try {
            const preview = await createFilePreview(file);
            setFilePreviews(prev => ({ ...prev, [fileId]: preview }));
          } catch (error) {
            console.error('Failed to generate preview:', error);
          }
        }
      }
    };

    generatePreviews();

    // Clean up previews for files that are no longer in the array
    const currentFileIds = new Set(currentFiles.map(file => getFileId(file)));
    setFilePreviews(prev => {
      const cleanedPreviews: { [key: string]: string } = {};
      Object.keys(prev).forEach(fileId => {
        if (currentFileIds.has(fileId)) {
          cleanedPreviews[fileId] = prev[fileId];
        }
      });
      return cleanedPreviews;
    });
  }, [currentFiles]);

  return (
    <div className="transition-all duration-200">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="space-y-2">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragging ? 'border-glamlink-teal bg-glamlink-teal/5' : 'border-gray-300 hover:border-gray-400'}
              ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={config.accept || 'image/*'}
              multiple={config.multiple !== false}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={disabled}
            />

            <div className="space-y-2">
              {isProcessing ? (
                <>
                  <div className="mx-auto h-12 w-12 text-glamlink-teal animate-spin">
                    <svg fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-glamlink-teal">
                      Uploading files to Glamlink...
                    </p>
                    <p className="text-xs text-gray-500">
                      Large files may take a moment. Please don't close this page.
                    </p>
                    {Object.keys(uploadProgress).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(uploadProgress).map(([fileId, progress]) => {
                          const status = uploadStatus[fileId];
                          return (
                            <div key={fileId} className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    status === 'error' ? 'bg-red-500' :
                                    status === 'success' ? 'bg-green-500' :
                                    'bg-glamlink-teal'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-12">
                                {status === 'error' ? 'Error' : `${progress}%`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-glamlink-teal hover:text-glamlink-teal-dark">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Accepted formats: {config.accept || 'image/*'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Max {config.maxFiles || 5} files, up to {config.maxSize ? `${config.maxSize / (1024 * 1024)}MB` : '100MB'} each
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {currentFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentFiles.map((file: File | SubmittedFile) => {
                  const fileId = getFileId(file);
                  return (
                    <div key={fileId} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeFile(file)}
                          className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1 text-red-500 hover:text-red-700 hover:bg-white transition-all duration-200 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* Media preview */}
                        {file.type && file.type.startsWith('image/') ? (
                          <img
                            src={filePreviews[fileId] || (file as SubmittedFile).url || ''}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Failed to load image preview:', file.name, 'URL:', filePreviews[fileId] || (file as SubmittedFile).url);
                              // Show fallback when image fails to load
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                        const errorDiv = document.createElement('div');
                                        errorDiv.className = 'w-full h-full flex items-center justify-center bg-red-50';
                                        errorDiv.innerHTML = `
                                          <div class="text-center p-2">
                                            <svg class="w-8 h-8 text-red-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                            </svg>
                                            <p class="text-xs text-red-600">Failed to load</p>
                                          </div>
                                        `;
                                        parent.appendChild(errorDiv);
                                      }
                            }}
                          />
                        ) : file.type && file.type.startsWith('video/') ? (
                          <div className="relative w-full h-full">
                            <video
                              src={filePreviews[fileId] || (file as SubmittedFile).url || ''}
                              className="w-full h-full object-cover"
                              controls={false}
                              muted={true}
                              onMouseEnter={(e) => {
                                const video = e.currentTarget;
                                video.currentTime = 1; // Show a preview frame
                              }}
                              onError={(e) => {
                                console.error('Failed to load video preview:', file.name, 'URL:', filePreviews[fileId] || (file as SubmittedFile).url);
                                // Show fallback when video fails to load
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const errorDiv = document.createElement('div');
                                  errorDiv.className = 'w-full h-full flex items-center justify-center bg-red-50';
                                  errorDiv.innerHTML = `
                                    <div class="text-center p-2">
                                      <svg class="w-8 h-8 text-red-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                      </svg>
                                      <p class="text-xs text-red-600">Failed to load</p>
                                    </div>
                                  `;
                                  parent.appendChild(errorDiv);
                                }
                              }}
                            >
                              Your browser does not support the video tag.
                            </video>
                            {/* Video icon overlay */}
                            <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1.5">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        ) : (
                          // Fallback for non-media files
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* File info below the square */}
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.size ? (
                            file.size < 1024 * 1024
                              ? `${(file.size / 1024).toFixed(1)} KB`
                              : `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                          ) : (
                            'Unknown size'
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {config.description && (
          <p className="text-sm text-gray-500">{config.description}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}