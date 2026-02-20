'use client';

import { Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import type { FormFieldConfig } from '../../types';
import { FORM_FIELD_TYPE_OPTIONS } from '@/lib/pages/admin/config/fields/getFeatured';
import { useFieldEditor } from './useFormConfigEditor';

interface FieldEditorProps {
  field: FormFieldConfig;
  onChange: (field: FormFieldConfig) => void;
  onDelete: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function FieldEditor({ field, onChange, onDelete, isExpanded, onToggleExpand }: FieldEditorProps) {
  const {
    updateField,
    addOption,
    updateOption,
    deleteOption,
    showOptions
  } = useFieldEditor(field, onChange);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
        onClick={onToggleExpand}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm">{field.label || 'New Field'}</span>
          <span className="text-xs text-gray-500 ml-2">({field.type})</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-red-400 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="px-3 py-3 border-t border-gray-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Field Key</label>
              <input
                type="text"
                value={field.name || ''}
                onChange={(e) => updateField({ name: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                placeholder="e.g., bio"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={field.label || ''}
                onChange={(e) => updateField({ label: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                placeholder="e.g., Your Bio"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={field.type}
                onChange={(e) => updateField({ type: e.target.value as any })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
              >
                {FORM_FIELD_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField({ required: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Helper Text</label>
            <input
              type="text"
              value={field.helperText || ''}
              onChange={(e) => updateField({ helperText: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
            />
          </div>

          {/* Options for select/radio/checkbox fields */}
          {showOptions && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">Options</label>
                <button
                  onClick={addOption}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  + Add Option
                </button>
              </div>
              <div className="space-y-2">
                {(field.options || []).map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option.id}
                      onChange={(e) => updateOption(idx, { id: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
                      placeholder="ID"
                    />
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updateOption(idx, { label: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
                      placeholder="Label"
                    />
                    <button
                      onClick={() => deleteOption(idx)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
