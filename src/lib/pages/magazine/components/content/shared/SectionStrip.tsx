"use client";

import React from "react";
import type { SectionStripConfig } from "../../../types/magazine/sections/custom-section";

interface SectionStripProps {
  config?: SectionStripConfig;
  /** Override the position for rendering (used when rendering inside/after content) */
  renderAsInline?: boolean;
}

/**
 * Get text color from config - supports textTypography or legacy textColor
 */
function getTextColor(config: SectionStripConfig): string {
  // First check textTypography.color
  if (config.textTypography?.color) {
    const color = config.textTypography.color;
    // If it's a hex color, return directly
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }
    // Map Tailwind color classes to actual colors
    const colorMap: Record<string, string> = {
      'text-white': '#ffffff',
      'text-black': '#000000',
      'text-gray-100': '#f3f4f6',
      'text-gray-200': '#e5e7eb',
      'text-gray-300': '#d1d5db',
      'text-gray-400': '#9ca3af',
      'text-gray-500': '#6b7280',
      'text-gray-600': '#4b5563',
      'text-gray-700': '#374151',
      'text-gray-800': '#1f2937',
      'text-gray-900': '#111827',
      'text-red-500': '#ef4444',
      'text-red-600': '#dc2626',
      'text-yellow-500': '#eab308',
      'text-yellow-600': '#ca8a04',
      'text-green-500': '#22c55e',
      'text-green-600': '#16a34a',
      'text-blue-500': '#3b82f6',
      'text-blue-600': '#2563eb',
      // Purple colors
      'text-purple-500': '#a855f7',
      'text-purple-600': '#9333ea',
      'text-glamlink-purple': '#9333ea',
      // Teal colors
      'text-teal-500': '#14b8a6',
      'text-teal-600': '#0d9488',
      'text-glamlink-teal': '#22B8C8',
      // Indigo colors
      'text-indigo-500': '#6366f1',
      'text-indigo-600': '#4f46e5',
      // Pink colors
      'text-pink-500': '#ec4899',
      'text-pink-600': '#db2777',
    };
    return colorMap[color] || color;
  }
  // Legacy: use textColor
  if (config.textColor) {
    const color = config.textColor;
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }
    const colorMap: Record<string, string> = {
      'text-white': '#ffffff',
      'text-black': '#000000',
    };
    return colorMap[color] || '#ffffff';
  }
  return '#ffffff';
}

/**
 * Determine if the strip should be displayed vertically
 */
function isVerticalDisplay(config: SectionStripConfig): boolean {
  // New display property takes precedence
  if (config.display === 'vertical') return true;
  // Legacy: check if rotation is close to 90 or -90 degrees
  if (config.rotation && (Math.abs(config.rotation) === 90 || Math.abs(config.rotation) === 270)) {
    return true;
  }
  return false;
}

/**
 * Get the rotation angle for vertical display
 */
function getVerticalRotation(config: SectionStripConfig): number {
  // New verticalAngle property takes precedence
  if (config.verticalAngle) {
    return parseInt(config.verticalAngle, 10);
  }
  // Legacy: use rotation if set
  if (config.rotation) {
    return config.rotation;
  }
  // Default: -90 (top to bottom)
  return -90;
}

/**
 * SectionStrip - A decorative element that appears in corners or fixed positions on a section.
 * Commonly used for labels like "SPECIAL ADVERTISING SECTION" or promotional banners.
 */
export default function SectionStrip({ config, renderAsInline = false }: SectionStripProps) {
  if (!config?.enabled || !config.text) return null;

  const useBackground = config.useBackground !== false; // Default to true
  const isVertical = isVerticalDisplay(config);
  const verticalRotation = isVertical ? getVerticalRotation(config) : 0;

  // Build inline styles
  const bgValue = config.backgroundColor || "#000";
  // Use 'background' for gradients, 'backgroundColor' for solid colors
  const isGradient = bgValue.includes('gradient') || bgValue.includes('linear-') || bgValue.includes('radial-');

  const styles: React.CSSProperties = {
    color: getTextColor(config),
    zIndex: config.zIndex || 10,
  };

  // Only apply background styles if useBackground is true
  if (useBackground) {
    if (isGradient) {
      styles.background = bgValue;
    } else {
      styles.backgroundColor = bgValue;
    }
    styles.padding = config.padding !== undefined ? `${config.padding}px` : "8px 16px";
    styles.borderRadius = config.borderRadius !== undefined ? `${config.borderRadius}px` : undefined;
  } else {
    // No background - just text
    styles.padding = "0";
  }

  // Apply width
  if (config.width) {
    if (config.width === "100%") {
      styles.width = "100%";
    } else if (config.width !== "auto") {
      styles.width = config.width;
    }
  }

  // Build typography classes - prefer textTypography, fallback to legacy fields
  const typographyClasses = [
    config.textTypography?.fontSize || config.fontSize || "text-xs",
    config.textTypography?.fontFamily || config.fontFamily || "font-sans",
    config.textTypography?.fontWeight || config.fontWeight || "font-semibold",
    "uppercase tracking-wide",
  ].filter(Boolean).join(" ");

  // Determine position styles based on position value
  const getPositionStyles = (): React.CSSProperties => {
    // If rendering inline (inside-content or after-content), don't apply absolute positioning
    if (renderAsInline || config.position === "inside-content" || config.position === "after-content") {
      const inlineStyles: React.CSSProperties = {
        position: "relative" as const,
        display: "inline-block",
      };

      // Apply rotation for inline vertical display
      if (isVertical) {
        inlineStyles.writingMode = "vertical-rl";
        inlineStyles.textOrientation = "mixed";
        if (verticalRotation === 90) {
          inlineStyles.transform = "rotate(180deg)";
        }
      }

      return inlineStyles;
    }

    // For corner positions, use absolute positioning
    const positionStyles: React.CSSProperties = {
      position: "absolute" as const,
    };

    // Handle vertical display positioning - position right next to the edge at corners
    if (isVertical) {
      positionStyles.writingMode = "vertical-rl";
      positionStyles.textOrientation = "mixed";

      // Position based on config.position - actual corners, not centered
      switch (config.position) {
        case "top-left":
          positionStyles.top = "0";
          positionStyles.left = "0";
          if (verticalRotation === 90) {
            positionStyles.transform = "rotate(180deg)";
          }
          break;
        case "top-right":
          positionStyles.top = "0";
          positionStyles.right = "0";
          if (verticalRotation === 90) {
            positionStyles.transform = "rotate(180deg)";
          }
          break;
        case "bottom-left":
          positionStyles.bottom = "0";
          positionStyles.left = "0";
          if (verticalRotation === 90) {
            positionStyles.transform = "rotate(180deg)";
          }
          break;
        case "bottom-right":
          positionStyles.bottom = "0";
          positionStyles.right = "0";
          if (verticalRotation === 90) {
            positionStyles.transform = "rotate(180deg)";
          }
          break;
        case "top-center":
          positionStyles.top = "12px";
          positionStyles.left = "50%";
          positionStyles.transform = verticalRotation === 90
            ? "translateX(-50%) rotate(180deg)"
            : "translateX(-50%)";
          positionStyles.writingMode = "horizontal-tb";
          positionStyles.textOrientation = "unset";
          break;
      }
    } else {
      // Horizontal positioning
      switch (config.position) {
        case "top-left":
          positionStyles.top = "12px";
          positionStyles.left = "12px";
          break;
        case "top-right":
          positionStyles.top = "12px";
          positionStyles.right = "12px";
          break;
        case "bottom-left":
          positionStyles.bottom = "12px";
          positionStyles.left = "12px";
          break;
        case "bottom-right":
          positionStyles.bottom = "12px";
          positionStyles.right = "12px";
          break;
        case "top-center":
          positionStyles.top = "12px";
          positionStyles.left = "50%";
          positionStyles.transform = "translateX(-50%)";
          break;
      }

      // Apply legacy rotation transform for horizontal mode
      if (config.rotation && config.rotation !== 0 && !isVertical) {
        positionStyles.transform = config.position === "top-center"
          ? `translateX(-50%) rotate(${config.rotation}deg)`
          : `rotate(${config.rotation}deg)`;
        positionStyles.transformOrigin = "center center";
      }
    }

    return positionStyles;
  };

  const positionStyles = getPositionStyles();
  const combinedStyles = { ...styles, ...positionStyles };

  return (
    <div
      className={`section-strip ${typographyClasses}`}
      style={combinedStyles}
    >
      {config.text}
    </div>
  );
}
