/**
 * UTM Preset Configurations
 *
 * Pre-defined UTM parameter sets for common link sharing scenarios.
 * These presets help professionals track where their traffic comes from.
 */

import type { UTMPreset } from '../types/utmConfig';

// =============================================================================
// UTM PRESETS
// =============================================================================

/**
 * All available UTM presets for link generation
 */
export const UTM_PRESETS: UTMPreset[] = [
  // ==========================================================================
  // PRINT / PHYSICAL
  // ==========================================================================
  {
    id: 'qr-code',
    name: 'QR Code',
    description: 'For printed QR codes on business cards, flyers, posters, etc.',
    source: 'qr',
    medium: 'digitalcard',
    icon: '📱',
    category: 'print',
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'For links printed on physical business cards',
    source: 'print',
    medium: 'businesscard',
    icon: '💳',
    category: 'print',
  },

  // ==========================================================================
  // SOCIAL MEDIA
  // ==========================================================================
  {
    id: 'instagram-bio',
    name: 'Instagram Bio',
    description: 'Link in your Instagram profile bio',
    source: 'instagram',
    medium: 'bio',
    icon: '📸',
    category: 'social',
  },
  {
    id: 'instagram-post',
    name: 'Instagram Pinned Post',
    description: 'Link in a pinned Instagram post or story',
    source: 'instagram',
    medium: 'pinnedpost',
    icon: '📌',
    category: 'social',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    description: 'Link sticker in Instagram Stories',
    source: 'instagram',
    medium: 'story',
    icon: '⏱️',
    category: 'social',
  },
  {
    id: 'tiktok-bio',
    name: 'TikTok Bio',
    description: 'Link in your TikTok profile bio',
    source: 'tiktok',
    medium: 'bio',
    icon: '🎵',
    category: 'social',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Links shared on Facebook posts or profile',
    source: 'facebook',
    medium: 'social',
    icon: '👤',
    category: 'social',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    description: 'Links shared on X/Twitter',
    source: 'twitter',
    medium: 'social',
    icon: '🐦',
    category: 'social',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Links shared on LinkedIn profile or posts',
    source: 'linkedin',
    medium: 'social',
    icon: '💼',
    category: 'social',
  },

  // ==========================================================================
  // DIRECT SHARING
  // ==========================================================================
  {
    id: 'direct-share',
    name: 'Direct Share',
    description: 'For sharing via text message, DMs, or personal messages',
    source: 'share',
    medium: 'direct',
    icon: '💬',
    category: 'share',
  },
  {
    id: 'email-signature',
    name: 'Email Signature',
    description: 'Link in your email signature',
    source: 'email',
    medium: 'signature',
    icon: '✉️',
    category: 'share',
  },
  {
    id: 'email-campaign',
    name: 'Email Campaign',
    description: 'Links in marketing or newsletter emails',
    source: 'email',
    medium: 'campaign',
    icon: '📧',
    category: 'share',
  },

  // ==========================================================================
  // OTHER PLATFORMS
  // ==========================================================================
  {
    id: 'linktree',
    name: 'Linktree',
    description: 'For Linktree or similar "link in bio" services',
    source: 'linktree',
    medium: 'bio',
    icon: '🌳',
    category: 'other',
  },
  {
    id: 'yelp',
    name: 'Yelp',
    description: 'Link on your Yelp business page',
    source: 'yelp',
    medium: 'profile',
    icon: '⭐',
    category: 'other',
  },
  {
    id: 'google-business',
    name: 'Google Business',
    description: 'Link on your Google Business Profile',
    source: 'google',
    medium: 'business',
    icon: '🔍',
    category: 'other',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a preset by its ID
 */
export function getPresetById(id: string): UTMPreset | undefined {
  return UTM_PRESETS.find(preset => preset.id === id);
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: UTMPreset['category']): UTMPreset[] {
  return UTM_PRESETS.filter(preset => preset.category === category);
}

/**
 * Get all preset categories with their presets
 */
export function getPresetsGroupedByCategory(): Record<string, UTMPreset[]> {
  return {
    social: getPresetsByCategory('social'),
    print: getPresetsByCategory('print'),
    share: getPresetsByCategory('share'),
    other: getPresetsByCategory('other'),
  };
}

/**
 * Category display labels
 */
export const CATEGORY_LABELS: Record<UTMPreset['category'], string> = {
  social: 'Social Media',
  print: 'Print & Physical',
  share: 'Direct Sharing',
  other: 'Other Platforms',
};
