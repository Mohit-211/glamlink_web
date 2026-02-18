/**
 * Custom Section Field Configuration
 * Field definitions for Custom Section with multiple content blocks
 */

import type { FieldConfig } from '@/lib/pages/admin/types/forms';
import type { CustomSectionData, CustomSectionContent } from '@/lib/pages/admin/components/magazine/web/types';
import { getDefaultCustomSectionContent } from '@/lib/pages/admin/components/magazine/web/types';

// =============================================================================
// CUSTOM SECTION FIELDS
// =============================================================================

/**
 * Basic fields for Custom Section header
 * Note: The 'content' field containing blocks is handled by CustomSectionEditor,
 * not by the standard FormRenderer
 */
export const customSectionFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Section Title',
    type: 'text',
    placeholder: 'Enter section title (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Section Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'backgroundColor',
    label: 'Section Background',
    type: 'backgroundColor',
    helperText: 'Background color for the entire section',
  },
];

/**
 * These are the basic fields rendered above the block editor
 * (excludes content which is handled separately)
 */
export const customSectionBasicFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Section Title',
    type: 'text',
    placeholder: 'Enter section title (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
  {
    name: 'subtitle',
    label: 'Section Subtitle',
    type: 'text',
    placeholder: 'Enter subtitle (optional)...',
    useTypography: true,
    typographyConfig: {
      showAlignment: true,
      showColor: true,
    },
  },
];

/**
 * Section Strip fields - configurable strip element for corners or fixed positions
 */
export const sectionStripFields: FieldConfig[] = [
  {
    name: 'sectionStrip.enabled',
    label: 'Enable Section Strip',
    type: 'checkbox',
    helperText: 'Display a strip label (e.g., "SPECIAL ADVERTISING SECTION")',
  },
  {
    name: 'sectionStrip.text',
    label: 'Strip Text',
    type: 'text',
    placeholder: 'SPECIAL ADVERTISING SECTION',
    useTypography: true,
    typographyConfig: {
      showAlignment: false,
      showColor: true,
    },
  },
  {
    name: 'sectionStrip.position',
    label: 'Strip Position',
    type: 'select',
    options: [
      { value: 'top-left', label: 'Top Left Corner' },
      { value: 'top-right', label: 'Top Right Corner' },
      { value: 'bottom-left', label: 'Bottom Left Corner' },
      { value: 'bottom-right', label: 'Bottom Right Corner' },
      { value: 'top-center', label: 'Top Center' },
      { value: 'inside-content', label: 'Inside Content Blocks' },
      { value: 'after-content', label: 'After Content Blocks' },
    ],
    defaultValue: 'top-left',
  },
  {
    name: 'sectionStrip.insideBlockIndex',
    label: 'Insert Before Block #',
    type: 'number',
    defaultValue: 0,
    min: 0,
    helperText: 'Block number (0-indexed) to insert the strip before. Only used when position is "Inside Content Blocks"',
    conditionalDisplay: {
      field: 'sectionStrip.position',
      operator: '===',
      value: 'inside-content',
    },
  },
  {
    name: 'sectionStrip.display',
    label: 'Display',
    type: 'select',
    options: [
      { value: 'regular', label: 'Regular' },
      { value: 'vertical', label: 'Vertical' },
    ],
    defaultValue: 'regular',
    helperText: 'Text orientation',
  },
  {
    name: 'sectionStrip.rotation',
    label: 'Rotation (degrees)',
    type: 'number',
    defaultValue: 0,
    helperText: 'Rotate for diagonal effect (e.g., -45)',
    conditionalDisplay: {
      field: 'sectionStrip.display',
      operator: '!==',
      value: 'vertical',
    },
  },
  {
    name: 'sectionStrip.verticalAngle',
    label: 'Vertical Angle',
    type: 'select',
    options: [
      { value: '90', label: '90° (Bottom to Top)' },
      { value: '-90', label: '-90° (Top to Bottom)' },
    ],
    defaultValue: '-90',
    helperText: 'Direction of vertical text',
    conditionalDisplay: {
      field: 'sectionStrip.display',
      operator: '===',
      value: 'vertical',
    },
  },
  {
    name: 'sectionStrip.useBackground',
    label: 'Use Background',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Show strip with a colored background container',
  },
  {
    name: 'sectionStrip.backgroundColor',
    label: 'Background Color',
    type: 'backgroundColor',
    helperText: 'Background color for the strip',
    conditionalDisplay: {
      field: 'sectionStrip.useBackground',
      operator: '===',
      value: true,
    },
  },
  {
    name: 'sectionStrip.padding',
    label: 'Padding (px)',
    type: 'number',
    defaultValue: 8,
    helperText: 'Inner padding in pixels',
    conditionalDisplay: {
      field: 'sectionStrip.useBackground',
      operator: '===',
      value: true,
    },
  },
  {
    name: 'sectionStrip.borderRadius',
    label: 'Border Radius (px)',
    type: 'number',
    defaultValue: 0,
    helperText: 'Corner rounding in pixels',
    conditionalDisplay: {
      field: 'sectionStrip.useBackground',
      operator: '===',
      value: true,
    },
  },
];

// =============================================================================
// DEFAULT VALUES
// =============================================================================

/**
 * Get default values for a new Custom Section
 */
export const getDefaultCustomSection = (): Partial<CustomSectionData> => ({
  type: 'custom-section',
  title: '',
  subtitle: '',
  backgroundColor: '#ffffff',
  content: getDefaultCustomSectionContent(),
});

/**
 * Get default values for Section Strip
 */
export const getDefaultSectionStrip = () => ({
  enabled: false,
  text: '',
  position: 'top-left' as const,
  insideBlockIndex: 0,
  display: 'regular' as const,
  verticalAngle: '-90',
  useBackground: true,
  backgroundColor: '#000000',
  textTypography: {
    fontSize: 'text-xs',
    fontFamily: 'font-sans',
    fontWeight: 'font-semibold',
    color: 'text-white',
  },
  // Legacy fields for backwards compatibility
  textColor: 'text-white',
  fontSize: 'text-xs',
  fontWeight: 'font-semibold',
  padding: 8,
  borderRadius: 0,
  rotation: 0,
});

// =============================================================================
// LAYOUT OPTIONS
// =============================================================================

/**
 * Available layout options for the block container
 */
export const LAYOUT_OPTIONS = [
  { value: 'single-column', label: 'Single Column' },
  { value: 'two-column', label: 'Two Columns' },
  { value: 'grid-3', label: '3-Column Grid' },
] as const;
