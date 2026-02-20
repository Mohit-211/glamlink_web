# Notifications Feature Plan

## Overview

Allow users to manage their email notification preferences for different types of communications from the platform.

---

## Directory Structure

```
lib/features/profile-settings/notifications/
├── types.ts
├── config.ts
├── components/
│   ├── NotificationsSection.tsx      # Main section for settings page
│   └── NotificationToggle.tsx        # Reusable toggle component
├── hooks/
│   └── useNotifications.ts           # Fetch/update preferences
└── index.ts
```

---

## Types

```typescript
// types.ts

export interface NotificationPreferences {
  // Marketing & Updates
  emailMarketing: boolean;           // Marketing emails, newsletters
  emailProductUpdates: boolean;      // New features, platform updates

  // Business Activity
  emailOrders: boolean;              // Order confirmations, booking updates
  emailReviews: boolean;             // New reviews on your brand/products
  emailMessages: boolean;            // Direct messages from customers

  // Promotions & Opportunities
  emailPromotions: boolean;          // Promotional opportunities
  emailFeatured: boolean;            // Featured/spotlight opportunities

  // System
  emailSecurity: boolean;            // Security alerts (always on, non-toggleable)
  emailAccountUpdates: boolean;      // Account-related notifications
}

export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  notifications: NotificationItem[];
}

export interface NotificationItem {
  id: keyof NotificationPreferences;
  label: string;
  description: string;
  required?: boolean;               // Cannot be disabled (e.g., security)
}

export interface UseNotificationsReturn {
  preferences: NotificationPreferences;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updatePreference: (key: keyof NotificationPreferences, value: boolean) => Promise<void>;
  updateAllInCategory: (keys: (keyof NotificationPreferences)[], value: boolean) => Promise<void>;
}
```

---

## Configuration

```typescript
// config.ts

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: 'marketing',
    name: 'Marketing & Updates',
    description: 'Stay informed about new features and opportunities',
    notifications: [
      {
        id: 'emailMarketing',
        label: 'Marketing emails',
        description: 'Newsletters, tips, and promotional content',
      },
      {
        id: 'emailProductUpdates',
        label: 'Product updates',
        description: 'New features and platform improvements',
      },
    ],
  },
  {
    id: 'business',
    name: 'Business Activity',
    description: 'Updates about your brand and customer interactions',
    notifications: [
      {
        id: 'emailOrders',
        label: 'Orders & bookings',
        description: 'Confirmations, updates, and reminders',
      },
      {
        id: 'emailReviews',
        label: 'Reviews',
        description: 'When customers leave reviews on your brand',
      },
      {
        id: 'emailMessages',
        label: 'Messages',
        description: 'Direct messages from customers',
      },
    ],
  },
  {
    id: 'promotions',
    name: 'Promotions & Opportunities',
    description: 'Growth opportunities for your brand',
    notifications: [
      {
        id: 'emailPromotions',
        label: 'Promotional opportunities',
        description: 'Discounts, partnerships, and special offers',
      },
      {
        id: 'emailFeatured',
        label: 'Featured opportunities',
        description: 'Spotlight and featured placement opportunities',
      },
    ],
  },
  {
    id: 'system',
    name: 'System & Security',
    description: 'Important account and security notifications',
    notifications: [
      {
        id: 'emailSecurity',
        label: 'Security alerts',
        description: 'Login attempts, password changes, and security updates',
        required: true,
      },
      {
        id: 'emailAccountUpdates',
        label: 'Account updates',
        description: 'Important changes to your account or terms',
      },
    ],
  },
];

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailMarketing: true,
  emailProductUpdates: true,
  emailOrders: true,
  emailReviews: true,
  emailMessages: true,
  emailPromotions: true,
  emailFeatured: true,
  emailSecurity: true,      // Always true
  emailAccountUpdates: true,
};
```

---

## Components

### NotificationsSection.tsx

Main section component for the settings page:
- Displays notification categories in grouped cards
- Toggle switches for each notification type
- "Enable All" / "Disable All" per category
- Visual indicator for required notifications
- Success/error feedback on toggle

### NotificationToggle.tsx

Reusable toggle component:
- Label and description
- Toggle switch (disabled state for required)
- Loading state during save
- Accessible with proper ARIA labels

---

## Hook

```typescript
// hooks/useNotifications.ts

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, [user?.uid]);

  const fetchPreferences = async () => {
    // GET /api/profile/notifications
  };

  const updatePreference = async (key, value) => {
    // PATCH /api/profile/notifications
    // Optimistic update with rollback on error
  };

  const updateAllInCategory = async (keys, value) => {
    // Batch update multiple preferences
  };

  return { preferences, isLoading, isSaving, error, updatePreference, updateAllInCategory };
}
```

---

## API Endpoints

### GET /api/profile/notifications
- Returns user's notification preferences
- Creates default preferences if none exist

### PATCH /api/profile/notifications
- Updates specific notification preferences
- Body: `{ [key]: boolean }`
- Validates keys against allowed preferences
- Prevents disabling required notifications

---

## Database Schema

Store in user profile document or separate preferences document:

```typescript
// Option 1: In user profile (Firestore)
users/{userId}/settings/notifications
{
  emailMarketing: true,
  emailProductUpdates: true,
  emailOrders: true,
  // ... etc
  updatedAt: Timestamp
}

// Option 2: In brand document (if brand-specific)
brands/{brandId}
{
  // ... existing fields
  notificationPreferences: {
    emailMarketing: true,
    // ... etc
  }
}
```

---

## UI Design

```
┌─────────────────────────────────────────────────────────────┐
│ Notification Preferences                                     │
│ Manage how we communicate with you                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Marketing & Updates                          [Enable All]   │
│ Stay informed about new features and opportunities          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Marketing emails                               [✓]     │ │
│ │ Newsletters, tips, and promotional content             │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Product updates                                [✓]     │ │
│ │ New features and platform improvements                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Business Activity                            [Enable All]   │
│ Updates about your brand and customer interactions          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Orders & bookings                              [✓]     │ │
│ │ Confirmations, updates, and reminders                  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Reviews                                        [✓]     │ │
│ │ When customers leave reviews on your brand             │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Messages                                       [✓]     │ │
│ │ Direct messages from customers                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ System & Security                                           │
│ Important account and security notifications                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Security alerts                           [✓] Required │ │
│ │ Login attempts, password changes                       │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Account updates                                [✓]     │ │
│ │ Important changes to your account or terms             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Optimistic Updates**: Toggle immediately, rollback on error
2. **Batch Updates**: "Enable All" should make single API call
3. **Required Notifications**: Security alerts cannot be disabled
4. **Default State**: New users get all notifications enabled
5. **Unsubscribe Links**: Email templates should include unsubscribe links that update these preferences

---

## Testing Checklist

- [ ] Default preferences created for new user
- [ ] Toggle updates preference immediately (optimistic)
- [ ] Toggle rolls back on API error
- [ ] "Enable All" enables all in category
- [ ] "Disable All" disables all except required
- [ ] Required notifications cannot be disabled
- [ ] Loading state shown during fetch
- [ ] Error state shown on failure
- [ ] Preferences persist across sessions

---

## Dependencies

- `@/lib/features/auth/useAuth` - For user context
- Firebase Firestore - Data persistence
- Lucide icons - Bell, Mail icons

---

## Priority

**High** - Users expect notification controls, relatively simple to implement
