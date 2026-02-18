import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for HTML Content Section
 *
 * Includes:
 * - HTML content (rich text editor)
 * - Optional container class for styling
 */
export const htmlContentFieldConfig: FieldConfig[] = [
  {
    name: 'html',
    label: 'HTML Content',
    type: 'html',
    required: true,
    placeholder: '<div>Your custom HTML content here...</div>',
    helperText: 'Custom HTML content to display in this section'
  },
  {
    name: 'containerClass',
    label: 'Container CSS Classes (Optional)',
    type: 'text',
    placeholder: 'py-16 bg-gray-50 custom-section',
    helperText: 'Optional CSS classes to apply to the section container (e.g., padding, background)'
  }
];
