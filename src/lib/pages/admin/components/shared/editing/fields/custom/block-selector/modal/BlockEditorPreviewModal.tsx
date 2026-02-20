'use client';

/**
 * BlockEditorPreviewModal Component
 *
 * A modal for editing content block properties with a live preview.
 *
 * Features:
 * - Split-pane layout (form on left, preview on right)
 * - Live preview updates as form values change
 * - FormProvider wraps both panels for shared state
 * - Save/Cancel buttons
 * - Configurable component registry via config prop
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FormProvider } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { FormRenderer } from '@/lib/pages/admin/components/shared/editing/form/FormRenderer';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { useBlockEditorModal } from './useBlockEditorModal';
import { LiveBlockPreview } from './LiveBlockPreview';
import type { BlockEditorPreviewModalProps } from '../types';

// =============================================================================
// INTERNAL COMPONENTS
// =============================================================================

/**
 * Modal content that has access to FormProvider context
 */
function ModalContent({
  blockType,
  fields,
  componentMap,
  onSave,
  onClose,
}: {
  blockType: NonNullable<BlockEditorPreviewModalProps['blockType']>;
  fields: ReturnType<typeof useBlockEditorModal>['fields'];
  componentMap?: BlockEditorPreviewModalProps['config'];
  onSave: () => void;
  onClose: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {blockType.displayName}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {blockType.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Split Pane */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Panel - Form */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Block Properties
              </h3>
              <p className="text-xs text-gray-500">
                Configure the content block settings below
              </p>
            </div>
            <FormRenderer fields={fields} columns={1} />
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-gray-100 overflow-hidden flex flex-col">
            <LiveBlockPreview
              category={blockType.category}
              type={blockType.name}
              componentMap={componentMap?.componentMap}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              'Save Block'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper component that provides the save handler with access to form data
 */
function ModalContentWithSave({
  blockType,
  fields,
  config,
  handleSave,
  onClose,
}: {
  blockType: NonNullable<BlockEditorPreviewModalProps['blockType']>;
  fields: ReturnType<typeof useBlockEditorModal>['fields'];
  config?: BlockEditorPreviewModalProps['config'];
  handleSave: ReturnType<typeof useBlockEditorModal>['handleSave'];
  onClose: () => void;
}) {
  const { formData } = useFormContext();

  const onSave = () => {
    handleSave(formData);
    onClose();
  };

  return (
    <ModalContent
      blockType={blockType}
      fields={fields}
      componentMap={config}
      onSave={onSave}
      onClose={onClose}
    />
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * BlockEditorPreviewModal - Modal for editing content blocks with live preview
 */
export function BlockEditorPreviewModal({
  isOpen,
  blockType,
  onClose,
  onSave,
  config,
}: BlockEditorPreviewModalProps) {
  // Get fields and handlers from hook
  const { fields, defaultData, handleSave } = useBlockEditorModal({
    blockType,
    onSave,
    config,
  });

  // Don't render if not open or no block type
  if (!isOpen || !blockType) return null;

  return (
    <FormProvider
      initialData={defaultData}
      fields={fields}
    >
      <ModalContentWithSave
        blockType={blockType}
        fields={fields}
        config={config}
        handleSave={handleSave}
        onClose={onClose}
      />
    </FormProvider>
  );
}

export default BlockEditorPreviewModal;
