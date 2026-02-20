import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Testimonials Section
 *
 * Includes:
 * - Section title
 * - Array of testimonial items with:
 *   - Quote text
 *   - Author name
 *   - Author role/title
 */
export const testimonialsFieldConfig: FieldConfig[] = [
  {
    name: 'sectionTitle',
    label: 'Section Title',
    type: 'text',
    required: true,
    placeholder: 'What Our Clients Say',
    helperText: 'Main heading for the testimonials section'
  },
  {
    name: 'testimonials',
    label: 'Testimonial',
    type: 'array',
    data: 'object',
    maxItems: 10,
    helperText: 'List of testimonials to display (max 10)',
    itemSchema: [
      {
        name: 'quote',
        label: 'Quote',
        type: 'textarea',
        rows: 3,
        required: true,
        placeholder: 'This platform has transformed how I connect with clients...',
        helperText: 'The testimonial text'
      },
      {
        name: 'author',
        label: 'Author Name',
        type: 'text',
        required: true,
        placeholder: 'Sarah Johnson',
        helperText: 'Name of the person giving the testimonial'
      },
      {
        name: 'role',
        label: 'Role/Title',
        type: 'text',
        required: true,
        placeholder: 'Licensed Esthetician',
        helperText: 'Job title or role of the author'
      }
    ]
  }
];
