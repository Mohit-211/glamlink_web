/**
 * Section Props Configuration - Content Sections
 *
 * Configuration for content-based sections:
 * - Specialties
 * - Important Info
 * - Current Promotions
 *
 * These sections support toggleGroup for display options with
 * [Title, List, QR Code] toggles and QR code position settings.
 */

import { UnifiedPropField } from './types';

// =============================================================================
// SPECIALTIES SECTION
// =============================================================================

export const SPECIALTIES_PROPS: UnifiedPropField[] = [
  {
    key: 'displayedContent',
    label: 'Displayed Content',
    type: 'toggleGroup',
    helperText: 'Toggle which elements are shown',
    toggles: [
      { key: 'showTitle', label: 'Title', defaultValue: true },
      { key: 'showList', label: 'List', defaultValue: true },
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
  {
    key: 'displayAsList',
    label: 'Display as list',
    type: 'checkbox',
    defaultValue: false,
    helperText: 'Show as bulleted list instead of colored tags',
    showWhen: (props) => props.showList !== false,
  },
  {
    key: 'maxItems',
    label: 'Maximum items',
    type: 'number',
    defaultValue: 4,
    min: 1,
    max: 20,
    step: 1,
    helperText: 'Limit the number of specialties shown',
    showWhen: (props) => props.showList !== false,
  },
];

// =============================================================================
// IMPORTANT INFO SECTION
// =============================================================================

export const IMPORTANT_INFO_PROPS: UnifiedPropField[] = [
  {
    key: 'displayedContent',
    label: 'Displayed Content',
    type: 'toggleGroup',
    helperText: 'Toggle which elements are shown',
    toggles: [
      { key: 'showTitle', label: 'Title', defaultValue: true },
      { key: 'showList', label: 'List', defaultValue: true },
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
  {
    key: 'displayAsList',
    label: 'Display as list',
    type: 'checkbox',
    defaultValue: false,
    helperText: 'Show as bulleted list instead of colored tags',
    showWhen: (props) => props.showList !== false,
  },
  {
    key: 'maxItems',
    label: 'Maximum items',
    type: 'number',
    defaultValue: 4,
    min: 1,
    max: 20,
    step: 1,
    helperText: 'Limit the number of items shown',
    showWhen: (props) => props.showList !== false,
  },
];

// =============================================================================
// CURRENT PROMOTIONS SECTIONS
// =============================================================================

export const CURRENT_PROMOTIONS_PROPS: UnifiedPropField[] = [
  {
    key: 'displayQrCode',
    label: 'Display QR Code',
    type: 'checkbox',
    defaultValue: false,
    helperText: 'Show QR code linking to the app download',
  },
  {
    key: 'qrCodeUrl',
    label: 'QR Code URL',
    type: 'url',
    defaultValue: 'https://apps.apple.com/us/app/glamlink/id6502334118',
    placeholder: 'https://...',
    helperText: 'URL the QR code links to',
    showWhen: (props) => props.displayQrCode === true,
  },
];

export const CURRENT_PROMOTIONS_DETAILED_PROPS: UnifiedPropField[] = [
  {
    key: 'displayQrCode',
    label: 'Display QR Code',
    type: 'checkbox',
    defaultValue: false,
    helperText: 'Show QR code linking to the app download',
  },
  {
    key: 'qrCodeUrl',
    label: 'QR Code URL',
    type: 'url',
    defaultValue: 'https://apps.apple.com/us/app/glamlink/id6502334118',
    placeholder: 'https://...',
    helperText: 'URL the QR code links to',
    showWhen: (props) => props.displayQrCode === true,
  },
];

// =============================================================================
// CONTENT SECTIONS CONFIG EXPORT
// =============================================================================

/**
 * Content sections configuration object
 * Maps section type IDs to their prop configurations
 */
export const CONTENT_SECTIONS_CONFIG: Record<string, UnifiedPropField[]> = {
  'specialties': SPECIALTIES_PROPS,
  'important-info': IMPORTANT_INFO_PROPS,
  'importantInfo': IMPORTANT_INFO_PROPS, // Alias with camelCase
  'current-promotions': CURRENT_PROMOTIONS_PROPS,
  'current-promotions-detailed': CURRENT_PROMOTIONS_DETAILED_PROPS,
};
