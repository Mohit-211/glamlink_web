/**
 * CTA Alert Configuration Types
 *
 * Used for managing the site-wide CTA alert banner that appears
 * at the top of pages. Admins can configure this from the
 * Content Settings > CTA Alerts tab.
 */

/**
 * Saved Modal Template - reusable modal content
 * Stored in Firestore collection: cta-alerts
 */
export interface SavedModalTemplate {
  id: string;
  name: string;             // Display name for dropdown
  modalTitle: string;       // The modal title
  modalHtmlContent: string; // The HTML content
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Source type for the CTA alert
 * - 'standalone': Independent CTA with its own configuration
 * - 'promo': Linked to an existing promo from the Promos collection
 */
export type CTAAlertSourceType = 'standalone' | 'promo';

/**
 * Modal type for the CTA popup
 * - 'standard': Uses HTML content from TiptapEditor
 * - 'custom': Uses a registered custom modal component
 */
export type CTAAlertModalType = 'standard' | 'custom';

/**
 * Main CTA Alert Configuration interface
 * Stored in Firestore at: settings/ctaAlert
 */
export interface CTAAlertConfig {
  // Unique identifier
  id: string;

  // Master on/off switch
  isActive: boolean;

  // Source Configuration
  sourceType: CTAAlertSourceType;
  linkedPromoId?: string; // Required if sourceType is 'promo'

  // Alert Bar Appearance
  message: string;
  buttonText: string;
  backgroundColor: string; // Tailwind class (e.g., 'bg-glamlink-teal') or hex color
  textColor: string; // Tailwind class (e.g., 'text-white') or hex color
  buttonBackgroundColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;

  // Scheduling - dates in YYYY-MM-DD format
  startDate: string;
  endDate: string;

  // Dismissal Settings
  localStorageKey: string; // Key for storing dismissal time
  dismissAfterHours: number; // Hours before alert reappears after dismissal

  // Modal Configuration
  modalType: CTAAlertModalType;
  customModalId?: string; // Required if modalType is 'custom'
  modalTitle?: string; // Title for standard modal
  modalHtmlContent?: string; // HTML content for standard modal (from TiptapEditor)
  showGotItButton?: boolean; // Whether to show "Got it" dismiss button in modal

  // Metadata
  createdAt?: string;
  updatedAt?: string;
  lastUpdatedBy?: string;
}

/**
 * Public CTA Alert response - stripped down for public API
 * Only includes fields needed for rendering the alert
 */
export interface PublicCTAAlert {
  id: string;
  message: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  localStorageKey: string;
  dismissAfterHours: number;
  modalType: CTAAlertModalType;
  customModalId?: string;
  modalTitle?: string;
  modalHtmlContent?: string;
  showGotItButton?: boolean;
}

/**
 * Default values for creating a new CTA Alert config
 */
export const getDefaultCTAAlertConfig = (): Partial<CTAAlertConfig> => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    id: 'cta-alert-config',
    isActive: false,
    sourceType: 'standalone',
    message: 'Check out our latest offer!',
    buttonText: 'Learn More',
    backgroundColor: 'bg-glamlink-teal',
    textColor: 'text-white',
    buttonBackgroundColor: 'bg-black',
    buttonTextColor: 'text-white',
    buttonHoverColor: 'hover:bg-gray-800',
    startDate: now.toISOString().split('T')[0],
    endDate: thirtyDaysFromNow.toISOString().split('T')[0],
    localStorageKey: 'cta_alert_dismissed_time',
    dismissAfterHours: 24,
    modalType: 'standard',
    modalTitle: '',
    modalHtmlContent: '',
    showGotItButton: true,
  };
};

/**
 * Validation result for CTA Alert config
 */
export interface CTAAlertValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate CTA Alert configuration
 */
export const validateCTAAlertConfig = (config: Partial<CTAAlertConfig>): CTAAlertValidationResult => {
  const errors: string[] = [];

  // Required fields for all configs
  if (!config.message || config.message.trim() === '') {
    errors.push('Message is required');
  }

  if (!config.buttonText || config.buttonText.trim() === '') {
    errors.push('Button text is required');
  }

  if (!config.startDate) {
    errors.push('Start date is required');
  }

  if (!config.endDate) {
    errors.push('End date is required');
  }

  // Date validation
  if (config.startDate && config.endDate) {
    const startDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);

    if (startDate > endDate) {
      errors.push('End date must be after start date');
    }
  }

  // Source type validation
  if (config.sourceType === 'promo' && !config.linkedPromoId) {
    errors.push('Linked promo is required when source type is "promo"');
  }

  // Modal type validation
  if (config.modalType === 'custom' && !config.customModalId) {
    errors.push('Custom modal selection is required when modal type is "custom"');
  }

  // Dismissal hours validation
  if (config.dismissAfterHours !== undefined && config.dismissAfterHours < 0) {
    errors.push('Dismiss after hours must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if CTA Alert is currently active based on dates
 */
export const isCTAAlertWithinDateRange = (config: CTAAlertConfig): boolean => {
  if (!config.isActive) return false;

  const now = new Date();
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);

  // Set end date to end of day
  endDate.setHours(23, 59, 59, 999);

  return now >= startDate && now <= endDate;
};
