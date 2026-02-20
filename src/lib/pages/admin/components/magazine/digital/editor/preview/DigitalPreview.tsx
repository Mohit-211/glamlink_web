import React, { forwardRef, useState } from 'react';
import type { DigitalPageType } from '../types';
import type { CustomObject } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects';
import { CustomLayoutOverlay } from './overlay';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface DigitalPreviewProps {
  canvasDataUrl: string | null;
  backgroundColor: string;
  width: number;
  height: number;
  showBorder?: boolean;
  isGenerating?: boolean;
  progress?: string;
  error?: string | null;
  onGenerate: () => void;
  onGenerateExample: () => void;
  onSaveCanvas?: () => void;
  isSavingCanvas?: boolean;
  // Custom layout overlay props
  pageType?: DigitalPageType;
  objects?: CustomObject[];
}

// =============================================================================
// COMPONENT
// =============================================================================

const DigitalPreview = forwardRef<HTMLDivElement, DigitalPreviewProps>(
  function DigitalPreview(
    {
      canvasDataUrl,
      backgroundColor,
      width,
      height,
      showBorder = true,
      isGenerating = false,
      progress = '',
      error = null,
      onGenerate,
      onGenerateExample,
      onSaveCanvas,
      isSavingCanvas = false,
      pageType,
      objects = [],
    },
    ref
  ) {
    // State for showing overlay on custom layout pages
    const [showOverlay, setShowOverlay] = useState(false);

    // Check if this is a custom layout page
    const isCustomLayout = pageType === 'page-custom';
    const hasObjects = objects.length > 0;

    return (
      <>
        <div
          ref={ref}
          className={`overflow-hidden ${showBorder ? 'border border-gray-300 shadow-lg' : ''}`}
          style={{
            position: 'relative',
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor,
          }}
        >
        {/* BLANK STATE - No canvas generated yet */}
        {!canvasDataUrl && !isGenerating && !error && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-50">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500 mb-1">No preview generated</p>
              <p className="text-xs text-gray-400 mb-4">
                {isCustomLayout && hasObjects
                  ? 'Toggle "Show Positions" to preview object placement'
                  : 'Generate a preview to see exactly what your PDF will look like'
                }
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onGenerate}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Preview
              </button>
              <button
                type="button"
                onClick={onGenerateExample}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Generate Example
              </button>
            </div>
          </div>
        )}

        {/* GENERATING STATE */}
        {isGenerating && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-sm text-gray-600">{progress || 'Generating preview...'}</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !isGenerating && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-red-50 p-4">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-red-600 text-center max-w-xs">{error}</p>
            <button
              type="button"
              onClick={onGenerate}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* CANVAS PREVIEW - Shows html2canvas output */}
        {canvasDataUrl && !isGenerating && !error && (
          <img
            src={canvasDataUrl}
            alt="Preview"
            className="w-full h-full object-contain"
            style={{ imageRendering: 'auto' }}
          />
        )}

        {/* OVERLAY - Shows object positions when toggled (works in both blank and canvas states) */}
        {isCustomLayout && showOverlay && hasObjects && (
          <CustomLayoutOverlay objects={objects} />
        )}
      </div>

      {/* Action buttons below preview */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
        {/* Show positions toggle for custom layout (always show when custom layout) */}
        {isCustomLayout && hasObjects && (
          <button
            type="button"
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              showOverlay
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {showOverlay ? 'Hide Positions' : 'Show Positions'}
          </button>
        )}

        {/* Regenerate buttons (shown when canvas exists) */}
        {canvasDataUrl && !isGenerating && !error && (
          <>
            <button
              type="button"
              onClick={onGenerate}
              className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={onGenerateExample}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Load Example
            </button>
            {onSaveCanvas && (
              <button
                type="button"
                onClick={onSaveCanvas}
                disabled={isSavingCanvas}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingCanvas ? 'Saving...' : 'Save Canvas'}
              </button>
            )}
          </>
        )}
      </div>
    </>
    );
  }
);

export default DigitalPreview;
