/**
 * Preferences Configuration
 * Constants and default values for user preferences
 */

import type {
  ThemeMode,
  LanguageCode,
  CurrencyCode,
  DateFormatType,
  TimeFormatType,
  UserPreferences,
  Language,
  Currency,
  TimezoneGroup
} from './types';

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

export const THEME_OPTIONS = [
  { value: 'light' as ThemeMode, label: 'Light', icon: 'Sun' },
  { value: 'dark' as ThemeMode, label: 'Dark', icon: 'Moon' },
  { value: 'system' as ThemeMode, label: 'System', icon: 'Monitor' },
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

export const DATE_FORMAT_OPTIONS: Array<{ value: DateFormatType; label: string; example: string }> = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '01/14/2026' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '14/01/2026' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2026-01-14' },
];

export const TIME_FORMAT_OPTIONS: Array<{ value: TimeFormatType; label: string; example: string }> = [
  { value: '12h', label: '12-hour', example: '2:30 PM' },
  { value: '24h', label: '24-hour', example: '14:30' },
];
