'use client';

/**
 * usePDFConfigPanel - Hook for PDF settings configuration logic
 *
 * Manages:
 * - PDF settings updates
 * - Footer settings with defaults
 * - Footer toggle functionality
 */

import { useCallback, useMemo } from 'react';
import type { PagePdfSettings, FooterSettings, PdfRatioType } from '../types';
import { DEFAULT_FOOTER_SETTINGS } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface UsePDFConfigPanelParams {
  pdfSettings: PagePdfSettings;
  onChange: (settings: PagePdfSettings) => void;
}

export interface UsePDFConfigPanelReturn {
  // Settings
  pdfSettings: PagePdfSettings;
  footerSettings: FooterSettings;

  // PDF setting updates
  updateSetting: <K extends keyof PagePdfSettings>(key: K, value: PagePdfSettings[K]) => void;
  updateRatio: (ratio: PdfRatioType) => void;
  updateBackgroundColor: (color: string) => void;
  updateMargin: (margin: number) => void;
  updateCustomWidth: (width: number) => void;
  updateCustomHeight: (height: number) => void;

  // Footer setting updates
  updateFooterSetting: <K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) => void;
  toggleFooterEnabled: () => void;

  // Preset handlers
  applyPreset: (preset: Partial<PagePdfSettings>) => void;
}

// =============================================================================
// PRESET CONFIGURATIONS
// =============================================================================

export const PRESETS = {
  standardDocument: {
    ratio: 'a4-portrait' as PdfRatioType,
    backgroundColor: '#ffffff',
    margin: 20,
  },
  fullBleedDark: {
    ratio: 'a4-portrait' as PdfRatioType,
    backgroundColor: '#000000',
    margin: 0,
  },
  presentation: {
    ratio: '16:9' as PdfRatioType,
    backgroundColor: '#ffffff',
    margin: 0,
  },
  socialPost: {
    ratio: 'square' as PdfRatioType,
    backgroundColor: '#f3f4f6',
    margin: 10,
  },
} as const;

// =============================================================================
// RATIO OPTIONS
// =============================================================================

export const RATIO_OPTIONS: Array<{ value: PdfRatioType; label: string; icon: string }> = [
  { value: 'a4-portrait', label: 'A4 Portrait', icon: '📄' },
  { value: 'a4-landscape', label: 'A4 Landscape', icon: '📃' },
  { value: '16:9', label: '16:9 Widescreen', icon: '🖥️' },
  { value: '4:3', label: '4:3 Standard', icon: '📺' },
  { value: 'square', label: 'Square', icon: '⬜' },
  { value: 'custom', label: 'Custom', icon: '✏️' },
];

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function usePDFConfigPanel({
  pdfSettings,
  onChange,
}: UsePDFConfigPanelParams): UsePDFConfigPanelReturn {
  // Get current footer settings or defaults
  const footerSettings = useMemo<FooterSettings>(
    () => pdfSettings.footer || DEFAULT_FOOTER_SETTINGS,
    [pdfSettings.footer]
  );

  // Update a single PDF setting
  const updateSetting = useCallback(
    <K extends keyof PagePdfSettings>(key: K, value: PagePdfSettings[K]) => {
      onChange({ ...pdfSettings, [key]: value });
    },
    [pdfSettings, onChange]
  );

  // Convenience methods for common updates
  const updateRatio = useCallback(
    (ratio: PdfRatioType) => updateSetting('ratio', ratio),
    [updateSetting]
  );

  const updateBackgroundColor = useCallback(
    (color: string) => updateSetting('backgroundColor', color),
    [updateSetting]
  );

  const updateMargin = useCallback(
    (margin: number) => updateSetting('margin', margin),
    [updateSetting]
  );

  const updateCustomWidth = useCallback(
    (width: number) => updateSetting('customWidth', width),
    [updateSetting]
  );

  const updateCustomHeight = useCallback(
    (height: number) => updateSetting('customHeight', height),
    [updateSetting]
  );

  // Update a single footer setting
  const updateFooterSetting = useCallback(
    <K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) => {
      onChange({
        ...pdfSettings,
        footer: { ...footerSettings, [key]: value },
      });
    },
    [pdfSettings, footerSettings, onChange]
  );

  // Toggle footer enabled/disabled
  const toggleFooterEnabled = useCallback(() => {
    onChange({
      ...pdfSettings,
      footer: footerSettings.enabled
        ? undefined
        : { ...DEFAULT_FOOTER_SETTINGS, enabled: true },
    });
  }, [pdfSettings, footerSettings.enabled, onChange]);

  // Apply a preset configuration
  const applyPreset = useCallback(
    (preset: Partial<PagePdfSettings>) => {
      onChange(preset as PagePdfSettings);
    },
    [onChange]
  );

  return {
    // Settings
    pdfSettings,
    footerSettings,

    // PDF setting updates
    updateSetting,
    updateRatio,
    updateBackgroundColor,
    updateMargin,
    updateCustomWidth,
    updateCustomHeight,

    // Footer setting updates
    updateFooterSetting,
    toggleFooterEnabled,

    // Preset handlers
    applyPreset,
  };
}

export default usePDFConfigPanel;
