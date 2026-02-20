/**
 * UTM Configuration Types
 *
 * Defines UTM preset configurations for generating trackable links
 * for different platforms and use cases.
 */

// =============================================================================
// UTM PRESET TYPES
// =============================================================================

/**
 * Configuration for a UTM link preset
 */
export interface UTMPreset {
  /** Unique identifier for the preset */
  id: string;

  /** Display name */
  name: string;

  /** Description of when to use this preset */
  description: string;

  /** UTM source value */
  source: string;

  /** UTM medium value */
  medium: string;

  /** Optional default campaign name */
  campaign?: string;

  /** Emoji or icon identifier for UI */
  icon: string;

  /** Category for grouping in UI */
  category: 'social' | 'print' | 'share' | 'other';
}

/**
 * Generated UTM link with all components
 */
export interface GeneratedUTMLink {
  /** The preset used to generate this link */
  preset: UTMPreset;

  /** Full URL with UTM parameters */
  fullUrl: string;

  /** Just the query string portion (e.g., ?utm_source=...) */
  queryString: string;

  /** Base URL without query string */
  baseUrl: string;
}

/**
 * Custom UTM parameters for non-preset links
 */
export interface CustomUTMParams {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// =============================================================================
// UTM EXTRACTION
// =============================================================================

/**
 * Extracted UTM parameters from a URL or cookies
 */
export interface ExtractedUTMParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}
