# Security Feature Plan

## Overview

Expand security settings beyond password change to include two-factor authentication, active session management, login history, and connected OAuth applications.

---

## Directory Structure

```
lib/features/profile-settings/security/
├── types.ts
├── config.ts
├── components/
│   ├── TwoFactorAuth.tsx            # 2FA setup and management
│   ├── ActiveSessions.tsx           # List of logged-in devices
│   ├── LoginHistory.tsx             # Recent sign-in activity
│   └── ConnectedApps.tsx            # OAuth connections (Google, etc.)
├── hooks/
│   └── useSecuritySettings.ts       # Security data and actions
└── index.ts
```

---

## Types

```typescript
// types.ts

// Two-Factor Authentication
export type TwoFactorMethod = 'authenticator' | 'sms' | 'email';

export interface TwoFactorStatus {
  enabled: boolean;
  method: TwoFactorMethod | null;
  enabledAt: string | null;
  backupCodesRemaining: number;
  phoneLastFour?: string;            // For SMS method
}

export interface TwoFactorSetupData {
  secret: string;                     // For authenticator apps
  qrCodeUrl: string;                  // QR code for scanning
  backupCodes: string[];              // One-time recovery codes
}

// Active Sessions
export interface Session {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;                    // Chrome, Safari, Firefox, etc.
  os: string;                         // Windows, macOS, iOS, Android
  location: string;                   // City, Country
  ipAddress: string;
  lastActive: string;                 // ISO timestamp
  isCurrent: boolean;                 // Is this the current session
  createdAt: string;                  // When session was created
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
  failureReason?: string;             // For failed attempts
}

// Connected Apps
export interface ConnectedApp {
  id: string;
  provider: 'google' | 'apple' | 'facebook';
  email: string;                      // Email associated with provider
  connectedAt: string;
  lastUsed: string;
  scopes: string[];                   // Permissions granted
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
```

---

## Configuration

```typescript
// config.ts

export const TWO_FACTOR_METHODS = [
  {
    id: 'authenticator' as TwoFactorMethod,
    name: 'Authenticator App',
    description: 'Use Google Authenticator, Authy, or similar apps',
    icon: 'Smartphone',
    recommended: true,
  },
  {
    id: 'sms' as TwoFactorMethod,
    name: 'SMS',
    description: 'Receive codes via text message',
    icon: 'MessageSquare',
    recommended: false,
  },
  {
    id: 'email' as TwoFactorMethod,
    name: 'Email',
    description: 'Receive codes via email',
    icon: 'Mail',
    recommended: false,
  },
];

export const DEVICE_ICONS: Record<Session['deviceType'], string> = {
  desktop: 'Monitor',
  mobile: 'Smartphone',
  tablet: 'Tablet',
};

export const BROWSER_ICONS: Record<string, string> = {
  Chrome: 'chrome-icon',
  Safari: 'safari-icon',
  Firefox: 'firefox-icon',
  Edge: 'edge-icon',
  Other: 'globe-icon',
};

export const LOGIN_STATUS_COLORS = {
  success: 'text-green-600 bg-green-50',
  failed: 'text-red-600 bg-red-50',
  blocked: 'text-yellow-600 bg-yellow-50',
};

export const OAUTH_PROVIDERS = {
  google: {
    name: 'Google',
    icon: 'google-icon',
    color: '#4285F4',
  },
  apple: {
    name: 'Apple',
    icon: 'apple-icon',
    color: '#000000',
  },
  facebook: {
    name: 'Facebook',
    icon: 'facebook-icon',
    color: '#1877F2',
  },
};
```

---

## Components

### TwoFactorAuth.tsx

Two-factor authentication setup and management:
- Status display (enabled/disabled)
- Setup wizard with QR code for authenticator
- Backup codes display and regeneration
- Disable 2FA with verification
- Method selection (authenticator recommended)

### ActiveSessions.tsx

List of currently active sessions:
- Device type, browser, OS icons
- Location and IP address
- "This device" badge for current session
- Last active timestamp
- "Sign out" button per session
- "Sign out all other devices" action

### LoginHistory.tsx

Recent login activity:
- Success/failed/blocked status badges
- Timestamp with relative time
- Device and location info
- Filter by status
- Pagination or "Load more"

### ConnectedApps.tsx

OAuth connections management:
- List of connected providers
- Email associated with each
- Connected date and last used
- "Disconnect" button
- Warning about sign-in impact

---

## Hook

```typescript
// hooks/useSecuritySettings.ts

export function useSecuritySettings(): UseSecuritySettingsReturn {
  const { user } = useAuth();

  // Two-Factor Auth State
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus | null>(null);
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Login History State
  const [loginHistory, setLoginHistory] = useState<LoginEvent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Connected Apps State
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);

  // Fetch all security data on mount
  useEffect(() => {
    fetchSecurityData();
  }, [user?.uid]);

  const fetchSecurityData = async () => {
    // Parallel fetch of all security data
  };

  // Two-Factor Auth Actions
  const enable2FA = async (method: TwoFactorMethod) => {
    // POST /api/security/2fa/enable
    // Returns setup data (QR code, secret, backup codes)
  };

  const verify2FA = async (code: string) => {
    // POST /api/security/2fa/verify
    // Validates code and activates 2FA
  };

  const disable2FA = async (code: string) => {
    // POST /api/security/2fa/disable
    // Requires code verification
  };

  const regenerateBackupCodes = async () => {
    // POST /api/security/2fa/backup-codes
  };

  // Session Actions
  const revokeSession = async (sessionId: string) => {
    // DELETE /api/security/sessions/{sessionId}
  };

  const revokeAllOtherSessions = async () => {
    // DELETE /api/security/sessions?except=current
  };

  // Connected App Actions
  const disconnectApp = async (appId: string) => {
    // DELETE /api/security/connected-apps/{appId}
  };

  return {
    twoFactorStatus,
    isEnabling2FA,
    setupData,
    enable2FA,
    verify2FA,
    disable2FA,
    regenerateBackupCodes,
    sessions,
    isLoadingSessions,
    revokeSession,
    revokeAllOtherSessions,
    loginHistory,
    isLoadingHistory,
    connectedApps,
    isLoadingApps,
    disconnectApp,
    isLoading: isLoadingSessions || isLoadingHistory || isLoadingApps,
    error: null,
  };
}
```

---

## API Endpoints

### Two-Factor Authentication

```
POST   /api/security/2fa/enable         - Start 2FA setup
POST   /api/security/2fa/verify         - Verify code and activate
POST   /api/security/2fa/disable        - Disable 2FA (requires code)
POST   /api/security/2fa/backup-codes   - Regenerate backup codes
GET    /api/security/2fa/status         - Get current 2FA status
```

### Sessions

```
GET    /api/security/sessions           - List active sessions
DELETE /api/security/sessions/{id}      - Revoke specific session
DELETE /api/security/sessions?all=true  - Revoke all other sessions
```

### Login History

```
GET    /api/security/login-history      - Get login history
       ?limit=20&offset=0&status=all
```

### Connected Apps

```
GET    /api/security/connected-apps     - List connected OAuth apps
DELETE /api/security/connected-apps/{id} - Disconnect app
```

---

## Database Schema

```typescript
// User security settings document
users/{userId}/security/settings
{
  twoFactor: {
    enabled: boolean,
    method: 'authenticator' | 'sms' | 'email' | null,
    secret: string,                    // Encrypted
    enabledAt: Timestamp,
    backupCodes: string[],             // Encrypted, hashed
    backupCodesRemaining: number,
    phoneNumber?: string,              // For SMS method
  },
  updatedAt: Timestamp
}

// Active sessions collection
users/{userId}/sessions/{sessionId}
{
  deviceType: 'desktop' | 'mobile' | 'tablet',
  browser: string,
  os: string,
  ipAddress: string,
  location: string,
  userAgent: string,
  createdAt: Timestamp,
  lastActive: Timestamp,
}

// Login history collection
users/{userId}/loginHistory/{eventId}
{
  timestamp: Timestamp,
  status: 'success' | 'failed' | 'blocked',
  ipAddress: string,
  location: string,
  deviceType: string,
  browser: string,
  userAgent: string,
  failureReason?: string,
}

// Connected apps (via Firebase Auth providers)
// Retrieved from Firebase Auth user record
```

---

## UI Design

### Two-Factor Authentication Section

```
┌─────────────────────────────────────────────────────────────┐
│ Two-Factor Authentication                                   │
│ Add an extra layer of security to your account              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Status: ✓ Enabled (Authenticator App)                       │
│ Enabled on: January 10, 2025                                │
│                                                             │
│ Backup Codes: 8 remaining                                   │
│ [Regenerate Backup Codes]  [Disable 2FA]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

--- OR (if disabled) ---

┌─────────────────────────────────────────────────────────────┐
│ Two-Factor Authentication                                   │
│ Add an extra layer of security to your account              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Status: ○ Not enabled                                       │
│                                                             │
│ Choose a method:                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📱 Authenticator App              [Set Up] Recommended │ │
│ │    Use Google Authenticator, Authy, or similar         │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 💬 SMS                                      [Set Up]   │ │
│ │    Receive codes via text message                      │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ✉️ Email                                     [Set Up]   │ │
│ │    Receive codes via email                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Active Sessions Section

```
┌─────────────────────────────────────────────────────────────┐
│ Active Sessions                                             │
│ Devices currently signed in to your account                 │
│                                        [Sign Out All Others]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🖥️ Chrome on macOS                    This device           │
│    San Francisco, CA • 192.168.1.1                          │
│    Active now                                               │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ 📱 Safari on iOS                      [Sign Out]            │
│    New York, NY • 10.0.0.1                                  │
│    Last active: 2 hours ago                                 │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ 💻 Firefox on Windows                 [Sign Out]            │
│    Chicago, IL • 172.16.0.1                                 │
│    Last active: 3 days ago                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Login History Section

```
┌─────────────────────────────────────────────────────────────┐
│ Login History                                               │
│ Recent sign-in activity on your account                     │
│                              [All ▼] [Last 30 days ▼]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✓ Successful sign-in                   Jan 13, 2025 2:30 PM │
│   Chrome on macOS • San Francisco, CA                       │
│                                                             │
│ ✗ Failed sign-in                       Jan 12, 2025 8:15 AM │
│   Unknown browser • Moscow, Russia                          │
│   Reason: Invalid password                                  │
│                                                             │
│ ⚠️ Blocked sign-in                     Jan 11, 2025 3:45 PM │
│   Chrome on Windows • Beijing, China                        │
│   Reason: Suspicious location                               │
│                                                             │
│ ✓ Successful sign-in                   Jan 11, 2025 9:00 AM │
│   Safari on iOS • San Francisco, CA                         │
│                                                             │
│                        [Load More]                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Firebase Auth Integration**:
   - Use Firebase Auth for session management where possible
   - Custom session tracking for detailed device info
   - Connected apps data from Firebase Auth providers

2. **2FA Implementation Options**:
   - Use `speakeasy` or `otplib` for TOTP generation
   - QR code generation with `qrcode` library
   - Encrypted storage of secrets

3. **Session Tracking**:
   - Create session document on login
   - Update `lastActive` on authenticated requests
   - Clean up old sessions periodically

4. **Login History**:
   - Log on every authentication attempt
   - Include geolocation from IP (use service like IP-API)
   - Retain for 90 days, then archive/delete

5. **Security Considerations**:
   - Rate limit 2FA verification attempts
   - Hash backup codes (one-time use)
   - Encrypt sensitive data at rest
   - Notify user of new device logins

---

## Testing Checklist

- [ ] 2FA setup flow with QR code scanning
- [ ] 2FA verification with valid/invalid codes
- [ ] Backup codes work for login
- [ ] Backup code regeneration
- [ ] 2FA disable with verification
- [ ] Sessions list shows current device
- [ ] Session revocation signs out device
- [ ] "Sign out all" works correctly
- [ ] Login history shows all attempts
- [ ] Failed logins logged correctly
- [ ] Connected apps list accurate
- [ ] App disconnection works

---

## Dependencies

- `speakeasy` or `otplib` - TOTP generation
- `qrcode` - QR code generation for authenticator setup
- IP geolocation service - Location from IP
- Firebase Auth - Session and provider management
- Lucide icons - Various security icons

---

## Priority

**Medium-High** - Builds user trust, important for security-conscious users
