'use client';

import { X } from 'lucide-react';
import { FormProvider } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { FormRenderer } from '@/lib/pages/admin/components/shared/editing/form/FormRenderer';
import { TemplateSelector, SaveTemplateModal } from './templates';
import { getSectionTypeLabel } from '../sections/for-clients/types';
import { SpinnerIcon } from '@/lib/pages/admin/components/shared/common';
import { useSectionEditor } from './useSectionEditor';
import type { ForClientsSection } from '../sections/for-clients/types';

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ForClientsSection;
  onSave: (section: ForClientsSection) => void;
}

/**
 * SectionEditorModal - Generic modal for editing all section types
 *
 * Features:
 * - Single modal for all section types
 * - Dynamically loads field configuration based on section type
 * - Template save/load/update/delete functionality
 * - Integrates with FormProvider for consistent UX
 */
export default function SectionEditorModal({
  isOpen,
  onClose,
  section,
  onSave
}: SectionEditorModalProps) {
  const {
    showSaveTemplateModal,
    isSaving,
    formDataState,
    fieldConfig,
    supportsTemplates,
    templates,
    selectedTemplateId,
    isLoadingTemplates,
    currentTemplate,
    setShowSaveTemplateModal,
    setFormDataState,
    handleTemplateSelectInternal,
    handleFormSave,
    handleSaveAsTemplate,
    handleUpdateExistingTemplate,
    handleDeleteTemplate
  } = useSectionEditor({
    section,
    onSave,
    onClose
  });

  if (!isOpen) return null;

  return (
    <>
      <FormProvider
        initialData={formDataState}
        fields={fieldConfig}
        onFieldChange={(name, value, data) => setFormDataState(data as any)}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit {getSectionTypeLabel(section.type)}
              </h2>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Controls (only for sections that support templates) */}
            {supportsTemplates && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 space-y-4">
                <TemplateSelector
                  templates={templates}
                  selectedTemplateId={selectedTemplateId}
                  isLoading={isLoadingTemplates}
                  onSelect={handleTemplateSelectInternal}
                  onDelete={handleDeleteTemplate}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveTemplateModal(true)}
                    className="px-3 py-1.5 text-sm font-medium text-glamlink-teal bg-white border border-glamlink-teal rounded-md hover:bg-glamlink-teal hover:text-white transition-colors"
                  >
                    Save as New Template
                  </button>

                  {selectedTemplateId && (
                    <button
                      type="button"
                      onClick={handleUpdateExistingTemplate}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Update "{currentTemplate?.name}"
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Templates save your current configuration for reuse across different sections of this type.
                </p>
              </div>
            )}

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {fieldConfig.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Editable Fields</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    This section type does not have any configurable fields. Its content is either hardcoded in the component or pulled from other data sources (like collections).
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Section type: <code className="bg-gray-100 px-2 py-1 rounded">{section.type}</code>
                  </p>
                </div>
              ) : (
                <FormRenderer fields={fieldConfig} columns={2} />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {fieldConfig.length === 0 ? 'Close' : 'Cancel'}
              </button>
              {fieldConfig.length > 0 && (
                <button
                  onClick={handleFormSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isSaving ? (
                    <>
                      <SpinnerIcon />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Section'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </FormProvider>

      {/* Save Template Modal (only for sections that support templates) */}
      {supportsTemplates && (
        <SaveTemplateModal
          isOpen={showSaveTemplateModal}
          onClose={() => setShowSaveTemplateModal(false)}
          onSave={handleSaveAsTemplate}
          mode="create"
          showCategoryField={section.type === 'html-content'}
        />
      )}
    </>
  );
}
