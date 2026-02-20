/**
 * UTM Link Generator
 *
 * Generates UTM-tagged URLs for tracking traffic sources to digital cards.
 */

import type { UTMPreset, GeneratedUTMLink, CustomUTMParams } from '../types/utmConfig';
import { UTM_PRESETS, getPresetById } from '../config/utmPresets';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Default base URL for digital cards
 * Can be overridden with environment variable or options
 */
const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://glamlink.net';

/**
 * Path template for professional card URLs
 */
const CARD_PATH_TEMPLATE = '/for-professionals/{id}';

// =============================================================================
// URL BUILDERS
// =============================================================================

/**
 * Build the base URL for a professional's card
 */
function buildCardBaseUrl(professionalId: string, baseUrl?: string): string {
  const base = baseUrl || DEFAULT_BASE_URL;
  const path = CARD_PATH_TEMPLATE.replace('{id}', professionalId);
  return `${base}${path}`;
}

/**
 * Build a UTM query string from parameters
 */
function buildUTMQueryString(params: {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
}): string {
  const queryParams = new URLSearchParams();

  queryParams.set('utm_source', params.source);
  queryParams.set('utm_medium', params.medium);

  if (params.campaign) {
    queryParams.set('utm_campaign', params.campaign);
  }
  if (params.term) {
    queryParams.set('utm_term', params.term);
  }
  if (params.content) {
    queryParams.set('utm_content', params.content);
  }

  return `?${queryParams.toString()}`;
}

// =============================================================================
// LINK GENERATION
// =============================================================================

/**
 * Generate a UTM-tagged URL from a preset
 *
 * @param professionalId - The professional's ID
 * @param presetId - The preset ID (e.g., 'qr-code', 'instagram-bio')
 * @param options - Optional overrides
 * @returns Generated link object or null if preset not found
 *
 * @example
 * const link = generateUTMLink('pro-123', 'instagram-bio');
 * // link.fullUrl = "https://glamlink.net/for-professionals/pro-123?utm_source=instagram&utm_medium=bio"
 */
export function generateUTMLink(
  professionalId: string,
  presetId: string,
  options?: {
    campaign?: string;
    baseUrl?: string;
  }
): GeneratedUTMLink | null {
  const preset = getPresetById(presetId);
  if (!preset) return null;

  const baseUrl = buildCardBaseUrl(professionalId, options?.baseUrl);
  const queryString = buildUTMQueryString({
    source: preset.source,
    medium: preset.medium,
    campaign: options?.campaign || preset.campaign,
  });

  return {
    preset,
    baseUrl,
    queryString,
    fullUrl: `${baseUrl}${queryString}`,
  };
}

/**
 * Generate a UTM-tagged URL with custom parameters
 *
 * @param professionalId - The professional's ID
 * @param params - Custom UTM parameters
 * @param options - Optional base URL override
 * @returns Generated URL string
 *
 * @example
 * const url = generateCustomUTMLink('pro-123', {
 *   source: 'partner',
 *   medium: 'referral',
 *   campaign: 'summer2025'
 * });
 */
export function generateCustomUTMLink(
  professionalId: string,
  params: CustomUTMParams,
  options?: { baseUrl?: string }
): string {
  const baseUrl = buildCardBaseUrl(professionalId, options?.baseUrl);
  const queryString = buildUTMQueryString(params);
  return `${baseUrl}${queryString}`;
}

/**
 * Generate all preset UTM links for a professional
 *
 * @param professionalId - The professional's ID
 * @param options - Optional overrides
 * @returns Array of generated link objects
 *
 * @example
 * const allLinks = generateAllUTMLinks('pro-123');
 * // Returns array with links for all presets
 */
export function generateAllUTMLinks(
  professionalId: string,
  options?: {
    campaign?: string;
    baseUrl?: string;
  }
): GeneratedUTMLink[] {
  return UTM_PRESETS.map(preset => {
    const baseUrl = buildCardBaseUrl(professionalId, options?.baseUrl);
    const queryString = buildUTMQueryString({
      source: preset.source,
      medium: preset.medium,
      campaign: options?.campaign || preset.campaign,
    });

    return {
      preset,
      baseUrl,
      queryString,
      fullUrl: `${baseUrl}${queryString}`,
    };
  });
}

/**
 * Generate links grouped by category
 *
 * @param professionalId - The professional's ID
 * @param options - Optional overrides
 * @returns Links grouped by category
 */
export function generateUTMLinksGrouped(
  professionalId: string,
  options?: {
    campaign?: string;
    baseUrl?: string;
  }
): Record<string, GeneratedUTMLink[]> {
  const allLinks = generateAllUTMLinks(professionalId, options);

  return allLinks.reduce((grouped, link) => {
    const category = link.preset.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(link);
    return grouped;
  }, {} as Record<string, GeneratedUTMLink[]>);
}

// =============================================================================
// URL PARSING
// =============================================================================

/**
 * Extract UTM parameters from a URL
 *
 * @param url - URL string to parse
 * @returns Extracted UTM parameters
 */
export function extractUTMParams(url: string): CustomUTMParams | null {
  try {
    const urlObj = new URL(url);
    const source = urlObj.searchParams.get('utm_source');
    const medium = urlObj.searchParams.get('utm_medium');

    if (!source || !medium) return null;

    return {
      source,
      medium,
      campaign: urlObj.searchParams.get('utm_campaign') || undefined,
      term: urlObj.searchParams.get('utm_term') || undefined,
      content: urlObj.searchParams.get('utm_content') || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Get the clean card URL without UTM parameters
 *
 * @param professionalId - The professional's ID
 * @param baseUrl - Optional base URL override
 * @returns Clean URL without query parameters
 */
export function getCleanCardUrl(professionalId: string, baseUrl?: string): string {
  return buildCardBaseUrl(professionalId, baseUrl);
}
