"use client";

/**
 * QuickActionsLine - Horizontal line of action buttons with decorative lines
 *
 * Features:
 * - Up to 3 customizable buttons in a single line
 * - Preset button types: Send Text, Instagram DM, Booking, Custom
 * - Each slot can be hidden by selecting "None"
 * - Decorative lines extending from sides (like "center-with-lines" title style)
 * - Backward compatibility with legacy image-based configuration
 */

import React from "react";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { formatUrl, isValidImageUrl } from './utils/helpers';
import { getPresetText, isNonePreset, isCustomPreset, isDefaultPreset, getDefaultPresetText, getPresetUrl } from './utils/quickActionPresets';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';
import { useAppSelector } from "../../../../../../../store/hooks";

// =============================================================================
// TYPES
// =============================================================================

interface TextButtonConfig {
  text: string;
  url: string;
  width?: number;
}

interface ImageLinkConfig {
  image: string;
  url: string;
  alt?: string;
  width: number;
}

interface QuickActionsLineProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function QuickActionsLine({ professional, section }: QuickActionsLineProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('quick-actions-line'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract button type configurations (new preset-based system)
  const button1Type = mergedProps?.button1Type ?? '';
  const button1Text = mergedProps?.button1Text ?? '';
  const button1Url = mergedProps?.button1Url ?? '';
  const button1Width = mergedProps?.button1Width ?? 120;

  const button2Type = mergedProps?.button2Type ?? '';
  const button2Text = mergedProps?.button2Text ?? '';
  const button2Url = mergedProps?.button2Url ?? '';
  const button2Width = mergedProps?.button2Width ?? 120;

  const button3Type = mergedProps?.button3Type ?? '';
  const button3Text = mergedProps?.button3Text ?? '';
  const button3Url = mergedProps?.button3Url ?? '';
  const button3Width = mergedProps?.button3Width ?? 120;

  // Legacy image-based configuration (for backward compatibility)
  const button1Image = mergedProps?.button1Image ?? '';
  const button2Image = mergedProps?.button2Image ?? '';
  const button3Image = mergedProps?.button3Image ?? '';

  // Style options
  const showDecorativeLines = mergedProps?.showDecorativeLines ?? true;
  const buttonSpacing = mergedProps?.buttonSpacing ?? 12;

  // Build array of text buttons from presets
  const textButtons: TextButtonConfig[] = [];

  // Helper to get button text based on preset type
  const getButtonText = (presetType: string, customText: string): string => {
    if (isCustomPreset(presetType)) return customText;
    if (isDefaultPreset(presetType)) return getDefaultPresetText(professional.preferredBookingMethod);
    return getPresetText(presetType);
  };

  // Process button 1
  if (button1Type && !isNonePreset(button1Type)) {
    const text = getButtonText(button1Type, button1Text);
    // Auto-generate URL based on preset, or use custom URL for 'custom' preset
    const url = getPresetUrl(button1Type, professional, button1Url);
    if (text && url) {
      textButtons.push({ text, url, width: isCustomPreset(button1Type) ? button1Width : undefined });
    }
  }

  // Process button 2
  if (button2Type && !isNonePreset(button2Type)) {
    const text = getButtonText(button2Type, button2Text);
    // Auto-generate URL based on preset, or use custom URL for 'custom' preset
    const url = getPresetUrl(button2Type, professional, button2Url);
    if (text && url) {
      textButtons.push({ text, url, width: isCustomPreset(button2Type) ? button2Width : undefined });
    }
  }

  // Process button 3
  if (button3Type && !isNonePreset(button3Type)) {
    const text = getButtonText(button3Type, button3Text);
    // Auto-generate URL based on preset, or use custom URL for 'custom' preset
    const url = getPresetUrl(button3Type, professional, button3Url);
    if (text && url) {
      textButtons.push({ text, url, width: isCustomPreset(button3Type) ? button3Width : undefined });
    }
  }

  // Legacy: Build array of image links (for backward compatibility)
  const imageLinks: ImageLinkConfig[] = [];

  if (isValidImageUrl(button1Image) && button1Url && !button1Type) {
    const url = formatUrl(button1Url);
    if (url) imageLinks.push({ image: button1Image, url, alt: 'Link 1', width: section?.props?.button1Width ?? 32 });
  }
  if (isValidImageUrl(button2Image) && button2Url && !button2Type) {
    const url = formatUrl(button2Url);
    if (url) imageLinks.push({ image: button2Image, url, alt: 'Link 2', width: section?.props?.button2Width ?? 32 });
  }
  if (isValidImageUrl(button3Image) && button3Url && !button3Type) {
    const url = formatUrl(button3Url);
    if (url) imageLinks.push({ image: button3Image, url, alt: 'Link 3', width: section?.props?.button3Width ?? 32 });
  }

  // Determine which mode to render
  const hasTextButtons = textButtons.length > 0;
  const hasImageLinks = imageLinks.length > 0;

  // If no buttons configured, show placeholder in editor
  if (!hasTextButtons && !hasImageLinks) {
    return (
      <div className="quick-actions-line flex items-center justify-center py-2">
        <p className="text-sm text-gray-400 italic">
          Configure buttons in Section Options
        </p>
      </div>
    );
  }

  // Render text buttons (new preset system)
  if (hasTextButtons) {
    if (showDecorativeLines) {
      return (
        <div className="quick-actions-line flex items-center gap-4">
          {/* Left decorative line */}
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-glamlink-teal/30 to-glamlink-teal/50" />

          {/* Buttons container */}
          <div className="flex items-center" style={{ gap: `${buttonSpacing}px` }}>
            {textButtons.map((btn, index) => (
              <a
                key={`text-${index}`}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-glamlink-teal text-white text-sm font-semibold uppercase tracking-wider rounded-md hover:bg-glamlink-teal/90 transition-colors text-center whitespace-nowrap"
                style={btn.width ? { minWidth: `${btn.width}px` } : undefined}
              >
                {btn.text}
              </a>
            ))}
          </div>

          {/* Right decorative line */}
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-glamlink-teal/30 to-glamlink-teal/50" />
        </div>
      );
    }

    // Without decorative lines
    return (
      <div className="quick-actions-line flex items-center justify-center">
        <div className="flex items-center" style={{ gap: `${buttonSpacing}px` }}>
          {textButtons.map((btn, index) => (
            <a
              key={`text-${index}`}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-glamlink-teal text-white text-sm font-semibold uppercase tracking-wider rounded-md hover:bg-glamlink-teal/90 transition-colors text-center whitespace-nowrap"
              style={btn.width ? { minWidth: `${btn.width}px` } : undefined}
            >
              {btn.text}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Render legacy image links (backward compatibility)
  if (showDecorativeLines) {
    return (
      <div className="quick-actions-line flex items-center gap-4">
        {/* Left decorative line */}
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-glamlink-teal/30 to-glamlink-teal/50" />

        {/* Images container */}
        <div className="flex items-center" style={{ gap: `${buttonSpacing}px` }}>
          {imageLinks.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src={item.image}
                alt={item.alt || `Link ${index + 1}`}
                style={{ width: `${item.width}px`, height: 'auto' }}
                className="object-contain"
              />
            </a>
          ))}
        </div>

        {/* Right decorative line */}
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-glamlink-teal/30 to-glamlink-teal/50" />
      </div>
    );
  }

  // Render without decorative lines (centered)
  return (
    <div className="quick-actions-line flex items-center justify-center">
      <div className="flex items-center" style={{ gap: `${buttonSpacing}px` }}>
        {imageLinks.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src={item.image}
              alt={item.alt || `Link ${index + 1}`}
              style={{ width: `${item.width}px`, height: 'auto' }}
              className="object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
