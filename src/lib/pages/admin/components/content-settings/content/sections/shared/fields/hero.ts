import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Hero Section
 *
 * Includes:
 * - Title and subtitle text fields
 * - Mobile-specific subtitle
 * - Background image URL
 * - Array of phone images
 * - CTA button configuration
 */
export const heroFieldConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Your Link To Everything Beauty',
    helperText: 'Main heading displayed on the hero section'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 3,
    required: true,
    placeholder: 'Connect with top beauty professionals...',
    helperText: 'Supporting text displayed below the title'
  },
  {
    name: 'mobileSubtitle',
    label: 'Mobile Subtitle (Optional)',
    type: 'text',
    placeholder: 'Shorter version for mobile screens',
    helperText: 'Alternative subtitle for mobile devices (optional)'
  },
  {
    name: 'backgroundImage',
    label: 'Background Image URL',
    type: 'text',
    placeholder: '/images/hero-bg.jpg',
    helperText: 'URL to the hero section background image'
  },
  {
    name: 'phoneImages',
    label: 'Phone Images',
    type: 'array',
    data: 'string',
    itemType: 'text',
    maxItems: 10,
    placeholder: '/images/Phone Holding 1.png',
    helperText: 'URLs of phone mockup images to display (max 10)'
  },
  {
    name: 'ctaButton.text',
    label: 'CTA Button Text',
    type: 'text',
    required: true,
    placeholder: 'Get Started',
    helperText: 'Text displayed on the call-to-action button'
  },
  {
    name: 'ctaButton.action',
    label: 'Button Action',
    type: 'select',
    required: true,
    options: [
      { value: 'download', label: 'Open Download Dialog' },
      { value: 'link', label: 'Navigate to Link' },
      { value: 'signup', label: 'Navigate to Sign Up' }
    ],
    helperText: 'Action triggered when the button is clicked'
  }
];
