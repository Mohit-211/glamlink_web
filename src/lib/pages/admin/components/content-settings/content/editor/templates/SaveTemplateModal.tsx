'use client';

import { useState } from 'react';
import { SpinnerIcon } from '@/lib/pages/admin/components/shared/common';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category?: string) => Promise<void>;
  mode: 'create' | 'update';
  currentTemplateName?: string;
  currentTemplateCategory?: string;
  showCategoryField?: boolean; // Show category field (especially useful for html-content templates)
}

/**
 * SaveTemplateModal - Dialog for saving or updating section templates
 *
 * Features:
 * - Input for template name
 * - Optional category input for organization
 * - Validates name not empty
 * - Triggers save with current form data
 * - Handles both create and update modes
 */
export default function SaveTemplateModal({
  isOpen,
  onClose,
  onSave,
  mode,
  currentTemplateName = '',
  currentTemplateCategory = '',
  showCategoryField = false
}: SaveTemplateModalProps) {
  const [templateName, setTemplateName] = useState(currentTemplateName);
  const [category, setCategory] = useState(currentTemplateCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(templateName.trim(), category.trim() || undefined);
      onClose();
      setTemplateName('');
      setCategory('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setTemplateName('');
    setCategory('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Save as Template' : 'Update Template'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSaving}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            {showCategoryField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Headers, Footers, CTAs, Announcements"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal"
                  disabled={isSaving}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional category label to help organize and filter templates
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => {
                  setTemplateName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Summer Hero Layout"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal"
                disabled={isSaving}
                autoFocus={!showCategoryField}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {mode === 'create'
                  ? 'Give your template a descriptive name for future reference'
                  : 'Update the template name if needed'
                }
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal border border-transparent rounded-md hover:bg-glamlink-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isSaving ? (
                <>
                  <SpinnerIcon />
                  <span>Saving...</span>
                </>
              ) : (
                mode === 'create' ? 'Save Template' : 'Update Template'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
