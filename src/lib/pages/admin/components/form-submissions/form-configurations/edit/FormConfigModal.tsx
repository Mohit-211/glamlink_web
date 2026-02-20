'use client';

/**
 * FormConfigModal - Modal for creating/editing form configurations
 *
 * Provides a form builder interface for managing Get Featured forms.
 * Supports adding/editing sections and fields within sections.
 * Also supports JSON editing mode for advanced users.
 */

import { useState } from 'react';
import { X, Plus, Code, FileEdit, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import type { GetFeaturedFormConfig, UnifiedFormConfig } from '../../types';
import { FORM_ICON_OPTIONS } from '@/lib/pages/admin/config/fields/getFeatured';
import { useFormConfigEditor } from './useFormConfigEditor';
import { SectionEditor } from './SectionEditor';
import { digitalCardFormConfig } from '../data';

// =============================================================================
// TYPES
// =============================================================================

type EditorMode = 'form' | 'json';

interface FormConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<GetFeaturedFormConfig>) => Promise<void>;
  initialData?: GetFeaturedFormConfig | null;
  isSaving?: boolean;
}

// =============================================================================
// SAMPLE CONFIGS FOR JSON EDITOR
// =============================================================================

const SAMPLE_CONFIGS: Record<string, UnifiedFormConfig> = {
  'digital-card': digitalCardFormConfig,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FormConfigModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false
}: FormConfigModalProps) {
  const {
    formData,
    updateFormData,
    setFormData,
    expandedSectionId,
    setExpandedSectionId,
    isEditing,
    addSection,
    updateSection,
    deleteSection
  } = useFormConfigEditor({ initialData });

  // JSON Editor state
  const [editorMode, setEditorMode] = useState<EditorMode>('form');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (editorMode === 'json') {
      // Parse and save JSON
      try {
        const parsed = JSON.parse(jsonText);
        await onSave(parsed);
      } catch (err) {
        setJsonError('Invalid JSON. Please fix before saving.');
        return;
      }
    } else {
      await onSave(formData);
    }
  };

  // JSON Editor handlers
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);
    try {
      JSON.parse(text);
      setJsonError(null);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err) {
      // Keep current text if invalid
    }
  };

  const handleLoadSample = (sampleKey: string) => {
    const sample = SAMPLE_CONFIGS[sampleKey];
    if (sample) {
      // Generate a unique ID for new configs
      const now = new Date().toISOString();
      const configWithTimestamps = {
        ...sample,
        id: sample.id + '-' + Date.now().toString(36),
        createdAt: now,
        updatedAt: now
      };
      setJsonText(JSON.stringify(configWithTimestamps, null, 2));
      setJsonError(null);
    }
  };

  const handleApplyJsonToForm = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setFormData(parsed);
      setEditorMode('form');
    } catch (err) {
      setJsonError('Cannot apply invalid JSON');
    }
  };

  const handleSwitchToJson = () => {
    setJsonText(JSON.stringify(formData, null, 2));
    setJsonError(null);
    setEditorMode('json');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Form Configuration' : 'Create Form Configuration'}
          </h2>
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex rounded-md border border-gray-300">
              <button
                onClick={() => setEditorMode('form')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-l-md transition-colors ${
                  editorMode === 'form'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileEdit className="w-4 h-4" />
                Form
              </button>
              <button
                onClick={handleSwitchToJson}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-r-md transition-colors ${
                  editorMode === 'json'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Code className="w-4 h-4" />
                JSON
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {editorMode === 'json' ? (
            /* JSON Editor Mode */
            <div className="space-y-4">
              {/* Sample Templates */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Load Template:</span>
                <button
                  onClick={() => handleLoadSample('digital-card')}
                  className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-100 rounded-md hover:bg-teal-200 transition-colors"
                >
                  Digital Card Form
                </button>
              </div>

              {/* JSON Tools */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Edit JSON directly or load a template. Click "Save Configuration" when done.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    title="Format JSON"
                  >
                    Format
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyJsonToForm}
                    disabled={!!jsonError}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                    title="Apply to Form editor"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Apply to Form
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error display */}
              {jsonError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Invalid JSON</p>
                    <p className="text-xs text-red-600 mt-0.5 font-mono">{jsonError}</p>
                  </div>
                </div>
              )}

              {/* JSON textarea */}
              <textarea
                value={jsonText}
                onChange={handleJsonChange}
                className={`w-full h-[500px] px-4 py-3 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 resize-y ${
                  jsonError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="Paste or type JSON configuration here..."
                spellCheck={false}
              />

              {/* Help text */}
              <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-md">
                <p><strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Click a template button above to load a sample configuration</li>
                  <li>JSON is validated in real-time as you type</li>
                  <li>Use "Format" to prettify the JSON</li>
                  <li>Use "Apply to Form" to switch to form view with this data</li>
                  <li>Required fields: <code className="bg-gray-200 px-1 rounded">id</code>, <code className="bg-gray-200 px-1 rounded">category</code>, <code className="bg-gray-200 px-1 rounded">title</code></li>
                </ul>
              </div>
            </div>
          ) : (
            /* Form Editor Mode */
            <>
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form ID</label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => updateFormData({ id: e.target.value })}
                  disabled={isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  placeholder="e.g., cover"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier (cannot be changed)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Cover Feature"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => updateFormData({ description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe what this form is for..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={formData.icon || 'star'}
                  onChange={(e) => updateFormData({ icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {FORM_ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order || 1}
                  onChange={(e) => updateFormData({ order: parseInt(e.target.value) || 1 })}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.enabled ?? true}
                    onChange={(e) => updateFormData({ enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Color</label>
              <input
                type="text"
                value={formData.bannerColor || ''}
                onChange={(e) => updateFormData({ bannerColor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., bg-gradient-to-r from-purple-600 to-pink-600"
              />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Form Sections</h3>
              <button
                onClick={addSection}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </button>
            </div>

            <div className="space-y-3">
              {(formData.sections || []).map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onChange={(s) => updateSection(section.id, s)}
                  onDelete={() => deleteSection(section.id)}
                  isExpanded={expandedSectionId === section.id}
                  onToggleExpand={() => setExpandedSectionId(
                    expandedSectionId === section.id ? null : section.id
                  )}
                />
              ))}
              {(!formData.sections || formData.sections.length === 0) && (
                <p className="text-center text-gray-500 py-8">
                  No sections yet. Click "Add Section" to create one.
                </p>
              )}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
