/**
 * Digital Card Page - Section Field Configurations
 *
 * Field configurations for CMS editing of digital card page sections.
 */

import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Digital Card Hero Section
 *
 * Single card layout with text content on left, video preview on right.
 * Includes:
 * - Headline and description
 * - Platform section title and description
 * - Video preview paths
 * - CTA button text
 */
export const digitalCardHeroFieldConfig: FieldConfig[] = [
  {
    name: 'headline',
    label: 'Headline',
    type: 'text',
    required: true,
    placeholder: 'The Link in Bio, Evolved.',
    helperText: 'Main headline displayed at the top of the card'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'html',
    required: true,
    placeholder: 'Your digital presence should be as refined as your craft...',
    helperText: 'Full paragraph about the Glam Card value proposition. Use bold for key terms.'
  },
  {
    name: 'platformTitle',
    label: 'Platform Section Title',
    type: 'text',
    required: true,
    placeholder: 'Powered by Glamlink. Built for the Beauty + Wellness Pro.',
    helperText: 'Secondary headline for the Glamlink platform section'
  },
  {
    name: 'platformDescription',
    label: 'Platform Section Description',
    type: 'html',
    required: true,
    placeholder: 'The Glam Card is your front door; Glamlink is your powerhouse...',
    helperText: 'Full paragraph about the Glamlink platform ecosystem. Use bold for key terms.'
  },
  {
    name: 'gifData.stillSrc',
    label: 'Preview Image (Still)',
    type: 'image',
    required: true,
    contentType: 'professional',
    helperText: 'Static preview image shown before hover'
  },
  {
    name: 'gifData.gifSrc',
    label: 'Preview Video/GIF',
    type: 'video',
    required: true,
    helperText: 'Animated video/GIF shown on hover'
  },
  {
    name: 'gifData.alt',
    label: 'Preview Alt Text',
    type: 'text',
    required: true,
    placeholder: 'Glam Card digital business card demonstration',
    helperText: 'Accessibility description for the preview media'
  },
  {
    name: 'ctaText',
    label: 'CTA Button Text',
    type: 'text',
    required: true,
    placeholder: 'Apply for Your Glam Card',
    helperText: 'Text displayed on the call-to-action button'
  }
];

/**
 * Field configuration for Digital Card Final CTA Section
 *
 * Includes:
 * - Title and subtitle
 * - Primary button (scroll to form)
 * - Secondary button (external link)
 * - Disclaimer text
 */
export const digitalCardFinalCtaFieldConfig: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Ready to Get Your Digital Card?',
    helperText: 'Main heading for the final CTA section'
  },
  {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'Join our network of beauty professionals and get discovered by clients.',
    helperText: 'Supporting text below the title'
  },
  {
    name: 'primaryButton.text',
    label: 'Primary Button Text',
    type: 'text',
    required: true,
    placeholder: 'Apply for Digital Card',
    helperText: 'Text for the main CTA button (scrolls to form)'
  },
  {
    name: 'secondaryButton.text',
    label: 'Secondary Button Text',
    type: 'text',
    placeholder: 'Access E-Commerce Panel',
    helperText: 'Text for the secondary button'
  },
  {
    name: 'secondaryButton.link',
    label: 'Secondary Button Link',
    type: 'text',
    placeholder: 'https://crm.glamlink.net',
    helperText: 'URL the secondary button links to'
  },
  {
    name: 'disclaimer',
    label: 'Disclaimer Text',
    type: 'text',
    placeholder: 'Free digital business card • Quick approval • Professional digital presence',
    helperText: 'Small print displayed below the buttons'
  }
];
