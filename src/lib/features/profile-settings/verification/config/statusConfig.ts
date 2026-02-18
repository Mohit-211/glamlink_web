/**
 * Verification Status Configuration
 */

import type { VerificationStatus, BusinessType } from '../types';

// =============================================================================
// STATUS LABELS & COLORS
// =============================================================================

export const STATUS_LABELS: Record<VerificationStatus, string> = {
  none: 'Not Verified',
  pending: 'Pending Review',
  approved: 'Verified',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<VerificationStatus, string> = {
  none: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const STATUS_ICONS: Record<VerificationStatus, string> = {
  none: '○',
  pending: '⏳',
  approved: '✓',
  rejected: '✗',
};

// =============================================================================
// BUSINESS TYPE OPTIONS
// =============================================================================

export const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: 'salon', label: 'Hair Salon' },
  { value: 'spa', label: 'Spa & Wellness' },
  { value: 'freelance', label: 'Freelance Professional' },
  { value: 'mobile', label: 'Mobile Services' },
  { value: 'studio', label: 'Beauty Studio' },
  { value: 'clinic', label: 'Medical Aesthetics Clinic' },
  { value: 'other', label: 'Other' },
];

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  salon: 'Hair Salon',
  spa: 'Spa & Wellness',
  freelance: 'Freelance Professional',
  mobile: 'Mobile Services',
  studio: 'Beauty Studio',
  clinic: 'Medical Aesthetics Clinic',
  other: 'Other',
};

// =============================================================================
// STEP CONFIGURATION
// =============================================================================

export const VERIFICATION_STEPS = [
  { number: 1, label: 'Business Info', shortLabel: 'Business' },
  { number: 2, label: 'Owner Identity', shortLabel: 'ID' },
  { number: 3, label: 'Documents', shortLabel: 'Docs' },
  { number: 4, label: 'Review', shortLabel: 'Review' },
];

export const TOTAL_STEPS = VERIFICATION_STEPS.length;

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

export const DOCUMENT_TYPE_LABELS = {
  id_front: 'Government ID (Front)',
  id_back: 'Government ID (Back)',
  business_license: 'Business License',
  certification: 'Professional Certification',
  insurance: 'Insurance Certificate',
  tax_document: 'Tax Registration',
};

export const ACCEPTED_ID_TYPES = [
  "Driver's License",
  'Passport',
  'State ID',
  'National ID Card',
];

// =============================================================================
// FILE UPLOAD CONFIG
// =============================================================================

export const DOCUMENT_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  acceptedExtensions: '.jpg,.jpeg,.png,.pdf',
};

// =============================================================================
// VERIFICATION TERMS
// =============================================================================

export const VERIFICATION_TERMS = [
  'All information I have provided is accurate and truthful.',
  'The documents I have uploaded are authentic and belong to me or my business.',
  'The name on my ID matches the name on my profile.',
  'I understand that Glamlink may store these documents for verification purposes.',
  'I understand that verification can be revoked if fraudulent activity is detected.',
  'I agree to re-verify my business if significant profile changes are made.',
];
