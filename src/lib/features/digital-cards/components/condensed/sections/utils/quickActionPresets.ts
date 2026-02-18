/**
 * Quick Action Button Presets for Condensed Card
 *
 * Defines preset button configurations for the Quick Actions Line section.
 * Each preset provides a predefined button text that appears on the digital card.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface QuickActionPreset {
  /** Unique identifier for the preset */
  id: string;
  /** Display label shown in the dropdown */
  label: string;
  /** Button text displayed on the card (empty for 'none' preset) */
  buttonText: string;
  /** Description shown in the editor */
  description: string;
}

// =============================================================================
// PRESETS CONFIGURATION
// =============================================================================

/**
 * Available quick action presets
 *
 * - none: Hides the button slot entirely
 * - default: Uses professional's preferred booking method setting
 * - send-text: Opens SMS messaging
 * - instagram-dm: Opens Instagram for direct messaging
 * - booking: Opens the booking link
 * - custom: Allows custom button text and configuration
 */
export const QUICK_ACTION_PRESETS: QuickActionPreset[] = [
  {
    id: 'none',
    label: 'None',
    buttonText: '',
    description: 'Hides this button slot entirely'
  },
  {
    id: 'default',
    label: 'Default (from Booking Method)',
    buttonText: '',
    description: 'Uses the professional\'s preferred booking method setting'
  },
  {
    id: 'send-text',
    label: 'Send Text',
    buttonText: 'SEND TEXT',
    description: 'Opens SMS to send a text message'
  },
  {
    id: 'instagram-dm',
    label: 'Instagram Profile',
    buttonText: 'DM ON INSTAGRAM',
    description: 'Opens Instagram profile for DM'
  },
  {
    id: 'booking',
    label: 'Go to booking link',
    buttonText: 'BOOK NOW',
    description: 'Opens booking link'
  },
  {
    id: 'custom',
    label: 'Custom setup',
    buttonText: '',
    description: 'Custom button with your own text and link'
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the button text for a preset ID
 * Returns empty string for 'none', 'custom', or 'default' presets
 * For 'default' preset, use getDefaultPresetText() instead
 */
export function getPresetText(presetId: string): string {
  const preset = QUICK_ACTION_PRESETS.find(p => p.id === presetId);
  return preset?.buttonText || '';
}

/**
 * Get the button text for the 'default' preset based on professional's preferred booking method
 * Maps preferredBookingMethod to corresponding button text
 */
export function getDefaultPresetText(preferredBookingMethod?: string): string {
  switch (preferredBookingMethod) {
    case 'send-text':
      return 'SEND TEXT';
    case 'instagram':
      return 'DM ON INSTAGRAM';
    case 'booking-link':
      return 'BOOK NOW';
    default:
      return '';
  }
}

/**
 * Check if a preset is the 'default' option
 * Used to determine if button text should be derived from professional's preferredBookingMethod
 */
export function isDefaultPreset(presetId: string): boolean {
  return presetId === 'default';
}

/**
 * Check if a preset is the custom option
 * Used to determine if custom fields (text, width) should be shown
 */
export function isCustomPreset(presetId: string): boolean {
  return presetId === 'custom';
}

/**
 * Check if a preset is the none option
 * Used to determine if the button should be hidden
 */
export function isNonePreset(presetId: string): boolean {
  return presetId === 'none' || !presetId;
}

/**
 * Get preset options formatted for select dropdown
 */
export function getPresetOptions(): { value: string; label: string }[] {
  return QUICK_ACTION_PRESETS.map(preset => ({
    value: preset.id,
    label: preset.label
  }));
}

/**
 * Get the auto-generated URL for a preset based on professional data
 * Returns null if the required professional data is missing
 */
export function getPresetUrl(
  presetId: string,
  professional: { phone?: string; instagram?: string; bookingUrl?: string; preferredBookingMethod?: string },
  customUrl?: string
): string | null {
  switch (presetId) {
    case 'default':
      // Map preferredBookingMethod to the corresponding preset behavior
      const method = professional.preferredBookingMethod;
      if (method === 'send-text') {
        return getPresetUrl('send-text', professional, customUrl);
      }
      if (method === 'instagram') {
        return getPresetUrl('instagram-dm', professional, customUrl);
      }
      if (method === 'booking-link') {
        return getPresetUrl('booking', professional, customUrl);
      }
      return null;

    case 'send-text':
      // Generate sms: URL from phone number
      if (professional.phone) {
        // Clean phone number (remove non-digits except +)
        const cleanPhone = professional.phone.replace(/[^\d+]/g, '');
        return `sms:${cleanPhone}`;
      }
      return null;

    case 'instagram-dm':
      // Generate Instagram URL from handle
      if (professional.instagram) {
        const handle = professional.instagram.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\/?/i, '');
        return `https://instagram.com/${handle}`;
      }
      return null;

    case 'booking':
      // Use booking URL directly
      if (professional.bookingUrl) {
        // Ensure URL has protocol
        if (professional.bookingUrl.startsWith('http://') || professional.bookingUrl.startsWith('https://')) {
          return professional.bookingUrl;
        }
        return `https://${professional.bookingUrl}`;
      }
      return null;

    case 'custom':
      // Use the custom URL provided
      return customUrl || null;

    default:
      return null;
  }
}
