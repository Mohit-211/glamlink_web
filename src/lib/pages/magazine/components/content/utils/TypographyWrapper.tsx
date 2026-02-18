"use client";

import React from "react";
import { getAlignmentClass } from "../../../config/universalStyles";

export interface TypographySettings {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  alignment?: string;
  color?: string;
}

interface TypographyWrapperProps {
  settings?: TypographySettings;
  className?: string; // For additional classes like mb-4, mt-2, etc.
  defaultSettings?: Partial<TypographySettings>; // Component-specific defaults
  children: React.ReactNode;
  as?: React.ElementType; // Optional element type (div, span, p, etc.)
}

export default function TypographyWrapper({
  settings = {},
  className = "",
  defaultSettings = {},
  children,
  as: Component = "div"
}: TypographyWrapperProps) {
  // Merge settings with defaults
  const finalSettings = {
    ...defaultSettings,
    ...settings
  };

  // Apply typography settings with fallbacks
  const fontSize = finalSettings.fontSize || "text-base";
  const fontFamily = finalSettings.fontFamily || "font-sans";
  const fontWeight = finalSettings.fontWeight || "font-normal";
  const fontStyle = finalSettings.fontStyle || "";
  const textDecoration = finalSettings.textDecoration || "";
  const alignment = finalSettings.alignment;
  const color = finalSettings.color || "text-gray-900";

  // Build className
  const typographyClasses = [
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textDecoration,
    getAlignmentClass(alignment),
    color,
    className
  ].filter(Boolean).join(" ");

  const ElementToRender = Component as React.ElementType;
  
  return (
    <ElementToRender className={typographyClasses}>
      {children}
    </ElementToRender>
  );
}