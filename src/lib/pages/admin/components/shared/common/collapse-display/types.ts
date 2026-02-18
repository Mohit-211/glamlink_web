/**
 * Collapse Display Module Types
 *
 * Shared type definitions for collapsible sections and display components.
 */

import type { ReactNode } from 'react';

// =============================================================================
// COLLAPSIBLE SECTION
// =============================================================================

export interface CollapsibleSectionProps {
  /** Section title displayed in the header */
  title: string;
  /** Whether the section is expanded by default */
  defaultOpen?: boolean;
  /** Optional icon displayed before the title */
  icon?: ReactNode;
  /** Optional badge (e.g., count) displayed after the title */
  badge?: string | number;
  /** Section content */
  children: ReactNode;
  /** Custom class for the container */
  className?: string;
  /** Custom class for the header */
  headerClassName?: string;
  /** Custom class for the content area */
  contentClassName?: string;
}

// =============================================================================
// FIELD DISPLAY
// =============================================================================

export interface FieldDisplayProps {
  /** Label displayed above the value */
  label: string;
  /** Value to display (renders nothing if null/undefined) */
  value: string | undefined | null;
  /** Optional icon displayed before the label */
  icon?: ReactNode;
  /** Display variant */
  variant?: 'default' | 'compact';
  /** Custom class for the label */
  labelClassName?: string;
  /** Custom class for the value */
  valueClassName?: string;
}

// =============================================================================
// TEXTAREA DISPLAY
// =============================================================================

export interface TextareaDisplayProps {
  /** Label displayed above the value */
  label: string;
  /** Value to display (renders nothing if null/undefined) */
  value: string | undefined | null;
  /** Whether to show a background */
  showBackground?: boolean;
  /** Maximum lines before truncation (0 = no limit) */
  maxLines?: number;
}

// =============================================================================
// LINK DISPLAY
// =============================================================================

export interface LinkDisplayProps {
  /** Label displayed above the link */
  label: string;
  /** URL to display (renders nothing if null/undefined) */
  value: string | undefined | null;
  /** Optional icon displayed before the label */
  icon?: ReactNode;
  /** Whether to auto-prefix https:// if missing */
  autoPrefix?: boolean;
  /** Whether the link opens in a new tab */
  external?: boolean;
}

// =============================================================================
// ARRAY DISPLAY
// =============================================================================

export interface ArrayDisplayProps {
  /** Label displayed above the list */
  label: string;
  /** Items to display (supports string or string[]) */
  items: string[] | string | undefined;
  /** Display variant */
  variant?: 'bullet' | 'numbered' | 'plain';
  /** Message shown when array is empty */
  emptyMessage?: string;
}

// =============================================================================
// ARRAY BADGE DISPLAY
// =============================================================================

export type BadgeColorScheme = 'indigo' | 'gray' | 'green' | 'blue' | 'red' | 'yellow' | 'custom';

export interface ArrayBadgeDisplayProps {
  /** Label displayed above the badges */
  label: string;
  /** Items to display as badges (supports string or string[]) */
  items: string[] | string | undefined;
  /** Badge color scheme */
  colorScheme?: BadgeColorScheme;
  /** Custom badge class (when colorScheme='custom') */
  badgeClassName?: string;
  /** Transform function for item text */
  transformText?: (item: string) => string;
}

// =============================================================================
// FILES DISPLAY
// =============================================================================

// Import and re-export SubmittedFile from canonical source
import type { SubmittedFile } from '@/lib/pages/apply/shared/types';
export type { SubmittedFile };

export interface FilesDisplayProps {
  /** Label displayed above the files */
  label: string;
  /** Files to display */
  files: SubmittedFile[] | undefined;
  /** Number of grid columns */
  columns?: 2 | 3 | 4;
  /** Whether to show file names */
  showNames?: boolean;
}
