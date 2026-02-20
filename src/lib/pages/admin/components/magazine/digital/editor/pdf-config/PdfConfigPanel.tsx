'use client';

/**
 * PdfConfigPanel - UI for PDF settings configuration
 *
 * Allows users to configure:
 * - Page ratio (A4 portrait/landscape, 16:9, 4:3, square, custom)
 * - Background color
 * - Margin
 * - Custom dimensions (when custom ratio selected)
 * - Footer settings (page number, magazine title, website URL)
 */

import React from 'react';
import type { PagePdfSettings } from '../types';
import { StandaloneColorPicker } from '@/lib/pages/admin/components/shared/editing/fields/backgroundColor/StandaloneColorPicker';
import { usePDFConfigPanel } from './usePDFConfigPanel';
import RatioSelection from './RatioSelection';
import QuickPresets from './QuickPresets';
import { FooterSettings } from './footer';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface PdfConfigPanelProps {
  pdfSettings: PagePdfSettings;
  onChange: (settings: PagePdfSettings) => void;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PdfConfigPanel({
  pdfSettings,
  onChange,
  className = '',
}: PdfConfigPanelProps) {
  const {
    footerSettings,
    updateRatio,
    updateBackgroundColor,
    updateMargin,
    updateCustomWidth,
    updateCustomHeight,
    updateFooterSetting,
    toggleFooterEnabled,
    applyPreset,
  } = usePDFConfigPanel({ pdfSettings, onChange });

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">PDF Settings</h3>

      {/* Ratio Selection */}
      <RatioSelection
        selectedRatio={pdfSettings.ratio}
        customWidth={pdfSettings.customWidth || 210}
        customHeight={pdfSettings.customHeight || 297}
        onRatioChange={updateRatio}
        onCustomWidthChange={updateCustomWidth}
        onCustomHeightChange={updateCustomHeight}
      />

      {/* Background Color */}
      <StandaloneColorPicker
        label="Background Color"
        value={pdfSettings.backgroundColor || '#ffffff'}
        onChange={updateBackgroundColor}
        helperText="Supports hex colors, gradients, and presets"
      />

      {/* Margin */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Margin (mm): {pdfSettings.margin || 0}
        </label>
        <input
          type="range"
          value={pdfSettings.margin || 0}
          onChange={(e) => updateMargin(parseInt(e.target.value) || 0)}
          min={0}
          max={50}
          step={5}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0mm</span>
          <span>25mm</span>
          <span>50mm</span>
        </div>
      </div>

      {/* Quick Presets */}
      <QuickPresets onApplyPreset={applyPreset} />

      {/* Footer Settings */}
      <FooterSettings
        footerSettings={footerSettings}
        onToggleEnabled={toggleFooterEnabled}
        onUpdate={updateFooterSetting}
      />
    </div>
  );
}
