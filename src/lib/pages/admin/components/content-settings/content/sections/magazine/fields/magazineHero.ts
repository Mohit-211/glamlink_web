import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Magazine Hero Section
 *
 * Includes:
 * - Title
 * - Subtitle
 */
export const magazineHeroFieldConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'The Glamlink Edit',
    helperText: 'Main heading for the magazine page'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'Your source for beauty trends, tips, and inspiration from top professionals.',
    helperText: 'Supporting text below the title'
  }
];
