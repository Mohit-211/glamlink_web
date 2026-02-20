export interface NotificationPreferences {
  // Marketing & Updates
  emailMarketing: boolean;           // Marketing emails, newsletters
  emailProductUpdates: boolean;      // New features, platform updates

  // Business Activity
  emailOrders: boolean;              // Order confirmations, booking updates
  emailReviews: boolean;             // New reviews on your brand/products
  emailMessages: boolean;            // Direct messages from customers

  // Promotions & Opportunities
  emailPromotions: boolean;          // Promotional opportunities
  emailFeatured: boolean;            // Featured/spotlight opportunities

  // System
  emailSecurity: boolean;            // Security alerts (always on, required)
  emailAccountUpdates: boolean;      // Account-related notifications
}

export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  notifications: NotificationItem[];
}

export interface NotificationItem {
  id: keyof NotificationPreferences;
  label: string;
  description: string;
  required?: boolean;                // Cannot be disabled (e.g., security)
}

export interface UseNotificationsReturn {
  preferences: NotificationPreferences;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updatePreference: (key: keyof NotificationPreferences, value: boolean) => Promise<void>;
  updateAllInCategory: (keys: (keyof NotificationPreferences)[], value: boolean) => Promise<void>;
}
