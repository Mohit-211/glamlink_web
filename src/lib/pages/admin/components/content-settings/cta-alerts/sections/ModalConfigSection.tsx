'use client';

import { CTAAlertConfig, SavedModalTemplate } from '@/lib/pages/admin/types/ctaAlert';
import { CUSTOM_MODAL_REGISTRY } from '@/lib/pages/admin/components/promos/config';

// Shared input className
const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal";

// Spinner component
const Spinner = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface ModalConfigSectionProps {
  localConfig: Partial<CTAAlertConfig>;
  updateField: (field: keyof CTAAlertConfig, value: any) => void;
  // Template props
  savedTemplates: SavedModalTemplate[];
  isLoadingTemplates: boolean;
  selectedTemplateId: string;
  selectedTemplate: SavedModalTemplate | null;
  isUpdatingTemplate: boolean;
  handleTemplateSelect: (templateId: string) => void;
  handleDeleteTemplate: (templateId: string) => void;
  handleUpdateTemplate: () => void;
  handleClearTemplateSelection: () => void;
  onSaveAsTemplate: () => void;
}

export default function ModalConfigSection({
  localConfig,
  updateField,
  savedTemplates,
  isLoadingTemplates,
  selectedTemplateId,
  selectedTemplate,
  isUpdatingTemplate,
  handleTemplateSelect,
  handleDeleteTemplate,
  handleUpdateTemplate,
  handleClearTemplateSelection,
  onSaveAsTemplate,
}: ModalConfigSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Modal Configuration</h3>

      {/* Modal Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Modal Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="modalType"
              value="standard"
              checked={localConfig.modalType === 'standard'}
              onChange={(e) => updateField('modalType', e.target.value)}
              className="h-4 w-4 text-glamlink-teal border-gray-300 focus:ring-glamlink-teal"
            />
            <span className="ml-2 text-sm text-gray-700">Standard (HTML Content)</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="modalType"
              value="custom"
              checked={localConfig.modalType === 'custom'}
              onChange={(e) => updateField('modalType', e.target.value)}
              className="h-4 w-4 text-glamlink-teal border-gray-300 focus:ring-glamlink-teal"
            />
            <span className="ml-2 text-sm text-gray-700">Custom Component</span>
          </label>
        </div>
      </div>

      {/* Custom Modal Selector */}
      {localConfig.modalType === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Modal <span className="text-red-500">*</span>
          </label>
          <select
            value={localConfig.customModalId || ''}
            onChange={(e) => updateField('customModalId', e.target.value)}
            className={inputClassName}
          >
            <option value="">-- Select custom modal --</option>
            {CUSTOM_MODAL_REGISTRY.map(modal => (
              <option key={modal.id} value={modal.id}>
                {modal.name} - {modal.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Standard Modal Content */}
      {localConfig.modalType === 'standard' && (
        <>
          {/* Template Selection with Actions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Load from Saved Template</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                disabled={isLoadingTemplates}
                className={`flex-1 ${inputClassName}`}
              >
                <option value="">-- New Modal (Custom) --</option>
                {savedTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>

              {isLoadingTemplates && <Spinner className="h-5 w-5 text-gray-400" />}

              {/* Delete button - only show when template is selected */}
              {selectedTemplateId && (
                <button
                  type="button"
                  onClick={() => handleDeleteTemplate(selectedTemplateId)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete this template"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Selected template info with Update button */}
            {selectedTemplate && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Editing: {selectedTemplate.name}
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      Changes here can be saved back to this template
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUpdateTemplate}
                      disabled={isUpdatingTemplate}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50"
                    >
                      {isUpdatingTemplate ? (
                        <>
                          <Spinner className="h-3 w-3 mr-1.5" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Update Template
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearTemplateSelection}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              Select a saved template to copy its title and content. You can then edit the values.
            </p>
          </div>

          {/* Modal Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Modal Title</label>
            <input
              type="text"
              value={localConfig.modalTitle || ''}
              onChange={(e) => updateField('modalTitle', e.target.value)}
              placeholder="How to Enter"
              className={inputClassName}
            />
          </div>

          {/* Modal HTML Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Modal Content (HTML)</label>
            <textarea
              value={localConfig.modalHtmlContent || ''}
              onChange={(e) => updateField('modalHtmlContent', e.target.value)}
              placeholder="<p>Enter your HTML content here...</p>"
              rows={10}
              className={`${inputClassName} font-mono text-sm`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter HTML content for the modal. Use Tailwind CSS classes for styling.
            </p>
          </div>

          {/* Show Got It Button Checkbox */}
          <div className="mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.showGotItButton ?? true}
                onChange={(e) => updateField('showGotItButton', e.target.checked)}
                className="h-4 w-4 text-glamlink-teal border-gray-300 rounded focus:ring-glamlink-teal"
              />
              <span className="ml-2 text-sm text-gray-700">Display "Got it" button</span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              When enabled, shows a dismiss button at the bottom of the modal
            </p>
          </div>

          {/* Template Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onSaveAsTemplate}
              disabled={!localConfig.modalTitle && !localConfig.modalHtmlContent}
              className={`
                inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors
                ${localConfig.modalTitle || localConfig.modalHtmlContent
                  ? 'border-glamlink-teal text-glamlink-teal hover:bg-glamlink-teal hover:text-white'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save as New Template
            </button>

            {savedTemplates.length > 0 && (
              <div className="text-sm text-gray-500">
                {savedTemplates.length} saved template{savedTemplates.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
