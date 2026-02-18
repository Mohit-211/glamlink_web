'use client';

import { useState, useRef, useEffect } from 'react';
import { useMessageTemplates } from '../hooks/useMessageTemplates';
import { TEMPLATE_CATEGORY_LABELS, type TemplateCategory, type MessageTemplate, type CreateTemplateInput } from '../types/template';

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalMode = 'list' | 'create' | 'edit';

/**
 * Template Manager modal for admins to create, edit, and delete message templates.
 */
export function TemplateManager({ isOpen, onClose }: TemplateManagerProps) {
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useMessageTemplates();
  const [mode, setMode] = useState<ModalMode>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState<CreateTemplateInput>({
    name: '',
    content: '',
    category: 'custom',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode('list');
      setSelectedTemplate(null);
      setFormData({ name: '', content: '', category: 'custom' });
      setError(null);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (mode !== 'list') {
          setMode('list');
          setSelectedTemplate(null);
          setFormData({ name: '', content: '', category: 'custom' });
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreate = () => {
    setMode('create');
    setFormData({ name: '', content: '', category: 'custom' });
    setError(null);
  };

  const handleEdit = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category,
    });
    setMode('edit');
    setError(null);
  };

  const handleDelete = async (template: MessageTemplate) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }

    const success = await deleteTemplate(template.id);
    if (!success) {
      setError('Failed to delete template');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      setError('Name and content are required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (mode === 'create') {
        const id = await createTemplate(formData);
        if (!id) {
          setError('Failed to create template');
          return;
        }
      } else if (mode === 'edit' && selectedTemplate) {
        const success = await updateTemplate(selectedTemplate.id, formData);
        if (!success) {
          setError('Failed to update template');
          return;
        }
      }

      setMode('list');
      setSelectedTemplate(null);
      setFormData({ name: '', content: '', category: 'custom' });
    } catch (err) {
      setError('An error occurred while saving');
      console.error('Error saving template:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setMode('list');
    setSelectedTemplate(null);
    setFormData({ name: '', content: '', category: 'custom' });
    setError(null);
  };

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const categories: (TemplateCategory | 'all')[] = ['all', 'greeting', 'solution', 'followup', 'closure', 'custom'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        role="dialog"
        aria-label="Template Manager"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'list' ? 'Message Templates' : mode === 'create' ? 'Create Template' : 'Edit Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'list' ? (
            <>
              {/* Category Filter */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      selectedCategory === cat
                        ? 'bg-glamlink-purple text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'All' : (
                      <>
                        <span aria-hidden="true">{TEMPLATE_CATEGORY_LABELS[cat].icon}</span>
                        {' '}
                        {TEMPLATE_CATEGORY_LABELS[cat].label}
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Template List */}
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-6 h-6 mx-auto mb-2 animate-spin text-glamlink-purple" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading templates...
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>{selectedCategory === 'all' ? 'No templates yet' : `No ${TEMPLATE_CATEGORY_LABELS[selectedCategory as TemplateCategory].label} templates`}</p>
                  <button
                    onClick={handleCreate}
                    className="mt-4 text-sm text-glamlink-purple hover:underline"
                  >
                    Create your first template
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-glamlink-purple/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{template.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                              {TEMPLATE_CATEGORY_LABELS[template.category].icon} {TEMPLATE_CATEGORY_LABELS[template.category].label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Used {template.usageCount} time{template.usageCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => handleEdit(template)}
                            className="p-2 text-gray-400 hover:text-glamlink-purple transition-colors"
                            aria-label={`Edit ${template.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(template)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label={`Delete ${template.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Create/Edit Form */
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <input
                  id="template-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Welcome greeting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="template-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="template-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TemplateCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:border-transparent"
                >
                  {(['greeting', 'solution', 'followup', 'closure', 'custom'] as TemplateCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {TEMPLATE_CATEGORY_LABELS[cat].icon} {TEMPLATE_CATEGORY_LABELS[cat].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="template-content" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Content *
                </label>
                <textarea
                  id="template-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Type your template message here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.content.length} characters
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          {mode === 'list' ? (
            <>
              <p className="text-sm text-gray-500">
                {templates.length} template{templates.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-glamlink-purple text-white font-medium rounded-lg hover:bg-glamlink-purple-dark transition-colors"
              >
                + Create Template
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.name.trim() || !formData.content.trim()}
                className="px-4 py-2 bg-glamlink-purple text-white font-medium rounded-lg hover:bg-glamlink-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : mode === 'create' ? 'Create Template' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: TemplateCategory): string {
  const colors: Record<TemplateCategory, string> = {
    greeting: 'bg-green-100 text-green-800',
    solution: 'bg-blue-100 text-blue-800',
    followup: 'bg-yellow-100 text-yellow-800',
    closure: 'bg-purple-100 text-purple-800',
    custom: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}
