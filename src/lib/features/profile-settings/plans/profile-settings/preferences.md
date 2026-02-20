# Preferences Feature Plan

## Overview

Allow users to customize their platform experience with theme selection, language, timezone, and currency preferences.

---

## Directory Structure

```
lib/features/profile-settings/preferences/
├── types.ts
├── config.ts
├── components/
│   ├── PreferencesSection.tsx       # Main section for settings page
│   ├── ThemeSelector.tsx            # Dark/Light/System toggle
│   ├── LanguageSelector.tsx         # Language dropdown
│   ├── TimezoneSelector.tsx         # Timezone picker
│   └── CurrencySelector.tsx         # Currency dropdown
├── hooks/
│   └── usePreferences.ts            # Fetch/update preferences
├── context/
│   └── PreferencesContext.tsx       # Global preferences context
└── index.ts
```

---

## Types

```typescript
// types.ts

export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ko';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'INR' | 'BRL';

export interface UserPreferences {
  // Appearance
  theme: ThemeMode;
  reducedMotion: boolean;            // Reduce animations

  // Regional
  language: LanguageCode;
  timezone: string;                  // IANA timezone (e.g., 'America/New_York')
  currency: CurrencyCode;

  // Display
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  measurementUnit: 'imperial' | 'metric';
}

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;                      // Emoji flag
}

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
}

export interface TimezoneGroup {
  label: string;
  timezones: Timezone[];
}

export interface Timezone {
  value: string;                     // IANA timezone ID
  label: string;                     // Display name
  offset: string;                    // UTC offset (e.g., 'UTC-05:00')
}

export interface UsePreferencesReturn {
  preferences: UserPreferences;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}
```

---

## Configuration

```typescript
// config.ts

export const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'Sun' },
  { value: 'dark', label: 'Dark', icon: 'Moon' },
  { value: 'system', label: 'System', icon: 'Monitor' },
];

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
];

export const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    label: 'Americas',
    timezones: [
      { value: 'America/New_York', label: 'Eastern Time', offset: 'UTC-05:00' },
      { value: 'America/Chicago', label: 'Central Time', offset: 'UTC-06:00' },
      { value: 'America/Denver', label: 'Mountain Time', offset: 'UTC-07:00' },
      { value: 'America/Los_Angeles', label: 'Pacific Time', offset: 'UTC-08:00' },
      { value: 'America/Anchorage', label: 'Alaska Time', offset: 'UTC-09:00' },
      { value: 'Pacific/Honolulu', label: 'Hawaii Time', offset: 'UTC-10:00' },
      { value: 'America/Toronto', label: 'Toronto', offset: 'UTC-05:00' },
      { value: 'America/Vancouver', label: 'Vancouver', offset: 'UTC-08:00' },
      { value: 'America/Sao_Paulo', label: 'São Paulo', offset: 'UTC-03:00' },
      { value: 'America/Mexico_City', label: 'Mexico City', offset: 'UTC-06:00' },
    ],
  },
  {
    label: 'Europe',
    timezones: [
      { value: 'Europe/London', label: 'London', offset: 'UTC+00:00' },
      { value: 'Europe/Paris', label: 'Paris', offset: 'UTC+01:00' },
      { value: 'Europe/Berlin', label: 'Berlin', offset: 'UTC+01:00' },
      { value: 'Europe/Rome', label: 'Rome', offset: 'UTC+01:00' },
      { value: 'Europe/Madrid', label: 'Madrid', offset: 'UTC+01:00' },
      { value: 'Europe/Amsterdam', label: 'Amsterdam', offset: 'UTC+01:00' },
      { value: 'Europe/Moscow', label: 'Moscow', offset: 'UTC+03:00' },
    ],
  },
  {
    label: 'Asia & Pacific',
    timezones: [
      { value: 'Asia/Tokyo', label: 'Tokyo', offset: 'UTC+09:00' },
      { value: 'Asia/Shanghai', label: 'Shanghai', offset: 'UTC+08:00' },
      { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'UTC+08:00' },
      { value: 'Asia/Singapore', label: 'Singapore', offset: 'UTC+08:00' },
      { value: 'Asia/Seoul', label: 'Seoul', offset: 'UTC+09:00' },
      { value: 'Asia/Dubai', label: 'Dubai', offset: 'UTC+04:00' },
      { value: 'Asia/Kolkata', label: 'Mumbai', offset: 'UTC+05:30' },
      { value: 'Australia/Sydney', label: 'Sydney', offset: 'UTC+11:00' },
      { value: 'Australia/Melbourne', label: 'Melbourne', offset: 'UTC+11:00' },
    ],
  },
];

export const DATE_FORMAT_OPTIONS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '01/13/2025' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '13/01/2025' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2025-01-13' },
];

export const TIME_FORMAT_OPTIONS = [
  { value: '12h', label: '12-hour', example: '2:30 PM' },
  { value: '24h', label: '24-hour', example: '14:30' },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  reducedMotion: false,
  language: 'en',
  timezone: 'America/New_York',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  measurementUnit: 'imperial',
};
```

---

## Components

### PreferencesSection.tsx

Main section component for the settings page:
- Grouped preference controls
- Real-time preview of changes
- "Reset to defaults" option

### ThemeSelector.tsx

Theme selection component:
- Three-option toggle (Light/Dark/System)
- Icon for each option
- Immediate visual feedback

### LanguageSelector.tsx

Language dropdown:
- Flag emoji + native name
- Search/filter capability
- Note about translation coverage

### TimezoneSelector.tsx

Timezone picker:
- Grouped by region
- Show current time in each zone
- Search by city name
- Auto-detect option

### CurrencySelector.tsx

Currency dropdown:
- Flag + currency code + symbol
- Note about display only (not conversion)

---

## Context

```typescript
// context/PreferencesContext.tsx

interface PreferencesContextValue {
  preferences: UserPreferences;
  setTheme: (theme: ThemeMode) => void;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatCurrency: (amount: number) => string;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // Load preferences from localStorage/API
  // Apply theme to document
  // Provide formatting utilities

  return (
    <PreferencesContext.Provider value={...}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within PreferencesProvider');
  }
  return context;
}
```

---

## Hook

```typescript
// hooks/usePreferences.ts

export function usePreferences(): UsePreferencesReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, [user?.uid]);

  const fetchPreferences = async () => {
    // GET /api/profile/preferences
    // Also check localStorage for unauthenticated users
  };

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    // PATCH /api/profile/preferences
    // Also update localStorage
    // Apply immediately (theme, etc.)
  };

  const resetToDefaults = async () => {
    // Reset to DEFAULT_PREFERENCES
  };

  return { preferences, isLoading, isSaving, error, updatePreference, resetToDefaults };
}
```

---

## API Endpoints

### GET /api/profile/preferences
- Returns user's preferences
- Creates default preferences if none exist

### PATCH /api/profile/preferences
- Updates specific preferences
- Body: `{ [key]: value }`

---

## Database Schema

```typescript
// In user profile or settings document
users/{userId}/settings/preferences
{
  theme: 'system',
  reducedMotion: false,
  language: 'en',
  timezone: 'America/New_York',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  measurementUnit: 'imperial',
  updatedAt: Timestamp
}
```

---

## UI Design

```
┌─────────────────────────────────────────────────────────────┐
│ Preferences                                                 │
│ Customize your experience                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Appearance                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Theme                                                   │ │
│ │ ┌─────────┬─────────┬─────────┐                        │ │
│ │ │ ☀️ Light │ 🌙 Dark │ 💻 System│ ← Selected            │ │
│ │ └─────────┴─────────┴─────────┘                        │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Reduced motion                             [ ]         │ │
│ │ Minimize animations throughout the app                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Regional                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Language                                                │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 🇺🇸 English                                    ▼   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Timezone                                                │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Eastern Time (UTC-05:00)                       ▼   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ Current time: 2:30 PM                                   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Currency                                                │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 🇺🇸 USD - US Dollar ($)                        ▼   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ℹ️ Currency is for display only, not conversion         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Display Format                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Date format                                             │ │
│ │ ○ MM/DD/YYYY (01/13/2025)                              │ │
│ │ ● DD/MM/YYYY (13/01/2025)                              │ │
│ │ ○ YYYY-MM-DD (2025-01-13)                              │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Time format                                             │ │
│ │ ● 12-hour (2:30 PM)                                    │ │
│ │ ○ 24-hour (14:30)                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                              [Reset to Defaults]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

1. **Theme Implementation**:
   - Use CSS custom properties for theming
   - Apply `dark` class to document root
   - Respect `prefers-color-scheme` for system mode
   - Store in localStorage for fast initial load

2. **Language/i18n**:
   - Start with English only
   - Prepare structure for future translations
   - Use next-intl or similar for i18n

3. **Timezone Handling**:
   - Store as IANA timezone ID
   - Use `Intl.DateTimeFormat` for formatting
   - Consider `date-fns-tz` for complex operations

4. **Currency Display**:
   - Display only, not conversion
   - Use `Intl.NumberFormat` for formatting
   - Clarify this is display preference only

5. **Persistence**:
   - Authenticated: Store in Firestore
   - Unauthenticated: Store in localStorage
   - Sync localStorage on login

6. **Global Context**:
   - Wrap app in PreferencesProvider
   - Provide formatting utilities
   - Theme applies immediately

---

## Testing Checklist

- [ ] Theme toggle works immediately
- [ ] Dark mode applies correctly
- [ ] System mode follows OS preference
- [ ] Language dropdown shows all options
- [ ] Timezone picker shows current time
- [ ] Currency changes display format
- [ ] Date format changes across app
- [ ] Time format changes across app
- [ ] Settings persist after refresh
- [ ] Reset to defaults works
- [ ] Settings sync on login

---

## Dependencies

- `next-themes` - Theme management (optional)
- `date-fns` / `date-fns-tz` - Date formatting
- `Intl` API - Number/currency formatting
- Lucide icons - Sun, Moon, Monitor, Globe

---

## Priority

**Medium** - Enhances UX, theme is highly requested feature
