import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for CTA (Call to Action) Section
 *
 * Includes:
 * - Heading text
 * - Button text and action
 * - Gradient color configuration
 */
export const ctaFieldConfig: FieldConfig[] = [
  {
    name: 'heading',
    label: 'Heading',
    type: 'text',
    required: true,
    placeholder: 'Ready to Transform Your Beauty Business?',
    helperText: 'Main heading displayed in the CTA section'
  },
  {
    name: 'buttonText',
    label: 'Button Text',
    type: 'text',
    required: true,
    placeholder: 'Get Started Now',
    helperText: 'Text displayed on the CTA button'
  },
  {
    name: 'buttonAction',
    label: 'Button Action',
    type: 'select',
    required: true,
    options: [
      { value: 'download', label: 'Download App' },
      { value: 'signup', label: 'Sign Up' },
      { value: 'link', label: 'Navigate to Link' }
    ],
    helperText: 'Action triggered when the button is clicked'
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'text',
    placeholder: '#24bbcb',
    helperText: 'Background color (hex code or CSS color name)'
  },
  {
    name: 'gradientFrom',
    label: 'Gradient Start Color',
    type: 'text',
    placeholder: 'glamlink-teal',
    helperText: 'Tailwind color class for gradient start (e.g., glamlink-teal, blue-500)'
  },
  {
    name: 'gradientTo',
    label: 'Gradient End Color',
    type: 'text',
    placeholder: 'cyan-600',
    helperText: 'Tailwind color class for gradient end (e.g., cyan-600, purple-500)'
  }
];
