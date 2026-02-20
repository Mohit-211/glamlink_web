/**
 * Preferences Types
 * Type definitions for user preferences system
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ko';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'INR' | 'BRL';
export type DateFormatType = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormatType = '12h' | '24h';
export type MeasurementUnit = 'imperial' | 'metric';

export interface UserPreferences {
  // Appearance
  theme: ThemeMode;
  reducedMotion: boolean;

  // Regional
  language: LanguageCode;
  timezone: string;                  // IANA timezone (e.g., 'America/New_York')
  currency: CurrencyCode;

  // Display
  dateFormat: DateFormatType;
  timeFormat: TimeFormatType;
  measurementUnit: MeasurementUnit;
}

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
}

export interface Timezone {
  value: string;
  label: string;
  offset: string;
}

export interface TimezoneGroup {
  label: string;
  timezones: Timezone[];
}

export interface UsePreferencesReturn {
  // Form state
  preferencesForm: UserPreferences;
  originalForm: UserPreferences;

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: boolean;
  hasChanges: boolean;

  // Handlers
  handleChange: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  handleReset: () => Promise<void>;
}

export interface PreferencesContextValue {
  preferences: UserPreferences;
  isLoading: boolean;
  updateTheme: (theme: ThemeMode) => Promise<void>;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatCurrency: (amount: number) => string;
  refreshPreferences: () => Promise<void>;
}
