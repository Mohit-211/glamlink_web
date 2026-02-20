import type { FieldConfig } from '@/lib/pages/admin/types/forms';

// Shared icon options for both cards
const ICON_OPTIONS = [
  { value: 'PersonOutline', label: 'Person' },
  { value: 'ShoppingBagOutlined', label: 'Shopping Bag' },
  { value: 'CalendarTodayOutlined', label: 'Calendar' },
  { value: 'RocketLaunchOutlined', label: 'Rocket' },
  { value: 'SearchOutlined', label: 'Search' },
  { value: 'EventNoteOutlined', label: 'Calendar Note' },
  { value: 'AttachMoneyOutlined', label: 'Money' },
  { value: 'AutoAwesomeOutlined', label: 'Sparkle/AI' },
  { value: 'StarOutline', label: 'Star' },
  { value: 'CheckCircleOutline', label: 'Check Circle' },
  { value: 'LocalOfferOutlined', label: 'Local Offer' },
  { value: 'TrendingUpOutlined', label: 'Trending Up' },
  { value: 'FavoriteOutlined', label: 'Heart' },
  { value: 'ThumbUpOutlined', label: 'Thumbs Up' }
];

// Shared feature item schema
const featureItemSchema: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Feature title',
    helperText: 'Feature title'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'Feature description',
    helperText: 'Feature description'
  },
  {
    name: 'icon',
    label: 'Material-UI Icon',
    type: 'select',
    required: true,
    options: ICON_OPTIONS,
    helperText: 'Icon to display next to the feature'
  }
];

/**
 * Field configuration for Why Glamlink Section
 *
 * Two-card layout:
 * - Left card: "For Clients" - configurable title, subtitle, features
 * - Right card: "For Professionals" - configurable title, subtitle, features
 */
export const whyGlamlinkFieldConfig: FieldConfig[] = [
  // ===== LEFT CARD - For Clients =====
  {
    name: 'title',
    label: 'Left Card Title (For Clients)',
    type: 'text',
    required: true,
    placeholder: 'Why Glamlink?',
    helperText: 'Title displayed on the left card'
  },
  {
    name: 'subtitle',
    label: 'Left Card Subtitle',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'A smarter way to discover trusted beauty professionals and shop expert-approved products.',
    helperText: 'Subtitle displayed below the title'
  },
  {
    name: 'features',
    label: 'Left Card Feature',
    type: 'array',
    data: 'object',
    maxItems: 6,
    helperText: 'Feature items for the left card (recommended: 4)',
    itemSchema: featureItemSchema
  },

  // ===== RIGHT CARD - For Professionals =====
  {
    name: 'proCard.title',
    label: 'Right Card Title (For Professionals)',
    type: 'text',
    required: true,
    placeholder: 'For Professionals',
    helperText: 'Title displayed on the right card'
  },
  {
    name: 'proCard.subtitle',
    label: 'Right Card Subtitle',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'Get discovered, get booked, and unlock new ways to grow.',
    helperText: 'Subtitle displayed below the title'
  },
  {
    name: 'proCard.features',
    label: 'Right Card Feature',
    type: 'array',
    data: 'object',
    maxItems: 6,
    helperText: 'Feature items for the right card (recommended: 4)',
    itemSchema: featureItemSchema
  }
];
