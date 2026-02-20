/**
 * Condensed Card Section Types
 *
 * Types for section configuration and instances.
 */

import type { PositionConfig } from '@/lib/pages/admin/components/shared/editing/fields/custom/positioning';
import type { CustomObject } from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects/types';

// =============================================================================
// SECTION CONFIGURATION
// =============================================================================

export type CondensedCardSectionId =
  | 'header'          // Profile image + gradient background
  | 'nameTitle'       // Name, title, business name
  | 'rating'          // Star rating + review count
  | 'specialties'     // Specialty tags
  | 'importantInfo'   // Important info for clients
  | 'contact'         // Location, phone, email, website, Instagram
  | 'cardUrl'         // URL display
  | 'branding'        // GLAMLINK footer
  | 'headerAndBio'    // NEW: Profile image + name/title + bio
  | 'map'             // NEW: Google Maps display
  | 'mapWithHours'    // NEW: Map + business hours
  | 'footer'          // NEW: Social media icons (Instagram, TikTok, Website)
  | 'custom'          // NEW: Custom section with layout objects
  | 'contentContainer'; // NEW: Flexible wrapper with title for any section

export interface CondensedCardSectionConfig {
  id: CondensedCardSectionId;
  label: string;
  visible: boolean;
  position: PositionConfig;
}

/**
 * Column placement for section in the website layout
 */
export type SectionColumn = 'left' | 'right' | 'full';

/**
 * Dynamic section instance for array-based configuration
 * Used in the new dynamic sections system
 */
export interface CondensedCardSectionInstance {
  id: string;                    // Unique instance ID (e.g., "header-1", "signature-work-2")
  sectionType: string;           // Section component type from registry (e.g., "header", "signature-work")
  label: string;                 // Display name for editor
  visible: boolean;              // Show/hide toggle
  position: PositionConfig;      // x, y, width, height positioning
  zIndex?: number;               // Layer order (higher = on top)
  props?: Record<string, any>;   // Component-specific props (optional)
  layoutObjects?: CustomObject[]; // Layout objects for custom sections (Text, Image, Link)
  column?: SectionColumn;        // Column placement for website layout (left, right, full)
  rowOrder?: number;             // Vertical ordering within the layout (0, 1, 2...)
}

// =============================================================================
// SECTION LAYOUT PRESETS
// =============================================================================

/**
 * Section Layout Preset - Saved configuration of sections
 * Stored in Firestore collection 'section-layout-presets'
 */
export interface SectionLayoutPreset {
  id: string;                              // Unique ID (Firestore doc ID or "default")
  name: string;                            // Display name ("Default", "Minimal", etc.)
  sections: CondensedCardSectionInstance[]; // Full section configuration
  isSystemDefault?: boolean;               // True for "Default" - cannot delete
  createdAt?: string;                      // ISO date
  updatedAt?: string;                      // ISO date
}

// =============================================================================
// SECTION ORDER
// =============================================================================

/**
 * Get all section IDs in display order
 */
export const SECTION_ORDER: CondensedCardSectionId[] = [
  'header',
  'nameTitle',
  'rating',
  'specialties',
  'importantInfo',
  'contact',
  'cardUrl',
  'branding',
  'headerAndBio',
  'map',
  'mapWithHours',
  'footer',
  'custom',
  'contentContainer',
];
