'use client';

/**
 * ContentContainerPropsEditor - UI for configuring Content Container sections
 *
 * Provides a structured form UI for configuring ContentContainer sections with:
 * - Title text input with typography settings (font size, family, weight, color)
 * - Title alignment dropdown
 * - Inner section type dropdown (auto-populated from SECTION_REGISTRY)
 * - Auto-populate defaults when section type changes
 * - Container styling with gradient support (background color, border radius, padding)
 */

import React from 'react';
import { SECTION_REGISTRY } from '@/lib/features/digital-cards/config/sectionRegistry';
import TypographySettings from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';
import type { TypographySettings as TypographySettingsType } from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';

// =============================================================================
// TYPES
// =============================================================================

export interface ContentContainerPropsEditorProps {
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

export function ContentContainerPropsEditor({
  props,
  onChange,
  disabled = false,
}: ContentContainerPropsEditorProps) {
  // Extract current values with defaults
  const titleDisplayPreset = props.titleDisplayPreset ?? 'professional-name';
  const title = props.title ?? '';
  const titleAlignment = props.titleAlignment ?? 'center-with-lines';
  const titleTypography: TypographySettingsType = props.titleTypography ?? {};
  const innerSectionType = props.innerSectionType ?? null;

  // Get available sections (exclude contentContainer itself to prevent nesting)
  const availableSections = SECTION_REGISTRY.filter(s => s.id !== 'contentContainer');

  // Handle field changes
  const updateProp = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  // Handle inner section type change - auto-populate defaults
  const handleSectionTypeChange = (sectionId: string | null) => {
    if (!sectionId) {
      updateProp('innerSectionType', null);
      updateProp('innerSectionProps', {});
      return;
    }

    const registryItem = SECTION_REGISTRY.find(s => s.id === sectionId);
    const defaults = registryItem?.defaultProps || {};

    onChange({
      ...props,
      innerSectionType: sectionId,
      innerSectionProps: defaults, // Auto-populate with section defaults
    });
  };

  // Handle typography settings change
  const handleTypographyChange = (newTypography: TypographySettingsType) => {
    updateProp('titleTypography', newTypography);
  };

  // Check if this is a Header and Bio section (for special title preset)
  const isHeaderAndBioSection = innerSectionType === 'headerAndBio';

  return (
    <div className="space-y-4">
      {/* Title Display Preset - ONLY for Header and Bio section */}
      {isHeaderAndBioSection && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title Display
          </label>
          <select
            value={titleDisplayPreset}
            onChange={(e) => {
              const newPreset = e.target.value;
              updateProp('titleDisplayPreset', newPreset);
              // Auto-set title when switching to professional-name preset
              if (newPreset === 'professional-name') {
                updateProp('title', 'About {name}');
              }
            }}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="professional-name">Professional&apos;s Name</option>
            <option value="custom">Custom</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {titleDisplayPreset === 'professional-name'
              ? 'Shows "About [Pro Name]" automatically'
              : 'Enter a custom title below'}
          </p>
        </div>
      )}

      {/* Title Input - for Header and Bio: only show for custom preset; for others: always show */}
      {(isHeaderAndBioSection ? titleDisplayPreset === 'custom' : true) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isHeaderAndBioSection ? 'Custom Title' : 'Title'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => updateProp('title', e.target.value)}
            disabled={disabled}
            placeholder={isHeaderAndBioSection ? "e.g., My Services, Visit Us, Contact Me" : "e.g., About {name}, My Services, Visit Us"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            {isHeaderAndBioSection
              ? <>Use <code className="bg-gray-100 px-1 rounded">{'{name}'}</code> to insert the professional&apos;s name dynamically.</>
              : <>Optional title displayed above the section content. Use <code className="bg-gray-100 px-1 rounded">{'{name}'}</code> to insert the professional&apos;s name dynamically.</>
            }
          </p>
        </div>
      )}

      {/* Title Typography Settings - show if title exists or for Header and Bio section */}
      {(title || isHeaderAndBioSection) && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title Typography
          </label>
          <TypographySettings
            settings={titleTypography}
            onChange={handleTypographyChange}
            showAlignment={false} // We have a separate alignment dropdown
            showColor={true}
            showTag={false}
          />
          <p className="mt-2 text-xs text-gray-500">
            Customize font size, family, weight, and color for the title
          </p>
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
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="center-with-lines">Centered with decorative lines</option>
          <option value="center">Centered (plain)</option>
          <option value="left">Left-aligned</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          How the title should be displayed
        </p>
      </div>

      {/* Inner Section Type Dropdown */}
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
          Choose which section content to display inside the container
        </p>
      </div>

      {/* Note: Inner Section Options and Section Styling are configured in separate
          collapsible groups in SectionPositionEditor.tsx, not here */}
    </div>
  );
}

export default ContentContainerPropsEditor;
