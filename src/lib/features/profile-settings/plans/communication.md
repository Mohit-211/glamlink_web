# Communication Feature Plan

## Overview

Allow beauty professionals to manage how customers can contact them, configure booking availability, and set up automated away messages.

---

## Directory Structure

```
lib/features/profile-settings/communication/
├── types.ts
├── config.ts
├── components/
│   ├── CommunicationSection.tsx     # Main section for settings page
│   ├── ContactPreferences.tsx       # How clients can reach you
│   ├── BookingSettings.tsx          # Accept/pause bookings
│   └── AutoReply.tsx                # Away message configuration
├── hooks/
│   └── useCommunication.ts          # Fetch/update communication settings
└── index.ts
```

---

## Types

```typescript
// types.ts

export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'instagram' | 'platform_message';
export type BookingStatus = 'accepting' | 'paused' | 'by_request';
export type AutoReplyTrigger = 'always' | 'outside_hours' | 'when_busy' | 'disabled';

export interface ContactMethodConfig {
  method: ContactMethod;
  enabled: boolean;
  value: string;                      // Email address, phone number, handle
  isPrimary: boolean;                 // Primary contact method
  displayOnProfile: boolean;          // Show on public profile
}

export interface BookingSettings {
  status: BookingStatus;
  pausedUntil?: string;               // ISO date for temporary pause
  pauseReason?: string;               // Optional reason shown to customers
  leadTime: number;                   // Minimum hours before booking (0-168)
  maxAdvanceBooking: number;          // Maximum days in advance (1-365)
  requireDeposit: boolean;            // Require deposit for bookings
  depositAmount?: number;             // Deposit percentage or fixed amount
  depositType?: 'percentage' | 'fixed';
  instantBooking: boolean;            // Allow instant booking vs. request only
  cancellationPolicy: CancellationPolicy;
}

export type CancellationPolicy =
  | 'flexible'                        // Free cancellation up to 24h before
  | 'moderate'                        // Free cancellation up to 48h before
  | 'strict'                          // Free cancellation up to 7 days before
  | 'custom';

export interface CustomCancellationPolicy {
  freeCancellationHours: number;      // Hours before appointment
  refundPercentage: number;           // Refund if cancelled after deadline
}

export interface AutoReplySettings {
  enabled: boolean;
  trigger: AutoReplyTrigger;
  message: string;                    // Custom auto-reply message
  includeAvailability: boolean;       // Include next available time
  includeBookingLink: boolean;        // Include link to book
  excludeExistingClients: boolean;    // Don't auto-reply to existing clients
}

export interface CommunicationSettings {
  contactMethods: ContactMethodConfig[];
  booking: BookingSettings;
  autoReply: AutoReplySettings;
}

export interface UseCommunicationReturn {
  settings: CommunicationSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Contact Methods
  updateContactMethod: (method: ContactMethod, updates: Partial<ContactMethodConfig>) => Promise<void>;
  addContactMethod: (config: ContactMethodConfig) => Promise<void>;
  removeContactMethod: (method: ContactMethod) => Promise<void>;
  setPrimaryContact: (method: ContactMethod) => Promise<void>;

  // Booking Settings
  updateBookingSettings: (updates: Partial<BookingSettings>) => Promise<void>;
  pauseBookings: (until?: string, reason?: string) => Promise<void>;
  resumeBookings: () => Promise<void>;

  // Auto Reply
  updateAutoReply: (updates: Partial<AutoReplySettings>) => Promise<void>;
}
```

---

## Configuration

```typescript
// config.ts

export const CONTACT_METHOD_OPTIONS: {
  method: ContactMethod;
  label: string;
  icon: string;
  placeholder: string;
  validation: RegExp;
}[] = [
  {
    method: 'email',
    label: 'Email',
    icon: 'Mail',
    placeholder: 'your@email.com',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  {
    method: 'phone',
    label: 'Phone',
    icon: 'Phone',
    placeholder: '+1 (555) 123-4567',
    validation: /^\+?[\d\s-()]+$/,
  },
  {
    method: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageCircle',
    placeholder: '+1 555 123 4567',
    validation: /^\+?[\d\s]+$/,
  },
  {
    method: 'instagram',
    label: 'Instagram',
    icon: 'Instagram',
    placeholder: '@yourusername',
    validation: /^@?[\w.]+$/,
  },
  {
    method: 'platform_message',
    label: 'Platform Messages',
    icon: 'MessageSquare',
    placeholder: 'Enabled by default',
    validation: /.*/,
  },
];

export const BOOKING_STATUS_OPTIONS: {
  value: BookingStatus;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'accepting',
    label: 'Accepting Bookings',
    description: 'Customers can book appointments',
    icon: 'CheckCircle',
  },
  {
    value: 'paused',
    label: 'Paused',
    description: 'Temporarily not accepting new bookings',
    icon: 'PauseCircle',
  },
  {
    value: 'by_request',
    label: 'By Request Only',
    description: 'Customers must request and you approve',
    icon: 'HelpCircle',
  },
];

export const CANCELLATION_POLICIES: {
  value: CancellationPolicy;
  label: string;
  description: string;
}[] = [
  {
    value: 'flexible',
    label: 'Flexible',
    description: 'Free cancellation up to 24 hours before',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Free cancellation up to 48 hours before',
  },
  {
    value: 'strict',
    label: 'Strict',
    description: 'Free cancellation up to 7 days before',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Set your own cancellation policy',
  },
];

export const AUTO_REPLY_TRIGGERS: {
  value: AutoReplyTrigger;
  label: string;
  description: string;
}[] = [
  {
    value: 'disabled',
    label: 'Disabled',
    description: 'No automatic replies',
  },
  {
    value: 'always',
    label: 'Always',
    description: 'Reply to all new messages',
  },
  {
    value: 'outside_hours',
    label: 'Outside Business Hours',
    description: 'Reply when outside your set hours',
  },
  {
    value: 'when_busy',
    label: 'When Busy',
    description: 'Reply when bookings are paused',
  },
];

export const DEFAULT_AUTO_REPLY_MESSAGE = `Thanks for reaching out! I've received your message and will get back to you as soon as possible.

In the meantime, feel free to check my availability and book an appointment through my profile.

Best,
{{brand_name}}`;

export const DEFAULT_COMMUNICATION_SETTINGS: CommunicationSettings = {
  contactMethods: [
    {
      method: 'platform_message',
      enabled: true,
      value: '',
      isPrimary: true,
      displayOnProfile: true,
    },
  ],
  booking: {
    status: 'accepting',
    leadTime: 24,
    maxAdvanceBooking: 60,
    requireDeposit: false,
    instantBooking: true,
    cancellationPolicy: 'moderate',
  },
  autoReply: {
    enabled: false,
    trigger: 'disabled',
    message: DEFAULT_AUTO_REPLY_MESSAGE,
    includeAvailability: true,
    includeBookingLink: true,
    excludeExistingClients: true,
  },
};
```

---

## Components

### CommunicationSection.tsx

Main section for settings page overview:
- Summary cards for each sub-section
- Quick actions (pause bookings, enable auto-reply)
- Links to detailed settings

### ContactPreferences.tsx

Contact method management:
- List of enabled contact methods
- Add/remove methods
- Set primary contact
- Toggle profile visibility for each
- Validation for each method type

### BookingSettings.tsx

Booking configuration:
- Status selector (accepting/paused/by request)
- Pause modal with date picker and reason
- Lead time and advance booking limits
- Deposit configuration
- Cancellation policy selection
- Custom policy builder

### AutoReply.tsx

Auto-reply configuration:
- Enable/disable toggle
- Trigger selection
- Message editor with preview
- Template variables ({{brand_name}}, etc.)
- Options for including availability/booking link

---

## Hook

```typescript
// hooks/useCommunication.ts

export function useCommunication(): UseCommunicationReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CommunicationSettings>(DEFAULT_COMMUNICATION_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [user?.uid]);

  const fetchSettings = async () => {
    // GET /api/profile/communication
  };

  // Contact Method Actions
  const updateContactMethod = async (method, updates) => {
    // Validate updates
    // PATCH /api/profile/communication/contact
  };

  const addContactMethod = async (config) => {
    // Validate config
    // POST /api/profile/communication/contact
  };

  const removeContactMethod = async (method) => {
    // DELETE /api/profile/communication/contact/{method}
  };

  const setPrimaryContact = async (method) => {
    // PATCH /api/profile/communication/contact/{method}/primary
  };

  // Booking Actions
  const updateBookingSettings = async (updates) => {
    // PATCH /api/profile/communication/booking
  };

  const pauseBookings = async (until, reason) => {
    // Special case of updateBookingSettings
  };

  const resumeBookings = async () => {
    // Special case of updateBookingSettings
  };

  // Auto Reply Actions
  const updateAutoReply = async (updates) => {
    // PATCH /api/profile/communication/auto-reply
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateContactMethod,
    addContactMethod,
    removeContactMethod,
    setPrimaryContact,
    updateBookingSettings,
    pauseBookings,
    resumeBookings,
    updateAutoReply,
  };
}
```

---

## API Endpoints

### GET /api/profile/communication
- Returns all communication settings

### PATCH /api/profile/communication/contact
- Update contact method settings
- Body: `{ method: string, updates: {...} }`

### POST /api/profile/communication/contact
- Add new contact method
- Body: `{ method: string, value: string, ... }`

### DELETE /api/profile/communication/contact/{method}
- Remove contact method

### PATCH /api/profile/communication/booking
- Update booking settings
- Body: `{ status?, leadTime?, ... }`

### PATCH /api/profile/communication/auto-reply
- Update auto-reply settings
- Body: `{ enabled?, trigger?, message?, ... }`

---

## Database Schema

```typescript
// In brand document
brands/{brandId}
{
  // ... existing fields
  communicationSettings: {
    contactMethods: [
      {
        method: 'email',
        enabled: true,
        value: 'contact@brand.com',
        isPrimary: true,
        displayOnProfile: true,
      },
      // ... more methods
    ],
    booking: {
      status: 'accepting',
      pausedUntil: null,
      pauseReason: null,
      leadTime: 24,
      maxAdvanceBooking: 60,
      requireDeposit: false,
      depositAmount: null,
      depositType: null,
      instantBooking: true,
      cancellationPolicy: 'moderate',
      customCancellationPolicy: null,
    },
    autoReply: {
      enabled: false,
      trigger: 'disabled',
      message: '...',
      includeAvailability: true,
      includeBookingLink: true,
      excludeExistingClients: true,
    },
    updatedAt: Timestamp,
  }
}
```

---

## UI Design

### Contact Preferences

```
┌─────────────────────────────────────────────────────────────┐
│ Contact Methods                                             │
│ How customers can reach you                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💬 Platform Messages                 ⭐ Primary         │ │
│ │    Enabled • Shown on profile                          │ │
│ │                                     [Edit] [Remove]    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ✉️ Email                                                │ │
│ │    contact@mybeauty.com                                │ │
│ │    Enabled • Shown on profile                          │ │
│ │                              [Set Primary] [Edit] [×]  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 📱 Phone                                                │ │
│ │    +1 (555) 123-4567                                   │ │
│ │    Enabled • Hidden from profile                       │ │
│ │                              [Set Primary] [Edit] [×]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                    [+ Add Contact Method]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Booking Settings

```
┌─────────────────────────────────────────────────────────────┐
│ Booking Settings                                            │
│ Configure how customers book with you                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Booking Status                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ● ✓ Accepting Bookings                                 │ │
│ │   Customers can book appointments                      │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ ⏸ Paused                                             │ │
│ │   Temporarily not accepting new bookings               │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ ? By Request Only                                    │ │
│ │   Customers must request and you approve               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Booking Window                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Minimum lead time:     [24 hours ▼]                    │ │
│ │ How far in advance customers must book                 │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Maximum advance booking: [60 days ▼]                   │ │
│ │ How far ahead customers can book                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Cancellation Policy                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ○ Flexible - Free cancellation up to 24h before        │ │
│ │ ● Moderate - Free cancellation up to 48h before        │ │
│ │ ○ Strict - Free cancellation up to 7 days before       │ │
│ │ ○ Custom - Set your own policy                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Reply

```
┌─────────────────────────────────────────────────────────────┐
│ Auto-Reply                                                  │
│ Automatic responses to new messages                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Enable auto-reply                            [✓]           │
│                                                             │
│ When to send auto-replies:                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Outside Business Hours                              ▼  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Message:                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Thanks for reaching out! I've received your message    │ │
│ │ and will get back to you as soon as possible.          │ │
│ │                                                         │ │
│ │ In the meantime, feel free to check my availability    │ │
│ │ and book an appointment through my profile.            │ │
│ │                                                         │ │
│ │ Best,                                                   │ │
│ │ {{brand_name}}                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Available variables: {{brand_name}}, {{next_available}}     │
│                                                             │
│ Options:                                                    │
│ ☑️ Include next available time                              │
│ ☑️ Include booking link                                     │
│ ☑️ Don't send to existing clients                           │
│                                                             │
│                    [Preview Message]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Platform Messages**:
   - Always enabled as a contact method
   - Cannot be removed, only toggled
   - Integrates with future messaging system

2. **Booking Pause**:
   - Can set end date or indefinite
   - Show banner on profile when paused
   - Auto-resume when pause date passes

3. **Auto-Reply System**:
   - Requires messaging system integration
   - Template variable replacement
   - Rate limiting to prevent spam
   - Track if customer already received auto-reply

4. **Contact Validation**:
   - Validate email format
   - Validate phone numbers (consider libphonenumber)
   - Validate Instagram handles

5. **Business Hours Integration**:
   - "Outside hours" trigger needs business hours set
   - Link to business hours settings if not configured

---

## Testing Checklist

- [ ] Add/remove contact methods
- [ ] Set primary contact method
- [ ] Toggle profile visibility
- [ ] Pause bookings with/without date
- [ ] Resume bookings manually
- [ ] Auto-resume when date passes
- [ ] Lead time validation
- [ ] Cancellation policy selection
- [ ] Auto-reply enable/disable
- [ ] Auto-reply message preview
- [ ] Template variables replaced correctly

---

## Dependencies

- `libphonenumber-js` - Phone number validation (optional)
- Date picker component - For pause date
- Rich text editor - For auto-reply message (optional)
- Lucide icons - Mail, Phone, MessageCircle, etc.

---

## Priority

**Medium** - Important for professionals but can launch without initially
