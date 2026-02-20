import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Passion Into Power Section
 *
 * Includes:
 * - Title
 * - Subtitle
 * - Primary button (text, action, subtext)
 * - Secondary button (text, action, link, subtext)
 */
export const passionIntoPowerFieldConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Turn Your Passion Into Power',
    helperText: 'Main heading for the section'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 3,
    required: true,
    placeholder: 'From viral content to e-commerce, Glamlink is where beauty meets technology. With AI-driven discovery on the horizon, this is your chance to claim your space, get discovered and thrive.',
    helperText: 'Supporting text below the title'
  },
  // Primary Button
  {
    name: 'primaryButton.text',
    label: 'Primary Button Text',
    type: 'text',
    required: true,
    placeholder: 'Become A Founding Pro',
    helperText: 'Text for the main action button'
  },
  {
    name: 'primaryButton.action',
    label: 'Primary Button Action',
    type: 'select',
    required: true,
    options: [
      { value: 'download-pro', label: 'Download Pro App' },
      { value: 'external-link', label: 'External Link' }
    ],
    helperText: 'Action when button is clicked'
  },
  {
    name: 'primaryButton.subtext',
    label: 'Primary Button Subtext',
    type: 'text',
    placeholder: 'Limited to 100 pros',
    helperText: 'Small text below the button'
  },
  // Secondary Button
  {
    name: 'secondaryButton.text',
    label: 'Secondary Button Text',
    type: 'text',
    required: true,
    placeholder: 'E-Commerce Panel',
    helperText: 'Text for the secondary action button'
  },
  {
    name: 'secondaryButton.action',
    label: 'Secondary Button Action',
    type: 'select',
    required: true,
    options: [
      { value: 'external-link', label: 'External Link' },
      { value: 'download-pro', label: 'Download Pro App' }
    ],
    helperText: 'Action when button is clicked'
  },
  {
    name: 'secondaryButton.link',
    label: 'Secondary Button Link',
    type: 'url',
    placeholder: 'https://crm.glamlink.net',
    helperText: 'URL for the external link (required if action is External Link)'
  },
  {
    name: 'secondaryButton.subtext',
    label: 'Secondary Button Subtext',
    type: 'text',
    placeholder: 'Existing Pro',
    helperText: 'Small text below the button'
  }
];
