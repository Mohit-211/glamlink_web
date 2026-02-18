/**
 * Profile Settings Types
 */

export interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export interface UsePasswordChangeReturn {
  // Form state
  isChangingPassword: boolean;
  setIsChangingPassword: (value: boolean) => void;
  passwordForm: PasswordForm;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;

  // Status
  passwordLoading: boolean;
  passwordError: string | null;
  passwordSuccess: boolean;

  // Validation
  passwordRequirements: PasswordRequirements;
  allRequirementsMet: boolean;
  passwordsMatch: boolean;

  // Handlers
  handlePasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancelPasswordChange: () => void;
}

export type ProfileSettingsVariant = 'profile' | 'admin';

// =============================================================================
// SETTINGS SECTION TYPES
// =============================================================================

export type SettingsSectionId =
  | 'profile'
  | 'account'
  | 'security'
  | 'preferences'
  | 'verification'
  | 'privacy'
  | 'brand-settings'
  | 'professional'
  | 'notifications'
  | 'communication'
  | 'support-bot'
  | 'messages'
  | 'account-management'
  | 'session';

export interface SettingsSection {
  id: SettingsSectionId;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: ProfileSettingsVariant[]; // Which variants this section is available for
}

// =============================================================================
// PROFILE EDIT TYPES
// =============================================================================

export interface ProfileForm {
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  photoURL: string;
  phoneNumber?: string;
}

export interface UseProfileEditReturn {
  // Form state
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  profileForm: ProfileForm;

  // Status
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: boolean;

  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhotoChange: (url: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
}

// =============================================================================
// TWO-FACTOR AUTHENTICATION TYPES
// =============================================================================

export type TwoFactorMethod = 'sms' | 'authenticator' | 'email';

export interface TwoFactorConfig {
  enabled: boolean;
  method?: TwoFactorMethod;
  phoneNumber?: string; // For SMS method
  backupCodes?: string[]; // Generated backup codes
  lastUpdated?: string; // ISO string
}

export interface UseTwoFactorReturn {
  // State
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod;
  backupCodes: string[];

  // Status
  isLoading: boolean;
  isEnabling: boolean;
  isDisabling: boolean;
  error: string | null;
  success: boolean;

  // Handlers
  enableTwoFactor: (method: TwoFactorMethod, phoneNumber?: string) => Promise<void>;
  disableTwoFactor: () => Promise<void>;
  regenerateBackupCodes: () => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
}

// =============================================================================
// DEVICE MANAGEMENT TYPES
// =============================================================================

export interface Device {
  id: string;
  name: string; // e.g., "Chrome on Mac", "Safari on iPhone"
  browser: string;
  os: string;
  ipAddress: string;
  location?: string; // City, State or Country
  lastActive: string; // ISO string
  current: boolean; // Is this the current device?
  createdAt: string; // ISO string
}

export interface UseDeviceManagementReturn {
  // State
  devices: Device[];

  // Status
  isLoading: boolean;
  isRevoking: boolean;
  error: string | null;
  success: boolean;

  // Handlers
  fetchDevices: () => Promise<void>;
  revokeDevice: (deviceId: string) => Promise<void>;
  revokeAllOtherDevices: () => Promise<void>;
}

// =============================================================================
// SOCIAL LOGIN TYPES
// =============================================================================

export type SocialProvider = 'google.com' | 'facebook.com' | 'apple.com';

export interface SocialConnection {
  provider: SocialProvider;
  connected: boolean;
  email?: string;
  displayName?: string;
  connectedAt?: string; // ISO string
}

export interface UseSocialLoginReturn {
  // State
  connections: SocialConnection[];

  // Status
  isLoading: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  error: string | null;
  success: boolean;

  // Handlers
  connectProvider: (provider: SocialProvider) => Promise<void>;
  disconnectProvider: (provider: SocialProvider) => Promise<void>;
  refreshConnections: () => Promise<void>;
}
