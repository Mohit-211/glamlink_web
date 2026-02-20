# Shopify Profile Features Implementation Plan

## Overview

This plan implements additional profile features inspired by Shopify's account profile pages, integrating with our existing profile settings system without duplication.

---

## Feature Analysis

### **What We Already Have ✅**

| Feature | Location | Status |
|---------|----------|--------|
| Display name, username, bio | Profile section | ✅ Complete |
| Profile photo upload | Profile section | ✅ Complete |
| Email display | Account section | ✅ Complete |
| Password change | Security section | ✅ Complete |
| Language preferences | Preferences section | ✅ Complete |
| Regional format | Preferences section | ✅ Complete |
| Timezone | Preferences section | ✅ Complete |
| Sign out | Session section | ✅ Complete |

### **New Features from Shopify 🆕**

| Feature | Priority | Complexity | Notes |
|---------|----------|------------|-------|
| First & Last Name (separate) | High | Low | Enhance Profile section |
| Phone Number | High | Medium | New field with validation |
| Email Verification Badge | High | Medium | Enhance Account section |
| Email Update Flow | Medium | High | Requires re-authentication |
| Social Login Links | Medium | High | OAuth integration |
| Two-Factor Authentication (2FA) | High | High | New security feature |
| Device Management | Medium | Medium | Session tracking |

---

## Implementation Phases

### **Phase 1: Profile Enhancement (High Priority)**

#### 1.1 First Name & Last Name Fields

**Current State:**
- We have `displayName` (single field)
- Example: "Nick Kane"

**Enhancement:**
- Add `firstName` and `lastName` fields to user profile
- Keep `displayName` as computed field for backward compatibility
- Auto-generate `displayName` from `firstName + lastName`

**Implementation:**

**File**: `lib/features/profile-settings/types.ts`
```typescript
export interface ProfileForm {
  displayName: string;
  firstName: string;          // NEW
  lastName: string;           // NEW
  username: string;
  bio: string;
  photoURL: string;
}
```

**File**: `lib/features/profile-settings/components/ProfileEditSection.tsx`
```typescript
// Replace displayName field with firstName and lastName
<div className="grid grid-cols-2 gap-4">
  {/* First Name */}
  <div>
    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
      First Name <span className="text-red-500">*</span>
    </label>
    <input
      id="firstName"
      name="firstName"
      type="text"
      required
      value={profileForm.firstName}
      onChange={handleInputChange}
      placeholder="First name"
      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
    />
    <p className="mt-1 text-xs text-gray-500">
      Use your first name as it appears on your government-issued ID.
    </p>
  </div>

  {/* Last Name */}
  <div>
    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
      Last Name <span className="text-red-500">*</span>
    </label>
    <input
      id="lastName"
      name="lastName"
      type="text"
      required
      value={profileForm.lastName}
      onChange={handleInputChange}
      placeholder="Last name"
      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
    />
  </div>
</div>
```

**Database Migration:**
```typescript
// Auto-split existing displayName into firstName and lastName
const nameParts = displayName.split(' ');
const firstName = nameParts[0] || '';
const lastName = nameParts.slice(1).join(' ') || '';

// Save to Firestore
await updateDoc(userRef, {
  firstName,
  lastName,
  displayName, // Keep for backward compatibility
});
```

---

#### 1.2 Phone Number Field

**Feature:**
- Optional phone number field
- "Add" link when empty
- International format support
- Validation with formatting

**Implementation:**

**File**: `lib/features/profile-settings/types.ts`
```typescript
export interface ProfileForm {
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  photoURL: string;
  phoneNumber?: string;       // NEW - optional
}
```

**File**: `lib/features/profile-settings/components/ProfileEditSection.tsx`
```typescript
{/* Phone Number */}
<div>
  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
    Phone Number <span className="text-gray-400 text-xs">(optional)</span>
  </label>
  <input
    id="phoneNumber"
    name="phoneNumber"
    type="tel"
    value={profileForm.phoneNumber || ''}
    onChange={handleInputChange}
    placeholder="+1 (555) 123-4567"
    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm"
  />
  <p className="mt-1 text-xs text-gray-500">
    Used for account recovery and important notifications
  </p>
</div>
```

**Validation:**
```typescript
// Basic phone validation
const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  // Allow international format: +1 234 567 8900, (123) 456-7890, etc.
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
```

---

### **Phase 2: Account Enhancement (High Priority)**

#### 2.1 Email Verification Status

**Feature:**
- Show verification badge next to email
- Display verification status (Verified/Unverified)
- Send verification email option

**Implementation:**

**File**: `lib/features/profile-settings/components/AccountInfoSection.tsx`
```typescript
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface AccountInfoSectionProps {
  email: string | null | undefined;
  emailVerified?: boolean;      // NEW
  onSendVerification?: () => Promise<void>; // NEW
}

export default function AccountInfoSection({
  email,
  emailVerified = false,
  onSendVerification
}: AccountInfoSectionProps) {
  const [sendingVerification, setSendingVerification] = useState(false);

  const handleSendVerification = async () => {
    if (!onSendVerification) return;
    setSendingVerification(true);
    try {
      await onSendVerification();
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-400" />
          Account
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {/* Email with Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Email Address
          </label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-gray-900">{email}</p>
              {emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                  <AlertCircle className="w-3 h-3" />
                  Unverified
                </span>
              )}
            </div>
            {!emailVerified && (
              <button
                onClick={handleSendVerification}
                disabled={sendingVerification}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {sendingVerification ? 'Sending...' : 'Send Verification'}
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {emailVerified
              ? 'Your email address is verified'
              : 'Please verify your email address to access all features'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
```

**API Implementation:**
```typescript
// /app/api/profile/send-verification/route.ts
import { sendEmailVerification } from 'firebase/auth';

export async function POST(request: NextRequest) {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sendEmailVerification(currentUser);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
```

---

#### 2.2 Email Update Flow (Optional - Complex)

**Note:** This is complex because changing email requires:
1. Re-authentication
2. Email verification on new address
3. Potential security issues

**Recommendation:** Implement in Phase 3 if really needed. Most apps make email immutable.

---

### **Phase 3: Security Enhancement (High Priority)**

#### 3.1 Two-Factor Authentication (2FA)

**Feature:**
- Enable/disable 2FA toggle
- Support for:
  - Email verification codes
  - Authenticator apps (Google Authenticator, Authy)
  - SMS codes (optional)
  - Backup codes

**Implementation:**

**Directory Structure:**
```
lib/features/profile-settings/two-factor/
├── types.ts
├── config.ts
├── hooks/
│   └── useTwoFactor.ts
├── components/
│   ├── TwoFactorSection.tsx
│   ├── EnableTwoFactorModal.tsx
│   ├── BackupCodesModal.tsx
│   └── VerifyTwoFactorModal.tsx
└── index.ts
```

**File**: `lib/features/profile-settings/two-factor/types.ts`
```typescript
export type TwoFactorMethod = 'email' | 'authenticator' | 'sms';

export interface TwoFactorSettings {
  enabled: boolean;
  method: TwoFactorMethod;
  phoneNumber?: string;        // For SMS
  secret?: string;             // For authenticator (encrypted)
  backupCodes: string[];       // Encrypted backup codes
  lastUsed?: string;           // ISO timestamp
}

export interface UseTwoFactorReturn {
  settings: TwoFactorSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  enableTwoFactor: (method: TwoFactorMethod) => Promise<void>;
  disableTwoFactor: () => Promise<void>;
  generateBackupCodes: () => Promise<string[]>;
  verifyCode: (code: string) => Promise<boolean>;
}
```

**File**: `lib/features/profile-settings/two-factor/components/TwoFactorSection.tsx`
```typescript
"use client";

import { Shield, CheckCircle, XCircle } from "lucide-react";
import { useTwoFactor } from "../hooks/useTwoFactor";

export default function TwoFactorSection() {
  const {
    settings,
    isLoading,
    enableTwoFactor,
    disableTwoFactor,
  } = useTwoFactor();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-400" />
          Two-Step Authentication
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-700">
                Authentication methods
              </span>
              {settings.enabled ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  On
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-300">
                  <XCircle className="w-3 h-3" />
                  Off
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              After entering your password, verify your identity with an authentication method.
            </p>
          </div>
        </div>

        {/* Description Card */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-2">
                Two-step authentication adds a layer of security to your account by using more than just your password to log in.
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">HOW IT WORKS</p>
                <p className="text-sm text-blue-800">
                  When you log in to Glamlink, you'll need to:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 ml-2">
                  <li>Enter your email and password</li>
                  <li>Complete a second step to prove that it's you logging in. You can enter a verification code, use a security key, or confirm your login on a trusted device.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => settings.enabled ? disableTwoFactor() : enableTwoFactor('email')}
          className="px-4 py-2 text-sm font-medium text-white bg-glamlink-teal hover:bg-glamlink-teal/90 rounded-lg transition-colors"
        >
          {settings.enabled ? 'Turn off two-step' : 'Turn on two-step'}
        </button>
      </div>
    </div>
  );
}
```

**Firebase Integration:**
- Use Firebase Auth's built-in 2FA (Multi-factor authentication)
- Store backup codes encrypted in Firestore

---

#### 3.2 Device Management

**Feature:**
- List all active sessions/devices
- Show device info: browser, OS, location, last active
- "This device" badge for current device
- Individual logout buttons
- "Log out all devices" option

**Implementation:**

**File**: `lib/features/profile-settings/security/types.ts`
```typescript
export interface DeviceSession {
  id: string;
  userId: string;
  deviceName: string;        // e.g., "Chrome on Windows"
  browser: string;           // "Chrome", "Firefox", etc.
  os: string;                // "Windows", "macOS", "Linux", etc.
  ipAddress: string;
  location: string;          // "Las Vegas (Nevada), United States"
  lastActive: string;        // ISO timestamp
  createdAt: string;         // ISO timestamp
  isCurrentDevice: boolean;
}

export interface UseDeviceManagementReturn {
  devices: DeviceSession[];
  isLoading: boolean;
  error: string | null;

  // Actions
  logoutDevice: (deviceId: string) => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  refreshDevices: () => Promise<void>;
}
```

**File**: `lib/features/profile-settings/components/SecuritySection.tsx`
```typescript
// Add to existing SecuritySection

{/* Device Management */}
<div className="mt-6 pt-6 border-t border-gray-200">
  <h3 className="text-sm font-medium text-gray-700 mb-3">Devices</h3>
  <p className="text-sm text-gray-600 mb-4">
    You're currently logged in to Glamlink on these devices. If you don't recognize a device, log out to keep your account secure.
  </p>

  <div className="space-y-3">
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Logged in</h4>

      {devices.map((device) => (
        <div key={device.id} className="flex items-start justify-between py-3 border-b border-gray-200 last:border-0">
          <div className="flex items-start gap-3">
            {/* Device Icon */}
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
              <Monitor className="w-5 h-5 text-gray-600" />
            </div>

            {/* Device Info */}
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">
                  {device.deviceName}
                </p>
                {device.isCurrentDevice && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    This device
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(device.lastActive), { addSuffix: true })}
              </p>
              <p className="text-xs text-gray-500">
                {device.location}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => logoutDevice(device.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded transition-colors"
          >
            Log out
          </button>
        </div>
      ))}
    </div>

    {/* Log out all devices */}
    <button
      onClick={logoutAllDevices}
      className="text-sm font-medium text-red-600 hover:text-red-700"
    >
      Log out all other devices
    </button>
  </div>
</div>
```

**Session Tracking Implementation:**
- Create session on login
- Update `lastActive` timestamp on each request (middleware)
- Store in Firestore: `users/{userId}/sessions/{sessionId}`
- Use JWT session tokens
- Parse User-Agent for browser/OS info
- Use IP geolocation API for location

---

### **Phase 4: Social Login Integration (Medium Priority)**

#### 4.1 Social Login Connections

**Feature:**
- Link/unlink social accounts (Google, Facebook, Apple)
- Show connection status
- Use for quick login

**Implementation:**

**File**: `lib/features/profile-settings/components/AccountInfoSection.tsx`
```typescript
{/* Social Login Connections */}
<div className="mt-6 pt-6 border-t border-gray-200">
  <h3 className="text-sm font-medium text-gray-700 mb-2">Login service</h3>
  <p className="text-sm text-gray-600 mb-4">
    Connect an external login service to quickly and securely access your Glamlink account.
  </p>

  <div className="space-y-2">
    {/* Apple */}
    <button
      onClick={() => connectProvider('apple')}
      disabled={connectedProviders.includes('apple')}
      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <Apple className="w-5 h-5" />
        <span className="text-sm font-medium text-gray-900">
          {connectedProviders.includes('apple') ? 'Connected to Apple' : 'Connect to Apple'}
        </span>
      </div>
      {connectedProviders.includes('apple') && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            disconnectProvider('apple');
          }}
          className="text-xs text-red-600 hover:text-red-700"
        >
          Disconnect
        </button>
      )}
    </button>

    {/* Facebook */}
    <button
      onClick={() => connectProvider('facebook')}
      disabled={connectedProviders.includes('facebook')}
      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <Facebook className="w-5 h-5 text-blue-600" />
        <span className="text-sm font-medium text-gray-900">
          {connectedProviders.includes('facebook') ? 'Connected to Facebook' : 'Connect to Facebook'}
        </span>
      </div>
      {connectedProviders.includes('facebook') && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            disconnectProvider('facebook');
          }}
          className="text-xs text-red-600 hover:text-red-700"
        >
          Disconnect
        </button>
      )}
    </button>

    {/* Google */}
    <button
      onClick={() => connectProvider('google')}
      disabled={connectedProviders.includes('google')}
      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          {/* Google icon SVG */}
        </svg>
        <span className="text-sm font-medium text-gray-900">
          {connectedProviders.includes('google') ? 'Connected to Google' : 'Connect to Google'}
        </span>
      </div>
      {connectedProviders.includes('google') && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            disconnectProvider('google');
          }}
          className="text-xs text-red-600 hover:text-red-700"
        >
          Disconnect
        </button>
      )}
    </button>
  </div>
</div>
```

**Firebase Implementation:**
```typescript
import {
  linkWithPopup,
  unlink,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth';

// Connect provider
async function connectProvider(providerId: 'google' | 'facebook' | 'apple') {
  const { auth, currentUser } = await getAuthenticatedAppForUser();

  let provider;
  switch (providerId) {
    case 'google':
      provider = new GoogleAuthProvider();
      break;
    case 'facebook':
      provider = new FacebookAuthProvider();
      break;
    case 'apple':
      provider = new OAuthProvider('apple.com');
      break;
  }

  try {
    await linkWithPopup(currentUser, provider);
    // Success
  } catch (error) {
    // Handle error
  }
}

// Disconnect provider
async function disconnectProvider(providerId: string) {
  const { currentUser } = await getAuthenticatedAppForUser();

  try {
    await unlink(currentUser, providerId);
    // Success
  } catch (error) {
    // Handle error
  }
}
```

---

## Implementation Summary

### **Phase 1: Profile Enhancement** (2-3 days)
- ✅ Split displayName into firstName + lastName
- ✅ Add phone number field
- ✅ Update ProfileEditSection component
- ✅ Migration script for existing users

### **Phase 2: Account Enhancement** (1-2 days)
- ✅ Add email verification badge
- ✅ Send verification email function
- ✅ Update AccountInfoSection component

### **Phase 3: Security Enhancement** (4-5 days)
- ✅ Two-factor authentication system
- ✅ Device/session management
- ✅ Update SecuritySection component
- ✅ Session tracking middleware

### **Phase 4: Social Login** (2-3 days)
- ✅ Social login connections
- ✅ Provider linking/unlinking
- ✅ OAuth integration

---

## Database Schema Updates

### **User Profile (Firestore)**
```typescript
users/{userId}
{
  // Existing fields
  displayName: string,
  email: string,
  photoURL: string,

  // NEW fields
  firstName: string,
  lastName: string,
  phoneNumber?: string,
  emailVerified: boolean,

  // Two-factor
  twoFactor: {
    enabled: boolean,
    method: 'email' | 'authenticator' | 'sms',
    phoneNumber?: string,
    secret?: string,              // Encrypted
    backupCodes: string[],        // Encrypted
    lastUsed?: Timestamp,
  },

  // Social connections
  connectedProviders: string[],   // ['google', 'facebook']

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp,
}

// NEW collection for sessions
users/{userId}/sessions/{sessionId}
{
  userId: string,
  deviceName: string,
  browser: string,
  os: string,
  ipAddress: string,
  location: string,
  lastActive: Timestamp,
  createdAt: Timestamp,
  token: string,                  // Hashed session token
}
```

---

## API Routes to Create

1. `/api/profile/send-verification` - POST - Send email verification
2. `/api/profile/two-factor/enable` - POST - Enable 2FA
3. `/api/profile/two-factor/disable` - POST - Disable 2FA
4. `/api/profile/two-factor/verify` - POST - Verify 2FA code
5. `/api/profile/two-factor/backup-codes` - GET - Generate backup codes
6. `/api/profile/sessions` - GET - List all sessions
7. `/api/profile/sessions/[id]` - DELETE - Logout specific session
8. `/api/profile/sessions/logout-all` - POST - Logout all other sessions
9. `/api/profile/social/connect` - POST - Link social provider
10. `/api/profile/social/disconnect` - DELETE - Unlink social provider

---

## Testing Checklist

### Phase 1: Profile
- [ ] First/last name fields save correctly
- [ ] displayName auto-generates from first + last
- [ ] Phone number validates correctly
- [ ] Phone number is optional
- [ ] Existing users migrate successfully

### Phase 2: Account
- [ ] Email verification badge shows correct status
- [ ] Send verification email works
- [ ] Verification link works and updates status

### Phase 3: Security
- [ ] 2FA enable/disable works
- [ ] Authenticator app integration works
- [ ] Backup codes generate and work
- [ ] Device list shows correctly
- [ ] Individual device logout works
- [ ] Logout all devices works
- [ ] Session tracking updates correctly

### Phase 4: Social
- [ ] Google connection works
- [ ] Facebook connection works
- [ ] Apple connection works
- [ ] Provider disconnection works
- [ ] Login with connected provider works

---

## Security Considerations

1. **2FA Implementation:**
   - Use Firebase's built-in multi-factor auth
   - Encrypt backup codes at rest
   - Rate limit verification attempts

2. **Session Management:**
   - Hash session tokens before storage
   - Implement session expiration (30 days)
   - Clear expired sessions automatically
   - Validate session on each request

3. **Social Login:**
   - Validate OAuth tokens
   - Require email verification
   - Prevent account takeover via provider linking

4. **Phone Numbers:**
   - Don't use for primary auth (2FA only)
   - Validate format before saving
   - Don't display full number publicly

---

## Migration Strategy

### Existing Users
```typescript
// Run once to migrate existing users
async function migrateUserProfiles() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);

  for (const doc of snapshot.docs) {
    const user = doc.data();

    // Split displayName
    const nameParts = (user.displayName || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update document
    await updateDoc(doc.ref, {
      firstName,
      lastName,
      emailVerified: user.emailVerified || false,
      'twoFactor.enabled': false,
      connectedProviders: [],
    });
  }
}
```

---

## Future Enhancements

1. **Passkeys (WebAuthn)** - Passwordless authentication
2. **SMS 2FA** - Additional 2FA method
3. **Security Keys** - Hardware token support
4. **Login History** - Audit log of all login attempts
5. **Suspicious Activity Alerts** - Email notifications for unusual logins
6. **Account Recovery** - Multiple recovery options
7. **Privacy Controls** - Who can see phone number, etc.

---

## Recommendations

**High Priority (Implement First):**
1. First/Last name fields (low effort, high value)
2. Phone number field (medium effort, high value)
3. Email verification badge (low effort, high value)
4. Two-factor authentication (high effort, very high value)

**Medium Priority (Implement Second):**
1. Device management (medium effort, medium value)
2. Social login connections (medium effort, medium value)

**Low Priority (Optional):**
1. Email update flow (very high effort, low value - most apps don't allow this)

**Start with Phase 1 & 2** to get quick wins, then tackle Phase 3 (2FA) for security.
