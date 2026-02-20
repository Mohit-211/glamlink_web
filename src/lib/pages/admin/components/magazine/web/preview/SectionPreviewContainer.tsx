'use client';

import React, { useState, useMemo } from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { RefreshIcon } from '@/lib/pages/admin/components/shared/common';
import {
  webPreviewComponents,
  getWebPreviewComponent,
  type WebPreviewComponent
} from '@/lib/pages/admin/config/webPreviewComponents';
import type { WebSectionData, WebSectionType } from '../types';

interface SectionPreviewContainerProps {
  /**
   * Current section type to preview
   */
  sectionType: WebSectionType;
  /**
   * Callback when section type is changed
   */
  onTypeChange?: (type: WebSectionType) => void;
  /**
   * Whether to show the type selector dropdown
   */
  showTypeSelector?: boolean;
}

/**
 * SectionPreviewContainer - Manages live preview rendering with form data
 *
 * Key features:
 * - Dropdown to select section type (if multiple types available)
 * - Real-time updates via useFormContext()
 * - Transforms form data to preview props
 * - Refresh button to force re-render
 * - Displays message if no preview components configured
 */
export default function SectionPreviewContainer({
  sectionType,
  onTypeChange,
  showTypeSelector = false,
}: SectionPreviewContainerProps) {
  const { formData } = useFormContext<Partial<WebSectionData>>();
  const [refreshKey, setRefreshKey] = useState(0);

  // Transform form data to complete section data structure
  const transformedData = useMemo<Partial<WebSectionData>>(() => {
    // For custom sections, pass through all form data to support all features
    // (sectionStrip, contentBlocks, layout settings, etc.)
    return {
      // Pass through all form data first
      ...formData,

      // Override required fields with defaults
      type: sectionType,
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      description: formData.description || '',
      backgroundColor: formData.backgroundColor || '#ffffff',

      // Typography settings (pass through if present)
      titleTypography: formData.titleTypography,
      subtitleTypography: formData.subtitleTypography,

      // Identity (if available)
      id: formData.id,
      issueId: formData.issueId,
    };
  }, [formData, sectionType, refreshKey]);

  // Find selected preview component (with fallback to first available)
  const selectedPreview = getWebPreviewComponent(sectionType) || webPreviewComponents[0];

  // Handle refresh button
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Handle type change
  const handleTypeChange = (newType: WebSectionType) => {
    if (onTypeChange) {
      onTypeChange(newType);
    }
  };

  // No preview components configured
  if (!webPreviewComponents || webPreviewComponents.length === 0) {
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
        <p className="text-gray-500 text-sm">Select a section type to see preview</p>
      </div>
    );
  }

  const PreviewComponent = selectedPreview.component;

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200 px-4 pt-4">
        <label htmlFor="preview-type-select" className="text-sm font-medium text-gray-700">
          Preview:
        </label>

        {showTypeSelector && webPreviewComponents.length > 1 ? (
          <select
            id="preview-type-select"
            value={sectionType}
            onChange={(e) => handleTypeChange(e.target.value as WebSectionType)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {webPreviewComponents.map((preview) => (
              <option key={preview.id} value={preview.id}>
                {preview.icon} {preview.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="flex-1 text-sm text-gray-600">
            {selectedPreview.icon} {selectedPreview.label}
          </span>
        )}

        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Refresh preview"
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="rounded-lg overflow-hidden min-h-[300px]" style={{ backgroundColor: '#FAF7F2' }}>
          <PreviewComponent key={refreshKey} sectionData={transformedData} />
        </div>
      </div>
    </div>
  );
}
