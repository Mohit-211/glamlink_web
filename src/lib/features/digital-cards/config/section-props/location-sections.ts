/**
 * Section Props Configuration - Location Sections
 *
 * Configuration for location-related sections:
 * - Map sections (map-section, map, mapWithHours, mapAndContentContainer)
 * - Business Hours
 * - Overview Stats
 *
 * Map sections support toggleGroup for display options with
 * [Title, List, QR Code] toggles and QR code position settings.
 */

import { UnifiedPropField } from './types';

// =============================================================================
// COMMON MAP PROPS
// =============================================================================

/**
 * Base map settings shared across map section types
 */
const BASE_MAP_PROPS: UnifiedPropField[] = [
  {
    key: 'mapHeight',
    label: 'Map Height (px)',
    type: 'number',
    defaultValue: 300,
    min: 150,
    max: 600,
    step: 10,
    helperText: 'Height of the map display',
  },
  {
    key: 'showAddressOverlay',
    label: 'Show address overlay on map',
    type: 'checkbox',
    defaultValue: false,
    helperText: 'Display address information overlaid on the map',
  },
  {
    key: 'showStaticMap',
    label: 'Static Map for Export',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Use static map image for card export (recommended)',
  },
];

// =============================================================================
// MAP SECTION (with toggleGroup for display options)
// =============================================================================

export const MAP_SECTION_PROPS: UnifiedPropField[] = [
  {
    key: 'displayedContent',
    label: 'Displayed Content',
    type: 'toggleGroup',
    helperText: 'Toggle which elements are shown',
    toggles: [
      { key: 'showTitle', label: 'Title', defaultValue: true },
      { key: 'showList', label: 'Hours', defaultValue: true },
      { key: 'showQrCode', label: 'QR Code', defaultValue: false },
    ],
  },
  {
    key: 'qrCodeUrl',
    label: 'QR Code URL',
    type: 'url',
    defaultValue: 'https://apps.apple.com/us/app/glamlink/id6502334118',
    placeholder: 'https://...',
    helperText: 'URL that the QR code will link to',
    showWhen: (props) => props.showQrCode === true,
  },
  {
    key: 'qrCodeLocation',
    label: 'QR Code Position',
    type: 'select',
    defaultValue: 'right',
    options: [
      { value: 'right', label: 'Right Side' },
      { value: 'middle', label: 'Middle (Centered)' },
    ],
    helperText: 'Where to position the QR code',
    showWhen: (props) => props.showQrCode === true,
  },
  ...BASE_MAP_PROPS,
];

// =============================================================================
// MAP (simple) SECTION
// =============================================================================

export const MAP_PROPS: UnifiedPropField[] = [
  ...BASE_MAP_PROPS,
];

// =============================================================================
// MAP WITH HOURS SECTION
// =============================================================================

export const MAP_WITH_HOURS_PROPS: UnifiedPropField[] = [
  ...BASE_MAP_PROPS,
  {
    key: 'showBusinessHours',
    label: 'Show Business Hours',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display business hours below the map',
  },
];

// =============================================================================
// MAP AND CONTENT CONTAINER SECTION
// =============================================================================

export const MAP_AND_CONTENT_CONTAINER_PROPS: UnifiedPropField[] = [
  ...BASE_MAP_PROPS,
];

// =============================================================================
// BUSINESS HOURS SECTION
// =============================================================================

export const BUSINESS_HOURS_PROPS: UnifiedPropField[] = [
  {
    key: 'displayedContent',
    label: 'Displayed Content',
    type: 'toggleGroup',
    helperText: 'Toggle display options (hours content always shown)',
    toggles: [
      { key: 'showTitle', label: 'Title', defaultValue: true },
      { key: 'showList', label: 'List', defaultValue: true },
      { key: 'compactMode', label: 'Compact', defaultValue: false },
    ],
  },
];

// =============================================================================
// OVERVIEW STATS SECTION
// =============================================================================

export const OVERVIEW_STATS_PROPS: UnifiedPropField[] = [
  {
    key: 'showExperience',
    label: 'Show Years of Experience',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display years of experience stat',
  },
  {
    key: 'showRating',
    label: 'Show Rating',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display rating stars',
  },
  {
    key: 'showServicesCount',
    label: 'Show Services Count',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display number of services offered',
  },
];

// =============================================================================
// LOCATION SECTIONS CONFIG EXPORT
// =============================================================================

/**
 * Location sections configuration object
 * Maps section type IDs to their prop configurations
 */
export const LOCATION_SECTIONS_CONFIG: Record<string, UnifiedPropField[]> = {
  'map-section': MAP_SECTION_PROPS,
  'map': MAP_PROPS,
  'mapWithHours': MAP_WITH_HOURS_PROPS,
  'mapAndContentContainer': MAP_AND_CONTENT_CONTAINER_PROPS,
  'business-hours': BUSINESS_HOURS_PROPS,
  'overview-stats': OVERVIEW_STATS_PROPS,
};
