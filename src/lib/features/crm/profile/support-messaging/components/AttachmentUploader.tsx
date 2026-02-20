'use client';

import { useCallback, useRef, useState } from 'react';
import type { Attachment } from '../types/attachment';
import { validateFile, formatFileSize, MAX_ATTACHMENTS_PER_MESSAGE, ALL_ALLOWED_MIME_TYPES } from '../types/attachment';
import type { UploadProgress } from '../hooks/useFileUpload';

interface AttachmentUploaderProps {
  /** Conversation ID for upload path */
  conversationId: string;
  /** Currently pending attachments */
  pendingAttachments: Attachment[];
  /** Callback when files are selected for upload */
  onFilesSelected: (files: File[]) => void;
  /** Current upload progress */
  uploads: Map<string, UploadProgress>;
  /** Cancel an upload */
  onCancelUpload: (uploadId: string) => void;
  /** Remove a pending attachment */
  onRemoveAttachment: (attachmentId: string) => void;
  /** Whether uploads are disabled */
  disabled?: boolean;
}

export function AttachmentUploader({
  conversationId,
  pendingAttachments,
  onFilesSelected,
  uploads,
  onCancelUpload,
  onRemoveAttachment,
  disabled = false,
}: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingSlots = MAX_ATTACHMENTS_PER_MESSAGE - pendingAttachments.length;
  const activeUploads = Array.from(uploads.values()).filter((u) => u.status === 'uploading');

  const handleFileSelect = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      // Check max attachments
      if (fileArray.length > remainingSlots) {
        setError(`You can only attach ${MAX_ATTACHMENTS_PER_MESSAGE} files per message. ${remainingSlots} slots remaining.`);
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      for (const file of fileArray) {
        const validation = validateFile(file);
        if (!validation.valid) {
          setError(validation.error || 'Invalid file');
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [remainingSlots, onFilesSelected]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelect(e.target.files);
        // Reset the input so the same file can be selected again
        e.target.value = '';
      }
    },
    [handleFileSelect]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [disabled, handleFileSelect]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      {/* Upload Button / Drop Zone */}
      <div
        className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALL_ALLOWED_MIME_TYPES.join(',')}
          onChange={handleInputChange}
          className="sr-only"
          disabled={disabled || remainingSlots <= 0}
          aria-label="Attach files"
        />

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || remainingSlots <= 0}
          className={`p-2 rounded-lg transition-colors ${
            dragActive
              ? 'bg-glamlink-purple/20 border-2 border-dashed border-glamlink-purple'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={remainingSlots <= 0 ? 'Maximum attachments reached' : 'Attach file'}
          title={remainingSlots <= 0 ? 'Maximum attachments reached' : 'Attach file (drag and drop supported)'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Drag overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-glamlink-purple/10 rounded-lg border-2 border-dashed border-glamlink-purple flex items-center justify-center pointer-events-none z-10">
            <span className="text-sm text-glamlink-purple font-medium">Drop files here</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Active Uploads */}
      {activeUploads.length > 0 && (
        <div className="space-y-1">
          {activeUploads.map((upload) => (
            <div key={upload.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded px-2 py-1">
              <div className="flex-1 min-w-0">
                <p className="truncate text-gray-700">{upload.fileName}</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className="bg-glamlink-purple h-1 rounded-full transition-all"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => onCancelUpload(upload.id)}
                className="text-gray-400 hover:text-red-500 flex-shrink-0"
                aria-label="Cancel upload"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pending Attachments */}
      {pendingAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pendingAttachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700"
            >
              {attachment.type === 'image' ? (
                <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span className="max-w-[100px] truncate">{attachment.name}</span>
              <span className="text-gray-400">({formatFileSize(attachment.size)})</span>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="text-gray-400 hover:text-red-500 ml-1"
                aria-label={`Remove ${attachment.name}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
