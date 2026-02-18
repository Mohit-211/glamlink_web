'use client';

/**
 * SectionStylingEditor - Shared styling editor for container sections
 *
 * Extracted from SectionPositionEditor (admin) and ProfileSectionEditor (profile)
 * to eliminate ~200 lines of duplicated code.
 *
 * Provides UI for:
 * - Outer Container Styling: containerBackground, borderRadius, padding, containerHeight, fullWidthSection
 * - Inner Section Styling: sectionBackground, sectionBorderRadius, sectionPadding, sectionMinHeight
 */

import React from 'react';
import { StandaloneColorPicker } from '@/lib/pages/admin/components/shared/editing/fields/backgroundColor/StandaloneColorPicker';

// =============================================================================
// TYPES
// =============================================================================

export interface SectionStylingProps {
  containerBackground?: string;
  borderRadius?: number;
  padding?: number;
  containerHeight?: number;
  fullWidthSection?: boolean;
  sectionBackground?: string;
  sectionBorderRadius?: number;
  sectionPadding?: number;
  sectionMinHeight?: number;
}

export interface SectionStylingEditorProps {
  /** Current props object containing styling values */
  props: SectionStylingProps & Record<string, any>;
  /** Callback when props change */
  onChange: (props: Record<string, any>) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Unique ID for form elements (typically section.id) */
  sectionId: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SectionStylingEditor({
  props,
  onChange,
  disabled = false,
  sectionId,
}: SectionStylingEditorProps) {
  return (
    <div className="space-y-4">
      {/* Outer Container Styling */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Outer Container Styling</h5>
        <p className="text-xs text-gray-500 mb-3">Background color/gradient for the entire container (behind title)</p>

        <div className="space-y-3">
          {/* Container Background */}
          <StandaloneColorPicker
            value={props.containerBackground ?? '#ffffff'}
            onChange={(value) => onChange({
              ...props,
              containerBackground: value,
            })}
            label="Container Background"
            disabled={disabled}
          />

          {/* Container Border Radius */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Border Radius (px)
            </label>
            <input
              type="number"
              value={props.borderRadius ?? 12}
              onChange={(e) => onChange({
                ...props,
                borderRadius: parseInt(e.target.value) || 0,
              })}
              disabled={disabled}
              min={0}
              max={50}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Container Padding */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Padding (px)
            </label>
            <input
              type="number"
              value={props.padding ?? 16}
              onChange={(e) => onChange({
                ...props,
                padding: parseInt(e.target.value) || 0,
              })}
              disabled={disabled}
              min={0}
              max={40}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Container Height */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Container Height (px, 0 for auto)
            </label>
            <input
              type="number"
              value={props.containerHeight ?? 0}
              onChange={(e) => onChange({
                ...props,
                containerHeight: parseInt(e.target.value) || 0,
              })}
              disabled={disabled}
              min={0}
              max={2000}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Full Width Section */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`fullWidthSection-${sectionId}`}
              checked={props.fullWidthSection ?? false}
              onChange={(e) => onChange({
                ...props,
                fullWidthSection: e.target.checked,
              })}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`fullWidthSection-${sectionId}`} className="text-xs text-gray-600">
              Full Width Section (no inner padding/border)
            </label>
          </div>
        </div>
      </div>

      {/* Inner Section Styling */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Inner Section Styling</h5>
        <p className="text-xs text-gray-500 mb-3">Background color for the content area (typically white)</p>

        <div className="space-y-3">
          {/* Section Background */}
          <StandaloneColorPicker
            value={props.sectionBackground ?? '#ffffff'}
            onChange={(value) => onChange({
              ...props,
              sectionBackground: value,
            })}
            label="Section Background"
            disabled={disabled}
          />

          {/* Section Border Radius */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Border Radius (px)
            </label>
            <input
              type="number"
              value={props.sectionBorderRadius ?? 8}
              onChange={(e) => onChange({
                ...props,
                sectionBorderRadius: parseInt(e.target.value) || 0,
              })}
              disabled={disabled}
              min={0}
              max={50}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Section Padding */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Padding (px)
            </label>
            <input
              type="number"
              value={props.sectionPadding ?? 12}
              onChange={(e) => onChange({
                ...props,
                sectionPadding: parseInt(e.target.value) || 0,
              })}
              disabled={disabled}
              min={0}
              max={40}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Section Min Height */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Min Height (px, 0 for auto)
            </label>
            <input
              type="number"
              value={props.sectionMinHeight ?? 0}
              onChange={(e) => onChange({
                ...props,
                sectionMinHeight: parseInt(e.target.value) || 0,
              })}
              disabled={disabled}
              min={0}
              max={2000}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionStylingEditor;
