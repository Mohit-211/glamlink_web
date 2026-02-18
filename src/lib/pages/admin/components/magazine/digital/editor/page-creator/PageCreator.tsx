'use client';

/**
 * PageCreator - Form/JSON editor with page type selection
 *
 * Features:
 * - Category badge filter (Image / Article)
 * - Dropdown to select page type from filtered digitalPreviewComponents
 * - Two tabs: Form view and JSON editor view
 * - Uses existing FormProvider, FormRenderer, JsonEditor
 * - Live updates to parent via onDataChange
 */

import React, { useState } from 'react';
import type { DigitalPageData, DigitalPageType, PagePdfSettings } from '../types';
import PageTypeSelector from './form/PageTypeSelector';
import TabNavigation from './form/TabNavigation';
import FormJsonContent from './form/FormJsonContent';
import { usePageCreator } from './usePageCreator';
import { LoadLayoutModal } from '@/lib/pages/admin/components/shared/editing/modal/layout-management';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

// Type for available pages (for internal link selection)
interface AvailablePage {
  id: string;
  pageNumber: number;
  title?: string;
  pageType: string;
}

interface PageCreatorProps {
  initialData?: Partial<DigitalPageData>;
  initialPageType?: DigitalPageType;
  onDataChange: (data: Partial<DigitalPageData>) => void;
  onPageTypeChange: (pageType: DigitalPageType) => void;
  onPdfSettingsChange?: (settings: PagePdfSettings) => void;
  className?: string;
  issueId?: string;
  pdfSettings?: PagePdfSettings;
  pageId?: string;  // Actual page.id (not pageData.id) for formKey generation
  availablePages?: AvailablePage[];  // For link object internal page selection
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PageCreator({
  initialData,
  initialPageType = 'image-with-caption',
  onDataChange,
  onPageTypeChange,
  onPdfSettingsChange,
  className = '',
  issueId,
  pdfSettings,
  pageId,
  availablePages,
}: PageCreatorProps) {
  // Load layout modal state
  const [showLoadLayout, setShowLoadLayout] = useState(false);

  // Use page creator hook for all logic
  const {
    activeTab,
    setActiveTab,
    selectedPageType,
    formKey,
    fields,
    mergedInitialData,
    handlePageTypeChange,
    handleFieldChange,
    handleJsonApply,
    handleLoadLayout,
  } = usePageCreator({
    initialData,
    initialPageType,
    onDataChange,
    onPageTypeChange,
    onPdfSettingsChange,
    pageId,
  });

  // Handle layout selection with modal close
  const onLayoutSelect = (layout: Parameters<typeof handleLoadLayout>[0]) => {
    handleLoadLayout(layout);
    setShowLoadLayout(false);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Page Type Selector */}
      <PageTypeSelector
        selectedPageType={selectedPageType}
        onPageTypeChange={handlePageTypeChange}
        onLoadLayout={() => setShowLoadLayout(true)}
        showLoadLayout={!!issueId}
      />

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Form/JSON Content */}
      <FormJsonContent
        activeTab={activeTab}
        formKey={formKey}
        mergedInitialData={mergedInitialData}
        fields={fields}
        onFieldChange={handleFieldChange}
        onJsonApply={handleJsonApply}
        issueId={issueId}
        pdfSettings={pdfSettings}
        availablePages={availablePages}
      />

      {/* Load Layout Modal */}
      {issueId && (
        <LoadLayoutModal
          isOpen={showLoadLayout}
          onClose={() => setShowLoadLayout(false)}
          issueId={issueId}
          onSelectLayout={onLayoutSelect}
        />
      )}
    </div>
  );
}
