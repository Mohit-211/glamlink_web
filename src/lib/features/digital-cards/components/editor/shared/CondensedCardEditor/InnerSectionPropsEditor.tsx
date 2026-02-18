'use client';

/**
 * InnerSectionPropsEditor - UI for editing inner section props
 *
 * Shows appropriate form fields based on the selected inner section type.
 * Makes it easy to discover and edit available options without needing to
 * know the JSON structure or look up documentation.
 *
 * Uses the unified section props config - props without visibility flags
 * are shared between Card Sections and Condensed Card editors.
 */

import React from 'react';
import ImageUploadField from '@/lib/pages/admin/components/shared/editing/fields/custom/media/imageUpload';
import TiptapEditor from '@/lib/pages/admin/components/shared/editing/fields/html/TiptapEditor';
import {
  getPropsForEditor,
  isPropShared,
  type UnifiedPropField,
  type ToggleItem,
} from '@/lib/features/digital-cards/config/sectionPropsConfig';

// =============================================================================
// TYPES
// =============================================================================

export interface InnerSectionPropsEditorProps {
  /** The selected inner section type */
  sectionType: string | null;
  /** Current inner section props */
  props: Record<string, any>;
  /** Callback when props change */
  onChange: (props: Record<string, any>) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Editor mode - determines which options are shown (filters adminOnly props) */
  mode?: 'admin' | 'profile';
}

// =============================================================================
// COMPONENT
// =============================================================================

export function InnerSectionPropsEditor({
  sectionType,
  props,
  onChange,
  disabled = false,
  mode = 'admin',
}: InnerSectionPropsEditorProps) {
  // Get the configuration for this section type, filtered for Condensed Card editor and mode
  const config = sectionType ? getPropsForEditor(sectionType, 'condensedCard', mode) : null;

  // Handle prop changes
  const updateProp = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  // Check if a prop is shared (syncs with Card Sections)
  const checkIsShared = (propKey: string): boolean => {
    return sectionType ? isPropShared(sectionType, propKey) : false;
  };

  // Render the shared badge
  const SharedBadge = () => (
    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-50 text-purple-600">
      Synced
    </span>
  );

  // If no section type selected or no config available
  if (!sectionType) {
    return null;
  }

  if (!config || config.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <p className="text-sm text-gray-500 italic">
          No configurable options for this section type.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-3">
      <h6 className="text-sm font-medium text-green-900 mb-3">
        Inner Section Options
      </h6>
      <div className="space-y-3">
        {config.map((field) => {
          // Check if field should be shown based on showWhen condition
          if (field.showWhen && !field.showWhen(props)) {
            return null;
          }

          const isShared = checkIsShared(field.key);

          return (
          <div key={field.key}>
            {field.type === 'checkbox' && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={`inner-${field.key}`}
                  checked={props[field.key] ?? field.defaultValue ?? false}
                  onChange={(e) => updateProp(field.key, e.target.checked)}
                  disabled={disabled}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div>
                  <label htmlFor={`inner-${field.key}`} className="text-sm font-medium text-gray-700">
                    {field.label}
                    {isShared && <SharedBadge />}
                  </label>
                  {field.description && (
                    <p className="text-xs text-gray-500">{field.description}</p>
                  )}
                </div>
              </div>
            )}

            {field.type === 'number' && (
              <div>
                <label htmlFor={`inner-${field.key}`} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {isShared && <SharedBadge />}
                </label>
                <input
                  type="number"
                  id={`inner-${field.key}`}
                  value={props[field.key] ?? field.defaultValue ?? 0}
                  onChange={(e) => updateProp(field.key, parseInt(e.target.value) || field.defaultValue)}
                  disabled={disabled}
                  min={field.min}
                  max={field.max}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                {field.description && (
                  <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            )}

            {field.type === 'text' && (
              <div>
                <label htmlFor={`inner-${field.key}`} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {isShared && <SharedBadge />}
                </label>
                <input
                  type="text"
                  id={`inner-${field.key}`}
                  value={props[field.key] ?? field.defaultValue ?? ''}
                  onChange={(e) => updateProp(field.key, e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                {field.description && (
                  <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            )}

            {field.type === 'select' && (
              <div>
                <label htmlFor={`inner-${field.key}`} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {isShared && <SharedBadge />}
                </label>
                <select
                  id={`inner-${field.key}`}
                  value={props[field.key] ?? field.defaultValue ?? ''}
                  onChange={(e) => updateProp(field.key, e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  {field.options?.map((option) => (
                    <option key={String(option.value)} value={String(option.value)}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {field.description && (
                  <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            )}

            {field.type === 'image' && (
              <div>
                <ImageUploadField
                  value={props[field.key] ?? field.defaultValue ?? ''}
                  onChange={(fieldName, value) => updateProp(field.key, value)}
                  label={field.label}
                  placeholder={field.placeholder || '/images/placeholder.png'}
                  fieldName={field.key}
                  issueId="condensed-card"
                  imageType="content"
                />
                {field.description && (
                  <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            )}

            {field.type === 'html' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <TiptapEditor
                  value={props[field.key] ?? field.defaultValue ?? ''}
                  onChange={(value) => updateProp(field.key, value)}
                  disabled={disabled}
                  minHeight={100}
                  placeholder="Enter formatted content..."
                />
                {field.description && (
                  <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            )}

            {field.type === 'toggleGroup' && field.toggles && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {field.toggles.map((toggle: ToggleItem) => {
                    const isActive = props[toggle.key] ?? toggle.defaultValue ?? true;
                    return (
                      <button
                        key={toggle.key}
                        type="button"
                        onClick={() => updateProp(toggle.key, !isActive)}
                        disabled={disabled}
                        className={`
                          px-3 py-1.5 text-xs font-medium rounded-full transition-all
                          ${isActive
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                          }
                          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {toggle.label}
                      </button>
                    );
                  })}
                </div>
                {(field.helperText || field.description) && (
                  <p className="mt-2 text-xs text-gray-500">{field.helperText || field.description}</p>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default InnerSectionPropsEditor;
