'use client';

/**
 * DropshadowContainerPropsEditor - UI for configuring Dropshadow Container sections
 *
 * Provides a structured form UI for configuring DropshadowContainer sections with:
 * - Shadow properties (offset, blur, spread, color, opacity)
 * - Border properties (color, width)
 * - Container styling (background, border radius)
 *
 * No inner section - this is just a styled empty container.
 */

import React, { useState } from 'react';
import { StandaloneColorPicker } from '@/lib/pages/admin/components/shared/editing/fields/backgroundColor/StandaloneColorPicker';

// =============================================================================
// TYPES
// =============================================================================

export interface DropshadowContainerPropsEditorProps {
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

export function DropshadowContainerPropsEditor({
  props,
  onChange,
  disabled = false,
}: DropshadowContainerPropsEditorProps) {
  // Collapsed state for sections
  const [shadowCollapsed, setShadowCollapsed] = useState(false); // Start expanded since it's the main feature
  const [borderCollapsed, setBorderCollapsed] = useState(true);

  // Shadow properties
  const shadowOffsetX = props.shadowOffsetX ?? 4;
  const shadowOffsetY = props.shadowOffsetY ?? 4;
  const shadowBlur = props.shadowBlur ?? 12;
  const shadowSpread = props.shadowSpread ?? 0;
  const shadowColor = props.shadowColor ?? '#000000';
  const shadowOpacity = props.shadowOpacity ?? 0.15;

  // Border properties - default to NO border (just dropshadow)
  const borderColor = props.borderColor ?? '#e5e7eb';
  const borderWidth = props.borderWidth ?? 0;

  // Container properties
  const containerBackground = props.containerBackground ?? '#ffffff';
  const borderRadius = props.borderRadius ?? 12;

  // Handle field changes
  const updateProp = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Shadow Properties - Collapsible */}
      <div className="border border-gray-200 rounded-md">
        <button
          type="button"
          onClick={() => setShadowCollapsed(!shadowCollapsed)}
          className="flex items-center justify-between w-full text-left px-3 py-2 bg-gray-50 rounded-t-md"
        >
          <div>
            <h5 className="text-sm font-medium text-gray-700">Shadow Properties</h5>
            <p className="text-xs text-gray-500">
              Configure drop shadow offset, blur, spread, and color
            </p>
          </div>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${shadowCollapsed ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!shadowCollapsed && (
          <div className="p-3 space-y-3 border-t border-gray-200">
            {/* Shadow Offset X */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shadow Offset X (px)
              </label>
              <input
                type="number"
                value={shadowOffsetX}
                onChange={(e) => updateProp('shadowOffsetX', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={-50}
                max={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">Horizontal shadow offset (negative = left, positive = right)</p>
            </div>

            {/* Shadow Offset Y */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shadow Offset Y (px)
              </label>
              <input
                type="number"
                value={shadowOffsetY}
                onChange={(e) => updateProp('shadowOffsetY', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={-50}
                max={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">Vertical shadow offset (negative = up, positive = down)</p>
            </div>

            {/* Shadow Blur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shadow Blur (px)
              </label>
              <input
                type="number"
                value={shadowBlur}
                onChange={(e) => updateProp('shadowBlur', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={0}
                max={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">Blur radius (0 = sharp edge, higher = softer shadow)</p>
            </div>

            {/* Shadow Spread */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shadow Spread (px)
              </label>
              <input
                type="number"
                value={shadowSpread}
                onChange={(e) => updateProp('shadowSpread', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={-50}
                max={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">Shadow expansion (negative = shrink, positive = grow)</p>
            </div>

            {/* Shadow Color - Using StandaloneColorPicker */}
            <div>
              <StandaloneColorPicker
                value={shadowColor}
                onChange={(value) => updateProp('shadowColor', value)}
                label="Shadow Color"
                helperText="Color of the drop shadow"
                disabled={disabled}
                placeholder="#000000"
              />
            </div>

            {/* Shadow Opacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shadow Opacity ({Math.round(shadowOpacity * 100)}%)
              </label>
              <input
                type="range"
                value={shadowOpacity}
                onChange={(e) => updateProp('shadowOpacity', parseFloat(e.target.value))}
                disabled={disabled}
                min={0}
                max={1}
                step={0.05}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-gray-500">Transparency of the shadow (0 = invisible, 100% = fully opaque)</p>
            </div>
          </div>
        )}
      </div>

      {/* Border & Background Properties - Collapsible */}
      <div className="border border-gray-200 rounded-md">
        <button
          type="button"
          onClick={() => setBorderCollapsed(!borderCollapsed)}
          className="flex items-center justify-between w-full text-left px-3 py-2 bg-gray-50 rounded-t-md"
        >
          <div>
            <h5 className="text-sm font-medium text-gray-700">Border & Background</h5>
            <p className="text-xs text-gray-500">
              Container border, background color, and sizing
            </p>
          </div>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${borderCollapsed ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!borderCollapsed && (
          <div className="p-3 space-y-3 border-t border-gray-200">
            {/* Border Color - Using StandaloneColorPicker */}
            <div>
              <StandaloneColorPicker
                value={borderColor}
                onChange={(value) => updateProp('borderColor', value)}
                label="Border Color"
                helperText="Color of the container border"
                disabled={disabled}
                placeholder="#e5e7eb"
              />
            </div>

            {/* Border Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Width (px)
              </label>
              <input
                type="number"
                value={borderWidth}
                onChange={(e) => updateProp('borderWidth', parseInt(e.target.value) || 0)}
                disabled={disabled}
                min={0}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">Set to 0 to remove border</p>
            </div>

            {/* Container Background - Using StandaloneColorPicker */}
            <div>
              <StandaloneColorPicker
                value={containerBackground}
                onChange={(value) => updateProp('containerBackground', value)}
                label="Container Background"
                helperText="Background color or gradient for the container"
                disabled={disabled}
                placeholder="#ffffff"
              />
            </div>

            {/* Border Radius */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">Rounded corners (0 = square, 12 = slightly rounded)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DropshadowContainerPropsEditor;
