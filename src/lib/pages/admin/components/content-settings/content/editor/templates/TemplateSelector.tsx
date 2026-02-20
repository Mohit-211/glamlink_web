'use client';

import { useState } from 'react';
import type { SectionTemplate } from '../../sections/for-clients/types';
import { DeleteIcon, SpinnerIcon } from '@/lib/pages/admin/components/shared/common';

interface TemplateSelectorProps {
  templates: SectionTemplate[];
  selectedTemplateId: string | null;
  isLoading: boolean;
  onSelect: (templateId: string | null) => void;
  onDelete: (templateId: string) => Promise<void>;
}

/**
 * TemplateSelector - Dropdown for selecting and managing section templates
 *
 * Features:
 * - Dropdown showing all templates for section type
 * - "New (Custom)" option to clear selection
 * - Delete button per template
 * - Loading state during fetch
 */
export default function TemplateSelector({
  templates,
  selectedTemplateId,
  isLoading,
  onSelect,
  onDelete
}: TemplateSelectorProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(templateId);
    try {
      await onDelete(templateId);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <SpinnerIcon />
        <span>Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Template
      </label>
      <div className="flex items-center gap-2">
        <select
          value={selectedTemplateId || ''}
          onChange={(e) => onSelect(e.target.value || null)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal"
        >
          <option value="">New (Custom)</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.category ? `[${template.category}] ` : ''}{template.name}
            </option>
          ))}
        </select>

        {/* Delete button - only show when template is selected */}
        {selectedTemplateId && (
          <button
            type="button"
            onClick={(e) => handleDelete(selectedTemplateId, e)}
            disabled={isDeleting === selectedTemplateId}
            className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            title="Delete template"
          >
            {isDeleting === selectedTemplateId ? (
              <SpinnerIcon />
            ) : (
              <DeleteIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Select a saved template or create a new custom configuration
      </p>
    </div>
  );
}
