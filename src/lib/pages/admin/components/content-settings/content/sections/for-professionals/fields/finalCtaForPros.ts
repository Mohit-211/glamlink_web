import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Final CTA For Pros Section
 *
 * Includes:
 * - Title
 * - Subtitle
 * - Primary button (text, action)
 * - Secondary button (text, action, link)
 * - Disclaimer text
 */
export const finalCtaForProsFieldConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Your Future in Beauty Starts Here',
    helperText: 'Main heading for the CTA section'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'Join the first 100 founding professionals and shape the future of beauty commerce.',
    helperText: 'Supporting text below the title'
  },
  // Primary Button
  {
    name: 'primaryButton.text',
    label: 'Primary Button Text',
    type: 'text',
    required: true,
    placeholder: 'Become a Founding Pro',
    helperText: 'Text for the main action button'
  },
  {
    name: 'primaryButton.action',
    label: 'Primary Button Action',
    type: 'select',
    required: true,
    options: [
      { value: 'download-pro', label: 'Download Pro App' }
    ],
    helperText: 'Action when button is clicked'
  },
  // Secondary Button
  {
    name: 'secondaryButton.text',
    label: 'Secondary Button Text',
    type: 'text',
    required: true,
    placeholder: 'Access E-Commerce Panel',
    helperText: 'Text for the secondary action button'
  },
  {
    name: 'secondaryButton.action',
    label: 'Secondary Button Action',
    type: 'select',
    required: true,
    options: [
      { value: 'external-link', label: 'External Link' }
    ],
    helperText: 'Action when button is clicked'
  },
  {
    name: 'secondaryButton.link',
    label: 'Secondary Button Link',
    type: 'url',
    required: true,
    placeholder: 'https://crm.glamlink.net',
    helperText: 'URL for the external link'
  },
  // Disclaimer
  {
    name: 'disclaimer',
    label: 'Disclaimer Text',
    type: 'text',
    placeholder: 'Limited spots available • No credit card required to start',
    helperText: 'Small print text below the buttons'
  }
];
