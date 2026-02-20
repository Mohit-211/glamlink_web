import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for How It Works Section
 *
 * Includes:
 * - Section title
 * - Array of step items with:
 *   - Step number
 *   - Title
 *   - Description
 */
export const howItWorksFieldConfig: FieldConfig[] = [
  {
    name: 'sectionTitle',
    label: 'Section Title',
    type: 'text',
    required: true,
    placeholder: 'How It Works',
    helperText: 'Main heading for the how it works section'
  },
  {
    name: 'steps',
    label: 'Step',
    type: 'array',
    data: 'object',
    maxItems: 10,
    helperText: 'List of steps to display (max 10)',
    itemSchema: [
      {
        name: 'number',
        label: 'Step Number',
        type: 'text',
        required: true,
        placeholder: '01',
        helperText: 'Step number (e.g., 01, 02, 03)'
      },
      {
        name: 'title',
        label: 'Step Title',
        type: 'text',
        required: true,
        placeholder: 'Sign Up',
        helperText: 'Title of the step'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 2,
        required: true,
        placeholder: 'Create your account in seconds...',
        helperText: 'Brief description of what happens in this step'
      }
    ]
  }
];
