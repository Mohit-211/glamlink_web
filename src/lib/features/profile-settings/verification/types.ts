/**
 * Business Verification Types
 */

// =============================================================================
// ENUMS & STATUS TYPES
// =============================================================================

export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export type BusinessType =
  | 'salon'
  | 'spa'
  | 'freelance'
  | 'mobile'
  | 'studio'
  | 'clinic'
  | 'other';

export type DocumentType =
  | 'id_front'
  | 'id_back'
  | 'business_license'
  | 'certification'
  | 'insurance'
  | 'tax_document';

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

// =============================================================================
// FORM DATA TYPES (Step-by-Step)
// =============================================================================

export interface BusinessInfoFormData {
  businessName: string;
  businessType: BusinessType;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  yearsInBusiness: number;
  website?: string;
  socialMedia?: string;
}

export interface OwnerIdentityFormData {
  ownerFullName: string;
  ownerIdFront: VerificationDocument | null;
  ownerIdBack: VerificationDocument | null;
}

export interface BusinessDocsFormData {
  businessLicense: VerificationDocument | null;
  certifications: VerificationDocument[];
  insurance: VerificationDocument | null;
  taxDocument: VerificationDocument | null;
}

// =============================================================================
// SUBMISSION TYPES
// =============================================================================

export interface VerificationSubmission {
  id: string;

  // Business Info (Step 1)
  businessName: string;
  businessType: BusinessType;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  yearsInBusiness: number;
  website?: string;
  socialMedia?: string;

  // Owner Identity (Step 2)
  ownerFullName: string;
  ownerIdFront: VerificationDocument;
  ownerIdBack?: VerificationDocument;

  // Business Documents (Step 3)
  businessLicense: VerificationDocument;
  certifications?: VerificationDocument[];
  insurance?: VerificationDocument;
  taxDocument?: VerificationDocument;

  // Metadata
  userId: string;
  brandId: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerEmail?: string;
  reviewNotes?: string;
  rejectionReason?: string;
}

// =============================================================================
// FORM STATE TYPES
// =============================================================================

export interface VerificationFormState {
  currentStep: number;
  businessInfo: BusinessInfoFormData;
  ownerIdentity: OwnerIdentityFormData;
  businessDocs: BusinessDocsFormData;
  agreedToTerms: boolean;
  isSubmitting: boolean;
  submitError: string | null;
}

export const INITIAL_BUSINESS_INFO: BusinessInfoFormData = {
  businessName: '',
  businessType: 'salon',
  businessAddress: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  yearsInBusiness: 0,
  website: '',
  socialMedia: '',
};

export const INITIAL_OWNER_IDENTITY: OwnerIdentityFormData = {
  ownerFullName: '',
  ownerIdFront: null,
  ownerIdBack: null,
};

export const INITIAL_BUSINESS_DOCS: BusinessDocsFormData = {
  businessLicense: null,
  certifications: [],
  insurance: null,
  taxDocument: null,
};

export const INITIAL_FORM_STATE: VerificationFormState = {
  currentStep: 1,
  businessInfo: INITIAL_BUSINESS_INFO,
  ownerIdentity: INITIAL_OWNER_IDENTITY,
  businessDocs: INITIAL_BUSINESS_DOCS,
  agreedToTerms: false,
  isSubmitting: false,
  submitError: null,
};

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

export interface UseVerificationFormReturn {
  // State
  formState: VerificationFormState;

  // Navigation
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;

  // Business Info
  updateBusinessInfo: (data: Partial<BusinessInfoFormData>) => void;

  // Owner Identity
  updateOwnerIdentity: (data: Partial<OwnerIdentityFormData>) => void;

  // Business Docs
  updateBusinessDocs: (data: Partial<BusinessDocsFormData>) => void;
  addCertification: (doc: VerificationDocument) => void;
  removeCertification: (docId: string) => void;

  // Terms
  setAgreedToTerms: (agreed: boolean) => void;

  // Submit
  submitVerification: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;

  // Validation
  isStepValid: (step: number) => boolean;
  getStepErrors: (step: number) => string[];
}

export interface UseVerificationStatusReturn {
  status: VerificationStatus;
  submission: VerificationSubmission | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface VerificationSubmitRequest {
  businessInfo: BusinessInfoFormData;
  ownerIdentity: {
    ownerFullName: string;
    ownerIdFront: VerificationDocument;
    ownerIdBack?: VerificationDocument;
  };
  businessDocs: {
    businessLicense: VerificationDocument;
    certifications?: VerificationDocument[];
    insurance?: VerificationDocument;
    taxDocument?: VerificationDocument;
  };
}

export interface VerificationStatusResponse {
  success: boolean;
  data: {
    status: VerificationStatus;
    submission: VerificationSubmission | null;
  };
  error?: string;
}

export interface VerificationSubmissionsResponse {
  success: boolean;
  data: VerificationSubmission[];
  error?: string;
}

export interface VerificationReviewRequest {
  status: 'approved' | 'rejected';
  reviewNotes?: string;
  rejectionReason?: string;
}
