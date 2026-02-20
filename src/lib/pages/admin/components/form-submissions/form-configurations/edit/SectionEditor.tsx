'use client';

import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import type { FormSectionConfig } from '../../types';
import { SECTION_LAYOUT_OPTIONS } from '@/lib/pages/admin/config/fields/getFeatured';
import { useSectionEditor } from './useFormConfigEditor';
import { FieldEditor } from './FieldEditor';

interface SectionEditorProps {
  section: FormSectionConfig;
  onChange: (section: FormSectionConfig) => void;
  onDelete: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function SectionEditor({ section, onChange, onDelete, isExpanded, onToggleExpand }: SectionEditorProps) {
  const {
    expandedFieldId,
    setExpandedFieldId,
    updateSection,
    addField,
    updateField,
    deleteField
  } = useSectionEditor(section, onChange);

  return (
    <div className="border border-gray-300 rounded-lg bg-gray-50">
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100"
        onClick={onToggleExpand}
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">{section.title || 'New Section'}</span>
          <span className="text-sm text-gray-500 ml-2">
            ({section.fields?.length || 0} fields)
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-red-400 hover:text-red-600"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="px-4 py-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => updateSection({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
              <select
                value={section.layout || 'single'}
                onChange={(e) => updateSection({ layout: e.target.value as 'grid' | 'single' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {SECTION_LAYOUT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={section.description || ''}
              onChange={(e) => updateSection({ description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Fields</label>
              <button
                onClick={addField}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>
            <div className="space-y-2">
              {(section.fields || []).map((field) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  onChange={(f) => updateField(field.id, f)}
                  onDelete={() => deleteField(field.id)}
                  isExpanded={expandedFieldId === field.id}
                  onToggleExpand={() => setExpandedFieldId(
                    expandedFieldId === field.id ? null : field.id
                  )}
                />
              ))}
              {(!section.fields || section.fields.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No fields yet. Click "Add Field" to create one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
