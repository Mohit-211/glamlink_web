# Account Management Feature Plan

## Overview

Allow users to manage their account data including exporting all data (GDPR compliance), permanently deleting their account, temporarily pausing their brand, and transferring brand ownership.

---

## Directory Structure

```
lib/features/profile-settings/account/
├── types.ts
├── config.ts
├── components/
│   ├── DataManagementSection.tsx    # Main section for settings page
│   ├── ExportData.tsx               # Data export functionality
│   ├── DeleteAccount.tsx            # Permanent account deletion
│   ├── PauseAccount.tsx             # Temporary brand pause
│   └── TransferBrand.tsx            # Brand ownership transfer
├── hooks/
│   └── useAccountManagement.ts      # Account actions hook
└── index.ts
```

---

## Types

```typescript
// types.ts

export type ExportFormat = 'json' | 'csv' | 'zip';
export type ExportStatus = 'idle' | 'preparing' | 'ready' | 'downloading' | 'error';
export type AccountStatus = 'active' | 'paused' | 'pending_deletion' | 'deleted';
export type TransferStatus = 'idle' | 'pending' | 'accepted' | 'rejected' | 'expired';

export interface DataExportRequest {
  id: string;
  userId: string;
  requestedAt: string;
  status: ExportStatus;
  format: ExportFormat;
  downloadUrl?: string;
  expiresAt?: string;                 // Download link expiration
  fileSize?: number;                  // Size in bytes
  includedData: DataCategory[];
}

export type DataCategory =
  | 'profile'
  | 'brand'
  | 'products'
  | 'services'
  | 'portfolio'
  | 'reviews'
  | 'messages'
  | 'bookings'
  | 'analytics'
  | 'settings';

export interface AccountPauseSettings {
  isPaused: boolean;
  pausedAt?: string;
  pausedUntil?: string;               // Optional end date
  pauseReason?: string;
  showPausedMessage: boolean;         // Show "temporarily unavailable" on profile
  pausedMessage?: string;             // Custom pause message
  preserveBookings: boolean;          // Keep existing bookings active
}

export interface AccountDeletionRequest {
  id: string;
  userId: string;
  requestedAt: string;
  scheduledDeletionAt: string;        // 30-day grace period
  reason?: string;
  feedback?: string;
  status: 'pending' | 'cancelled' | 'completed';
}

export interface BrandTransferRequest {
  id: string;
  brandId: string;
  fromUserId: string;
  toEmail: string;
  toUserId?: string;                  // Set when recipient accepts
  status: TransferStatus;
  requestedAt: string;
  expiresAt: string;                  // 7 days to accept
  acceptedAt?: string;
  message?: string;                   // Optional message to recipient
}

export interface UseAccountManagementReturn {
  // Account Status
  accountStatus: AccountStatus;
  pauseSettings: AccountPauseSettings;
  deletionRequest: AccountDeletionRequest | null;
  transferRequest: BrandTransferRequest | null;

  // Loading States
  isLoading: boolean;
  isExporting: boolean;
  isPausing: boolean;
  isDeleting: boolean;
  isTransferring: boolean;
  error: string | null;

  // Data Export
  requestExport: (categories: DataCategory[], format: ExportFormat) => Promise<DataExportRequest>;
  downloadExport: (requestId: string) => Promise<void>;
  exportHistory: DataExportRequest[];

  // Account Pause
  pauseAccount: (settings: Partial<AccountPauseSettings>) => Promise<void>;
  resumeAccount: () => Promise<void>;

  // Account Deletion
  requestDeletion: (reason?: string, feedback?: string) => Promise<AccountDeletionRequest>;
  cancelDeletion: () => Promise<void>;

  // Brand Transfer
  initiateTransfer: (toEmail: string, message?: string) => Promise<BrandTransferRequest>;
  cancelTransfer: () => Promise<void>;
  acceptTransfer: (requestId: string) => Promise<void>;
  rejectTransfer: (requestId: string) => Promise<void>;
}
```

---

## Configuration

```typescript
// config.ts

export const DATA_CATEGORIES: {
  id: DataCategory;
  label: string;
  description: string;
  estimatedSize: string;
}[] = [
  {
    id: 'profile',
    label: 'Profile Information',
    description: 'Your name, email, bio, and account settings',
    estimatedSize: '< 1 MB',
  },
  {
    id: 'brand',
    label: 'Brand Information',
    description: 'Brand name, description, contact info, and settings',
    estimatedSize: '< 1 MB',
  },
  {
    id: 'products',
    label: 'Products',
    description: 'All product listings and images',
    estimatedSize: '10-50 MB',
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Service offerings, pricing, and descriptions',
    estimatedSize: '< 5 MB',
  },
  {
    id: 'portfolio',
    label: 'Portfolio & Gallery',
    description: 'Before/after photos and portfolio images',
    estimatedSize: '50-200 MB',
  },
  {
    id: 'reviews',
    label: 'Reviews',
    description: 'Customer reviews and your responses',
    estimatedSize: '< 5 MB',
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'All direct messages and conversations',
    estimatedSize: '5-20 MB',
  },
  {
    id: 'bookings',
    label: 'Bookings',
    description: 'Appointment history and booking records',
    estimatedSize: '< 10 MB',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Profile views, engagement data, and statistics',
    estimatedSize: '< 5 MB',
  },
  {
    id: 'settings',
    label: 'Settings & Preferences',
    description: 'All account settings and preferences',
    estimatedSize: '< 1 MB',
  },
];

export const EXPORT_FORMATS: {
  value: ExportFormat;
  label: string;
  description: string;
}[] = [
  {
    value: 'json',
    label: 'JSON',
    description: 'Machine-readable format, preserves data structure',
  },
  {
    value: 'csv',
    label: 'CSV',
    description: 'Spreadsheet-compatible, good for viewing data',
  },
  {
    value: 'zip',
    label: 'ZIP Archive',
    description: 'Complete archive with all files and images',
  },
];

export const DELETION_GRACE_PERIOD_DAYS = 30;

export const TRANSFER_EXPIRATION_DAYS = 7;

export const PAUSE_REASONS = [
  'Taking a break',
  'Vacation',
  'Health reasons',
  'Business restructuring',
  'Seasonal closure',
  'Other',
];

export const DELETION_REASONS = [
  'No longer need the service',
  'Switching to a different platform',
  'Privacy concerns',
  'Too expensive',
  'Not getting enough customers',
  'Closing my business',
  'Other',
];

export const CONFIRMATION_PHRASES = {
  delete: 'DELETE MY ACCOUNT',
  transfer: 'TRANSFER BRAND',
};
```

---

## Components

### DataManagementSection.tsx

Main section overview:
- Account status display
- Quick actions for each sub-section
- Warnings for pending actions (deletion, transfer)
- Last export date

### ExportData.tsx

Data export functionality:
- Category selection checkboxes
- Format selection
- "Select all" option
- Estimated total size
- Export button with progress
- Download history
- Privacy policy link

### DeleteAccount.tsx

Account deletion flow:
- Multi-step confirmation
- Reason selection
- Optional feedback textarea
- Warning about what will be deleted
- Type confirmation phrase
- 30-day grace period explanation
- Cancel pending deletion option

### PauseAccount.tsx

Temporary pause configuration:
- Enable/disable toggle
- End date picker (optional)
- Custom pause message
- Option to preserve existing bookings
- Preview of paused profile appearance

### TransferBrand.tsx

Brand ownership transfer:
- Email input for recipient
- Optional message
- Multi-step confirmation
- Pending transfer status
- Cancel transfer option
- Transfer history

---

## Hook

```typescript
// hooks/useAccountManagement.ts

export function useAccountManagement(): UseAccountManagementReturn {
  const { user } = useAuth();
  const [accountStatus, setAccountStatus] = useState<AccountStatus>('active');
  const [pauseSettings, setPauseSettings] = useState<AccountPauseSettings>({
    isPaused: false,
    showPausedMessage: true,
    preserveBookings: true,
  });
  const [deletionRequest, setDeletionRequest] = useState<AccountDeletionRequest | null>(null);
  const [transferRequest, setTransferRequest] = useState<BrandTransferRequest | null>(null);
  const [exportHistory, setExportHistory] = useState<DataExportRequest[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountData();
  }, [user?.uid]);

  const fetchAccountData = async () => {
    // GET /api/profile/account
    // Returns status, pause settings, pending requests
  };

  // Data Export
  const requestExport = async (categories: DataCategory[], format: ExportFormat) => {
    // POST /api/profile/account/export
    // Returns request with status 'preparing'
    // Background job prepares data
    // Webhook/polling to check when ready
  };

  const downloadExport = async (requestId: string) => {
    // GET /api/profile/account/export/{requestId}/download
    // Returns signed URL for download
  };

  // Account Pause
  const pauseAccount = async (settings: Partial<AccountPauseSettings>) => {
    // PATCH /api/profile/account/pause
    // Updates brand visibility
  };

  const resumeAccount = async () => {
    // DELETE /api/profile/account/pause
    // Restores normal visibility
  };

  // Account Deletion
  const requestDeletion = async (reason?: string, feedback?: string) => {
    // POST /api/profile/account/delete
    // Sets 30-day timer
    // Sends confirmation email
  };

  const cancelDeletion = async () => {
    // DELETE /api/profile/account/delete
    // Cancels pending deletion
  };

  // Brand Transfer
  const initiateTransfer = async (toEmail: string, message?: string) => {
    // POST /api/profile/account/transfer
    // Sends invitation email to recipient
    // 7-day expiration
  };

  const cancelTransfer = async () => {
    // DELETE /api/profile/account/transfer
  };

  const acceptTransfer = async (requestId: string) => {
    // POST /api/profile/account/transfer/{requestId}/accept
    // Transfers brand ownership
  };

  const rejectTransfer = async (requestId: string) => {
    // POST /api/profile/account/transfer/{requestId}/reject
  };

  return {
    accountStatus,
    pauseSettings,
    deletionRequest,
    transferRequest,
    isLoading,
    isExporting,
    isPausing,
    isDeleting,
    isTransferring,
    error,
    requestExport,
    downloadExport,
    exportHistory,
    pauseAccount,
    resumeAccount,
    requestDeletion,
    cancelDeletion,
    initiateTransfer,
    cancelTransfer,
    acceptTransfer,
    rejectTransfer,
  };
}
```

---

## API Endpoints

### Account Status

```
GET  /api/profile/account              - Get account status and settings
```

### Data Export

```
POST /api/profile/account/export       - Request data export
GET  /api/profile/account/export       - List export history
GET  /api/profile/account/export/{id}  - Get export status
GET  /api/profile/account/export/{id}/download - Get download URL
```

### Account Pause

```
PATCH  /api/profile/account/pause      - Pause account
DELETE /api/profile/account/pause      - Resume account
```

### Account Deletion

```
POST   /api/profile/account/delete     - Request deletion (30-day grace)
DELETE /api/profile/account/delete     - Cancel deletion request
```

### Brand Transfer

```
POST   /api/profile/account/transfer              - Initiate transfer
DELETE /api/profile/account/transfer              - Cancel transfer
POST   /api/profile/account/transfer/{id}/accept  - Accept transfer
POST   /api/profile/account/transfer/{id}/reject  - Reject transfer
```

---

## Database Schema

```typescript
// Account status in user document
users/{userId}
{
  // ... existing fields
  accountStatus: 'active' | 'paused' | 'pending_deletion',
  pauseSettings: {
    isPaused: false,
    pausedAt: null,
    pausedUntil: null,
    pauseReason: null,
    showPausedMessage: true,
    pausedMessage: null,
    preserveBookings: true,
  },
}

// Data export requests collection
dataExports/{exportId}
{
  userId: 'user_xxx',
  requestedAt: Timestamp,
  status: 'preparing' | 'ready' | 'downloaded' | 'expired',
  format: 'json' | 'csv' | 'zip',
  categories: ['profile', 'brand', ...],
  downloadUrl: 'https://storage.../export.zip',
  expiresAt: Timestamp,
  fileSize: 52428800,  // bytes
  downloadedAt: Timestamp | null,
}

// Deletion requests collection
deletionRequests/{requestId}
{
  userId: 'user_xxx',
  requestedAt: Timestamp,
  scheduledDeletionAt: Timestamp,  // +30 days
  reason: 'Closing my business',
  feedback: 'Great platform but...',
  status: 'pending' | 'cancelled' | 'completed',
  cancelledAt: Timestamp | null,
  completedAt: Timestamp | null,
}

// Transfer requests collection
brandTransfers/{transferId}
{
  brandId: 'brand_xxx',
  fromUserId: 'user_xxx',
  toEmail: 'new@owner.com',
  toUserId: null,  // Set when accepted
  status: 'pending' | 'accepted' | 'rejected' | 'expired',
  requestedAt: Timestamp,
  expiresAt: Timestamp,  // +7 days
  acceptedAt: Timestamp | null,
  message: 'Transferring to new partner',
}
```

---

## UI Design

### Export Data

```
┌─────────────────────────────────────────────────────────────┐
│ Export Your Data                                            │
│ Download a copy of all your data                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Select data to export:                          [Select All]│
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑️ Profile Information              < 1 MB              │ │
│ │    Your name, email, bio, and account settings         │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ☑️ Brand Information                < 1 MB              │ │
│ │    Brand name, description, contact info               │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ☑️ Products                         10-50 MB            │ │
│ │    All product listings and images                     │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ☑️ Portfolio & Gallery              50-200 MB           │ │
│ │    Before/after photos and portfolio images            │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ☑️ Reviews                          < 5 MB              │ │
│ │    Customer reviews and your responses                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Export Format:                                              │
│ ● ZIP Archive - Complete archive with all files            │
│ ○ JSON - Machine-readable format                           │
│ ○ CSV - Spreadsheet-compatible                             │
│                                                             │
│ Estimated total size: ~75 MB                                │
│                                                             │
│                              [Request Export]               │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ Export History                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Jan 10, 2025 - ZIP (52 MB)         [Download] Expires   │ │
│ │ All data                            in 6 days           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Delete Account

```
┌─────────────────────────────────────────────────────────────┐
│ Delete Account                                              │
│ Permanently delete your account and all data                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚠️ Warning: This action cannot be undone                    │
│                                                             │
│ Deleting your account will:                                 │
│ • Permanently delete your profile and brand                 │
│ • Remove all products, services, and portfolio items        │
│ • Delete all reviews and messages                           │
│ • Cancel any pending bookings                               │
│ • Remove you from search results                            │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ Why are you leaving?                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Closing my business                                 ▼  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Help us improve (optional):                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Any feedback you'd like to share...                    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ To confirm, type "DELETE MY ACCOUNT":                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ℹ️ You'll have 30 days to change your mind before          │
│   deletion is permanent.                                    │
│                                                             │
│                              [Cancel] [Delete Account]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pause Account

```
┌─────────────────────────────────────────────────────────────┐
│ Pause Your Brand                                            │
│ Temporarily hide your brand without deleting anything       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Pause brand                                   [✓]          │
│                                                             │
│ When paused:                                                │
│ • Your brand won't appear in search results                 │
│ • Customers can't book new appointments                     │
│ • Your profile shows "temporarily unavailable"              │
│ • All your data is preserved                                │
│                                                             │
│ Pause until (optional):                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📅  February 15, 2025                             [×]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Leave empty for indefinite pause                            │
│                                                             │
│ Reason:                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Vacation                                            ▼  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Options:                                                    │
│ ☑️ Show "temporarily unavailable" message on profile        │
│ ☑️ Keep existing bookings active                            │
│                                                             │
│ Custom message (optional):                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ We're taking a short break and will be back soon!      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                              [Cancel] [Pause Brand]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Transfer Brand

```
┌─────────────────────────────────────────────────────────────┐
│ Transfer Brand Ownership                                    │
│ Transfer your brand to another person                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚠️ This will transfer complete ownership of your brand      │
│                                                             │
│ After transfer:                                             │
│ • You will lose access to manage the brand                  │
│ • The new owner will control all brand settings             │
│ • Products, reviews, and bookings transfer to them          │
│ • Your account remains active (without this brand)          │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ New owner's email:                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ newowner@email.com                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Message (optional):                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Hi! I'm transferring my beauty brand to you...         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ To confirm, type "TRANSFER BRAND":                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ℹ️ The recipient has 7 days to accept. You can cancel      │
│   the transfer at any time before they accept.              │
│                                                             │
│                              [Cancel] [Send Transfer]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Data Export**:
   - Use background job for large exports
   - Stream data to prevent memory issues
   - Generate signed URLs with expiration
   - Consider rate limiting exports

2. **GDPR Compliance**:
   - Export must include all user data
   - 30-day deletion period recommended
   - Keep audit log of deletion
   - Delete from all systems (Firestore, Storage, Analytics)

3. **Account Deletion**:
   - Soft delete during grace period
   - Hard delete after 30 days via scheduled job
   - Send reminder emails during grace period
   - Archive for compliance before deletion

4. **Brand Transfer**:
   - Recipient must have Glamlink account
   - Or create account to accept
   - Atomic transfer operation
   - Notification to both parties

5. **Pause Functionality**:
   - Update brand visibility in search index
   - Middleware to show pause message
   - Auto-resume when pause date passes

6. **Security**:
   - Rate limit sensitive actions
   - Require password confirmation
   - Email notifications for all actions
   - IP logging for audit trail

---

## Testing Checklist

- [ ] Export request creates background job
- [ ] Export download works with signed URL
- [ ] Export link expires after 7 days
- [ ] Deletion request sets 30-day timer
- [ ] Deletion can be cancelled
- [ ] Reminder emails sent during grace period
- [ ] Account actually deletes after 30 days
- [ ] Pause hides brand from search
- [ ] Pause message displays on profile
- [ ] Auto-resume works when date passes
- [ ] Transfer email sent to recipient
- [ ] Transfer expires after 7 days
- [ ] Accept transfer changes ownership
- [ ] Reject transfer notifies sender

---

## Dependencies

- Background job system - For export preparation
- Email service - For notifications
- Scheduled tasks - For deletion execution
- File storage - For export files
- Lucide icons - Download, Trash, Pause, UserPlus

---

## Priority

**Lower** - Important for compliance but less frequently used
