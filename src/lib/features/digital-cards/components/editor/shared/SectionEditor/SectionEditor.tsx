'use client';

/**
 * SectionEditor - Unified Section Editor for Admin and Profile
 *
 * Combines the functionality of:
 * - SectionPositionEditor (admin) - visibility toggle, remove, custom sections
 * - ProfileSectionEditor (profile) - newly added flow, cancel button
 *
 * Feature flags control which features are enabled:
 * - showVisibilityToggle: Show checkbox to toggle section visibility (admin)
 * - showRemoveButton: Show button to remove section (admin)
 * - showCustomSections: Show CustomLayoutEditor for custom sections (admin)
 * - hideSectionStyling: Hide the Section Styling panel (profile)
 * - showEditingHighlight: Show green border when editing (profile)
 */

import React, { useState } from 'react';
import { PositionSizeFields } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import type { CondensedCardSectionInstance } from '@/lib/features/digital-cards/types/condensedCardConfig';
import type { PositionConfig } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import CustomLayoutEditor from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects/editor/CustomLayoutEditor';
import { InnerSectionPropsEditor } from '../CondensedCardEditor';
import { ContentContainerPropsEditor } from './ContentContainerPropsEditor';
import { MapAndContentContainerPropsEditor } from './MapAndContentContainerPropsEditor';
import { DropshadowContainerPropsEditor } from './DropshadowContainerPropsEditor';
import { SectionStylingEditor } from './SectionStylingEditor';
import { SECTION_REGISTRY } from '@/lib/features/digital-cards/config/sectionRegistry';
import { CollapsibleFieldGroup } from '@/lib/pages/admin/components/shared/editing/fields/CollapsibleFieldGroup';

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get the display label for an inner section type from the registry
 */
const getInnerSectionLabel = (innerSectionType: string): string => {
  const registryItem = SECTION_REGISTRY.find(s => s.id === innerSectionType);
  return registryItem?.label || innerSectionType;
};

// =============================================================================
// TYPES
// =============================================================================

export interface SectionEditorProps {
  /** Section instance configuration */
  section: CondensedCardSectionInstance;
  /** Callback when section changes */
  onChange: (updates: Partial<CondensedCardSectionInstance>) => void;

  // Position editing
  /** Callback to enter drag-to-edit mode for this section */
  onEditPosition?: () => void;
  /** Callback to save position and exit edit mode */
  onSavePosition?: () => void;
  /** Whether this section is currently being edited (drag mode active) */
  isEditing?: boolean;

  // Admin features (visibility/remove)
  /** Show visibility checkbox toggle (admin feature) */
  showVisibilityToggle?: boolean;
  /** Callback when section should be removed (admin feature) */
  onRemove?: () => void;

  // Profile features (newly added flow)
  /** Callback to cancel adding a newly added section (removes it) */
  onCancelAdd?: () => void;
  /** Whether this section was just added (shows Cancel button) */
  isNewlyAdded?: boolean;

  // Feature flags
  /** Hide the Section Styling panel (default: false) */
  hideSectionStyling?: boolean;
  /** Show CustomLayoutEditor for custom sections (admin feature) */
  showCustomSections?: boolean;
  /** Show green border/ring when editing (profile feature) */
  showEditingHighlight?: boolean;

  // Common
  /** Whether the inputs are disabled */
  disabled?: boolean;
  /** Whether expanded by default (overridden by isNewlyAdded for profile) */
  defaultExpanded?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SectionEditor({
  section,
  onChange,
  onEditPosition,
  onSavePosition,
  isEditing = false,
  showVisibilityToggle = false,
  onRemove,
  onCancelAdd,
  isNewlyAdded = false,
  hideSectionStyling = false,
  showCustomSections = false,
  showEditingHighlight = false,
  disabled = false,
  defaultExpanded = false,
}: SectionEditorProps) {
  // Start expanded if newly added, otherwise use defaultExpanded
  const [isExpanded, setIsExpanded] = useState(isNewlyAdded || defaultExpanded);

  const handleVisibilityToggle = () => {
    onChange({ visible: !section.visible });
  };

  const handlePositionChange = (position: PositionConfig) => {
    onChange({ position });
  };

  const handleRemove = () => {
    if (onRemove && confirm(`Remove "${section.label}" section?`)) {
      onRemove();
    }
  };

  // Determine if position fields should be disabled
  // Admin: disabled when section is not visible OR explicitly disabled
  // Profile: only when explicitly disabled
  const isFieldDisabled = disabled || (showVisibilityToggle && !section.visible);

  // Border styling - profile uses green highlight when editing
  const borderClass = showEditingHighlight && isEditing
    ? 'border-green-500 ring-2 ring-green-200'
    : 'border-gray-200';

  // Header background - admin varies based on visibility
  const headerBgClass = showVisibilityToggle
    ? (section.visible ? 'bg-gray-50' : 'bg-gray-100')
    : 'hover:bg-gray-50 transition-colors';

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${borderClass}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${headerBgClass}`}>
        {/* Visibility Checkbox (admin only) */}
        {showVisibilityToggle && (
          <input
            type="checkbox"
            checked={section.visible}
            onChange={(e) => {
              e.stopPropagation();
              handleVisibilityToggle();
            }}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        )}

        {/* Section Label (clickable to expand/collapse) */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex-1 text-left text-sm font-medium transition-colors hover:text-blue-600 ${
            showVisibilityToggle
              ? (section.visible ? 'text-gray-700' : 'text-gray-400')
              : 'text-gray-900'
          }`}
        >
          {section.label}
          {/* Show inner section type for container sections */}
          {(section.sectionType === 'contentContainer' || section.sectionType === 'mapAndContentContainer') &&
           section.props?.innerSectionType && (
            <span className="text-xs font-normal text-gray-500 ml-1">
              ({getInnerSectionLabel(section.props.innerSectionType)})
            </span>
          )}
        </button>

        {/* Z-Index Badge */}
        {section.zIndex !== undefined && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
            Z: {section.zIndex}
          </span>
        )}

        {/* Update Position / Save Position / Cancel Buttons */}
        {isEditing && onSavePosition ? (
          <div className="flex items-center gap-2">
            {/* Cancel button - only for newly added sections (profile) */}
            {isNewlyAdded && onCancelAdd && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelAdd();
                }}
                disabled={disabled}
                className="px-2 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSavePosition();
              }}
              disabled={disabled}
              className="px-2 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-white bg-green-600 hover:bg-green-700"
            >
              Save Position
            </button>
          </div>
        ) : (onEditPosition && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditPosition();
            }}
            disabled={disabled || (showVisibilityToggle && !section.visible)}
            className="px-2 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-blue-600 bg-blue-50 hover:bg-blue-100"
          >
            Update Position + Size
          </button>
        ))}

        {/* Remove Button (admin only) */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            disabled={disabled}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove section"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}

        {/* Expand/Collapse Icon */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded Content with Collapsible Groups */}
      {isExpanded && (
        <div className="px-4 py-4 border-t border-gray-200 bg-white space-y-3">
          {/* Position Group */}
          <CollapsibleFieldGroup
            title="Position"
            description="X, Y coordinates and dimensions"
            defaultExpanded={false}
          >
            <div className="space-y-4">
              {/* Position Controls */}
              <PositionSizeFields
                value={section.position}
                onChange={handlePositionChange}
                showTitle={false}
                showZIndex={false}
                showVisibility={false}
                disabled={isFieldDisabled}
              />

              {/* Z-Index Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Layer Order (Z-Index)
                </label>
                <input
                  type="number"
                  value={section.zIndex || 1}
                  onChange={(e) => onChange({ zIndex: parseInt(e.target.value) || 1 })}
                  disabled={isFieldDisabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  min={0}
                  max={100}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Higher values appear on top of lower values
                </p>
              </div>
            </div>
          </CollapsibleFieldGroup>

          {/* Section Options Group (for container types only) */}
          {(section.sectionType === 'contentContainer' ||
            section.sectionType === 'mapAndContentContainer' ||
            section.sectionType === 'dropshadowContainer') && (
            <CollapsibleFieldGroup
              title="Section Options"
              description="Configure section-specific properties"
              defaultExpanded={false}
            >
              {section.sectionType === 'contentContainer' ? (
                <ContentContainerPropsEditor
                  props={section.props || {}}
                  onChange={(newProps) => onChange({ props: newProps })}
                  disabled={isFieldDisabled}
                />
              ) : section.sectionType === 'mapAndContentContainer' ? (
                <MapAndContentContainerPropsEditor
                  props={section.props || {}}
                  onChange={(newProps) => onChange({ props: newProps })}
                  disabled={isFieldDisabled}
                />
              ) : (
                <DropshadowContainerPropsEditor
                  props={section.props || {}}
                  onChange={(newProps) => onChange({ props: newProps })}
                  disabled={isFieldDisabled}
                />
              )}
            </CollapsibleFieldGroup>
          )}

          {/* Inner Section Options Group - for container types with inner section */}
          {(section.sectionType === 'contentContainer' || section.sectionType === 'mapAndContentContainer') &&
           section.props?.innerSectionType && (
            <CollapsibleFieldGroup
              title="Inner Section Options"
              description={`Configure ${getInnerSectionLabel(section.props.innerSectionType)} properties`}
              defaultExpanded={false}
            >
              <InnerSectionPropsEditor
                sectionType={section.props.innerSectionType}
                props={section.props?.innerSectionProps || {}}
                onChange={(newInnerProps) => onChange({
                  props: {
                    ...section.props,
                    innerSectionProps: newInnerProps,
                  }
                })}
                disabled={isFieldDisabled}
              />
            </CollapsibleFieldGroup>
          )}

          {/* Section Styling Group - for container types (contentContainer and mapAndContentContainer) */}
          {!hideSectionStyling && (section.sectionType === 'contentContainer' || section.sectionType === 'mapAndContentContainer') && (
            <CollapsibleFieldGroup
              title="Section Styling"
              description="Background colors, padding, and border radius"
              defaultExpanded={false}
            >
              <SectionStylingEditor
                props={section.props || {}}
                onChange={(newProps) => onChange({ props: newProps })}
                disabled={isFieldDisabled}
                sectionId={section.id}
              />
            </CollapsibleFieldGroup>
          )}

          {/* Section Options Group - for non-container section types */}
          {section.sectionType !== 'contentContainer' &&
           section.sectionType !== 'mapAndContentContainer' &&
           section.sectionType !== 'dropshadowContainer' &&
           section.sectionType !== 'custom' && (
            <CollapsibleFieldGroup
              title="Section Options"
              description="Configure section-specific properties"
              defaultExpanded={false}
            >
              <InnerSectionPropsEditor
                sectionType={section.sectionType}
                props={section.props || {}}
                onChange={(newProps) => onChange({ props: newProps })}
                disabled={isFieldDisabled}
              />
            </CollapsibleFieldGroup>
          )}

          {/* Content Objects Group (for custom sections only - admin feature) */}
          {showCustomSections && section.sectionType === 'custom' && (
            <CollapsibleFieldGroup
              title="Content Objects"
              description="Add Text, Image, or Link objects"
              defaultExpanded={true}
            >
              <CustomLayoutEditor
                objects={section.layoutObjects || []}
                onChange={(layoutObjects) => onChange({ layoutObjects })}
              />
            </CollapsibleFieldGroup>
          )}
        </div>
      )}
    </div>
  );
}

export default SectionEditor;
