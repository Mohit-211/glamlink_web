"use client";

import { getAlignmentClass } from "../../../config/universalStyles";

interface SectionHeaderProps {
  title?: string;
  titleStyles?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  subtitle?: string;
  subtitleStyles?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  subtitle2?: string;
  subtitle2Styles?: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    alignment?: string;
    color?: string;
  };
  styles?: {
    titleFontSize?: string;
    titleFontFamily?: string;
    titleFontWeight?: string;
    titleAlignment?: string;
    titleColor?: string;
    subtitleFontSize?: string;
    subtitleFontFamily?: string;
    subtitleFontWeight?: string;
    subtitleAlignment?: string;
    subtitleColor?: string;
    subtitle2FontSize?: string;
    subtitle2FontFamily?: string;
    subtitle2FontWeight?: string;
    subtitle2Alignment?: string;
    subtitle2Color?: string;
  };
  className?: string;
}

export default function SectionHeader({ 
  title,
  titleStyles = {},
  subtitle,
  subtitleStyles = {},
  subtitle2,
  subtitle2Styles = {},
  styles = {}, 
  className = "" 
}: SectionHeaderProps) {
  if (!title && !subtitle && !subtitle2) return null;

  // Use individual style props if provided, otherwise fall back to legacy styles object
  const titleFontSize = titleStyles.fontSize || styles.titleFontSize || "text-3xl md:text-4xl";
  const titleFontFamily = titleStyles.fontFamily || styles.titleFontFamily || "font-serif";
  const titleFontWeight = titleStyles.fontWeight || styles.titleFontWeight || "font-bold";
  const titleFontStyle = titleStyles.fontStyle || "";
  const titleTextDecoration = titleStyles.textDecoration || "";
  const titleAlignment = titleStyles.alignment || styles.titleAlignment;
  const titleColor = titleStyles.color || styles.titleColor || "text-gray-900";

  const subtitleFontSize = subtitleStyles.fontSize || styles.subtitleFontSize || "text-lg md:text-xl";
  const subtitleFontFamily = subtitleStyles.fontFamily || styles.subtitleFontFamily || "font-sans";
  const subtitleFontWeight = subtitleStyles.fontWeight || styles.subtitleFontWeight || "font-medium";
  const subtitleFontStyle = subtitleStyles.fontStyle || "";
  const subtitleTextDecoration = subtitleStyles.textDecoration || "";
  const subtitleAlignment = subtitleStyles.alignment || styles.subtitleAlignment;
  const subtitleColor = subtitleStyles.color || styles.subtitleColor || "text-gray-600";

  const subtitle2FontSize = subtitle2Styles.fontSize || styles.subtitle2FontSize || "text-base";
  const subtitle2FontFamily = subtitle2Styles.fontFamily || styles.subtitle2FontFamily || "font-sans";
  const subtitle2FontWeight = subtitle2Styles.fontWeight || styles.subtitle2FontWeight || "font-normal";
  const subtitle2FontStyle = subtitle2Styles.fontStyle || "";
  const subtitle2TextDecoration = subtitle2Styles.textDecoration || "";
  const subtitle2Alignment = subtitle2Styles.alignment || styles.subtitle2Alignment;
  const subtitle2Color = subtitle2Styles.color || styles.subtitle2Color || "text-gray-500";

  return (
    <div className={`mb-4 sm:mb-6 md:mb-8 ${className}`}>
      {title && (
        <h2
          className={`
            ${titleFontSize} 
            ${titleFontFamily}
            ${titleFontWeight}
            ${titleFontStyle}
            ${titleTextDecoration}
            ${getAlignmentClass(titleAlignment)}
            ${titleColor}
            mb-2
          `}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={`
            ${subtitleFontSize} 
            ${subtitleFontFamily}
            ${subtitleFontWeight}
            ${subtitleFontStyle}
            ${subtitleTextDecoration}
            ${getAlignmentClass(subtitleAlignment)}
            ${subtitleColor}
          `}
        >
          {subtitle}
        </p>
      )}
      {subtitle2 && (
        <p
          className={`
            ${subtitle2FontSize} 
            ${subtitle2FontFamily}
            ${subtitle2FontWeight}
            ${subtitle2FontStyle}
            ${subtitle2TextDecoration}
            ${getAlignmentClass(subtitle2Alignment)}
            ${subtitle2Color}
            mt-1
          `}
        >
          {subtitle2}
        </p>
      )}
    </div>
  );
}