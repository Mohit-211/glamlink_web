/**
 * Profile Settings Feature - Barrel exports
 *
 * Shared profile settings functionality for both /profile/settings and /admin/settings
 */

// Components
export {
  AccountInfoSection,
  AvatarUpload,
  ProfileEditSection,
  SecuritySection,
  TwoFactorSection,
  DeviceManagementSection,
  SocialLoginConnections,
  SessionSection,
  VerificationSection,
  ProfileSettingsPage,
  ProfileSettingsSectionPage,
  SettingsSectionCard,
} from "./components";

// Hooks
export { usePasswordChange } from "./usePasswordChange";
export { useProfileEdit } from "./useProfileEdit";
export { useTwoFactor } from "./useTwoFactor";
export { useDeviceManagement } from "./useDeviceManagement";
export { useSocialLogin } from "./useSocialLogin";

// Types
export type {
  PasswordForm,
  PasswordRequirements,
  UsePasswordChangeReturn,
  ProfileSettingsVariant,
  ProfileForm,
  UseProfileEditReturn,
  SettingsSectionId,
  SettingsSection,
  TwoFactorMethod,
  TwoFactorConfig,
  UseTwoFactorReturn,
  Device,
  UseDeviceManagementReturn,
  SocialProvider,
  SocialConnection,
  UseSocialLoginReturn,
} from "./types";

// Section Config
export {
  SETTINGS_SECTIONS,
  getSectionsForVariant,
  getSectionById,
} from "./sectionsConfig";

// Verification - Re-export from verification module
export {
  DocumentUpload,
  VerificationForm,
  VerificationStatusCard,
  VerifiedBadge,
  VerifiedBadgeInline,
  VerifiedBadgeWithLabel,
  useVerificationForm,
  useVerificationStatus,
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
  INITIAL_BUSINESS_INFO,
  INITIAL_OWNER_IDENTITY,
  INITIAL_BUSINESS_DOCS,
  INITIAL_FORM_STATE,
} from "./verification";

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
} from "./verification/types";

// Professional Settings
export {
  ProfessionalSection,
  CertificationDisplay,
  PortfolioPrivacy,
  PricingVisibility,
  ReviewsDisplay,
  useProfessional,
  DEFAULT_PROFESSIONAL_SETTINGS,
  PRICING_DISPLAY_OPTIONS,
  PORTFOLIO_ACCESS_OPTIONS,
  REVIEW_VISIBILITY_OPTIONS,
} from './professional';

export type {
  ProfessionalSettings,
  CertificationDisplaySettings,
  PortfolioSettings,
  PricingSettings,
  ReviewSettings,
  UseProfessionalReturn,
  PricingDisplay,
  PortfolioAccess,
  ReviewVisibility,
} from './professional';

// Preferences
export {
  PreferencesSection,
  ThemeToggle,
  PreferencesProvider,
  usePreferencesContext,
  usePreferences,
  ThemeManager,
  PreferencesFormatter,
  DEFAULT_PREFERENCES,
  THEME_OPTIONS,
  LANGUAGES,
  CURRENCIES,
  TIMEZONE_GROUPS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
} from './preferences';

export type {
  ThemeMode,
  LanguageCode,
  CurrencyCode,
  DateFormatType,
  TimeFormatType,
  MeasurementUnit,
  UserPreferences,
  Language,
  Currency,
  Timezone,
  TimezoneGroup,
  UsePreferencesReturn,
  PreferencesContextValue,
} from './preferences';

// Notifications
export {
  NotificationsSection,
  NotificationToggle,
  useNotifications,
  DEFAULT_PREFERENCES as DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_CATEGORIES,
} from './notifications';

export type {
  NotificationPreferences,
  NotificationCategory,
  NotificationItem,
  UseNotificationsReturn,
} from './notifications';

// Communication
export {
  CommunicationSection,
  ContactPreferences,
  BookingSettings,
  AutoReply,
  useCommunication,
  DEFAULT_COMMUNICATION_SETTINGS,
  CONTACT_METHOD_OPTIONS,
  BOOKING_STATUS_OPTIONS,
  CANCELLATION_POLICIES,
  AUTO_REPLY_TRIGGERS,
  DEFAULT_AUTO_REPLY_MESSAGE,
} from './communication';

export type {
  ContactMethod,
  BookingStatus,
  AutoReplyTrigger,
  CancellationPolicy,
  ContactMethodConfig,
  BookingSettings as CommunicationBookingSettings,
  AutoReplySettings,
  CommunicationSettings,
  UseCommunicationReturn,
} from './communication';
