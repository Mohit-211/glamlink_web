// ============================================
// TYPOGRAPHY DISPLAY COMPONENT
// ============================================

import React from 'react';
import type { TypographySettings } from './TypographySettings';

/**
 * Props for TypographyDisplay component
 */
interface TypographyDisplayProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  typography?: TypographySettings;
  defaults?: TypographySettings;
  className?: string;
  children: React.ReactNode;
}

/**
 * TypographyDisplay - Reusable component for rendering text with typography settings
 *
 * This component consolidates the repeated pattern of applying typography classes
 * throughout the preview components. Instead of manually writing out all the
 * typography class logic, you can use this component.
 *
 * @example
 * ```tsx
 * <TypographyDisplay
 *   tag="h1"
 *   typography={(issue as any)?.titleTypography}
 *   defaults={DEFAULT_TITLE_TYPOGRAPHY_WHITE}
 *   className="mb-2"
 * >
 *   {issue.title}
 * </TypographyDisplay>
 * ```
 */
export default function TypographyDisplay({
  tag: Tag,
  typography,
  defaults,
  className = '',
  children
}: TypographyDisplayProps) {
  // Build typography classes with fallbacks to defaults
  const typographyClasses = [
    typography?.fontSize || defaults?.fontSize || '',
    typography?.fontFamily || defaults?.fontFamily || '',
    typography?.fontWeight || defaults?.fontWeight || '',
    typography?.color || defaults?.color || '',
    getAlignmentClass(typography?.alignment || defaults?.alignment || 'left'),
    className
  ].filter(Boolean).join(' ');

  return <Tag className={typographyClasses}>{children}</Tag>;
}

/**
 * Convert alignment value to Tailwind class
 */
function getAlignmentClass(alignment: 'left' | 'center' | 'right'): string {
  switch (alignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'left':
    default:
      return '';  // text-left is default
  }
}
