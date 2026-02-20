import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Everything You Need Section
 *
 * Includes:
 * - Section title
 * - Subtitle
 * - Array of feature cards with:
 *   - Title
 *   - Description
 *   - Icon path
 *   - Animation class
 *   - Coming soon flag
 */
export const everythingYouNeedFieldConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Section Title',
    type: 'text',
    required: true,
    placeholder: 'Everything You Need To Create, Build & Dominate',
    helperText: 'Main heading for the section'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 3,
    required: true,
    placeholder: 'Stop juggling multiple platforms. Start dominating one. Glamlink is the only platform built for beauty and wellness professionals that is social media, booking, e-commerce. It\'s an all-in-one ecosystem designed to put you in control.',
    helperText: 'Supporting text below the title'
  },
  {
    name: 'features',
    label: 'Feature Card',
    type: 'array',
    data: 'object',
    maxItems: 10,
    helperText: 'Platform features to display (recommended: 8)',
    itemSchema: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Geo-Discovery',
        helperText: 'Feature title'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 2,
        required: true,
        placeholder: 'Be discovered by new clients near you with our powerful location-based search',
        helperText: 'Feature description'
      },
      {
        name: 'icon',
        label: 'Icon Path',
        type: 'text',
        required: true,
        placeholder: '/icons/geo_discovery_4_transparent.png',
        helperText: 'Path to the feature icon image'
      },
      {
        name: 'animation',
        label: 'Animation',
        type: 'select',
        options: [
          { value: '', label: 'None' },
          { value: 'animate-pulse-radar', label: 'Pulse Radar' },
          { value: 'animate-star-burst', label: 'Star Burst' },
          { value: 'animate-bounce-cart', label: 'Bounce Cart' },
          { value: 'animate-spin-social', label: 'Spin Social' },
          { value: 'animate-shine', label: 'Shine' },
          { value: 'animate-page-flip', label: 'Page Flip' },
          { value: 'animate-glitch', label: 'Glitch' },
          { value: 'animate-chart-rise', label: 'Chart Rise' }
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
