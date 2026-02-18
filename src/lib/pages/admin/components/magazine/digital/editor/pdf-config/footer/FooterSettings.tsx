'use client';

/**
 * FooterSettings - Main footer configuration component
 *
 * Combines all footer sub-sections:
 * - Page Number
 * - Magazine Title
 * - Website URL
 * - Shared settings (font size, margin)
 */

import React from 'react';
import type { FooterSettings as FooterSettingsType } from '../../types';
import PageNumberSection from './PageNumberSection';
import MagazineTitleSection from './MagazineTitleSection';
import WebsiteUrlSection from './WebsiteUrlSection';

// =============================================================================
// TYPES
// =============================================================================

interface FooterSettingsProps {
  footerSettings: FooterSettingsType;
  onToggleEnabled: () => void;
  onUpdate: <K extends keyof FooterSettingsType>(key: K, value: FooterSettingsType[K]) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function FooterSettings({
  footerSettings,
  onToggleEnabled,
  onUpdate,
}: FooterSettingsProps) {
  return (
    <div className="pt-4 border-t border-gray-200">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">Footer Settings</label>
        <button
          type="button"
          onClick={onToggleEnabled}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${footerSettings.enabled ? 'bg-indigo-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${footerSettings.enabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Footer content when enabled */}
      {footerSettings.enabled && (
        <div className="space-y-4 pl-2 border-l-2 border-indigo-100">
          {/* Page Number Section */}
          <PageNumberSection
            footerSettings={footerSettings}
            onUpdate={onUpdate}
          />

          {/* Magazine Title Section */}
          <MagazineTitleSection
            footerSettings={footerSettings}
            onUpdate={onUpdate}
          />

          {/* Website URL Section */}
          <WebsiteUrlSection
            footerSettings={footerSettings}
            onUpdate={onUpdate}
          />

          {/* Shared Settings */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            {/* Font Size */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Font Size: {footerSettings.fontSize}px
              </label>
              <input
                type="range"
                value={footerSettings.fontSize}
                onChange={(e) => onUpdate('fontSize', parseInt(e.target.value))}
                min={8}
                max={14}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>8px</span>
                <span>11px</span>
                <span>14px</span>
              </div>
            </div>

            {/* Bottom Margin */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Bottom Margin: {footerSettings.marginBottom}mm
              </label>
              <input
                type="range"
                value={footerSettings.marginBottom}
                onChange={(e) => onUpdate('marginBottom', parseInt(e.target.value))}
                min={5}
                max={20}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5mm</span>
                <span>12mm</span>
                <span>20mm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
