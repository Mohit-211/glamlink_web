'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { MagazineIssue } from '@/lib/pages/magazine/types/magazine/core';
import { extractThumbnailFromSection } from '@/lib/pages/magazine/hooks';
import storageService from '@/lib/services/firebase/storageService';
import { ArrowLeftIcon } from '@/lib/pages/admin/components/shared/common';

interface ThumbnailEditorProps {
  issue: MagazineIssue;
  onSave: (pageThumbnails: Record<number, string>) => Promise<void>;
  onBack: () => void;
}

interface PageInfo {
  pid: number;
  type: 'cover' | 'toc' | 'editors-note' | 'section';
  title: string;
  defaultThumbnail: string | null;
}

/**
 * ThumbnailEditor - Edit custom thumbnails for magazine pages
 *
 * Displays pages in a 4-column grid and allows uploading custom thumbnails.
 */
export default function ThumbnailEditor({ issue, onSave, onBack }: ThumbnailEditorProps) {
  const [thumbnails, setThumbnails] = useState<Record<number, string>>(
    issue.pageThumbnails || {}
  );
  const [uploadingPid, setUploadingPid] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Build page list from issue
  const pages = useMemo<PageInfo[]>(() => {
    const result: PageInfo[] = [];
    let pid = 0;

    // Cover
    result.push({
      pid: pid++,
      type: 'cover',
      title: 'Cover',
      defaultThumbnail: issue.descriptionImage || issue.coverBackgroundImage || issue.coverImage || null,
    });

    // Table of Contents
    result.push({
      pid: pid++,
      type: 'toc',
      title: 'Table of Contents',
      defaultThumbnail: null,
    });

    // Editor's Note (if exists)
    if (issue.editorNote) {
      result.push({
        pid: pid++,
        type: 'editors-note',
        title: "Editor's Note",
        defaultThumbnail: null,
      });
    }

    // Sections
    if (issue.sections) {
      for (const section of issue.sections) {
        result.push({
          pid: pid++,
          type: 'section',
          title: section.tocTitle || section.title,
          defaultThumbnail: extractThumbnailFromSection(section),
        });
      }
    }

    return result;
  }, [issue]);

  // Handle file upload
  const handleFileUpload = async (pid: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingPid(pid);

    try {
      const path = `magazine/${issue.id}/thumbnails/page-${pid}`;
      const url = await storageService.uploadFile(file, path);

      setThumbnails(prev => ({
        ...prev,
        [pid]: url,
      }));
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      alert('Failed to upload thumbnail');
    } finally {
      setUploadingPid(null);
    }
  };

  // Handle removing custom thumbnail
  const handleRemoveThumbnail = (pid: number) => {
    setThumbnails(prev => {
      const updated = { ...prev };
      delete updated[pid];
      return updated;
    });
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(thumbnails);
    } catch (error) {
      console.error('Failed to save thumbnails:', error);
      alert('Failed to save thumbnails');
    } finally {
      setIsSaving(false);
    }
  };

  // Get thumbnail fallback text
  const getFallbackText = (page: PageInfo) => {
    if (page.type === 'cover') return 'C';
    if (page.type === 'toc') return 'T';
    if (page.type === 'editors-note') return 'E';
    return page.title.charAt(0).toUpperCase();
  };

  // Get gradient classes for fallback
  const getFallbackGradient = (page: PageInfo) => {
    switch (page.type) {
      case 'cover': return 'bg-gradient-to-br from-glamlink-purple to-glamlink-teal';
      case 'toc': return 'bg-gradient-to-br from-gray-600 to-gray-800';
      case 'editors-note': return 'bg-gradient-to-br from-amber-500 to-orange-600';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Back to issues"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Page Thumbnails
              </h2>
              <p className="text-sm text-gray-500">
                {issue.title} - Issue #{issue.issueNumber}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-glamlink-teal text-white hover:bg-glamlink-teal/90'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Thumbnails'}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Click on a thumbnail to upload a custom image.
            Custom thumbnails will override the automatically extracted images from sections.
          </p>
        </div>

        {/* Thumbnail Grid - 4 per row */}
        <div className="grid grid-cols-4 gap-4">
          {pages.map((page) => {
            const customThumbnail = thumbnails[page.pid];
            const displayThumbnail = customThumbnail || page.defaultThumbnail;
            const isUploading = uploadingPid === page.pid;

            return (
              <div key={page.pid} className="relative group">
                {/* Thumbnail container */}
                <label
                  className={`
                    block aspect-[3/4] rounded-lg overflow-hidden cursor-pointer
                    border-2 transition-all
                    ${customThumbnail
                      ? 'border-glamlink-teal'
                      : 'border-gray-200 hover:border-gray-400'
                    }
                    ${isUploading ? 'opacity-50' : ''}
                  `}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(page.pid, file);
                      e.target.value = '';
                    }}
                    disabled={isUploading}
                  />

                  {displayThumbnail ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={displayThumbnail}
                        alt={page.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 200px"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          Change
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${getFallbackGradient(page)}`}>
                      <span className="text-white text-2xl font-bold">
                        {getFallbackText(page)}
                      </span>
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          Add Image
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Loading overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-glamlink-teal border-t-transparent rounded-full" />
                    </div>
                  )}
                </label>

                {/* Page info and actions */}
                <div className="mt-2 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {page.pid + 1}. {page.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {page.type.replace('-', ' ')}
                    </p>
                  </div>

                  {/* Remove button (only for custom thumbnails) */}
                  {customThumbnail && (
                    <button
                      onClick={() => handleRemoveThumbnail(page.pid)}
                      className="ml-2 text-xs text-red-600 hover:text-red-800"
                      title="Remove custom thumbnail"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Custom badge */}
                {customThumbnail && (
                  <div className="absolute top-2 right-2 bg-glamlink-teal text-white text-[10px] px-1.5 py-0.5 rounded">
                    Custom
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
