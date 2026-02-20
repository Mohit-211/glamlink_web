'use client';

/**
 * CanvasEditor - Canvas Metadata Editor Component
 *
 * Allows users to edit canvas metadata (name, description) before saving.
 * Uses the FormContext to read/write canvas name and description fields.
 */

import React from 'react';
import { useFormContext } from '@/lib/pages/admin/components/shared/editing/form/FormProvider';
import { FormRenderer } from '@/lib/pages/admin/components/shared/editing/form/FormRenderer';
import { canvasInfoFields } from '@/lib/pages/admin/config/fields/digital';

export default function CanvasEditor() {
  const { getFieldValue } = useFormContext();
  const canvasName = getFieldValue('canvasName') || '';
  const canvasDescription = getFieldValue('canvasDescription') || '';

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-4">
      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-green-800 mb-1">
          Canvas Save Settings
        </h4>
        <p className="text-xs text-green-700">
          Configure canvas metadata before saving. This information helps identify
          different versions of your canvas when managing PDFs.
        </p>
      </div>

      {/* Canvas Info Fields */}
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Canvas Information
        </h4>
        <FormRenderer fields={canvasInfoFields} columns={1} />
      </div>

      {/* Preview of What Will Be Saved */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Save Preview
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-500 w-24">Name:</span>
            <span className={canvasName ? 'text-gray-900' : 'text-gray-400 italic'}>
              {canvasName || '(not set - required)'}
            </span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-24">Description:</span>
            <span className={canvasDescription ? 'text-gray-900' : 'text-gray-400 italic'}>
              {canvasDescription || '(optional)'}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Tip:</strong> After filling in the canvas name, click the
          &quot;Save Canvas&quot; button below the preview to save your canvas.
        </p>
        <p>
          Saved canvases can be selected in the PDF Manager when building your
          final magazine PDF.
        </p>
      </div>
    </div>
  );
}
