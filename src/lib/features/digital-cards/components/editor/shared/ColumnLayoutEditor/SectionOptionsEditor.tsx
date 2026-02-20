'use client';

/**
 * SectionOptionsEditor - Comprehensive editor for all section options
 *
 * Structure:
 * - Section Options (all users): Title, Title Typography (collapsible), Title Alignment
 * - [Section Name] Options (all users): Content-specific options
 * - Admin (admin only, collapsible): Z-Index, Position (collapsible), Section Styling (collapsible)
 */

import React, { useState } from 'react';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/sections';
import ImageUploadField from '@/lib/pages/admin/components/shared/editing/fields/custom/media/imageUpload';
import TiptapEditor from '@/lib/pages/admin/components/shared/editing/fields/html/TiptapEditor';
import {
  getSectionTitleOptions,
  getBasicTitleOptions,
  getTitleTypographyOptions,
  getPropsForEditor,
  getSectionAdminOptions,
  getPositionOptions,
  getOuterStylingOptions,
  getInnerStylingOptions,
  getSectionDisplayName,
  type UnifiedPropField,
  type ToggleItem,
} from '@/lib/features/digital-cards/config/sectionPropsConfig';

// =============================================================================
// TYPES
// =============================================================================

export interface SectionOptionsEditorProps {
  /** The section being edited */
  section: CondensedCardSectionInstance;
  /** Current mode (admin or profile) */
  mode: 'admin' | 'profile';
  /** Callback when a section option is changed */
  onChange: (updates: Partial<CondensedCardSectionInstance>) => void;
  /** Callback when inner section props change */
  onInnerPropsChange: (newProps: Record<string, any>) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
}

// =============================================================================
// COLLAPSIBLE SECTION COMPONENT
// =============================================================================

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

function CollapsibleSection({ title, defaultOpen = false, children, className = '' }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-3 bg-white space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// FIELD RENDERER
// =============================================================================

interface FieldRendererProps {
  field: UnifiedPropField;
  value: any;
  allProps: Record<string, any>;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
  colorScheme?: 'purple' | 'green' | 'teal' | 'blue' | 'gray';
}

function FieldRenderer({ field, value, allProps, onChange, disabled, colorScheme = 'purple' }: FieldRendererProps) {
  // Check showWhen condition
  if (field.showWhen && !field.showWhen(allProps)) {
    return null;
  }

  const currentValue = value ?? field.defaultValue;
  const helperText = field.helperText || field.description;

  // Color classes based on scheme
  const colorClasses = {
    purple: {
      checkbox: 'text-purple-600 focus:ring-purple-500',
      input: 'focus:ring-purple-500 focus:border-purple-500',
    },
    green: {
      checkbox: 'text-green-600 focus:ring-green-500',
      input: 'focus:ring-green-500 focus:border-green-500',
    },
    teal: {
      checkbox: 'text-teal-600 focus:ring-teal-500',
      input: 'focus:ring-teal-500 focus:border-teal-500',
    },
    blue: {
      checkbox: 'text-blue-600 focus:ring-blue-500',
      input: 'focus:ring-blue-500 focus:border-blue-500',
    },
    gray: {
      checkbox: 'text-gray-600 focus:ring-gray-500',
      input: 'focus:ring-gray-500 focus:border-gray-500',
    },
  };

  const colors = colorClasses[colorScheme];

  switch (field.type) {
    case 'checkbox':
      return (
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id={field.key}
            checked={currentValue ?? false}
            onChange={(e) => onChange(field.key, e.target.checked)}
            disabled={disabled}
            className={`mt-1 h-4 w-4 rounded border-gray-300 ${colors.checkbox}`}
          />
          <div>
            <label htmlFor={field.key} className="text-sm font-medium text-gray-700 cursor-pointer">
              {field.label}
            </label>
            {helperText && (
              <p className="text-xs text-gray-500">{helperText}</p>
            )}
          </div>
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type="number"
            value={currentValue ?? ''}
            onChange={(e) => onChange(field.key, e.target.value === '' ? undefined : Number(e.target.value))}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${colors.input} disabled:opacity-50 disabled:bg-gray-100`}
          />
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <select
            value={currentValue ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${colors.input} disabled:opacity-50 disabled:bg-gray-100`}
          >
            {field.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    case 'text':
    case 'url':
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            value={currentValue ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${colors.input} disabled:opacity-50 disabled:bg-gray-100`}
          />
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <textarea
            value={currentValue ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={3}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${colors.input} disabled:opacity-50 disabled:bg-gray-100`}
          />
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    case 'color':
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentValue ?? '#000000'}
              onChange={(e) => onChange(field.key, e.target.value)}
              disabled={disabled}
              className="w-10 h-10 border border-gray-300 rounded cursor-pointer disabled:opacity-50"
            />
            <input
              type="text"
              value={currentValue ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder="#000000"
              disabled={disabled}
              className={`flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm ${colors.input} disabled:opacity-50 disabled:bg-gray-100`}
            />
          </div>
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    case 'image':
      return (
        <div>
          <ImageUploadField
            value={currentValue ?? ''}
            onChange={(fieldName, value) => onChange(field.key, value)}
            label={field.label}
            placeholder={field.placeholder || '/images/placeholder.png'}
            fieldName={field.key}
            issueId="condensed-card"
            imageType="content"
          />
          {helperText && (
            <p className="mt-1 text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    case 'html':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <TiptapEditor
            value={currentValue ?? ''}
            onChange={(value) => onChange(field.key, value)}
            disabled={disabled}
            minHeight={100}
            placeholder="Enter formatted content..."
          />
          {helperText && (
            <p className="mt-1 text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    case 'toggleGroup':
      if (!field.toggles) return null;
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {field.toggles.map((toggle: ToggleItem) => {
              const isActive = allProps[toggle.key] ?? toggle.defaultValue ?? true;
              return (
                <button
                  key={toggle.key}
                  type="button"
                  onClick={() => onChange(toggle.key, !isActive)}
                  disabled={disabled}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-full transition-all border
                    ${isActive
                      ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {toggle.label}
                </button>
              );
            })}
          </div>
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SectionOptionsEditor({
  section,
  mode,
  onChange,
  onInnerPropsChange,
  disabled = false,
}: SectionOptionsEditorProps) {
  // Determine section types
  // wrapperSectionType: The actual section type (e.g., 'mapAndContentContainer', 'contentContainer')
  // innerSectionType: The content inside wrapper sections (e.g., 'business-hours', 'signature-work')
  const wrapperSectionType = section.sectionType;
  const innerSectionType = section.props?.innerSectionType || null;
  const isWrapperSection = !!innerSectionType;

  // Props storage
  const wrapperProps = section.props || {};
  const innerProps = section.props?.innerSectionProps || {};

  // Get display names for section headers
  const wrapperDisplayName = getSectionDisplayName(wrapperSectionType);
  const innerDisplayName = innerSectionType ? getSectionDisplayName(innerSectionType) : null;

  // Get field configurations
  const basicTitleOptions = getBasicTitleOptions();
  const typographyOptions = getTitleTypographyOptions();

  // Wrapper section options (e.g., map settings for mapAndContentContainer)
  const wrapperOptions = getPropsForEditor(wrapperSectionType, 'condensedCard', mode);

  // Inner section options (e.g., business hours settings)
  const innerContentOptions = innerSectionType
    ? getPropsForEditor(innerSectionType, 'condensedCard', mode)
    : [];

  // For non-wrapper sections, use wrapper options as content options
  const contentOptions = isWrapperSection ? wrapperOptions : wrapperOptions;

  const adminOptions = getSectionAdminOptions(mode);
  const positionOptions = getPositionOptions(mode);
  const outerStylingOptions = getOuterStylingOptions(mode);
  const innerStylingOptions = getInnerStylingOptions(mode);

  // Check if we have any options to show
  const hasWrapperOptions = wrapperOptions.length > 0;
  const hasInnerOptions = innerContentOptions.length > 0;
  const hasContentOptions = hasWrapperOptions || hasInnerOptions;
  const hasAdminOptions = mode === 'admin' && (
    adminOptions.length > 0 ||
    positionOptions.length > 0 ||
    outerStylingOptions.length > 0 ||
    innerStylingOptions.length > 0
  );

  // Handler for section-level changes (title, alignment, etc.)
  const handleSectionPropChange = (key: string, value: any) => {
    onChange({
      props: {
        ...section.props,
        [key]: value,
      },
    });
  };

  // Handler for inner section prop changes
  const handleInnerPropChange = (key: string, value: any) => {
    if (section.props?.innerSectionType) {
      // Wrapper section - update innerSectionProps
      onInnerPropsChange({
        ...innerProps,
        [key]: value,
      });
    } else {
      // Direct section - update props directly
      onInnerPropsChange({
        ...section.props,
        [key]: value,
      });
    }
  };

  // Handler for admin-level changes (z-index directly on section)
  const handleAdminFieldChange = (key: string, value: any) => {
    if (key === 'zIndex') {
      onChange({ [key]: value });
    } else if (key.startsWith('position.')) {
      // Handle position fields
      const posKey = key.replace('position.', '');
      onChange({
        position: {
          ...section.position,
          [posKey]: { value, unit: '%' },
        },
      });
    } else {
      // Other admin props go to section.props
      handleSectionPropChange(key, value);
    }
  };

  // Get position values for display
  const getPositionValue = (key: string): number => {
    const posKey = key.replace('position.', '') as keyof typeof section.position;
    const posValue = section.position?.[posKey];
    if (typeof posValue === 'object' && posValue !== null && 'value' in posValue) {
      return posValue.value;
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      {/* ================================================================== */}
      {/* SECTION OPTIONS (All Users) - Title, Typography, Alignment */}
      {/* ================================================================== */}
      <div>
        <h5 className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-3">
          Section Options
        </h5>

        <div className="space-y-3">
          {/* Basic Title Options (Title, Alignment) */}
          {basicTitleOptions.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={section.props?.[field.key]}
              allProps={section.props || {}}
              onChange={handleSectionPropChange}
              disabled={disabled}
              colorScheme="purple"
            />
          ))}

          {/* Title Typography (Collapsible) - Only show when showCustomTitle is checked */}
          {typographyOptions.length > 0 && section.props?.showCustomTitle === true && (
            <CollapsibleSection title="Title Typography" defaultOpen={false}>
              {typographyOptions.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  value={section.props?.[field.key]}
                  allProps={section.props || {}}
                  onChange={handleSectionPropChange}
                  disabled={disabled}
                  colorScheme="purple"
                />
              ))}
            </CollapsibleSection>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* WRAPPER SECTION OPTIONS (e.g., Map settings for mapAndContentContainer) */}
      {/* ================================================================== */}
      {hasWrapperOptions && (
        <div>
          <h5 className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-3">
            {wrapperDisplayName} Options
          </h5>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-3">
            {wrapperOptions.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={wrapperProps[field.key]}
                allProps={wrapperProps}
                onChange={handleSectionPropChange}
                disabled={disabled}
                colorScheme="green"
              />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* INNER SECTION OPTIONS (e.g., Business Hours settings) */}
      {/* ================================================================== */}
      {hasInnerOptions && (
        <div>
          <h5 className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-3">
            {innerDisplayName} Options
          </h5>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 space-y-3">
            {innerContentOptions.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={innerProps[field.key]}
                allProps={innerProps}
                onChange={handleInnerPropChange}
                disabled={disabled}
                colorScheme="teal"
              />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* ADMIN OPTIONS (Admin Only, Collapsible) */}
      {/* ================================================================== */}
      {hasAdminOptions && (
        <CollapsibleSection title="Admin" defaultOpen={false} className="border-blue-200">
          <div className="space-y-4">
            {/* Z-Index */}
            {adminOptions.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={(section as any)[field.key]}
                allProps={section as any}
                onChange={handleAdminFieldChange}
                disabled={disabled}
                colorScheme="blue"
              />
            ))}

            {/* Position (Collapsible) */}
            {positionOptions.length > 0 && (
              <CollapsibleSection title="Position" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-3">
                  {positionOptions.map((field) => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={getPositionValue(field.key)}
                      allProps={{}}
                      onChange={handleAdminFieldChange}
                      disabled={disabled}
                      colorScheme="blue"
                    />
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Section Styling (Collapsible) */}
            {(outerStylingOptions.length > 0 || innerStylingOptions.length > 0) && (
              <CollapsibleSection title="Section Styling" defaultOpen={false}>
                {/* Outer Container */}
                {outerStylingOptions.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Outer Container
                    </h6>
                    <div className="space-y-3">
                      {outerStylingOptions.map((field) => (
                        <FieldRenderer
                          key={field.key}
                          field={field}
                          value={section.props?.[field.key]}
                          allProps={section.props || {}}
                          onChange={handleSectionPropChange}
                          disabled={disabled}
                          colorScheme="blue"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Inner Container */}
                {innerStylingOptions.length > 0 && (
                  <div>
                    <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Inner Container
                    </h6>
                    <div className="space-y-3">
                      {innerStylingOptions.map((field) => (
                        <FieldRenderer
                          key={field.key}
                          field={field}
                          value={section.props?.[field.key]}
                          allProps={section.props || {}}
                          onChange={handleSectionPropChange}
                          disabled={disabled}
                          colorScheme="blue"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleSection>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* No options available message */}
      {!hasContentOptions && basicTitleOptions.length === 0 && !hasAdminOptions && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-500 italic">
            No configurable options for this section type.
          </p>
        </div>
      )}
    </div>
  );
}

export default SectionOptionsEditor;
