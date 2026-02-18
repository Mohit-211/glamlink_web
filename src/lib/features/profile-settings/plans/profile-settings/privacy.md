# Privacy Feature Plan

## Overview

Allow users to control the visibility of their brand profile and personal information across the platform.

---

## Directory Structure

```
lib/features/profile-settings/privacy/
├── types.ts
├── config.ts
├── components/
│   ├── PrivacySection.tsx           # Main section for settings page
│   ├── VisibilitySelector.tsx       # Dropdown for visibility levels
│   └── PrivacyToggle.tsx            # Toggle for boolean settings
├── hooks/
│   └── usePrivacy.ts                # Fetch/update privacy settings
└── index.ts
```

---

## Types

```typescript
// types.ts

export type ProfileVisibility = 'public' | 'private' | 'unlisted';
export type SearchVisibility = 'visible' | 'hidden';
export type ActivityStatus = 'show' | 'hide';

export interface PrivacySettings {
  // Profile Visibility
  profileVisibility: ProfileVisibility;     // Who can see your brand profile
  searchVisibility: SearchVisibility;       // Appear in marketplace search

  // Activity & Status
  showActivityStatus: boolean;              // Show "Online" indicator
  showLastActive: boolean;                  // Show "Last active" timestamp

  // Contact Information
  hideEmail: boolean;                       // Don't display email publicly
  hidePhone: boolean;                       // Don't display phone publicly
  hideAddress: boolean;                     // Don't display full address
  showCityOnly: boolean;                    // Show city instead of full address

  // Social & Engagement
  allowMessages: boolean;                   // Allow direct messages
  allowReviews: boolean;                    // Allow customers to leave reviews
  showReviewCount: boolean;                 // Display review count on profile

  // Analytics
  hideFromAnalytics: boolean;               // Opt out of platform analytics
}

export interface VisibilityOption {
  value: ProfileVisibility;
  label: string;
  description: string;
  icon: string;
}

export interface PrivacySetting {
  id: keyof PrivacySettings;
  label: string;
  description: string;
  type: 'toggle' | 'select';
  options?: VisibilityOption[];
  warning?: string;                         // Warning text for sensitive settings
}

export interface PrivacyCategory {
  id: string;
  name: string;
  description: string;
  settings: PrivacySetting[];
}

export interface UsePrivacyReturn {
  settings: PrivacySettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateSetting: <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => Promise<void>;
}
```

---

## Configuration

```typescript
// config.ts

export const VISIBILITY_OPTIONS: VisibilityOption[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can view your brand profile',
    icon: 'Globe',
  },
  {
    value: 'unlisted',
    label: 'Unlisted',
    description: 'Only people with the link can view your profile',
    icon: 'Link',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can view your brand profile',
    icon: 'Lock',
  },
];

export const PRIVACY_CATEGORIES: PrivacyCategory[] = [
  {
    id: 'visibility',
    name: 'Profile Visibility',
    description: 'Control who can find and view your brand',
    settings: [
      {
        id: 'profileVisibility',
        label: 'Profile visibility',
        description: 'Choose who can see your brand profile',
        type: 'select',
        options: VISIBILITY_OPTIONS,
      },
      {
        id: 'searchVisibility',
        label: 'Search visibility',
        description: 'Allow your brand to appear in marketplace search results',
        type: 'toggle',
        warning: 'Hiding from search may reduce customer discovery',
      },
    ],
  },
  {
    id: 'activity',
    name: 'Activity & Status',
    description: 'Control visibility of your online status',
    settings: [
      {
        id: 'showActivityStatus',
        label: 'Show online status',
        description: 'Display when you are currently online',
        type: 'toggle',
      },
      {
        id: 'showLastActive',
        label: 'Show last active',
        description: 'Display when you were last active on the platform',
        type: 'toggle',
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact Information',
    description: 'Control what contact details are visible',
    settings: [
      {
        id: 'hideEmail',
        label: 'Hide email address',
        description: 'Do not display your email on your public profile',
        type: 'toggle',
      },
      {
        id: 'hidePhone',
        label: 'Hide phone number',
        description: 'Do not display your phone number publicly',
        type: 'toggle',
      },
      {
        id: 'hideAddress',
        label: 'Hide full address',
        description: 'Only show city/region instead of full address',
        type: 'toggle',
      },
    ],
  },
  {
    id: 'social',
    name: 'Social & Engagement',
    description: 'Control how customers can interact with you',
    settings: [
      {
        id: 'allowMessages',
        label: 'Allow direct messages',
        description: 'Let customers send you direct messages',
        type: 'toggle',
      },
      {
        id: 'allowReviews',
        label: 'Allow reviews',
        description: 'Let customers leave reviews on your brand',
        type: 'toggle',
        warning: 'Disabling reviews may affect customer trust',
      },
      {
        id: 'showReviewCount',
        label: 'Show review count',
        description: 'Display total number of reviews on your profile',
        type: 'toggle',
      },
    ],
  },
];

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisibility: 'public',
  searchVisibility: 'visible',
  showActivityStatus: true,
  showLastActive: true,
  hideEmail: false,
  hidePhone: true,
  hideAddress: false,
  showCityOnly: false,
  allowMessages: true,
  allowReviews: true,
  showReviewCount: true,
  hideFromAnalytics: false,
};
```

---

## Components

### PrivacySection.tsx

Main section component for the settings page:
- Displays privacy categories in grouped cards
- Mix of toggle switches and select dropdowns
- Warning badges for sensitive settings
- Real-time preview of how profile appears

### VisibilitySelector.tsx

Dropdown component for visibility selection:
- Radio-style options with icons
- Description for each option
- Current selection highlighted

### PrivacyToggle.tsx

Toggle component with optional warning:
- Standard toggle switch
- Warning icon and text when applicable
- Confirmation dialog for sensitive changes

---

## Hook

```typescript
// hooks/usePrivacy.ts

export function usePrivacy(): UsePrivacyReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [user?.uid]);

  const fetchSettings = async () => {
    // GET /api/profile/privacy
  };

  const updateSetting = async <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    // PATCH /api/profile/privacy
    // Show confirmation for sensitive changes (allowReviews, searchVisibility)
  };

  return { settings, isLoading, isSaving, error, updateSetting };
}
```

---

## API Endpoints

### GET /api/profile/privacy
- Returns user's privacy settings
- Creates default settings if none exist

### PATCH /api/profile/privacy
- Updates specific privacy settings
- Body: `{ [key]: value }`
- Validates values against allowed options

---

## Database Schema

```typescript
// In user settings document or brand document
brands/{brandId}
{
  // ... existing fields
  privacySettings: {
    profileVisibility: 'public',
    searchVisibility: 'visible',
    showActivityStatus: true,
    showLastActive: true,
    hideEmail: false,
    hidePhone: true,
    hideAddress: false,
    showCityOnly: false,
    allowMessages: true,
    allowReviews: true,
    showReviewCount: true,
    hideFromAnalytics: false,
    updatedAt: Timestamp
  }
}
```

---

## UI Design

```
┌─────────────────────────────────────────────────────────────┐
│ Privacy Settings                                            │
│ Control who can see your information                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Profile Visibility                                          │
│ Control who can find and view your brand                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Profile visibility                                      │ │
│ │ Choose who can see your brand profile                   │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 🌐 Public                                      ✓   │ │ │
│ │ │    Anyone can view your brand profile              │ │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ 🔗 Unlisted                                        │ │ │
│ │ │    Only people with the link can view              │ │ │
│ │ ├─────────────────────────────────────────────────────┤ │ │
│ │ │ 🔒 Private                                         │ │ │
│ │ │    Only you can view your brand profile            │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Search visibility                              [✓]     │ │
│ │ Allow your brand to appear in search results           │ │
│ │ ⚠️ Hiding from search may reduce customer discovery    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Contact Information                                         │
│ Control what contact details are visible                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Hide email address                             [ ]     │ │
│ │ Do not display your email on your public profile       │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Hide phone number                              [✓]     │ │
│ │ Do not display your phone number publicly              │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Hide full address                              [ ]     │ │
│ │ Only show city/region instead of full address          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Profile Visibility Effects**:
   - `public`: Normal listing in marketplace
   - `unlisted`: Removed from search/browse, accessible via direct link
   - `private`: Returns 404 for non-owner visits

2. **Search Visibility**:
   - When hidden, exclude from marketplace search queries
   - Still accessible via direct link if profile is public/unlisted

3. **Contact Info Privacy**:
   - Respect these settings in brand detail pages
   - Show "Contact through platform" when email/phone hidden

4. **Warning Dialogs**:
   - Confirm before disabling reviews
   - Confirm before hiding from search
   - Explain implications clearly

5. **Real-time Preview**:
   - Consider adding a preview panel showing how profile appears to others

---

## Testing Checklist

- [ ] Default settings applied for new users
- [ ] Profile visibility changes affect public access
- [ ] Private profiles return 404 for non-owners
- [ ] Unlisted profiles don't appear in search
- [ ] Hidden contact info not shown on profile
- [ ] Warning dialog appears for sensitive changes
- [ ] Settings persist across sessions
- [ ] Error handling for failed updates

---

## Dependencies

- `@/lib/features/auth/useAuth` - For user context
- Firebase Firestore - Data persistence
- Lucide icons - Globe, Lock, Link, Eye, EyeOff icons

---

## Priority

**High** - Important for user control and trust, relatively straightforward implementation
