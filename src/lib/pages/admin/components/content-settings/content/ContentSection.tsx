'use client';

import { PageContentEditor } from './editor';
import { useContentSection } from './useContentSection';

interface ContentSectionProps {
  content: Record<string, any>;
  lastUpdated: number | null;
  selectedPage: string;
  onPageChange: (page: string) => void;
  onRefresh: () => void;
  onUpdate: (page: string, content: any) => Promise<void>;
  isSaving: boolean;
  isRefreshing: boolean;
}

export default function ContentSection({ content, lastUpdated, selectedPage, onPageChange, onRefresh, onUpdate, isSaving, isRefreshing }: ContentSectionProps) {
  const { availablePages, currentPageConfig } = useContentSection({ selectedPage });

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Page Content Editor</h2>
        <p className="mt-1 text-sm text-gray-600">
          Edit content for specific pages. Changes will be reflected immediately on the site.
        </p>
      </div>

      {/* Page Selector */}
      <div className="mb-6">
        <label htmlFor="page-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Page to Edit
        </label>
        <select
          id="page-select"
          value={selectedPage}
          onChange={(e) => onPageChange(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
        >
          {availablePages.map((page) => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content Fields */}
      <div className="mb-8">
        {currentPageConfig ? (
          <PageContentEditor
            pageType={currentPageConfig.pageType}
            pageLabel={currentPageConfig.pageLabel}
            initialConfig={content[currentPageConfig.contentKey]}
            defaultSections={currentPageConfig.getDefaultSections()}
            lastUpdated={lastUpdated}
            onRefresh={onRefresh}
            onSave={(config) => onUpdate(currentPageConfig.contentKey, config)}
            isSaving={isSaving}
            isRefreshing={isRefreshing}
          />
        ) : (
          <p className="text-gray-500">Select a page to edit its content.</p>
        )}
      </div>
    </div>
  );
}
