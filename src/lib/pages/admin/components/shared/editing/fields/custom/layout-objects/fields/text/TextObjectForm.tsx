'use client';

/**
 * TextObjectForm - Form fields for editing Text layout objects
 *
 * Fields:
 * - Title with typography settings
 * - Subtitle with typography settings
 * - HTML content editor
 * - Background color
 * - Drop cap toggle
 * - Sub-spacers
 */

import React, { useState } from 'react';
import type { TextCustomObject } from '../../types';
import { normalizeTypography } from '../../shared/typographyHelpers';
import TextSpacerEditor from './TextSpacerEditor';
import { StandaloneHtmlField } from '@/lib/pages/admin/components/shared/editing/fields/html';
import TypographySettingsComponent from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';
import { StandaloneColorPicker } from '@/lib/pages/admin/components/shared/editing/fields/backgroundColor/StandaloneColorPicker';

// =============================================================================
// TYPES
// =============================================================================

interface TextObjectFormProps {
  object: TextCustomObject;
  onUpdate: (updates: Partial<TextCustomObject>) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function TextObjectForm({ object, onUpdate }: TextObjectFormProps) {
  // Normalize title and subtitle to TypographySettings objects
  const titleSettings = normalizeTypography(object.title);
  const subtitleSettings = normalizeTypography(object.subtitle);

  // Collapsible state for typography sections
  const [showTitleTypography, setShowTitleTypography] = useState(false);
  const [showSubtitleTypography, setShowSubtitleTypography] = useState(false);

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700">Text Content</h4>

      {/* Title */}
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title Text</label>
          <input
            type="text"
            value={titleSettings.text || ''}
            onChange={(e) => onUpdate({ title: { ...titleSettings, text: e.target.value } })}
            placeholder="Enter title text..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowTitleTypography(!showTitleTypography)}
            className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 focus:outline-none"
          >
            <svg
              className={`h-3 w-3 transition-transform ${showTitleTypography ? 'rotate-0' : '-rotate-90'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Title Typography Settings
          </button>
          {showTitleTypography && (
            <div className="mt-2 pl-4 border-l-2 border-gray-200">
              <TypographySettingsComponent
                settings={titleSettings}
                onChange={(newSettings) => onUpdate({ title: { ...titleSettings, ...newSettings } })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle Text</label>
          <input
            type="text"
            value={subtitleSettings.text || ''}
            onChange={(e) => onUpdate({ subtitle: { ...subtitleSettings, text: e.target.value } })}
            placeholder="Enter subtitle text..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowSubtitleTypography(!showSubtitleTypography)}
            className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 focus:outline-none"
          >
            <svg
              className={`h-3 w-3 transition-transform ${showSubtitleTypography ? 'rotate-0' : '-rotate-90'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Subtitle Typography Settings
          </button>
          {showSubtitleTypography && (
            <div className="mt-2 pl-4 border-l-2 border-gray-200">
              <TypographySettingsComponent
                settings={subtitleSettings}
                onChange={(newSettings) => onUpdate({ subtitle: { ...subtitleSettings, ...newSettings } })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content - HTML Editor */}
      <StandaloneHtmlField
        label="Content (HTML)"
        value={object.content || ''}
        onChange={(newContent) => onUpdate({ content: newContent })}
        minHeight={200}
        placeholder="<p>Enter HTML content...</p>"
        helperText="Rich text editor with WYSIWYG formatting"
        showPreview={true}
      />

      {/* Background Color - StandaloneColorPicker */}
      <StandaloneColorPicker
        label="Background Color"
        value={object.backgroundColor || 'transparent'}
        onChange={(newColor) => onUpdate({ backgroundColor: newColor })}
      />

      {/* Drop Cap Toggle */}
      <div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`dropCap-${object.id}`}
            checked={object.dropCapEnabled ?? false}
            onChange={(e) => onUpdate({ dropCapEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor={`dropCap-${object.id}`} className="text-sm text-gray-700">
            Enable Drop Cap
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Style the first letter as a large decorative capital
        </p>
      </div>

      {/* Sub-Spacers */}
      <TextSpacerEditor
        spacers={object.spacers || []}
        onChange={(spacers) => onUpdate({ spacers })}
      />
    </div>
  );
}
