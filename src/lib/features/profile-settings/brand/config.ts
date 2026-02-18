import type { DayOption, TimeOption, ServiceAreaOption, BusinessHours, BrandSettings } from './types';

// Days of week configuration
export const DAYS_OF_WEEK: DayOption[] = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
];

// Time options in 30-minute intervals
export const TIME_OPTIONS: TimeOption[] = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour < 12 ? 'AM' : 'PM';
  const display = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  return { value: time, label: display };
});

// Service area type options
export const SERVICE_AREA_TYPES: ServiceAreaOption[] = [
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

// Default business hours (9 AM - 5 PM weekdays, 10 AM - 4 PM Saturday, closed Sunday)
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

// Slug validation rules
export const SLUG_RULES = {
  minLength: 3,
  maxLength: 50,
  pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,  // lowercase alphanumeric with hyphens
  reserved: [
    'admin', 'api', 'www', 'app', 'help', 'support',
    'brand', 'brands', 'profile', 'settings', 'magazine',
    'for-professionals', 'about', 'contact', 'terms', 'privacy'
  ],
};

// US States for address form
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

// Helper to validate slug format
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug) {
    return { valid: false, error: 'Slug is required' };
  }

  if (slug.length < SLUG_RULES.minLength) {
    return { valid: false, error: `Slug must be at least ${SLUG_RULES.minLength} characters` };
  }

  if (slug.length > SLUG_RULES.maxLength) {
    return { valid: false, error: `Slug must be less than ${SLUG_RULES.maxLength} characters` };
  }

  if (!SLUG_RULES.pattern.test(slug)) {
    return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
  }

  if (SLUG_RULES.reserved.includes(slug.toLowerCase())) {
    return { valid: false, error: 'This slug is reserved and cannot be used' };
  }

  return { valid: true };
}

// Helper to format time for display
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
