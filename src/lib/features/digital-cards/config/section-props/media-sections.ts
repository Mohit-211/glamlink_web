/**
 * Section Props Configuration - Media Sections
 *
 * Configuration for media-based sections:
 * - Signature Work (video portfolio)
 * - Signature Work & Actions
 */

import { UnifiedPropField } from './types';

// =============================================================================
// SIGNATURE WORK SECTION
// =============================================================================

export const SIGNATURE_WORK_PROPS: UnifiedPropField[] = [
  // Display toggles - enable to configure display settings for each preview
  {
    key: 'displayToggles',
    label: 'Display',
    type: 'toggleGroup',
    toggles: [
      { key: 'pageDisplayEnabled', label: 'Page', defaultValue: false },
      { key: 'imageDisplayEnabled', label: 'Image', defaultValue: false },
    ],
    helperText: 'Toggle to customize display settings for each preview',
  },
  // === PAGE DISPLAY SETTINGS ===
  {
    key: 'pageDisplaySize',
    label: 'Page Display Size',
    type: 'select',
    defaultValue: 'none',
    options: [
      { value: 'none', label: 'None (auto)' },
      { value: 'width', label: 'Width' },
      { value: 'height', label: 'Height' },
      { value: 'both', label: 'Both' },
    ],
    showWhen: (props) => props.pageDisplayEnabled === true,
  },
  {
    key: 'pageDisplayWidth',
    label: 'Page Width (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.pageDisplayEnabled === true && (props.pageDisplaySize === 'width' || props.pageDisplaySize === 'both'),
  },
  {
    key: 'pageDisplayHeight',
    label: 'Page Height (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.pageDisplayEnabled === true && (props.pageDisplaySize === 'height' || props.pageDisplaySize === 'both'),
  },
  // === IMAGE DISPLAY SETTINGS ===
  {
    key: 'imageDisplaySize',
    label: 'Image Display Size',
    type: 'select',
    defaultValue: 'none',
    options: [
      { value: 'none', label: 'None (auto)' },
      { value: 'width', label: 'Width' },
      { value: 'height', label: 'Height' },
      { value: 'both', label: 'Both' },
    ],
    showWhen: (props) => props.imageDisplayEnabled === true,
  },
  {
    key: 'imageDisplayWidth',
    label: 'Image Width (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.imageDisplayEnabled === true && (props.imageDisplaySize === 'width' || props.imageDisplaySize === 'both'),
  },
  {
    key: 'imageDisplayHeight',
    label: 'Image Height (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.imageDisplayEnabled === true && (props.imageDisplaySize === 'height' || props.imageDisplaySize === 'both'),
  },
  {
    key: 'showPlayButton',
    label: 'Show Play Button',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Show play button overlay on the video thumbnail',
  },
  {
    key: 'hideCaption',
    label: 'Hide Caption',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Hide the video caption/title',
  },
];

// =============================================================================
// SIGNATURE WORK & ACTIONS SECTION
// =============================================================================

export const SIGNATURE_WORK_ACTIONS_PROPS: UnifiedPropField[] = [
  // Display toggles - enable to configure display settings for each preview
  {
    key: 'displayToggles',
    label: 'Display',
    type: 'toggleGroup',
    toggles: [
      { key: 'pageDisplayEnabled', label: 'Page', defaultValue: false },
      { key: 'imageDisplayEnabled', label: 'Image', defaultValue: false },
    ],
    helperText: 'Toggle to customize display settings for each preview',
  },
  // === PAGE DISPLAY SETTINGS ===
  {
    key: 'pageDisplaySize',
    label: 'Page Display Size',
    type: 'select',
    defaultValue: 'none',
    options: [
      { value: 'none', label: 'None (auto)' },
      { value: 'width', label: 'Width' },
      { value: 'height', label: 'Height' },
      { value: 'both', label: 'Both' },
    ],
    showWhen: (props) => props.pageDisplayEnabled === true,
  },
  {
    key: 'pageDisplayWidth',
    label: 'Page Width (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.pageDisplayEnabled === true && (props.pageDisplaySize === 'width' || props.pageDisplaySize === 'both'),
  },
  {
    key: 'pageDisplayHeight',
    label: 'Page Height (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.pageDisplayEnabled === true && (props.pageDisplaySize === 'height' || props.pageDisplaySize === 'both'),
  },
  // === IMAGE DISPLAY SETTINGS ===
  {
    key: 'imageDisplaySize',
    label: 'Image Display Size',
    type: 'select',
    defaultValue: 'none',
    options: [
      { value: 'none', label: 'None (auto)' },
      { value: 'width', label: 'Width' },
      { value: 'height', label: 'Height' },
      { value: 'both', label: 'Both' },
    ],
    showWhen: (props) => props.imageDisplayEnabled === true,
  },
  {
    key: 'imageDisplayWidth',
    label: 'Image Width (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.imageDisplayEnabled === true && (props.imageDisplaySize === 'width' || props.imageDisplaySize === 'both'),
  },
  {
    key: 'imageDisplayHeight',
    label: 'Image Height (%)',
    type: 'number',
    defaultValue: 100,
    min: 10,
    max: 100,
    step: 5,
    showWhen: (props) => props.imageDisplayEnabled === true && (props.imageDisplaySize === 'height' || props.imageDisplaySize === 'both'),
  },
  {
    key: 'showPlayButton',
    label: 'Show Play Button',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Show play button overlay on the video thumbnail',
  },
];

// =============================================================================
// MEDIA SECTIONS CONFIG EXPORT
// =============================================================================

/**
 * Media sections configuration object
 * Maps section type IDs to their prop configurations
 */
export const MEDIA_SECTIONS_CONFIG: Record<string, UnifiedPropField[]> = {
  'signature-work': SIGNATURE_WORK_PROPS,
  'signature-work-actions': SIGNATURE_WORK_ACTIONS_PROPS,
};
