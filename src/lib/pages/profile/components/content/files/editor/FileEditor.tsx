/**
 * FileEditor Component
 *
 * Full-screen file detail view with editing tools
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ContentFile, ImageTransform } from '@/lib/features/crm/content/types';
import { useFile } from '@/lib/features/crm/content/hooks';
import { formatDate } from '@/lib/utils/format';
import { ImageCropper } from './ImageCropper';
import { ImageResizer } from './ImageResizer';
import { ImageDrawTool } from './ImageDrawTool';
import { BackgroundEditor, BackgroundEditResult } from './BackgroundEditor';
import { FocalPointPicker } from './FocalPointPicker';

interface FileEditorProps {
  fileId: string;
}

type EditorTool = 'crop' | 'resize' | 'draw' | 'background' | 'focal-point' | null;

export function FileEditor({ fileId }: FileEditorProps) {
  const { file, loading, error, updateFile, applyTransform } = useFile(fileId);
  const [activeTool, setActiveTool] = useState<EditorTool>(null);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-lg font-medium text-gray-900 mb-2">File not found</h2>
        <p className="text-sm text-gray-500 mb-4">{error || 'The file you are looking for does not exist.'}</p>
        <Link href="/profile/content/files" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
          Back to files
        </Link>
      </div>
    );
  }

  const displayUrl = editedUrl || file.url;
  const isImage = file.type === 'image';

  const handleCrop = async (cropArea: { x: number; y: number; width: number; height: number }) => {
    const transform: ImageTransform = {
      crop: {
        ...cropArea,
        aspectRatio: 'original',
        orientation: 'landscape',
      },
    };
    await applyTransform(transform);
    setActiveTool(null);
  };

  const handleResize = async (width: number, height: number) => {
    const transform: ImageTransform = {
      resize: { width, height },
    };
    await applyTransform(transform);
    setActiveTool(null);
  };

  const handleDrawSave = async (dataUrl: string) => {
    // In a real implementation, upload the dataUrl to storage
    setEditedUrl(dataUrl);
    setActiveTool(null);
  };

  const handleBackgroundEdit = async (_result: BackgroundEditResult) => {
    // Background editing is not directly supported by ImageTransform
    // For now, just close the tool - the result would need to be uploaded separately
    setActiveTool(null);
  };

  const handleFocalPointSave = async (point: { x: number; y: number }) => {
    await updateFile({ focalPoint: point });
    setActiveTool(null);
  };

  const handleMetadataUpdate = async (updates: Partial<ContentFile>) => {
    setSaving(true);
    try {
      await updateFile(updates);
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/profile/content/files"
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{file.name}</h1>
                <p className="text-sm text-gray-500">
                  {file.format.toUpperCase()} • {formatFileSize(file.size)} • Added {formatDate(file.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Download button */}
              <a
                href={file.url}
                download={file.name}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>

              {/* Copy URL button */}
              <button
                onClick={() => navigator.clipboard.writeText(file.url)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main preview area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Preview */}
              <div className="p-6">
                {isImage ? (
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={displayUrl}
                      alt={file.altText || file.name}
                      className="w-full h-auto max-h-[600px] object-contain"
                      style={{
                        objectPosition: file.focalPoint
                          ? `${file.focalPoint.x}% ${file.focalPoint.y}%`
                          : 'center',
                      }}
                    />
                    {file.focalPoint && (
                      <div
                        className="absolute w-4 h-4 -ml-2 -mt-2 bg-pink-600 rounded-full border-2 border-white shadow pointer-events-none"
                        style={{
                          left: `${file.focalPoint.x}%`,
                          top: `${file.focalPoint.y}%`,
                        }}
                        title="Focal point"
                      />
                    )}
                  </div>
                ) : file.type === 'video' ? (
                  <video
                    src={file.url}
                    controls
                    className="w-full h-auto max-h-[600px] rounded-lg bg-black"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{file.format.toUpperCase()} document</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image editing tools */}
              {isImage && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTool('crop')}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Crop
                    </button>
                    <button
                      onClick={() => setActiveTool('resize')}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      Resize
                    </button>
                    <button
                      onClick={() => setActiveTool('draw')}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Draw
                    </button>
                    <button
                      onClick={() => setActiveTool('background')}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      Background
                    </button>
                    <div className="w-px h-6 bg-gray-300" />
                    <button
                      onClick={() => setActiveTool('focal-point')}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Focal point
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* References */}
            {file.references.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Used in</h3>
                <div className="space-y-3">
                  {file.references.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ref.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{ref.type}</p>
                        </div>
                      </div>
                      <Link
                        href={`/profile/${ref.type}s/${ref.id}`}
                        className="text-sm text-pink-600 hover:text-pink-700"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar with metadata */}
          <div className="w-80">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              {/* Alt text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt text</label>
                <textarea
                  value={file.altText || ''}
                  onChange={(e) => handleMetadataUpdate({ altText: e.target.value })}
                  placeholder="Describe this image for accessibility"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Helps with accessibility and SEO
                </p>
              </div>

              {/* File info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">File information</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="text-gray-900 font-medium">{file.format.toUpperCase()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Size</dt>
                    <dd className="text-gray-900 font-medium">{formatFileSize(file.size)}</dd>
                  </div>
                  {file.width && file.height && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Dimensions</dt>
                      <dd className="text-gray-900 font-medium">
                        {file.width} × {file.height}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Added</dt>
                    <dd className="text-gray-900 font-medium">{formatDate(file.createdAt)}</dd>
                  </div>
                  {file.updatedAt && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Modified</dt>
                      <dd className="text-gray-900 font-medium">{formatDate(file.updatedAt)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Focal point info */}
              {file.focalPoint && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Focal point</h3>
                  <p className="text-sm text-gray-500">
                    X: {file.focalPoint.x}% • Y: {file.focalPoint.y}%
                  </p>
                  <button
                    onClick={() => handleMetadataUpdate({ focalPoint: undefined })}
                    className="text-xs text-red-600 hover:text-red-700 mt-1"
                  >
                    Remove focal point
                  </button>
                </div>
              )}

              {/* URL */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">File URL</h3>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 break-all font-mono">{file.url}</p>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="mt-6 bg-white rounded-xl border border-red-200 p-6">
              <h3 className="text-sm font-medium text-red-600 mb-3">Danger zone</h3>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
                    // Handle delete
                  }
                }}
                className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Delete file
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor tools */}
      {activeTool === 'crop' && file.width && file.height && (
        <ImageCropper
          imageUrl={displayUrl}
          onCrop={handleCrop}
          onCancel={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'resize' && file.width && file.height && (
        <ImageResizer
          currentWidth={file.width}
          currentHeight={file.height}
          onResize={handleResize}
          onCancel={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'draw' && (
        <ImageDrawTool
          imageUrl={displayUrl}
          onSave={handleDrawSave}
          onCancel={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'background' && (
        <BackgroundEditor
          imageUrl={displayUrl}
          onApply={handleBackgroundEdit}
          onCancel={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'focal-point' && (
        <FocalPointPicker
          imageUrl={displayUrl}
          initialPoint={file.focalPoint}
          onSave={handleFocalPointSave}
          onCancel={() => setActiveTool(null)}
        />
      )}
    </div>
  );
}

export default FileEditor;
