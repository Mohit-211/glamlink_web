'use client';

import React, { useState, useMemo } from 'react';
import { useFormContext } from '../form/FormProvider';
import type { IssuePreviewComponent, PreviewComponentProps } from '@/lib/pages/admin/config/previewComponents';
import type { MagazineIssue } from '@/lib/pages/magazine/types';
import { RefreshIcon } from '@/lib/pages/admin/components/shared/common';

interface PreviewContainerProps {
  previewComponents: IssuePreviewComponent[];
}

/**
 * PreviewContainer - Manages preview rendering with live form data
 *
 * Key features:
 * - Dropdown to select preview type (Cover, TOC, Editors Note, etc.)
 * - Real-time updates via useFormContext()
 * - Transforms Partial<MagazineIssue> → MagazineIssue for preview components
 * - Refresh button to force re-render
 * - Displays message if no preview components configured
 */
export default function PreviewContainer({ previewComponents }: PreviewContainerProps) {
  const { formData } = useFormContext<Partial<MagazineIssue>>();
  const [selectedPreviewId, setSelectedPreviewId] = useState<string>(
    previewComponents[0]?.id || ''
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // Transform form data to complete MagazineIssue structure
  const transformedIssue = useMemo<Partial<MagazineIssue>>(() => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];

    return {
      // Required fields with defaults
      id: formData.id || dateString,
      title: formData.title || 'Untitled Issue',
      subtitle: formData.subtitle || '',
      issueNumber: formData.issueNumber || 1,
      issueDate: formData.issueDate || dateString,

      // Optional fields (pass through if present)
      urlId: formData.urlId,
      description: formData.description,
      descriptionImage: formData.descriptionImage,
      editorNote: formData.editorNote,
      editorNoteTocTitle: formData.editorNoteTocTitle,
      editorNoteTocSubtitle: formData.editorNoteTocSubtitle,
      coverQuote: formData.coverQuote,
      coverQuotePosition: formData.coverQuotePosition,
      publuuLink: formData.publuuLink,

      // Cover configuration
      coverDisplayMode: formData.coverDisplayMode,
      coverImage: formData.coverImage,
      coverImageAlt: formData.coverImageAlt,
      coverBackgroundImage: formData.coverBackgroundImage,
      coverPositioning: (formData as any).coverPositioning,

      // Background colors
      coverBackgroundColor: formData.coverBackgroundColor,
      tocBackgroundColor: formData.tocBackgroundColor,
      editorNoteBackgroundColor: formData.editorNoteBackgroundColor,

      // Typography settings
      titleTypography: formData.titleTypography,
      subtitleTypography: formData.subtitleTypography,

      // Arrays
      sections: formData.sections || [],

      // Boolean flags
      featured: formData.featured ?? false,
      visible: formData.visible ?? true,
      isEmpty: formData.isEmpty ?? false,
      isActive: (formData as any).isActive ?? true,
    };
  }, [formData, refreshKey]);

  // Find selected preview component
  const selectedPreview = previewComponents.find(p => p.id === selectedPreviewId);

  // Handle refresh button
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // No preview components configured
  if (!previewComponents || previewComponents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">No preview components configured</p>
      </div>
    );
  }

  // No preview selected
  if (!selectedPreview) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">Select a preview type</p>
      </div>
    );
  }

  const PreviewComponent = selectedPreview.component;

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <label htmlFor="preview-select" className="text-sm font-medium text-gray-700">
          Preview:
        </label>
        <select
          id="preview-select"
          value={selectedPreviewId}
          onChange={(e) => setSelectedPreviewId(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {previewComponents.map((preview) => (
            <option key={preview.id} value={preview.id}>
              {preview.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Refresh preview"
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="bg-gray-50 rounded-lg overflow-auto max-h-[calc(90vh-16rem)]">
        <PreviewComponent key={refreshKey} issue={transformedIssue} />
      </div>
    </div>
  );
}
