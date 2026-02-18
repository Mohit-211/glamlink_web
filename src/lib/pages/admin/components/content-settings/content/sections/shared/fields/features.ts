import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Features Section
 *
 * Includes:
 * - Section title
 * - Array of feature items with:
 *   - Title
 *   - Description
 *   - Icon URL
 *   - Animation class
 *   - Coming soon flag
 */
export const featuresFieldConfig: FieldConfig[] = [
  {
    name: 'sectionTitle',
    label: 'Section Title',
    type: 'text',
    required: true,
    placeholder: 'Your Link To Everything Beauty',
    helperText: 'Main heading for the features section'
  },
  {
    name: 'features',
    label: 'Feature',
    type: 'array',
    data: 'object',
    maxItems: 10,
    helperText: 'List of features to display (max 10)',
    itemSchema: [
      {
        name: 'title',
        label: 'Feature Title',
        type: 'text',
        required: true,
        placeholder: 'Digital Business Cards',
        helperText: 'Title of the feature'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 2,
        required: true,
        placeholder: 'Create a stunning digital presence...',
        helperText: 'Brief description of the feature'
      },
      {
        name: 'icon',
        label: 'Icon URL',
        type: 'text',
        placeholder: '/icons/card.svg',
        helperText: 'URL to the feature icon image'
      },
      {
        name: 'animation',
        label: 'Animation',
        type: 'select',
        options: [
          { value: '', label: 'None' },
          { value: 'animate-scan-radar', label: 'Scan Radar' },
          { value: 'animate-flip-reveal', label: 'Flip Reveal' },
          { value: 'animate-play-pulse', label: 'Play Pulse' },
          { value: 'animate-stamp-approve', label: 'Stamp Approve' },
          { value: 'animate-calendar-slide', label: 'Calendar Slide' },
          { value: 'animate-ai-scan', label: 'AI Scan' }
        ],
        helperText: 'Animation effect for the feature card'
      },
      {
        name: 'isComingSoon',
        label: 'Coming Soon',
        type: 'checkbox',
        helperText: 'Mark this feature as coming soon'
      }
    ]
  }
];
