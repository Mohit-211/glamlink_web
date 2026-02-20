'use client';

/**
 * StyledSectionWrapper - Styled container for preview sections
 *
 * Provides consistent styling matching the condensed card design:
 * - Gradient background
 * - Rounded corners
 * - Optional title with decorative lines
 * - Inner content area with white background
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface TitleTypographyProps {
  /** Font family */
  titleFontFamily?: string;
  /** Font size (e.g., '1rem', '16px') */
  titleFontSize?: string;
  /** Font weight (e.g., 400, 600, 'bold') */
  titleFontWeight?: number | string;
  /** Text color */
  titleColor?: string;
  /** Text transform (e.g., 'uppercase', 'capitalize') */
  titleTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing (e.g., '0.05em', '1px') */
  titleLetterSpacing?: string;
}

export interface StyledSectionWrapperProps extends TitleTypographyProps {
  /** Section title */
  title?: string;
  /** Title alignment style */
  titleAlignment?: 'left' | 'center' | 'center-with-lines';
  /** Outer container background (supports gradients) */
  containerBackground?: string;
  /** Inner section background */
  sectionBackground?: string;
  /** Outer border radius */
  borderRadius?: number;
  /** Outer padding */
  padding?: number;
  /** Inner section border radius */
  sectionBorderRadius?: number;
  /** Inner section padding */
  sectionPadding?: number;
  /** Optional custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

// =============================================================================
// DEFAULT STYLING (from condensed card)
// =============================================================================

const DEFAULT_STYLES = {
  containerBackground: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  sectionBackground: '#ffffff',
  borderRadius: 12,
  padding: 16,
  sectionBorderRadius: 8,
  sectionPadding: 12,
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if a background value is a CSS gradient
 */
function isGradient(value: string): boolean {
  return value.includes('gradient(') || value.includes('linear-gradient') || value.includes('radial-gradient');
}

/**
 * Build inline styles for background (supports colors and gradients)
 */
function getBackgroundStyle(value: string): React.CSSProperties {
  if (!value || value === 'transparent') {
    return { backgroundColor: 'transparent' };
  }

  if (isGradient(value)) {
    return { background: value };
  }

  if (value.startsWith('#') || value.startsWith('rgb')) {
    return { backgroundColor: value };
  }

  return { backgroundColor: value };
}

// =============================================================================
// TITLE DISPLAY
// =============================================================================

interface TitleDisplayProps {
  title: string;
  alignment: string;
  typography?: TitleTypographyProps;
}

/**
 * Renders title with decorative gradient lines
 */
function TitleDisplay({ title, alignment, typography = {} }: TitleDisplayProps) {
  // Check if font family is a Tailwind class (starts with 'font-') or CSS value
  const isTailwindFontClass = typography.titleFontFamily?.startsWith('font-');
  const fontClassName = isTailwindFontClass ? typography.titleFontFamily : '';

  // Build styles from typography props with defaults
  // Only apply fontFamily as inline style if it's not a Tailwind class
  const baseStyles: React.CSSProperties = {
    fontSize: typography.titleFontSize || '1rem',
    fontWeight: typography.titleFontWeight || 600,
    color: typography.titleColor || '#111827',
    ...(typography.titleFontFamily && !isTailwindFontClass && { fontFamily: typography.titleFontFamily }),
    ...(typography.titleTextTransform && { textTransform: typography.titleTextTransform }),
    ...(typography.titleLetterSpacing && { letterSpacing: typography.titleLetterSpacing }),
  };

  if (alignment === 'center-with-lines') {
    return (
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
        <h3 style={baseStyles} className={`whitespace-nowrap px-2 ${fontClassName}`}>
          {title}
        </h3>
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
      </div>
    );
  }

  if (alignment === 'center') {
    return (
      <h3 style={{ ...baseStyles, textAlign: 'center' }} className={`mb-3 ${fontClassName}`}>
        {title}
      </h3>
    );
  }

  // Left alignment (default)
  return (
    <h3 style={baseStyles} className={`mb-3 ${fontClassName}`}>
      {title}
    </h3>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function StyledSectionWrapper({
  title,
  titleAlignment = 'center-with-lines',
  containerBackground = DEFAULT_STYLES.containerBackground,
  sectionBackground = DEFAULT_STYLES.sectionBackground,
  borderRadius = DEFAULT_STYLES.borderRadius,
  padding = DEFAULT_STYLES.padding,
  sectionBorderRadius = DEFAULT_STYLES.sectionBorderRadius,
  sectionPadding = DEFAULT_STYLES.sectionPadding,
  className = '',
  children,
  // Typography props
  titleFontFamily,
  titleFontSize,
  titleFontWeight,
  titleColor,
  titleTextTransform,
  titleLetterSpacing,
}: StyledSectionWrapperProps) {
  // Outer container style (gradient background)
  const containerStyle: React.CSSProperties = {
    ...getBackgroundStyle(containerBackground),
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
  };

  // Inner section style (white background)
  const sectionStyle: React.CSSProperties = {
    ...getBackgroundStyle(sectionBackground),
    borderRadius: `${sectionBorderRadius}px`,
    padding: `${sectionPadding}px`,
  };

  // Collect typography props
  const typographyProps: TitleTypographyProps = {
    titleFontFamily,
    titleFontSize,
    titleFontWeight,
    titleColor,
    titleTextTransform,
    titleLetterSpacing,
  };

  return (
    <div style={containerStyle} className={`styled-section-wrapper ${className}`}>
      {/* Title with decorative lines */}
      {title && (
        <TitleDisplay title={title} alignment={titleAlignment} typography={typographyProps} />
      )}

      {/* Inner content area */}
      <div style={sectionStyle} className="styled-section-content">
        {children}
      </div>
    </div>
  );
}
