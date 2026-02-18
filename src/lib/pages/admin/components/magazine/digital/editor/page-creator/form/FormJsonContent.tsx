'use client';

import React from 'react';
import { FormProvider } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { FormRenderer } from '@/lib/pages/admin/components/shared/editing/form/FormRenderer';
import { JsonEditor } from '@/lib/pages/admin/components/shared/editing/form/JsonEditor';
import type { DigitalPageData, PagePdfSettings } from '../../types';
import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { EditorTab } from '../usePageCreator';
import CanvasEditor from './CanvasEditor';

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

interface FormJsonContentProps {
  activeTab: EditorTab;
  formKey: string;
  mergedInitialData: Partial<DigitalPageData>;
  fields: FieldConfig[];
  onFieldChange: (name: string, value: any, data: Partial<DigitalPageData>) => void;
  onJsonApply: (data: Partial<DigitalPageData>) => void;
  issueId?: string;
  pdfSettings?: PagePdfSettings;
  availablePages?: AvailablePage[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function FormJsonContent({
  activeTab,
  formKey,
  mergedInitialData,
  fields,
  onFieldChange,
  onJsonApply,
  issueId,
  pdfSettings,
  availablePages,
}: FormJsonContentProps) {
  return (
    <div className="flex-1 min-h-0">
      <FormProvider<Partial<DigitalPageData>>
        key={formKey}
        initialData={mergedInitialData}
        fields={fields}
        onFieldChange={onFieldChange}
        context={{ issueId, pdfSettings, availablePages }}
      >
        {activeTab === 'json' ? (
          <div className="h-full">
            <JsonEditor<Partial<DigitalPageData>>
              onApply={onJsonApply}
              entityType="Digital Page"
              fields={fields}
            />
          </div>
        ) : activeTab === 'canvas' ? (
          <CanvasEditor />
        ) : (
          <div className="h-full overflow-y-auto pr-2">
            <FormRenderer fields={fields} columns={1} />
          </div>
        )}
      </FormProvider>
    </div>
  );
}
