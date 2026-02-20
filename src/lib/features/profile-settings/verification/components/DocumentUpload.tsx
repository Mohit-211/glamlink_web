"use client";

/**
 * DocumentUpload - Secure document upload component for verification
 */

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image, AlertCircle, Eye } from "lucide-react";
import { DOCUMENT_UPLOAD_CONFIG, DOCUMENT_TYPE_LABELS } from "../config";
import type { VerificationDocument, DocumentType } from "../types";

interface DocumentUploadProps {
  label: string;
  documentType: DocumentType;
  value: VerificationDocument | null;
  onChange: (doc: VerificationDocument | null) => void;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export default function DocumentUpload({
  label,
  documentType,
  value,
  onChange,
  required = false,
  helperText,
  disabled = false,
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > DOCUMENT_UPLOAD_CONFIG.maxSize) {
      return `File size must be less than ${DOCUMENT_UPLOAD_CONFIG.maxSize / (1024 * 1024)}MB`;
    }
    if (!DOCUMENT_UPLOAD_CONFIG.acceptedTypes.includes(file.type)) {
      return "File must be JPG, PNG, or PDF";
    }
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      setUploadError(null);

      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }

      setIsUploading(true);

      try {
        // Upload to Firebase Storage via API
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", documentType);

        const response = await fetch("/api/verification/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await response.json();

        const doc: VerificationDocument = {
          id: `${documentType}_${Date.now()}`,
          type: documentType,
          fileName: file.name,
          fileUrl: data.url,
          fileSize: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        };

        onChange(doc);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [documentType, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(null);
    setUploadError(null);
  };

  const isImage = value?.mimeType?.startsWith("image/");

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Upload Area or File Preview */}
      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-colors
            ${isDragging ? "border-glamlink-teal bg-glamlink-teal/5" : "border-gray-300"}
            ${disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer hover:border-glamlink-teal/50"}
          `}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={DOCUMENT_UPLOAD_CONFIG.acceptedExtensions}
            onChange={handleInputChange}
            disabled={disabled || isUploading}
            className="hidden"
          />

          <div className="flex flex-col items-center text-center">
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-8 w-8 text-glamlink-teal mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="text-glamlink-teal font-medium">Click to upload</span>
                  {" or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, or PDF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start gap-3">
            {/* File Icon/Preview */}
            <div className="flex-shrink-0">
              {isImage ? (
                <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden">
                  <img
                    src={value.fileUrl}
                    alt={value.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {value.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(value.fileSize)} • Uploaded
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isImage && (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !uploadError && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {/* Image Preview Modal */}
      {showPreview && value && isImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={value.fileUrl}
              alt={value.fileName}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
