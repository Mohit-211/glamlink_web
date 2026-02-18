'use client';

import React from 'react';
import { FormRenderer } from '../form/FormRenderer';
import { JsonEditor } from '../form/JsonEditor';
import DefaultPreviewContainer from './PreviewContainer';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { IssuePreviewComponent } from '@/lib/pages/admin/config/previewComponents';
import type { PreviewContainerProps } from '../types';

export interface ModalDisplayProps<T = Record<string, any>> {
  activeSubTab: 'default' | 'form' | 'preview' | 'json';
  activeFields: FieldConfig[];
  errors: Record<string, string>;
  saveError: string | null;
  previewComponents?: IssuePreviewComponent[] | any[];  // Support both magazine and custom preview components
  PreviewContainer?: React.ComponentType<PreviewContainerProps<any>>;  // Custom preview container
  onJsonApply: (data: T) => void;
}

/**
 * ModalDisplay - Renders form modal content based on active tab
 *
 * Handles:
 * - Error banners (save errors and validation errors)
 * - Content switching between default/form/preview/json modes
 * - Default mode: Split view with form (40%) + preview (60%)
 * - Form mode: Standard 2-column form
 * - Preview mode: Full-width preview
 * - JSON mode: JSON editor
 */
export function ModalDisplay<T extends Record<string, any> = Record<string, any>>({
  activeSubTab,
  activeFields,
  errors,
  saveError,
  previewComponents,
  PreviewContainer: CustomPreviewContainer,
  onJsonApply,
}: ModalDisplayProps<T>) {
  // Use custom preview container if provided, otherwise use default
  const PreviewContainerComponent = CustomPreviewContainer || DefaultPreviewContainer;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {/* Error Banner */}
      {saveError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{saveError}</p>
        </div>
      )}

      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm font-medium text-amber-800 mb-1">
            Please fix the following errors:
          </p>
          <ul className="text-sm text-amber-700 list-disc list-inside">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Content based on active subtab */}
      {activeSubTab === 'default' && previewComponents ? (
        /* Default Tab: Split view with Form (40%) + Preview (60%) */
        <div className="grid grid-cols-[40%_60%] gap-4">
          <div className="overflow-y-auto">
            <FormRenderer fields={activeFields} columns={1} />
          </div>
          <div className="overflow-y-auto">
            <PreviewContainerComponent previewComponents={previewComponents} />
          </div>
        </div>
      ) : activeSubTab === 'form' ? (
        /* Form Tab: Standard 2-column form */
        <FormRenderer fields={activeFields} columns={2} />
      ) : activeSubTab === 'preview' && previewComponents ? (
        /* Preview Tab: Full-width preview only */
        <PreviewContainerComponent previewComponents={previewComponents} />
      ) : activeSubTab === 'json' ? (
        /* JSON Tab: JSON editor */
        <JsonEditor<T> fields={activeFields} onApply={onJsonApply} />
      ) : (
        /* Fallback for cases where preview isn't available */
        <FormRenderer fields={activeFields} columns={2} />
      )}
    </div>
  );
}

export default ModalDisplay;
