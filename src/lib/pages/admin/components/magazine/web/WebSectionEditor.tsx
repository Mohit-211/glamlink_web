'use client';

import TableHeader from '@/lib/pages/admin/components/shared/table/TableHeader';
import { FormProvider } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { FormRenderer } from '@/lib/pages/admin/components/shared/editing/form/FormRenderer';
import { SectionPreviewContainer } from './preview';
import { useWebSectionEditor } from './useWebSectionEditor';
import { CustomSectionEditor } from './editor';
import { customSectionBasicFields, sectionStripFields } from '@/lib/pages/admin/config/fields/web/customSection';
import {
  webPreviewComponents,
  getWebPreviewComponent,
  getFieldsForWebSection,
} from '@/lib/pages/admin/config/webPreviewComponents';
import type { WebSectionData, WebSectionType } from './types';
import { SpinnerIcon } from '@/lib/pages/admin/components/shared/common';

interface WebSectionEditorProps {
  /**
   * Section to edit (null for new section)
   */
  section: Partial<WebSectionData> | null;
  /**
   * Issue ID this section belongs to
   */
  issueId: string;
  /**
   * Issue title for display
   */
  issueTitle: string;
  /**
   * Callback to go back to sections list
   */
  onBack: () => void;
  /**
   * Callback when section is saved (for create mode)
   */
  onSave?: (data: Partial<WebSectionData>) => Promise<void>;
}

/**
 * WebSectionEditor - Full split-pane editor for web sections
 *
 * Features:
 * - Left panel: Form editing with type selector
 * - Right panel: Live HTML preview that updates in real-time
 * - Header: Back button, Save button, section title
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ TableHeader (Back, Save, Title)                 │
 * ├───────────────────────┬─────────────────────────┤
 * │                       │                         │
 * │   Form Panel          │   Preview Panel         │
 * │   (Type Selector +    │   (SectionPreview-      │
 * │    FormRenderer)      │    Container)           │
 * │                       │                         │
 * └───────────────────────┴─────────────────────────┘
 */
export default function WebSectionEditor({
  section,
  issueId,
  issueTitle,
  onBack,
  onSave,
}: WebSectionEditorProps) {
  // Use the editor hook for state management
  const {
    sectionData,
    sectionType,
    isSaving,
    hasUnsavedChanges,
    isNewSection,
    error,
    handleDataChange,
    handleTypeChange,
    handleSave,
    handleBack,
  } = useWebSectionEditor({
    initialSection: section,
    issueId,
    onSave: onSave || (async () => {}),
    onBack,
  });

  // Get fields for current section type
  const fields = getFieldsForWebSection(sectionType);

  // Get current preview config
  const previewConfig = getWebPreviewComponent(sectionType);

  // Title for header
  const headerTitle = isNewSection
    ? 'Create New Section'
    : `Edit Section: ${section?.title || 'Untitled'}`;

  return (
    <div className="max-w-full h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
        {/* Header */}
        <TableHeader
          title={headerTitle}
          onBack={handleBack}
          backButtonText="Back to Sections"
          onRefresh={() => {}}
        />

        {/* Action buttons row */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            {/* Section Type Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="section-type" className="text-sm font-medium text-gray-700">
                Section Type:
              </label>
              <select
                id="section-type"
                value={sectionType}
                onChange={(e) => handleTypeChange(e.target.value as WebSectionType)}
                aria-describedby={previewConfig?.description ? 'section-type-description' : undefined}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {webPreviewComponents.map((component) => (
                  <option key={component.id} value={component.id}>
                    {component.icon} {component.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            {previewConfig?.description && (
              <span id="section-type-description" className="text-sm text-gray-500">
                {previewConfig.description}
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            aria-label={isSaving ? 'Saving section...' : 'Save section'}
            aria-busy={isSaving}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${hasUnsavedChanges
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            `}
          >
            {isSaving ? (
              <>
                <SpinnerIcon className="h-4 w-4" aria-hidden="true" />
                Saving...
              </>
            ) : (
              'Save Section'
            )}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Split Pane Content - Wrapped in single FormProvider for shared state */}
        <FormProvider
          initialData={sectionData}
          fields={fields}
          onFieldChange={(name, value, data) => {
            handleDataChange(data);
          }}
        >
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Form */}
            <div className="w-1/2 border-r border-gray-200 overflow-auto p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Section Content
                </h3>

                {/* Conditional rendering based on section type */}
                {sectionType === 'custom-section' ? (
                  <>
                    {/* Basic fields (title, subtitle) for custom section */}
                    <FormRenderer fields={customSectionBasicFields} columns={1} />

                    {/* Section Strip - Collapsible */}
                    <div className="border-t border-gray-200 pt-6">
                      <details className="group">
                        <summary className="cursor-pointer text-md font-medium text-gray-800 mb-4 flex items-center gap-2 list-none">
                          <svg
                            className="w-4 h-4 transition-transform group-open:rotate-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Section Strip
                          <span className="text-xs text-gray-500 font-normal">(optional label element)</span>
                        </summary>
                        <div className="pl-6 pt-4">
                          <FormRenderer fields={sectionStripFields} columns={1} />
                        </div>
                      </details>
                    </div>

                    {/* Content Blocks Divider */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-md font-medium text-gray-800 mb-4">
                        Content Blocks
                      </h4>
                      {/* Custom Section Editor for managing blocks */}
                      <CustomSectionEditor className="pl-8" />
                    </div>
                  </>
                ) : (
                  /* Standard FormRenderer for other section types */
                  <FormRenderer fields={fields} columns={1} />
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-gray-50 overflow-hidden flex flex-col">
              <SectionPreviewContainer
                sectionType={sectionType}
                showTypeSelector={false}
              />
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
