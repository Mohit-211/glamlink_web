import type { DataCategory, ExportFormat } from './types';

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

export const DELETION_GRACE_PERIOD_DAYS = 30;
export const TRANSFER_EXPIRATION_DAYS = 7;

// Default pause settings
export const DEFAULT_PAUSE_SETTINGS = {
  isPaused: false,
  showPausedMessage: true,
  preserveBookings: true,
};
