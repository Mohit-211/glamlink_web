'use client';

import { X, FileImage, Monitor, Loader2, AlertCircle } from 'lucide-react';
import type { ImageExportMode } from '../useCardShare';

// =============================================================================
// TYPES
// =============================================================================

export interface SaveImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mode: ImageExportMode) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function SaveImageModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  error,
}: SaveImageModalProps) {
  if (!isOpen) return null;

  const handleSave = async (mode: ImageExportMode) => {
    await onSave(mode);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Save as Image
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm">
            Choose how you want to save your digital card:
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 gap-4">
            {/* Condensed Card Option */}
            <button
              onClick={() => handleSave('condensed')}
              disabled={isSaving}
              className={`
                flex items-start gap-4 p-4 rounded-xl border-2 text-left
                transition-all duration-200
                ${isSaving
                  ? 'opacity-50 cursor-not-allowed border-gray-200'
                  : 'border-gray-200 hover:border-glamlink-teal hover:bg-glamlink-teal/5'
                }
              `}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-glamlink-teal/10 rounded-lg flex items-center justify-center">
                <FileImage className="w-6 h-6 text-glamlink-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Condensed Card
                </h3>
                <p className="text-sm text-gray-500">
                  A compact, stylized version optimized for sharing on social media (1080x1350)
                </p>
              </div>
              {isSaving && (
                <Loader2 className="w-5 h-5 text-glamlink-teal animate-spin flex-shrink-0" />
              )}
            </button>

            {/* Full Screenshot Option */}
            <button
              onClick={() => handleSave('full')}
              disabled={isSaving}
              className={`
                flex items-start gap-4 p-4 rounded-xl border-2 text-left
                transition-all duration-200
                ${isSaving
                  ? 'opacity-50 cursor-not-allowed border-gray-200'
                  : 'border-gray-200 hover:border-glamlink-teal hover:bg-glamlink-teal/5'
                }
              `}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Full Screenshot
                </h3>
                <p className="text-sm text-gray-500">
                  Capture the entire digital card exactly as displayed on screen
                </p>
              </div>
              {isSaving && (
                <Loader2 className="w-5 h-5 text-glamlink-teal animate-spin flex-shrink-0" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export { SaveImageModal };
