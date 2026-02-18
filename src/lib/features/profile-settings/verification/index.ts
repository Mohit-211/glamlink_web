/**
 * Business Verification Feature - Barrel exports
 */

// Components
export {
  DocumentUpload,
  VerificationForm,
  VerificationStatus as VerificationStatusCard,
  VerifiedBadge,
  VerifiedBadgeInline,
  VerifiedBadgeWithLabel,
} from "./components";

// Hooks
export { useVerificationForm, useVerificationStatus } from "./hooks";

// Config
export {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ICONS,
  BUSINESS_TYPE_OPTIONS,
  BUSINESS_TYPE_LABELS,
  VERIFICATION_STEPS,
  TOTAL_STEPS,
  DOCUMENT_TYPE_LABELS,
  ACCEPTED_ID_TYPES,
  DOCUMENT_UPLOAD_CONFIG,
  VERIFICATION_TERMS,
} from "./config";

// Types
export type {
  VerificationStatus,
  BusinessType,
  DocumentType,
  VerificationDocument,
  BusinessInfoFormData,
  OwnerIdentityFormData,
  BusinessDocsFormData,
  VerificationSubmission,
  VerificationFormState,
  UseVerificationFormReturn,
  UseVerificationStatusReturn,
  VerificationSubmitRequest,
  VerificationStatusResponse,
  VerificationSubmissionsResponse,
  VerificationReviewRequest,
} from "./types";

export {
  INITIAL_BUSINESS_INFO,
  INITIAL_OWNER_IDENTITY,
  INITIAL_BUSINESS_DOCS,
  INITIAL_FORM_STATE,
} from "./types";
