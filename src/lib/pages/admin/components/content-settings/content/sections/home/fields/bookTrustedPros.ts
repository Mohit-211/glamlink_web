import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Book Trusted Pros Section
 *
 * Includes:
 * - Array of service cards with:
 *   - Image URL
 *   - Alt text
 *   - Title
 */
export const bookTrustedProsFieldConfig: FieldConfig[] = [
  {
    name: 'services',
    label: 'Service Card',
    type: 'array',
    data: 'object',
    maxItems: 6,
    helperText: 'Service cards to display (recommended: 3)',
    itemSchema: [
      {
        name: 'image',
        label: 'Image URL',
        type: 'text',
        required: true,
        placeholder: '/images/search_by_service.png',
        helperText: 'URL to the service image'
      },
      {
        name: 'alt',
        label: 'Alt Text',
        type: 'text',
        required: true,
        placeholder: 'Professional hair styling',
        helperText: 'Alt text for accessibility'
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Search by Service',
        helperText: 'Title displayed on the card'
      }
    ]
  }
];
