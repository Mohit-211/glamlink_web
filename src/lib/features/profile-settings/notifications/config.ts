import type { NotificationCategory, NotificationPreferences } from './types';

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
  emailSecurity: true,      // Always true, required
  emailAccountUpdates: true,
};
