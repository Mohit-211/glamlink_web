'use client';

import React from 'react';
import { extractYouTubeId } from '@/lib/pages/admin/components/shared/editing/fields/custom/media';

interface VideoFieldWrapperProps {
  value: string;
  onChange: (value: string) => void;
  fieldName: string;
  issueId: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function VideoFieldWrapper({
  value,
  onChange,
  fieldName,
  issueId,
  placeholder,
  disabled,
}: VideoFieldWrapperProps) {
  // Import hooks dynamically to avoid SSR issues
  const { useVideoUpload, isYouTubeUrl } = require('@/lib/pages/admin/components/shared/editing/fields/custom/media/video');
  const { Upload, X, Play, Youtube, Video, AlertCircle, Loader2 } = require('lucide-react');

  const {
    isUploading,
    uploadProgress,
    previewUrl,
    videoType,
    isFirebaseUrl,
    fileInputRef,
    error,
    setVideoType,
    setError,
    handleFileSelect,
    handleUrlChange,
    handleRemoveVideo,
    triggerFileInput,
  } = useVideoUpload({
    value,
    fieldName,
    issueId,
    onChange: (_: string, newValue: string) => onChange(newValue),
  });

  const handleSourceTypeChange = (newType: 'none' | 'file' | 'youtube') => {
    setVideoType(newType);
    setError(null);
    if (newType === 'none') {
      onChange('');
    }
  };

  const renderVideoPreview = () => {
    if (!previewUrl) return null;

    if (videoType === 'youtube') {
      const videoId = extractYouTubeId(previewUrl);
      if (!videoId) return null;

      return (
        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video preview"
          />
        </div>
      );
    }

    if (videoType === 'file' && previewUrl) {
      return (
        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-black">
          <video
            src={previewUrl}
            className="absolute inset-0 w-full h-full object-contain"
            controls
            preload="metadata"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Source Type Selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleSourceTypeChange('none')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${
            videoType === 'none'
              ? 'bg-gray-100 border-gray-400 text-gray-900'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
          disabled={disabled}
        >
          <X className="w-4 h-4" />
          None
        </button>
        <button
          type="button"
          onClick={() => handleSourceTypeChange('file')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${
            videoType === 'file'
              ? 'bg-indigo-100 border-indigo-400 text-indigo-900'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
          disabled={disabled}
        >
          <Video className="w-4 h-4" />
          Upload Video
        </button>
        <button
          type="button"
          onClick={() => handleSourceTypeChange('youtube')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${
            videoType === 'youtube'
              ? 'bg-red-100 border-red-400 text-red-900'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
          disabled={disabled}
        >
          <Youtube className="w-4 h-4" />
          YouTube URL
        </button>
      </div>

      {/* File Upload UI */}
      {videoType === 'file' && (
        <div className="space-y-3">
          {!previewUrl ? (
            <div
              onClick={!disabled && !isUploading ? triggerFileInput : undefined}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                disabled || isUploading
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-purple-400 cursor-pointer hover:bg-purple-50'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                  <p className="text-sm text-gray-600">Uploading video...</p>
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload video</p>
                  <p className="text-xs text-gray-400">MP4, WebM, or MOV (max 100MB)</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {renderVideoPreview()}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={disabled || isUploading}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  disabled={disabled || isUploading}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
                {isFirebaseUrl && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Stored in Firebase
                  </span>
                )}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/mov"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* YouTube URL Input */}
      {videoType === 'youtube' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={previewUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder || 'https://www.youtube.com/watch?v=...'}
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-sm"
            />
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveVideo}
                disabled={disabled}
                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {previewUrl && extractYouTubeId(previewUrl) && renderVideoPreview()}

          <p className="text-xs text-gray-500">
            Supports youtube.com/watch, youtu.be, and youtube.com/embed URLs
          </p>
        </div>
      )}

      {/* None selected message */}
      {videoType === 'none' && (
        <p className="text-sm text-gray-500 italic">
          No video selected. Choose an option above to add a video.
        </p>
      )}

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
