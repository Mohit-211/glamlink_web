'use client';

/**
 * CombinedContainerStylingEditor - Combined Outer + Inner Container Styling
 *
 * A simplified version of the admin's separate Outer Container Styling and
 * Inner Section Styling sections, merged into a single collapsible panel.
 *
 * Includes:
 * - Container Background (with gradient support)
 * - Container Border Radius
 * - Container Padding
 * - Section Background
 * - Section Border Radius
 * - Section Padding
 */

import React, { useState } from 'react';
import { StandaloneColorPicker } from '@/lib/pages/admin/components/shared/editing/fields/backgroundColor/StandaloneColorPicker';

// =============================================================================
// TYPES
// =============================================================================

export interface CombinedContainerStylingEditorProps {
  /** Current props object */
  props: Record<string, any>;
  /** Callback when props change */
  onChange: (props: Record<string, any>) => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CombinedContainerStylingEditor({
  props,
  onChange,
  disabled = false,
}: CombinedContainerStylingEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract current values with defaults
  // Outer container styling
  const containerBackground = props.containerBackground ?? '#ffffff';
  const borderRadius = props.borderRadius ?? 12;
  const padding = props.padding ?? 16;

  // Inner section styling
  const sectionBackground = props.sectionBackground ?? '#ffffff';
  const sectionBorderRadius = props.sectionBorderRadius ?? 8;
  const sectionPadding = props.sectionPadding ?? 12;

  // Handle field changes
  const updateProp = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header - Clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div>
          <h5 className="text-sm font-medium text-gray-700">Container Styling</h5>
          <p className="text-xs text-gray-500">
            Customize background colors, borders, and spacing
          </p>
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content - Collapsible */}
      {isExpanded && (
        <div className="p-4 space-y-6 bg-white">
          {/* Outer Container Section */}
          <div className="space-y-3">
            <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Outer Container
            </h6>

            {/* Container Background Color with Gradient Support */}
            <div>
              <StandaloneColorPicker
                value={containerBackground}
                onChange={(value) => updateProp('containerBackground', value)}
                label="Background"
                helperText="Supports gradients for decorative effects"
                disabled={disabled}
                placeholder="#ffffff or gradient"
              />
            </div>

            {/* Container Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius (px)
              </label>
              <input
                type="number"
                value={borderRadius}
                onChange={(e) => updateProp('borderRadius', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={0}
                max={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-glamlink-teal focus:border-glamlink-teal disabled:bg-gray-100 disabled:text-gray-500 text-sm"
              />
            </div>

            {/* Container Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Padding (px)
              </label>
              <input
                type="number"
                value={padding}
                onChange={(e) => updateProp('padding', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={0}
                max={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-glamlink-teal focus:border-glamlink-teal disabled:bg-gray-100 disabled:text-gray-500 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Space between container edge and content
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Inner Section */}
          <div className="space-y-3">
            <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Inner Content Area
            </h6>

            {/* Section Background Color */}
            <div>
              <StandaloneColorPicker
                value={sectionBackground}
                onChange={(value) => updateProp('sectionBackground', value)}
                label="Background"
                helperText="Usually white or a light color"
                disabled={disabled}
                placeholder="#ffffff"
              />
            </div>

            {/* Section Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius (px)
              </label>
              <input
                type="number"
                value={sectionBorderRadius}
                onChange={(e) => updateProp('sectionBorderRadius', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={0}
                max={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-glamlink-teal focus:border-glamlink-teal disabled:bg-gray-100 disabled:text-gray-500 text-sm"
              />
            </div>

            {/* Section Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Padding (px)
              </label>
              <input
                type="number"
                value={sectionPadding}
                onChange={(e) => updateProp('sectionPadding', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={0}
                max={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-glamlink-teal focus:border-glamlink-teal disabled:bg-gray-100 disabled:text-gray-500 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Inner padding for the content area
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CombinedContainerStylingEditor;
