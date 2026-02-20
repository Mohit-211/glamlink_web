# Brand Settings Feature Plan

## Overview

Allow beauty professionals to configure brand-specific settings including custom URL slug, business hours, location settings, and service areas.

---

## Directory Structure

```
lib/features/profile-settings/brand/
├── types.ts
├── config.ts
├── components/
│   ├── BrandSettingsSection.tsx     # Main section for settings page
│   ├── BrandUrlSlug.tsx             # Custom URL configuration
│   ├── BusinessHours.tsx            # Operating hours editor
│   └── LocationSettings.tsx         # Service area and address
├── hooks/
│   └── useBrandSettings.ts          # Fetch/update brand settings
└── index.ts
```

---

## Types

```typescript
// types.ts

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  open: string;                       // HH:MM format (24h)
  close: string;                      // HH:MM format (24h)
}

export interface DayHours {
  isOpen: boolean;
  slots: TimeSlot[];                  // Support multiple slots (e.g., closed for lunch)
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
  timezone: string;                   // IANA timezone
  specialHours: SpecialHours[];       // Holidays, special events
}

export interface SpecialHours {
  id: string;
  date: string;                       // YYYY-MM-DD
  name: string;                       // "Christmas", "Labor Day"
  isOpen: boolean;
  slots?: TimeSlot[];                 // Custom hours if open
}

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type ServiceAreaType = 'location' | 'mobile' | 'both';

export interface ServiceArea {
  type: ServiceAreaType;
  // For location-based
  address?: Address;
  showFullAddress: boolean;           // Show full or city only
  // For mobile services
  serviceRadius?: number;             // Miles/km from base
  serviceZipCodes?: string[];         // Specific zip codes served
  travelFee?: {
    enabled: boolean;
    amount: number;
    unit: 'flat' | 'per_mile';
    freeWithin?: number;              // Free travel within X miles
  };
}

export interface BrandUrlSettings {
  slug: string;                       // my-beauty-brand
  previousSlugs: string[];            // For redirects
  customDomain?: string;              // Future: mybeauty.com
  slugChangedAt?: string;             // Track changes
}

export interface BrandSettings {
  url: BrandUrlSettings;
  hours: BusinessHours;
  location: ServiceArea;
}

export interface UseBrandSettingsReturn {
  settings: BrandSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // URL Settings
  checkSlugAvailability: (slug: string) => Promise<boolean>;
  updateSlug: (slug: string) => Promise<void>;

  // Hours Settings
  updateDayHours: (day: DayOfWeek, hours: DayHours) => Promise<void>;
  updateAllHours: (hours: BusinessHours) => Promise<void>;
  addSpecialHours: (special: Omit<SpecialHours, 'id'>) => Promise<void>;
  removeSpecialHours: (id: string) => Promise<void>;
  copyHoursToAllDays: (day: DayOfWeek) => Promise<void>;

  // Location Settings
  updateLocation: (location: Partial<ServiceArea>) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
}
```

---

## Configuration

```typescript
// config.ts

export const DAYS_OF_WEEK: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour < 12 ? 'AM' : 'PM';
  const display = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  return { value: time, label: display };
});

export const SERVICE_AREA_TYPES: {
  value: ServiceAreaType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'location',
    label: 'At My Location',
    description: 'Customers come to your salon/studio',
    icon: 'MapPin',
  },
  {
    value: 'mobile',
    label: 'Mobile Services',
    description: 'You travel to customers',
    icon: 'Car',
  },
  {
    value: 'both',
    label: 'Both',
    description: 'Offer services at your location and mobile',
    icon: 'Compass',
  },
];

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { isOpen: true, slots: [{ open: '09:00', close: '17:00' }] },
  tuesday: { isOpen: true, slots: [{ open: '09:00', close: '17:00' }] },
  wednesday: { isOpen: true, slots: [{ open: '09:00', close: '17:00' }] },
  thursday: { isOpen: true, slots: [{ open: '09:00', close: '17:00' }] },
  friday: { isOpen: true, slots: [{ open: '09:00', close: '17:00' }] },
  saturday: { isOpen: true, slots: [{ open: '10:00', close: '16:00' }] },
  sunday: { isOpen: false, slots: [] },
  timezone: 'America/New_York',
  specialHours: [],
};

export const SLUG_RULES = {
  minLength: 3,
  maxLength: 50,
  pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,  // lowercase alphanumeric with hyphens
  reserved: ['admin', 'api', 'www', 'app', 'help', 'support', 'brand', 'brands', 'profile', 'settings'],
};

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  // ... all states
  { value: 'WY', label: 'Wyoming' },
];
```

---

## Components

### BrandSettingsSection.tsx

Main section overview:
- Current URL preview with copy button
- Hours summary (Open now / Closed)
- Location summary
- Quick links to detailed settings

### BrandUrlSlug.tsx

Custom URL configuration:
- Current URL display with copy button
- Slug editor with real-time availability check
- Validation feedback
- Warning about SEO impact when changing
- Preview of full URL

### BusinessHours.tsx

Operating hours editor:
- Week view with toggle for each day
- Time slot pickers (open/close)
- Support for multiple slots per day (lunch break)
- "Copy to all days" functionality
- Timezone selector
- Special hours section (holidays)
- "Open now" indicator based on current time

### LocationSettings.tsx

Service area configuration:
- Service type selector (location/mobile/both)
- Address form with autocomplete
- Show/hide full address toggle
- Service radius for mobile
- Travel fee configuration
- Map preview (optional)

---

## Hook

```typescript
// hooks/useBrandSettings.ts

export function useBrandSettings(): UseBrandSettingsReturn {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [user?.uid]);

  const fetchSettings = async () => {
    // GET /api/profile/brand-settings
  };

  // URL Methods
  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    // GET /api/profile/brand-settings/slug/check?slug={slug}
    // Debounced for real-time checking
  };

  const updateSlug = async (slug: string) => {
    // PATCH /api/profile/brand-settings/slug
    // Store previous slug for redirects
  };

  // Hours Methods
  const updateDayHours = async (day: DayOfWeek, hours: DayHours) => {
    // PATCH /api/profile/brand-settings/hours
  };

  const updateAllHours = async (hours: BusinessHours) => {
    // PUT /api/profile/brand-settings/hours
  };

  const addSpecialHours = async (special: Omit<SpecialHours, 'id'>) => {
    // POST /api/profile/brand-settings/hours/special
  };

  const removeSpecialHours = async (id: string) => {
    // DELETE /api/profile/brand-settings/hours/special/{id}
  };

  const copyHoursToAllDays = async (sourceDay: DayOfWeek) => {
    // Copy source day's hours to all other days
  };

  // Location Methods
  const updateLocation = async (location: Partial<ServiceArea>) => {
    // PATCH /api/profile/brand-settings/location
  };

  const updateAddress = async (address: Address) => {
    // PATCH /api/profile/brand-settings/location/address
    // Optional: Geocode address for coordinates
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    checkSlugAvailability,
    updateSlug,
    updateDayHours,
    updateAllHours,
    addSpecialHours,
    removeSpecialHours,
    copyHoursToAllDays,
    updateLocation,
    updateAddress,
  };
}
```

---

## API Endpoints

### GET /api/profile/brand-settings
- Returns all brand settings

### GET /api/profile/brand-settings/slug/check
- Check if slug is available
- Query: `?slug={slug}`
- Returns: `{ available: boolean, suggestion?: string }`

### PATCH /api/profile/brand-settings/slug
- Update brand URL slug
- Body: `{ slug: string }`
- Validates uniqueness
- Stores previous slug for redirects

### PATCH /api/profile/brand-settings/hours
- Update business hours
- Body: `{ day?: DayOfWeek, hours?: DayHours, allHours?: BusinessHours }`

### POST /api/profile/brand-settings/hours/special
- Add special hours entry
- Body: `{ date, name, isOpen, slots? }`

### DELETE /api/profile/brand-settings/hours/special/{id}
- Remove special hours entry

### PATCH /api/profile/brand-settings/location
- Update location settings
- Body: `{ type?, address?, showFullAddress?, serviceRadius?, ... }`

---

## Database Schema

```typescript
// In brand document
brands/{brandId}
{
  // ... existing fields
  slug: 'my-beauty-brand',           // For URL routing
  brandSettings: {
    url: {
      slug: 'my-beauty-brand',
      previousSlugs: ['old-name'],   // For redirects
      customDomain: null,
      slugChangedAt: Timestamp,
    },
    hours: {
      monday: { isOpen: true, slots: [{ open: '09:00', close: '17:00' }] },
      tuesday: { isOpen: true, slots: [{ open: '09:00', close: '17:00' }] },
      // ... other days
      timezone: 'America/New_York',
      specialHours: [
        { id: 'xxx', date: '2025-12-25', name: 'Christmas', isOpen: false },
      ],
    },
    location: {
      type: 'both',
      address: {
        street: '123 Beauty Lane',
        unit: 'Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'US',
        coordinates: { lat: 37.7749, lng: -122.4194 },
      },
      showFullAddress: true,
      serviceRadius: 25,
      serviceZipCodes: [],
      travelFee: {
        enabled: true,
        amount: 25,
        unit: 'flat',
        freeWithin: 10,
      },
    },
    updatedAt: Timestamp,
  }
}

// Slug index for quick lookups
brandSlugs/{slug}
{
  brandId: 'brand_xxx',
  createdAt: Timestamp,
}
```

---

## UI Design

### Brand URL Section

```
┌─────────────────────────────────────────────────────────────┐
│ Brand URL                                                   │
│ Customize your brand's web address                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Your brand URL:                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ glamlink.com/brand/ my-beauty-brand              [📋]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Change URL slug:                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ glamlink.com/brand/ │ my-beauty-brand │            ✓   │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ✓ This URL is available                                     │
│                                                             │
│ ⚠️ Changing your URL may affect search engine rankings.     │
│    Your old URL will redirect for 90 days.                  │
│                                                             │
│                              [Cancel] [Save Changes]        │
└─────────────────────────────────────────────────────────────┘
```

### Business Hours Section

```
┌─────────────────────────────────────────────────────────────┐
│ Business Hours                                              │
│ Set your operating hours                      [Copy to All] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Timezone: Eastern Time (UTC-05:00)           [Change]       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [✓] Monday      9:00 AM  -  5:00 PM    [+ Add Break]   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [✓] Tuesday     9:00 AM  -  5:00 PM    [+ Add Break]   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [✓] Wednesday   9:00 AM  -  5:00 PM    [+ Add Break]   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [✓] Thursday    9:00 AM  -  5:00 PM    [+ Add Break]   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [✓] Friday      9:00 AM  -  5:00 PM    [+ Add Break]   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [✓] Saturday    10:00 AM -  4:00 PM    [+ Add Break]   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [ ] Sunday      Closed                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Special Hours                           [+ Add Special Day] │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Dec 25, 2025 - Christmas              Closed      [×]  │ │
│ │ Dec 31, 2025 - New Year's Eve         10AM-2PM    [×]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Location Section

```
┌─────────────────────────────────────────────────────────────┐
│ Service Location                                            │
│ Where you provide services                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Service Type:                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ○ 📍 At My Location                                    │ │
│ │   Customers come to your salon/studio                  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ○ 🚗 Mobile Services                                   │ │
│ │   You travel to customers                              │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ● 🧭 Both                                              │ │
│ │   Offer services at your location and mobile           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Your Address:                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Street: 123 Beauty Lane                                │ │
│ │ Unit:   Suite 100                                      │ │
│ │ City:   San Francisco                                  │ │
│ │ State:  California              Zip: 94102             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ☑️ Show full address on profile                             │
│ ☐ Show city only                                            │
│                                                             │
│ Mobile Service Area:                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Service radius: [25 miles ▼] from your location        │ │
│ │                                                         │ │
│ │ Travel fee:                                            │ │
│ │ ☑️ Charge travel fee                                    │ │
│ │    [$25] [flat ▼] fee                                  │ │
│ │    Free within [10 miles]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Slug Uniqueness**:
   - Create separate collection for slug lookups
   - Check availability before update
   - Store previous slugs for redirects
   - Implement 301 redirects for old URLs

2. **Business Hours Display**:
   - Show "Open now" / "Closed" based on current time
   - Respect timezone settings
   - Check special hours first, then regular hours

3. **Address Geocoding**:
   - Optional: Use Google Places API for autocomplete
   - Store coordinates for map display
   - Validate address format

4. **Multiple Time Slots**:
   - Support lunch breaks (9-12, 1-5)
   - Validate slots don't overlap
   - Ensure close time after open time

5. **URL Redirects**:
   - Implement middleware for slug redirects
   - Keep redirects active for 90 days
   - Track redirect usage for analytics

---

## Testing Checklist

- [ ] Slug availability check works
- [ ] Slug validation (format, reserved words)
- [ ] URL change saves previous slug
- [ ] Old URLs redirect to new
- [ ] Business hours toggle days
- [ ] Multiple time slots per day
- [ ] Special hours override regular
- [ ] "Open now" indicator accurate
- [ ] Address form validation
- [ ] Service radius configuration
- [ ] Travel fee settings save

---

## Dependencies

- Google Places API - Address autocomplete (optional)
- date-fns-tz - Timezone handling
- Lucide icons - MapPin, Clock, Car, etc.

---

## Priority

**Medium-High** - Core functionality for professional brands
