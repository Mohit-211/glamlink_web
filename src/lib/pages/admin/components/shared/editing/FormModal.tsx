'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FormProvider, useFormContext } from './form/FormProvider';
import { useFormModal } from './useFormModal';
import TabsContainer from './modal/TabsContainer';
import { ModalDisplay } from './modal/ModalDisplay';
import type { FormModalProps, CustomTab } from './types';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import { SpinnerIcon } from '@/lib/pages/admin/components/shared/common';
import { DragPositionProvider } from '@/lib/features/digital-cards/components/editor/shared/DragPositionContext';

/**
 * FormModal - Main modal component for editing forms
 *
 * Key features:
 * - Wraps content in FormProvider for state management
 * - No artificial focus management (trusts browser)
 * - Supports form/JSON tab modes
 * - Clean save/cancel handling
 */
export function FormModal<T extends Record<string, any> = Record<string, any>>({
  isOpen,
  onClose,
  title,
  initialData = {},
  fields,
  onSave,
  onFieldChange,
  size = 'lg',
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  showTabs = false,
  defaultTab = 'form',
  customTabs,
  onTabChange,
  previewComponents,
  PreviewContainer: CustomPreviewContainer,
  isSaving = false,
  customActionBar,
}: FormModalProps<T>) {
  // Don't render if not open
  if (!isOpen) return null;

  // Internal component that has access to FormProvider context
  function ModalContent() {
    // Use extracted hook for all modal state and handlers
    const {
      isLoading,
      saveError,
      modalRef,
      effectiveSize,
      sizeClasses,
      handleTabChangeInternal,
      handleSave,
      handleJsonApply,
    } = useFormModal<T>({ size, onSave, onClose, onTabChange });

    // Get errors from form context for display
    const { errors } = useFormContext<T>();

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          ref={modalRef}
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[effectiveSize]} max-h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Custom Action Bar (e.g., JSON Export/Import buttons) */}
          {customActionBar && (
            <div className="px-6 pt-4">
              {customActionBar}
            </div>
          )}

          {/* TabsContainer - manages custom tabs and form/json subtabs */}
          <TabsContainer
            customTabs={customTabs}
            showTabs={showTabs || !!customTabs}
            defaultTab={defaultTab}
            allFields={fields}
            onTabChange={handleTabChangeInternal}
          >
            {(activeFields, activeSubTab) => (
              <ModalDisplay<T>
                activeSubTab={activeSubTab}
                activeFields={activeFields}
                errors={errors}
                saveError={saveError}
                previewComponents={previewComponents}
                PreviewContainer={CustomPreviewContainer}
                onJsonApply={handleJsonApply}
              />
            )}
          </TabsContainer>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isLoading || isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[140px] justify-center"
            >
              {(isLoading || isSaving) ? (
                <>
                  <SpinnerIcon />
                  <span>Saving...</span>
                </>
              ) : (
                saveButtonText
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider<T>
      initialData={initialData as Partial<T>}
      fields={fields}
      onFieldChange={onFieldChange}
    >
      <DragPositionProvider>
        <ModalContent />
      </DragPositionProvider>
    </FormProvider>
  );
}

export default FormModal;
