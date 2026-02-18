"use client";

// Two-Factor Authentication
export type TwoFactorMethod = 'authenticator' | 'sms' | 'email';

export interface TwoFactorStatus {
  enabled: boolean;
  method: TwoFactorMethod | null;
  enabledAt: string | null;
  backupCodesRemaining: number;
  phoneLastFour?: string; // For SMS method
}

export interface TwoFactorSetupData {
  secret: string; // For authenticator apps
  qrCodeUrl: string; // QR code for scanning
  backupCodes: string[]; // One-time recovery codes
}

// Active Sessions
export interface Session {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string; // Chrome, Safari, Firefox, etc.
  os: string; // Windows, macOS, iOS, Android
  location: string; // City, Country
  ipAddress: string;
  lastActive: string; // ISO timestamp
  isCurrent: boolean; // Is this the current session
  createdAt: string; // When session was created
}

// Login History
export interface LoginEvent {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  ipAddress: string;
  location: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  failureReason?: string; // For failed attempts
}

// Connected Apps
export interface ConnectedApp {
  id: string;
  provider: 'google' | 'apple' | 'facebook';
  email: string; // Email associated with provider
  connectedAt: string;
  lastUsed: string;
  scopes: string[]; // Permissions granted
}

// Hook Return Types
export interface UseSecuritySettingsReturn {
  // Two-Factor Auth
  twoFactorStatus: TwoFactorStatus | null;
  isEnabling2FA: boolean;
  setupData: TwoFactorSetupData | null;
  enable2FA: (method: TwoFactorMethod) => Promise<TwoFactorSetupData>;
  verify2FA: (code: string) => Promise<boolean>;
  disable2FA: (code: string) => Promise<void>;
  regenerateBackupCodes: () => Promise<string[]>;

  // Sessions
  sessions: Session[];
  isLoadingSessions: boolean;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllOtherSessions: () => Promise<void>;

  // Login History
  loginHistory: LoginEvent[];
  isLoadingHistory: boolean;

  // Connected Apps
  connectedApps: ConnectedApp[];
  isLoadingApps: boolean;
  disconnectApp: (appId: string) => Promise<void>;

  // General
  isLoading: boolean;
  error: string | null;
}
