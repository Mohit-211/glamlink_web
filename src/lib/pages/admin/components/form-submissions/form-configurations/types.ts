/**
 * Unified Form Configuration Types
 *
 * Supports multiple form categories: 'get-featured', 'digital-card', future types
 * Extends existing get-featured types with category support.
 */

import type {
  SelectFilterConfig,
  CheckboxFilterConfig,
  StatBadgeConfig
} from '@/lib/pages/admin/components/shared/common';

// =============================================================================
// FORM CATEGORY
// =============================================================================

export type FormCategory = 'get-featured' | 'digital-card';

// =============================================================================
// FIELD TYPES (extended from get-featured)
// =============================================================================

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'multi-checkbox'
  | 'file-upload'
  | 'bullet-array'
  | 'array'            // Digital card: business hours, specialties
  | 'multiLocation'    // Digital card: locations
  | 'gallery'          // Digital card: portfolio images/videos
  | 'socialLinksArray'; // Digital card: enhanced social links

// =============================================================================
// FIELD VALIDATION
// =============================================================================

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minChars?: number;
  pattern?: string; // Stored as string, converted to RegExp at runtime
  minFiles?: number;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string; // file types
  message?: string; // custom error message
}

// =============================================================================
// FIELD OPTION (for select, radio, checkbox)
// =============================================================================

export interface FieldOption {
  id: string;
  label: string;
  description?: string;
}

// =============================================================================
// FORM FIELD CONFIGURATION
// =============================================================================

export interface FormFieldConfig {
  id: string;
  name: string; // Field key in submission data
  type: FormFieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  validation?: FieldValidation;
  options?: FieldOption[]; // For select/checkbox/radio
  maxLength?: number;
  rows?: number; // For textarea
  maxPoints?: number; // For bullet-array
  minSelections?: number;
  maxSelections?: number;
  columns?: number; // For multi-checkbox grid
  order: number;
  // Conditional display
  showWhen?: {
    field: string;
    value: any;
  };
  // Default value
  defaultValue?: any;
}

// =============================================================================
// FORM SECTION CONFIGURATION
// =============================================================================

export interface FormSectionConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  layout?: 'grid' | 'single';
  order: number;
}

// =============================================================================
// BASE FORM CONFIGURATION (shared by all form types)
// =============================================================================

export interface BaseFormConfig {
  id: string;
  category: FormCategory;
  title: string;
  description: string;
  icon: string;
  bannerColor: string;
  enabled: boolean;
  order: number;
  sections: FormSectionConfig[];
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// CATEGORY-SPECIFIC FORM CONFIGURATIONS
// =============================================================================

export interface GetFeaturedFormConfig extends BaseFormConfig {
  category: 'get-featured';
}

export interface DigitalCardFormConfig extends BaseFormConfig {
  category: 'digital-card';
  // Digital card specific settings
  previewEnabled?: boolean;
  successMessage?: string;
}

export type UnifiedFormConfig = GetFeaturedFormConfig | DigitalCardFormConfig;

// =============================================================================
// DISPLAY TYPES (for table rendering)
// =============================================================================

export interface FormConfigDisplay {
  id: string;
  category: FormCategory;
  categoryLabel: string;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
  fieldCount: number;
  sectionCount: number;
}

// =============================================================================
// STATS TYPE
// =============================================================================

export interface FormConfigStats {
  total: number;
  enabled: number;
  disabled: number;
  totalFields: number;
  byCategory: Record<FormCategory, number>;
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export type FormConfigCategoryFilter = 'all' | FormCategory;

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface FormConfigsResponse {
  success: boolean;
  data: UnifiedFormConfig[];
  error?: string;
}

export interface FormConfigResponse {
  success: boolean;
  data: UnifiedFormConfig;
  error?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const FORM_CATEGORY_LABELS: Record<FormCategory, string> = {
  'get-featured': 'Get Featured',
  'digital-card': 'Digital Card',
};

export const FORM_ICONS: Record<string, string> = {
  'star': '⭐',
  'location': '📍',
  'rocket': '🚀',
  'sparkles': '✨',
  'trophy': '🏆',
  'heart': '❤️',
  'card': '💳',
  'user': '👤',
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function countFields(config: UnifiedFormConfig): number {
  if (!config.sections) return 0;
  return config.sections.reduce((sum, section) => sum + (section.fields?.length || 0), 0);
}

export function transformToDisplay(config: UnifiedFormConfig): FormConfigDisplay {
  return {
    id: config.id,
    category: config.category,
    categoryLabel: FORM_CATEGORY_LABELS[config.category],
    title: config.title,
    description: config.description,
    enabled: config.enabled,
    order: config.order,
    fieldCount: countFields(config),
    sectionCount: config.sections?.length || 0,
  };
}

// =============================================================================
// FILTER CONFIGURATIONS (for DisplayFilters component)
// =============================================================================

export const SEARCH_PLACEHOLDER = 'Search by title or description...';
export const ACCENT_COLOR = 'teal' as const;

export function getSelectFilters(
  categoryFilter: FormConfigCategoryFilter,
  onCategoryFilterChange: (category: FormConfigCategoryFilter) => void
): SelectFilterConfig[] {
  return [
    {
      id: 'category',
      value: categoryFilter,
      onChange: (value) => onCategoryFilterChange(value as FormConfigCategoryFilter),
      placeholder: 'All Categories',
      options: Object.entries(FORM_CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label
      }))
    }
  ];
}

export function getCheckboxFilters(
  showDisabled: boolean,
  onShowDisabledChange: (show: boolean) => void
): CheckboxFilterConfig[] {
  return [
    {
      id: 'showDisabled',
      checked: showDisabled,
      onChange: onShowDisabledChange,
      label: 'Show Disabled'
    }
  ];
}

export function getStatBadges(stats: FormConfigStats): StatBadgeConfig[] {
  return [
    { id: 'total', count: stats.total, label: 'total', color: 'teal', showWhenZero: true },
    { id: 'enabled', count: stats.enabled, label: 'enabled', color: 'green' },
    { id: 'disabled', count: stats.disabled, label: 'disabled', color: 'gray' }
  ];
}
