'use client';

import { CTAAlertConfig } from '@/lib/pages/admin/types/ctaAlert';
import { PromoItem } from '@/lib/features/promos/config';
import { useCTAAlertSection } from './useCTAAlertSection';
import CTAAlertPreviewModal from './CTAAlertPreviewModal';
import {
  SourceConfigSection,
  AppearanceSection,
  SchedulingSection,
  ModalConfigSection,
  SaveTemplateModal,
} from './sections';

interface CTAAlertSectionProps {
  config: CTAAlertConfig | null;
  promos: PromoItem[];
  onUpdate: (config: Partial<CTAAlertConfig>) => Promise<void>;
  isSaving: boolean;
}

export default function CTAAlertSection({ config, promos, onUpdate, isSaving }: CTAAlertSectionProps) {
  const {
    localConfig,
    hasChanges,
    showSuccess,
    showPreview,
    validationErrors,
    activePromos,
    setShowPreview,
    updateField,
    handlePromoSelect,
    handleSave,
    handleReset,
    handleToggleActive,
    // Template-related
    savedTemplates,
    isLoadingTemplates,
    showSaveTemplateModal,
    setShowSaveTemplateModal,
    templateName,
    setTemplateName,
    isSavingTemplate,
    selectedTemplateId,
    selectedTemplate,
    isUpdatingTemplate,
    handleTemplateSelect,
    handleSaveAsTemplate,
    handleDeleteTemplate,
    handleUpdateTemplate,
    handleClearTemplateSelection,
  } = useCTAAlertSection({ config, promos, onUpdate, isSaving });

  return (
    <div>
      {/* Section Header with Active Toggle */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">CTA Alert Banner</h2>
          <p className="mt-1 text-sm text-gray-600">
            Configure the promotional alert banner that appears at the top of pages.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Preview Button */}
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 text-sm font-medium text-glamlink-teal border border-glamlink-teal rounded-md hover:bg-glamlink-teal hover:text-white transition-colors"
          >
            Preview
          </button>
          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active:</span>
            <button
              onClick={handleToggleActive}
              disabled={isSaving}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2
                ${localConfig.isActive ? 'bg-green-500' : 'bg-gray-200'}
                ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-pressed={localConfig.isActive}
              aria-label="Toggle CTA Alert active state"
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${localConfig.isActive ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
            <span className={`text-sm font-medium ${localConfig.isActive ? 'text-green-600' : 'text-gray-500'}`}>
              {localConfig.isActive ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="ml-3 text-sm text-green-800 font-medium">CTA Alert settings saved successfully!</p>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800 font-medium">Please fix the following errors:</p>
              <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-8">
        <SourceConfigSection
          localConfig={localConfig}
          activePromos={activePromos}
          updateField={updateField}
          handlePromoSelect={handlePromoSelect}
        />

        <AppearanceSection
          localConfig={localConfig}
          updateField={updateField}
        />

        <SchedulingSection
          localConfig={localConfig}
          updateField={updateField}
        />

        <ModalConfigSection
          localConfig={localConfig}
          updateField={updateField}
          savedTemplates={savedTemplates}
          isLoadingTemplates={isLoadingTemplates}
          selectedTemplateId={selectedTemplateId}
          selectedTemplate={selectedTemplate}
          isUpdatingTemplate={isUpdatingTemplate}
          handleTemplateSelect={handleTemplateSelect}
          handleDeleteTemplate={handleDeleteTemplate}
          handleUpdateTemplate={handleUpdateTemplate}
          handleClearTemplateSelection={handleClearTemplateSelection}
          onSaveAsTemplate={() => setShowSaveTemplateModal(true)}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {hasChanges && (
            <p className="text-sm text-amber-600 font-medium">
              You have unsaved changes
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className={`
              px-4 py-2 text-sm font-medium rounded-md border transition-colors
              ${hasChanges && !isSaving
                ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              }
            `}
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${hasChanges && !isSaving
                ? 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <CTAAlertPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        config={localConfig as CTAAlertConfig}
      />

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={showSaveTemplateModal}
        templateName={templateName}
        isSaving={isSavingTemplate}
        onClose={() => {
          setShowSaveTemplateModal(false);
          setTemplateName('');
        }}
        onSave={handleSaveAsTemplate}
        onNameChange={setTemplateName}
      />
    </div>
  );
}
