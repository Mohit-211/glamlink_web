/**
 * Section Props Configuration - Type Definitions
 *
 * Core type definitions for section props configuration.
 * Used across all section-specific configuration files.
 */

// =============================================================================
// FIELD TYPES
// =============================================================================

/**
 * Supported field types for section props
 */
export type PropFieldType =
  | 'checkbox'
  | 'select'
  | 'number'
  | 'text'
  | 'textarea'
  | 'html'
  | 'image'
  | 'url'
  | 'color'
  | 'toggleGroup';

// =============================================================================
// TOGGLE GROUP
// =============================================================================

/**
 * Toggle item for toggleGroup field type
 * Each toggle is a small pill/button that can be on or off
 */
export interface ToggleItem {
  /** The key in props that this toggle controls */
  key: string;
  /** Short label displayed on the toggle button */
  label: string;
  /** Default value (true/false) */
  defaultValue?: boolean;
}

// =============================================================================
// PROP FIELD DEFINITION
// =============================================================================

/**
 * Unified field definition for section props configuration
 * Supports all field types and conditional rendering
 */
export interface UnifiedPropField {
  /** Unique key for this prop */
  key: string;
  /** Display label */
  label: string;
  /** Field type for rendering */
  type: PropFieldType;
  /** Default value */
  defaultValue?: any;
  /** Options for select fields */
  options?: Array<{ value: string | number | boolean; label: string }>;
  /** Toggle items for toggleGroup field type */
  toggles?: ToggleItem[];
  /** Helper text shown below the field */
  helperText?: string;
  /** Description text shown below the field (alias for helperText) */
  description?: string;
  /** Min value for number fields */
  min?: number;
  /** Max value for number fields */
  max?: number;
  /** Step for number fields */
  step?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Whether this prop is only for condensed card (not shared) */
  condensedCardOnly?: boolean;
  /** Conditional rendering function */
  showWhen?: (props: Record<string, any>) => boolean;
  /** Whether this prop is only visible in admin mode */
  adminOnly?: boolean;
  /** Group this field belongs to (for collapsible sections) */
  group?: string;
}
