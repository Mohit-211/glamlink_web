'use client';

/**
 * MapAndContentContainerPropsEditor - UI for configuring Map + Content Container sections
 *
 * Extends ContentContainerPropsEditor with map-specific settings:
 * - Map height, border radius, address overlay toggle
 * - Plus all the ContentContainer settings (title, typography, backgrounds)
 */

import React from 'react';
import { SECTION_REGISTRY } from '@/lib/features/digital-cards/config/sectionRegistry';
import TypographySettings from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';
import type { TypographySettings as TypographySettingsType } from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';

// =============================================================================
// TYPES
// =============================================================================

export interface MapAndContentContainerPropsEditorProps {
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

export function MapAndContentContainerPropsEditor({
  props,
  onChange,
  disabled = false,
}: MapAndContentContainerPropsEditorProps) {
  // Map settings
  const mapHeight = props.mapHeight ?? 150;
  const mapBorderRadius = props.mapBorderRadius ?? 8;
  const showAddressOverlay = props.showAddressOverlay ?? false;

  // Title settings
  const title = props.title ?? '';
  const titleAlignment = props.titleAlignment ?? 'center-with-lines';
  const titleTypography: TypographySettingsType = props.titleTypography ?? {};

  // Inner section settings
  const innerSectionType = props.innerSectionType ?? null;

  // Get available sections (exclude container types to prevent nesting)
  const availableSections = SECTION_REGISTRY.filter(
    s => s.id !== 'contentContainer' && s.id !== 'mapAndContentContainer'
  );

  // Handle field changes
  const updateProp = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  // Handle inner section type change - auto-populate defaults
  const handleSectionTypeChange = (sectionId: string | null) => {
    if (!sectionId) {
      onChange({ ...props, innerSectionType: null, innerSectionProps: {} });
      return;
    }

    const registryItem = SECTION_REGISTRY.find(s => s.id === sectionId);
    const defaults = registryItem?.defaultProps || {};

    onChange({
      ...props,
      innerSectionType: sectionId,
      innerSectionProps: defaults,
    });
  };

  // Handle typography settings change
  const handleTypographyChange = (newTypography: TypographySettingsType) => {
    updateProp('titleTypography', newTypography);
  };

  return (
    <div className="space-y-4">
      {/* ================================================================== */}
      {/* MAP SETTINGS */}
      {/* ================================================================== */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h5 className="text-sm font-medium text-blue-900 mb-3">Map Settings</h5>

        {/* Map Height */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Map Height (px)
          </label>
          <input
            type="number"
            value={mapHeight}
            onChange={(e) => updateProp('mapHeight', parseInt(e.target.value) || 100)}
            disabled={disabled}
            min={50}
            max={400}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        {/* Map Border Radius */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Map Border Radius (px)
          </label>
          <input
            type="number"
            value={mapBorderRadius}
            onChange={(e) => updateProp('mapBorderRadius', parseInt(e.target.value) || 0)}
            disabled={disabled}
            min={0}
            max={30}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        {/* Show Address Overlay */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAddressOverlay"
            checked={showAddressOverlay}
            onChange={(e) => updateProp('showAddressOverlay', e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="showAddressOverlay" className="text-sm text-gray-700">
            Show address overlay on map
          </label>
        </div>
      </div>

      {/* ================================================================== */}
      {/* TITLE SETTINGS */}
      {/* ================================================================== */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => updateProp('title', e.target.value)}
          disabled={disabled}
          placeholder="e.g., Visit Us, Our Location"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional title displayed between map and content
        </p>
      </div>

      {/* Title Typography Settings (only show if title is set) */}
      {title && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title Typography
          </label>
          <TypographySettings
            settings={titleTypography}
            onChange={handleTypographyChange}
            showAlignment={false}
            showColor={true}
            showTag={false}
          />
        </div>
      )}

      {/* Title Alignment Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title Alignment
        </label>
        <select
          value={titleAlignment}
          onChange={(e) => updateProp('titleAlignment', e.target.value)}
          disabled={disabled || !title}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="center-with-lines">Centered with decorative lines</option>
          <option value="center">Centered (plain)</option>
          <option value="left">Left-aligned</option>
        </select>
      </div>

      {/* ================================================================== */}
      {/* INNER SECTION */}
      {/* ================================================================== */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Inner Section Type <span className="text-red-500">*</span>
        </label>
        <select
          value={innerSectionType || ''}
          onChange={(e) => handleSectionTypeChange(e.target.value || null)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">-- Select section to display --</option>
          {availableSections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label} - {section.description}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Choose which section content to display below the map
        </p>
      </div>

      {/* Note: Inner Section Options and Section Styling are configured in separate
          collapsible groups in SectionPositionEditor.tsx, not here */}
    </div>
  );
}

export default MapAndContentContainerPropsEditor;
