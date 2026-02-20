"use client";

// Day of week enumeration
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Service area types
export type ServiceAreaType = 'location' | 'mobile' | 'both';

// Time slot for business hours
export interface TimeSlot {
  open: string;   // HH:MM format (24h) - e.g., "09:00"
  close: string;  // HH:MM format (24h) - e.g., "17:00"
}

// Hours for a single day
export interface DayHours {
  isOpen: boolean;
  slots: TimeSlot[];  // Support multiple slots (e.g., closed for lunch)
}

// Special hours override
export interface SpecialHours {
  id: string;
  date: string;       // YYYY-MM-DD
  name: string;       // "Christmas", "Labor Day"
  isOpen: boolean;
  slots?: TimeSlot[]; // Custom hours if open
}

// Complete business hours
export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
  timezone: string;             // IANA timezone
  specialHours: SpecialHours[]; // Holidays, special events
}

// Address structure
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

// Service area configuration
export interface ServiceArea {
  type: ServiceAreaType;
  // For location-based services
  address?: Address;
  showFullAddress: boolean;     // Show full or city only
  // For mobile services
  serviceRadius?: number;        // Miles from base
  serviceZipCodes?: string[];    // Specific zip codes served
  travelFee?: {
    enabled: boolean;
    amount: number;
    unit: 'flat' | 'per_mile';
    freeWithin?: number;         // Free travel within X miles
  };
}

// URL slug settings
export interface BrandUrlSettings {
  slug: string;                  // my-beauty-brand
  previousSlugs: string[];       // For redirects
  customDomain?: string;         // Future: mybeauty.com
  slugChangedAt?: string;        // Track last change
}

// Main settings interface
export interface BrandSettings {
  url: BrandUrlSettings;
  hours: BusinessHours;
  location: ServiceArea;
}

// UI configuration types
export interface ServiceAreaOption {
  value: ServiceAreaType;
  label: string;
  description: string;
  icon: string;
}

export interface TimeOption {
  value: string;  // HH:MM
  label: string;  // "9:00 AM"
}

export interface DayOption {
  value: DayOfWeek;
  label: string;
  short: string;
}

// Hook return type
export interface UseBrandSettingsReturn {
  settings: BrandSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // URL methods
  checkSlugAvailability: (slug: string) => Promise<{ available: boolean; suggestion?: string }>;
  updateSlug: (slug: string) => Promise<void>;

  // Hours methods
  updateDayHours: (day: DayOfWeek, hours: DayHours) => Promise<void>;
  updateAllHours: (hours: BusinessHours) => Promise<void>;
  addSpecialHours: (special: Omit<SpecialHours, 'id'>) => Promise<void>;
  removeSpecialHours: (id: string) => Promise<void>;

  // Location methods
  updateLocation: (location: Partial<ServiceArea>) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
}
