/**
 * Form Submissions Admin Types
 *
 * Types for managing digital card submissions and get-featured submissions
 * in the unified Form Submissions admin panel.
 */

import type { LocationData, GalleryItem } from '@/lib/pages/for-professionals/types/professional';

// Re-export form configuration types
export type {
  FormFieldConfig,
  FormSectionConfig,
  GetFeaturedFormConfig,
  FieldOption,
  FormCategory,
  FormFieldType,
  FieldValidation,
  BaseFormConfig,
  DigitalCardFormConfig,
  UnifiedFormConfig,
  FormConfigDisplay,
  FormConfigStats,
  FormConfigCategoryFilter,
  FormConfigsResponse,
  FormConfigResponse,
} from './form-configurations/types';

// =============================================================================
// DIGITAL CARD SUBMISSION TYPES
// =============================================================================

export interface DigitalCardSubmission {
  id: string;
  name: string;
  title: string;
  specialty: string;
  email: string;
  phone: string;
  bio: string;
  locations: LocationData[];
  businessName?: string;
  businessHours: string[];
  primarySpecialties: string[];
  specialties: string[];
  website?: string;
  instagram?: string;
  tiktok?: string;
  bookingUrl?: string;
  preferredBookingMethod?: 'send-text' | 'instagram' | 'booking-link';
  customHandle?: string;  // Custom URL handle for the professional (e.g., "betty-smith" for glamlink.net/betty-smith)
  importantInfo?: string[];
  // Gallery & Portfolio
  gallery?: GalleryItem[];
  profileImage?: string;
  status: 'pending_review' | 'approved' | 'rejected';
  reviewed: boolean;
  hidden: boolean;
  submittedAt: string;
  createdAt: any;
  metadata?: {
    userAgent: string;
    ip: string;
    source: string;
  };
  // Added when converted to professional
  convertedToProfessionalId?: string;
  convertedAt?: string;
}

export interface DigitalCardSubmissionDisplay {
  id: string;
  name: string;
  email: string;
  specialty: string;
  status: string;
  statusLabel: string;
  reviewed: boolean;
  hidden: boolean;
  submittedAt: string;
  submittedAtFormatted: string;
  canAddProfessional: boolean;
}

// =============================================================================
// SUBMISSION TYPE SWITCHER
// =============================================================================

export type SubmissionType = 'get-featured' | 'professional' | 'form-configs';

// =============================================================================
// FILTER TYPES
// =============================================================================

export type SubmissionStatusFilter = 'all' | 'pending_review' | 'approved' | 'rejected';

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface DigitalCardSubmissionsResponse {
  success: boolean;
  submissions: DigitalCardSubmission[];
  count: number;
  error?: string;
}

export interface DigitalCardSubmissionResponse {
  success: boolean;
  submission: DigitalCardSubmission;
  error?: string;
}

export interface ConvertToProfessionalResponse {
  success: boolean;
  professionalId: string;
  message: string;
  error?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const STATUS_LABELS: Record<string, string> = {
  'pending_review': 'Pending Review',
  'approved': 'Approved',
  'rejected': 'Rejected',
};

export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  'get-featured': 'Get Featured',
  'professional': 'Professional',
  'form-configs': 'Form Configurations',
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format date string to readable format
 */
export function formatSubmissionDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Transform raw submission to display format
 */
export function transformToDisplay(submission: DigitalCardSubmission): DigitalCardSubmissionDisplay {
  return {
    id: submission.id,
    name: submission.name,
    email: submission.email,
    specialty: submission.specialty,
    status: submission.status,
    statusLabel: STATUS_LABELS[submission.status] || submission.status,
    reviewed: submission.reviewed,
    hidden: submission.hidden ?? false,
    submittedAt: submission.submittedAt,
    submittedAtFormatted: formatSubmissionDate(submission.submittedAt),
    canAddProfessional: submission.status === 'approved' && !(submission.hidden ?? false)
  };
}
