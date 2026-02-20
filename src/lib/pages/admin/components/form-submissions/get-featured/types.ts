/**
 * Get Featured Admin Types
 *
 * Types for managing form configurations and submissions
 * in the admin panel.
 */

import type {
  SelectFilterConfig,
  StatBadgeConfig
} from '@/lib/pages/admin/components/shared/common';
import { SUBMISSION_STATUS_OPTIONS, FORM_TYPE_OPTIONS } from '@/lib/pages/admin/config/fields/getFeatured';

// Re-export submission type from main types file
export type { GetFeaturedSubmission, SubmittedFile } from '@/lib/pages/apply/featured/types';

// =============================================================================
// FIELD TYPES
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
  | 'bullet-array';

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
// FORM CONFIGURATION (main document)
// =============================================================================

export interface GetFeaturedFormConfig {
  id: string; // e.g., 'cover', 'local-spotlight', 'rising-star', 'top-treatment'
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
// DISPLAY TYPES (for table rendering)
// =============================================================================

export interface GetFeaturedSubmissionDisplay {
  id: string;
  fullName: string;
  email: string;
  formType: string;
  formTypeLabel: string;
  status: string;
  statusLabel: string;
  reviewed: boolean;
  submittedAt: string;
  submittedAtFormatted: string;
}

export interface FormConfigDisplay {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
  fieldCount: number;
  sectionCount: number;
}

// =============================================================================
// TAB VIEW TYPE
// =============================================================================

export type GetFeaturedTabView = 'submissions' | 'form-configs';

// =============================================================================
// FILTER TYPES
// =============================================================================

export type SubmissionStatusFilter = 'all' | 'pending_review' | 'approved' | 'rejected';
export type FormTypeFilter = 'all' | 'cover' | 'local-spotlight' | 'rising-star' | 'top-treatment' | 'profile-only';

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface FormConfigsResponse {
  success: boolean;
  data: GetFeaturedFormConfig[];
  error?: string;
}

export interface FormConfigResponse {
  success: boolean;
  data: GetFeaturedFormConfig;
  error?: string;
}

// =============================================================================
// STATS TYPES (for filters)
// =============================================================================

export interface SubmissionStats {
  total: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

export interface FormConfigStats {
  total: number;
  enabled: number;
  disabled: number;
  totalFields: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const FORM_TYPE_LABELS: Record<string, string> = {
  'cover': 'Cover Feature',
  'local-spotlight': 'Local Spotlight',
  'rising-star': 'Rising Star',
  'top-treatment': 'Top Treatment',
  'profile-only': 'Profile Only',
};

export const STATUS_LABELS: Record<string, string> = {
  'pending_review': 'Pending Review',
  'approved': 'Approved',
  'rejected': 'Rejected',
};

export const FORM_ICONS: Record<string, string> = {
  'star': '⭐',
  'location': '📍',
  'rocket': '🚀',
  'sparkles': '✨',
  'trophy': '🏆',
  'heart': '❤️',
};

// =============================================================================
// FILTER CONFIGURATIONS (for DisplayFilters component)
// =============================================================================

export const SUBMISSIONS_SEARCH_PLACEHOLDER = 'Search by name, email, or business...';
export const SUBMISSIONS_ACCENT_COLOR = 'indigo' as const;

export function getSubmissionsSelectFilters(
  statusFilter: string,
  onStatusFilterChange: (status: string) => void,
  formTypeFilter: string,
  onFormTypeFilterChange: (formType: string) => void
): SelectFilterConfig[] {
  return [
    {
      id: 'status',
      value: statusFilter,
      onChange: onStatusFilterChange,
      placeholder: 'All Statuses',
      options: SUBMISSION_STATUS_OPTIONS
    },
    {
      id: 'formType',
      value: formTypeFilter,
      onChange: onFormTypeFilterChange,
      placeholder: 'All Form Types',
      options: FORM_TYPE_OPTIONS
    }
  ];
}

export function getSubmissionsStatBadges(stats: SubmissionStats): StatBadgeConfig[] {
  return [
    { id: 'pending', count: stats.pendingReview, label: 'pending', color: 'yellow' },
    { id: 'approved', count: stats.approved, label: 'approved', color: 'green' },
    { id: 'rejected', count: stats.rejected, label: 'rejected', color: 'red' }
  ];
}
