'use client';

import React from 'react';
import {
  fontSizeOptions,
  fontFamilyOptions,
  fontWeightOptions,
  alignmentOptions,
  textColorOptions
} from '@/lib/pages/magazine/config/universalStyles';

export interface TypographySettings {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  alignment?: 'left' | 'center' | 'right';
  color?: string;
  tag?: string;  // HTML tag (h1-h6, p, span, etc.)
  lineHeight?: number;  // Line height value (unitless multiplier or fixed value)
}

// Default tag options (headings only)
const DEFAULT_TAG_OPTIONS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

interface TypographySettingsProps {
  settings: TypographySettings;
  onChange: (settings: TypographySettings) => void;
  showAlignment?: boolean;
  showColor?: boolean;
  showTag?: boolean;           // Show tag dropdown (default false)
  tagOptions?: string[];       // Override default h1-h6 options
  defaultTag?: string;         // Default tag value (default 'h3')
}

export default function TypographySettings({
  settings,
  onChange,
  showAlignment = true,
  showColor = true,
  showTag = false,
  tagOptions,
  defaultTag = 'h3'
}: TypographySettingsProps) {
  const updateSetting = (key: keyof TypographySettings, value: string | number | undefined) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {/* Font Size */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Size
        </label>
        <select
          value={settings.fontSize || ''}
          onChange={(e) => updateSetting('fontSize', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
        >
          <option value="">Default</option>
          {fontSizeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Font
        </label>
        <select
          value={settings.fontFamily || ''}
          onChange={(e) => updateSetting('fontFamily', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
        >
          <option value="">Default</option>
          {fontFamilyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Weight
        </label>
        <select
          value={settings.fontWeight || ''}
          onChange={(e) => updateSetting('fontWeight', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
        >
          <option value="">Default</option>
          {fontWeightOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Alignment */}
      {showAlignment && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Align
          </label>
          <select
            value={settings.alignment || ''}
            onChange={(e) => updateSetting('alignment', e.target.value as any)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
          >
            <option value="">Default</option>
            {alignmentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Color */}
      {showColor && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Color
          </label>
          <select
            value={settings.color || ''}
            onChange={(e) => updateSetting('color', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
          >
            <option value="">Default</option>
            {textColorOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* HTML Tag */}
      {showTag && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            HTML Tag
          </label>
          <select
            value={settings.tag || defaultTag}
            onChange={(e) => updateSetting('tag', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
          >
            {(tagOptions || DEFAULT_TAG_OPTIONS).map(tag => (
              <option key={tag} value={tag}>
                {tag.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Line Height */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Line Height
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={settings.lineHeight ?? ''}
          onChange={(e) => updateSetting('lineHeight', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="Default"
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
        />
      </div>
    </div>
  );
}
