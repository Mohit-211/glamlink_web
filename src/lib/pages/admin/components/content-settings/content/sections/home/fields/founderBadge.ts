import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Founder Badge Section
 *
 * Includes:
 * - Badge image
 * - Title
 * - Description
 * - Subtext (call-to-action)
 */
export const founderBadgeFieldConfig: FieldConfig[] = [
  {
    name: 'image',
    label: 'Badge Image',
    type: 'text',
    required: true,
    placeholder: '/images/gold_badge.png',
    helperText: 'URL to the founder badge image'
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Founder Badge (First 100 Only)',
    helperText: 'Main heading for the badge section'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 2,
    required: true,
    placeholder: 'Early professionals get exclusive visibility, permanent perks, and first access to new tools.',
    helperText: 'Description of the founder badge benefits'
  },
  {
    name: 'subtext',
    label: 'Subtext',
    type: 'text',
    placeholder: 'Join now and be recognized as a Founding Member.',
    helperText: 'Additional call-to-action text below description'
  }
];
