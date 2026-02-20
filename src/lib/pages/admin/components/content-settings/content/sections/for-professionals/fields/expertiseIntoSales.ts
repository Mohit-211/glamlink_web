import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Expertise Into Sales Section
 *
 * This is the most complex section with:
 * - Title with gradient text
 * - Video configuration object
 * - Features array with stats
 * - CTA object with badge
 */
export const expertiseIntoSalesFieldConfig: FieldConfig[] = [
  // Title Section
  {
    name: 'title',
    label: 'Title (Plain Part)',
    type: 'text',
    required: true,
    placeholder: 'Turn Your Expertise Into',
    helperText: 'First part of the title (plain text)'
  },
  {
    name: 'titleGradientText',
    label: 'Title (Gradient Part)',
    type: 'text',
    required: true,
    placeholder: 'Unstoppable Sales',
    helperText: 'Second part of the title (gradient text)'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 3,
    required: true,
    placeholder: 'If you\'re not selling retail, you\'re leaving money behind. Glamlink gives you the steps to sign up your shop and start earning. For a limited time, enjoy a lower platform fee while you grow.',
    helperText: 'Supporting text below the title'
  },

  // Video Configuration
  {
    name: 'video.type',
    label: 'Video Type',
    type: 'select',
    required: true,
    options: [
      { value: 'none', label: 'No Video (Placeholder)' },
      { value: 'local', label: 'Local Video File' },
      { value: 'youtube', label: 'YouTube Video' }
    ],
    helperText: 'Type of video to display'
  },
  {
    name: 'video.src',
    label: 'Video Source',
    type: 'text',
    placeholder: '/videos/ai-video.mp4 or YouTube URL',
    helperText: 'Path to local video or YouTube URL'
  },
  {
    name: 'video.thumbnail',
    label: 'Video Thumbnail',
    type: 'text',
    placeholder: '/images/video-thumbnail.jpg',
    helperText: 'Thumbnail image for the video (optional)'
  },
  {
    name: 'video.title',
    label: 'Video Title',
    type: 'text',
    placeholder: 'Watch How Pros Earn More',
    helperText: 'Title displayed with the video'
  },
  {
    name: 'video.description',
    label: 'Video Description',
    type: 'text',
    placeholder: '3 minute setup • Instant results',
    helperText: 'Description displayed with the video'
  },
  {
    name: 'video.placeholderTitle',
    label: 'Placeholder Title',
    type: 'text',
    placeholder: 'Professional Video Coming Soon',
    helperText: 'Title shown when video type is "none"'
  },
  {
    name: 'video.placeholderDescription',
    label: 'Placeholder Description',
    type: 'text',
    placeholder: 'Stay tuned for exclusive content showing how pros maximize their earnings',
    helperText: 'Description shown when video type is "none"'
  },

  // Features Array
  {
    name: 'features',
    label: 'Feature Card',
    type: 'array',
    data: 'object',
    maxItems: 6,
    helperText: 'E-commerce feature cards (recommended: 4)',
    itemSchema: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Your Shop, Everywhere',
        helperText: 'Feature title'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 2,
        required: true,
        placeholder: 'Be visible 24/7. Your products live in the main Shop tab where users browse anytime and directly on your profile for instant sales.',
        helperText: 'Feature description'
      },
      {
        name: 'stat',
        label: 'Stat Value',
        type: 'text',
        required: true,
        placeholder: '24/7',
        helperText: 'Large stat number or text'
      },
      {
        name: 'statLabel',
        label: 'Stat Label',
        type: 'text',
        required: true,
        placeholder: 'Visibility',
        helperText: 'Label below the stat'
      }
    ]
  },

  // CTA Object
  {
    name: 'cta.badge',
    label: 'CTA Badge Text',
    type: 'text',
    placeholder: 'Limited Time Offer',
    helperText: 'Badge displayed above the CTA'
  },
  {
    name: 'cta.title',
    label: 'CTA Title',
    type: 'text',
    required: true,
    placeholder: 'Join Now, Pay Less',
    helperText: 'Main CTA heading'
  },
  {
    name: 'cta.subtitle',
    label: 'CTA Subtitle',
    type: 'text',
    required: true,
    placeholder: 'Sign up today and benefit from introductory platform fees.',
    helperText: 'Supporting text for the CTA'
  },
  {
    name: 'cta.buttonText',
    label: 'CTA Button Text',
    type: 'text',
    required: true,
    placeholder: 'Start Selling',
    helperText: 'Text for the CTA button'
  },
  {
    name: 'cta.buttonLink',
    label: 'CTA Button Link',
    type: 'url',
    required: true,
    placeholder: 'https://crm.glamlink.net',
    helperText: 'URL the button links to'
  },
  {
    name: 'cta.disclaimer',
    label: 'CTA Disclaimer',
    type: 'text',
    placeholder: 'No setup fees • Instant approval • Cancel anytime',
    helperText: 'Small print below the button'
  }
];
