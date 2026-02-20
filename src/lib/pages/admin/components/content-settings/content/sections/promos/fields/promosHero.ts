import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Promos Hero Section
 *
 * Includes:
 * - Title
 * - Subtitle
 */
export const promosHeroFieldConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Exclusive Promotions',
    helperText: 'Main heading for the promos page'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'Discover special offers and deals from beauty professionals.',
    helperText: 'Supporting text below the title'
  }
];
