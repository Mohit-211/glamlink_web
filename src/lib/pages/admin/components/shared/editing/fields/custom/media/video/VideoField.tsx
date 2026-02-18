'use client';

import React, { memo } from 'react';
import { Upload, X, Play, Youtube, Video, AlertCircle, Loader2 } from 'lucide-react';
import { useVideoUpload, extractYouTubeId, type VideoSourceType } from './useVideoUpload';
import { useFormContext } from '../../../../form/FormProvider';
import { BaseField } from '../../../BaseField';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';

interface VideoFieldProps {
  field: FieldConfig;
  error?: string;
}

/**
 * VideoField - Video upload and YouTube URL input component
 * Supports Firebase Storage uploads and YouTube embeds
 */
function VideoFieldComponent({ field, error }: VideoFieldProps) {
  const { getFieldValue, updateField, validateField } = useFormContext();
  const value = getFieldValue(field.name) || '';

  // Extract issueId from field metadata or use a default
  const issueId = (field as any).issueId || 'default';

  const {
    isUploading,
    uploadProgress,
    previewUrl,
    videoType,
    isFirebaseUrl,
    fileInputRef,
    error: uploadError,
    setVideoType,
    setError,
    handleFileSelect,
    handleUrlChange,
    handleRemoveVideo,
    triggerFileInput,
  } = useVideoUpload({
    value,
    fieldName: field.name,
    issueId,
    onChange: (fieldName, newValue) => updateField(fieldName, newValue),
  });

  const displayError = error || uploadError || undefined;

  const handleSourceTypeChange = (newType: VideoSourceType) => {
    setVideoType(newType);
    setError(null);
    if (newType === 'none') {
      updateField(field.name, '');
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
    <BaseField field={field} error={displayError}>
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
            disabled={field.disabled}
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
            disabled={field.disabled}
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
            disabled={field.disabled}
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
                onClick={!field.disabled && !isUploading ? triggerFileInput : undefined}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  field.disabled || isUploading
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-indigo-400 cursor-pointer hover:bg-indigo-50'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-sm text-gray-600">Uploading video...</p>
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
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
                    disabled={field.disabled || isUploading}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    disabled={field.disabled || isUploading}
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
                onBlur={() => validateField(field.name)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={field.disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm"
              />
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  disabled={field.disabled}
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
        {displayError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {displayError}
          </div>
        )}
      </div>
    </BaseField>
  );
}

export const VideoField = memo(VideoFieldComponent, (prev, next) => {
  return prev.field === next.field && prev.error === next.error;
});

export default VideoField;
