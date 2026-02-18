/**
 * Marketing Infrastructure Constants
 *
 * Configuration constants, default values, and options for the marketing system.
 */

import type {
  MarketingChannel,
  ChannelType,
  CampaignStatus,
  AutomationTriggerType,
} from './types';

// ============================================
// ATTRIBUTION MODELS
// ============================================

export const ATTRIBUTION_MODELS = [
  {
    id: 'last_non_direct_click',
    name: 'Last non-direct click',
    description: 'Direct is ignored, 100% credit given to the last channel clicked',
    isDefault: true,
  },
  {
    id: 'last_click',
    name: 'Last click',
    description: '100% credit to the last channel before conversion',
    isDefault: false,
  },
  {
    id: 'first_click',
    name: 'First click',
    description: '100% credit to the first channel that brought the customer',
    isDefault: false,
  },
  {
    id: 'any_click',
    name: 'Any click',
    description: '100% credit to each channel (total can exceed 100%)',
    isDefault: false,
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Equal credit distributed across all channels',
    isDefault: false,
  },
] as const;

export const ATTRIBUTION_WINDOW_DAYS = 30;

// ============================================
// DEFAULT MARKETING CHANNELS
// ============================================

export const DEFAULT_CHANNELS: MarketingChannel[] = [
  {
    id: 'direct',
    name: 'Direct',
    type: 'direct',
    icon: '🔗',
    isActive: true,
  },
  {
    id: 'organic_search',
    name: 'Organic Search',
    type: 'organic',
    icon: '🔍',
    isActive: true,
  },
  {
    id: 'paid_search',
    name: 'Paid Search',
    type: 'paid',
    icon: '💰',
    isActive: true,
  },
  {
    id: 'social_organic',
    name: 'Social Media (Organic)',
    type: 'social',
    icon: '📱',
    isActive: true,
  },
  {
    id: 'social_paid',
    name: 'Social Media (Paid)',
    type: 'paid',
    icon: '📱',
    isActive: true,
  },
  {
    id: 'email',
    name: 'Email Marketing',
    type: 'email',
    icon: '📧',
    isActive: true,
  },
  {
    id: 'referral',
    name: 'Referral',
    type: 'referral',
    icon: '🤝',
    isActive: true,
  },
  {
    id: 'unknown',
    name: 'Unknown',
    type: 'unknown',
    icon: '❓',
    isActive: true,
  },
];

// ============================================
// CAMPAIGN STATUSES
// ============================================

export const CAMPAIGN_STATUSES: Record<
  CampaignStatus,
  { label: string; color: string; description?: string }
> = {
  draft: {
    label: 'Draft',
    color: 'gray',
    description: 'Campaign is being created',
  },
  scheduled: {
    label: 'Scheduled',
    color: 'blue',
    description: 'Scheduled to send at a specific time',
  },
  sending: {
    label: 'Sending',
    color: 'yellow',
    description: 'Currently being sent',
  },
  sent: {
    label: 'Sent',
    color: 'green',
    description: 'Successfully sent',
  },
  active: {
    label: 'Active',
    color: 'green',
    description: 'Currently running',
  },
  paused: {
    label: 'Paused',
    color: 'orange',
    description: 'Temporarily paused',
  },
  inactive: {
    label: 'Inactive',
    color: 'gray',
    description: 'Not currently running',
  },
} as const;

// ============================================
// AUTOMATION TRIGGER TYPES
// ============================================

export const AUTOMATION_TRIGGERS: Record<
  AutomationTriggerType,
  { label: string; description: string; icon: string; category: string }
> = {
  abandoned_checkout: {
    label: 'Abandoned Checkout',
    description: 'Customer started checkout but did not complete',
    icon: '🛒',
    category: 'Cart Recovery',
  },
  abandoned_cart: {
    label: 'Abandoned Cart',
    description: 'Customer added items but did not checkout',
    icon: '🛍️',
    category: 'Cart Recovery',
  },
  abandoned_browse: {
    label: 'Abandoned Browse',
    description: 'Customer viewed products but did not add to cart',
    icon: '👀',
    category: 'Cart Recovery',
  },
  new_subscriber: {
    label: 'New Subscriber',
    description: 'Someone subscribed to your mailing list',
    icon: '✉️',
    category: 'Welcome',
  },
  post_purchase: {
    label: 'Post Purchase',
    description: 'Customer completed a purchase',
    icon: '🎉',
    category: 'Follow Up',
  },
  customer_birthday: {
    label: 'Customer Birthday',
    description: "It's the customer's birthday",
    icon: '🎂',
    category: 'Engagement',
  },
  customer_winback: {
    label: 'Win-Back',
    description: 'Customer has not purchased in a while',
    icon: '🔄',
    category: 'Re-engagement',
  },
  vip_status: {
    label: 'VIP Status',
    description: 'Customer reached VIP tier',
    icon: '⭐',
    category: 'Loyalty',
  },
  product_back_in_stock: {
    label: 'Back in Stock',
    description: 'Previously out-of-stock product is available',
    icon: '📦',
    category: 'Inventory',
  },
  custom: {
    label: 'Custom Trigger',
    description: 'Custom event or condition',
    icon: '⚙️',
    category: 'Advanced',
  },
} as const;

// ============================================
// DATE RANGE PRESETS
// ============================================

export const DATE_RANGE_PRESETS = [
  {
    id: 'today',
    label: 'Today',
    description: 'Current day',
  },
  {
    id: 'yesterday',
    label: 'Yesterday',
    description: 'Previous day',
  },
  {
    id: 'last_7_days',
    label: 'Last 7 days',
    description: 'Past week',
  },
  {
    id: 'last_30_days',
    label: 'Last 30 days',
    description: 'Past month',
  },
  {
    id: 'last_90_days',
    label: 'Last 90 days',
    description: 'Past quarter',
  },
  {
    id: 'this_month',
    label: 'This month',
    description: 'Current month',
  },
  {
    id: 'last_month',
    label: 'Last month',
    description: 'Previous month',
  },
  {
    id: 'this_year',
    label: 'This year',
    description: 'Year to date',
  },
  {
    id: 'last_year',
    label: 'Last year',
    description: 'Previous year',
  },
  {
    id: 'custom',
    label: 'Custom range',
    description: 'Select specific dates',
  },
] as const;

// ============================================
// CAMPAIGN EMAIL TEMPLATES
// ============================================

export const DEFAULT_EMAIL_COLORS = {
  background: '#f5f5f5',
  contentBackground: '#ffffff',
  border: '#e0e0e0',
  text: '#333333',
  link: '#007bff',
} as const;

// ============================================
// METRIC DISPLAY CONFIGURATIONS
// ============================================

export const METRIC_FORMATS = {
  currency: {
    prefix: '$',
    decimals: 2,
    suffix: '',
  },
  percentage: {
    prefix: '',
    decimals: 1,
    suffix: '%',
  },
  number: {
    prefix: '',
    decimals: 0,
    suffix: '',
  },
  rate: {
    prefix: '',
    decimals: 2,
    suffix: '',
  },
} as const;

// ============================================
// CHANNEL TYPE CONFIGURATION
// ============================================

export const CHANNEL_TYPE_CONFIG: Record<
  ChannelType,
  { label: string; color: string; icon: string }
> = {
  direct: {
    label: 'Direct',
    color: 'blue',
    icon: '🔗',
  },
  organic: {
    label: 'Organic',
    color: 'green',
    icon: '🌱',
  },
  paid: {
    label: 'Paid',
    color: 'purple',
    icon: '💰',
  },
  referral: {
    label: 'Referral',
    color: 'orange',
    icon: '🤝',
  },
  social: {
    label: 'Social',
    color: 'pink',
    icon: '📱',
  },
  email: {
    label: 'Email',
    color: 'teal',
    icon: '📧',
  },
  unknown: {
    label: 'Unknown',
    color: 'gray',
    icon: '❓',
  },
} as const;

// ============================================
// CONVERSION TYPES
// ============================================

export const CONVERSION_TYPES = [
  {
    id: 'purchase',
    label: 'Purchase',
    description: 'Customer completed a purchase',
    icon: '💳',
  },
  {
    id: 'signup',
    label: 'Sign Up',
    description: 'Customer created an account',
    icon: '✍️',
  },
  {
    id: 'booking',
    label: 'Booking',
    description: 'Customer booked an appointment',
    icon: '📅',
  },
  {
    id: 'inquiry',
    label: 'Inquiry',
    description: 'Customer submitted an inquiry',
    icon: '💬',
  },
] as const;

// ============================================
// SUBSCRIBER SOURCES
// ============================================

export const SUBSCRIBER_SOURCES = [
  {
    id: 'checkout',
    label: 'Checkout',
    description: 'Subscribed during checkout',
  },
  {
    id: 'form',
    label: 'Signup Form',
    description: 'Subscribed via website form',
  },
  {
    id: 'import',
    label: 'Import',
    description: 'Imported from file',
  },
  {
    id: 'manual',
    label: 'Manual',
    description: 'Manually added',
  },
] as const;

// ============================================
// EMAIL SECTION TYPES
// ============================================

export const EMAIL_SECTION_TYPES = [
  {
    type: 'header',
    label: 'Header',
    description: 'Logo and branding',
    icon: '🎨',
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Rich text content',
    icon: '📝',
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Single image block',
    icon: '🖼️',
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action button',
    icon: '🔘',
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Horizontal separator',
    icon: '➖',
  },
  {
    type: 'product',
    label: 'Product',
    description: 'Product showcase',
    icon: '📦',
  },
  {
    type: 'footer',
    label: 'Footer',
    description: 'Unsubscribe and legal',
    icon: '📄',
  },
] as const;

// ============================================
// EXPORT ALL CONSTANTS
// ============================================

export const MARKETING_CONSTANTS = {
  ATTRIBUTION_MODELS,
  ATTRIBUTION_WINDOW_DAYS,
  DEFAULT_CHANNELS,
  CAMPAIGN_STATUSES,
  AUTOMATION_TRIGGERS,
  DATE_RANGE_PRESETS,
  DEFAULT_EMAIL_COLORS,
  METRIC_FORMATS,
  CHANNEL_TYPE_CONFIG,
  CONVERSION_TYPES,
  SUBSCRIBER_SOURCES,
  EMAIL_SECTION_TYPES,
} as const;
