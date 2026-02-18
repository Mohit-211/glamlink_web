import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Two Boxes Section
 *
 * Includes:
 * - Left box (AI Features)
 *   - Title, description, features array, button text
 * - Right box (Founders Badge)
 *   - Title, description, criteria label, criteria array, button text
 */
export const twoBoxesFieldConfig: FieldConfig[] = [
  // Left Box
  {
    name: 'leftBox.title',
    label: 'Left Box Title',
    type: 'text',
    required: true,
    placeholder: 'Lock In Your Profile Before Glamlink AI Goes Live',
    helperText: 'Title for the left box'
  },
  {
    name: 'leftBox.description',
    label: 'Left Box Description',
    type: 'textarea',
    rows: 3,
    required: true,
    placeholder: 'Glamlink is redefining how beauty professionals get discovered. Our upcoming AI will analyze clients needs and match them with the right treatments, products and professionals.',
    helperText: 'Description text for the left box'
  },
  {
    name: 'leftBox.features',
    label: 'Left Box Features',
    type: 'array',
    data: 'string',
    itemType: 'text',
    maxItems: 6,
    placeholder: 'Secure your spot as one of the first pros AI recommends',
    helperText: 'Feature bullet points (max 6)'
  },
  {
    name: 'leftBox.buttonText',
    label: 'Left Box Button Text',
    type: 'text',
    required: true,
    placeholder: 'Join Before AI Launches',
    helperText: 'Text for the left box button'
  },
  // Right Box
  {
    name: 'rightBox.title',
    label: 'Right Box Title',
    type: 'text',
    required: true,
    placeholder: 'Be One Of The 100 Founding Professionals',
    helperText: 'Title for the right box'
  },
  {
    name: 'rightBox.description',
    label: 'Right Box Description',
    type: 'textarea',
    rows: 3,
    required: true,
    placeholder: 'Founding Pros get early visibility, priority features and a badge of authority that sets you apart.',
    helperText: 'Description text for the right box'
  },
  {
    name: 'rightBox.criteriaLabel',
    label: 'Criteria Label',
    type: 'text',
    required: true,
    placeholder: 'Criteria:',
    helperText: 'Label before the criteria list'
  },
  {
    name: 'rightBox.criteria',
    label: 'Right Box Criteria',
    type: 'array',
    data: 'string',
    itemType: 'text',
    maxItems: 6,
    placeholder: 'Complete your profile with at least 2 photo albums with your best work',
    helperText: 'Criteria bullet points (max 6)'
  },
  {
    name: 'rightBox.buttonText',
    label: 'Right Box Button Text',
    type: 'text',
    required: true,
    placeholder: 'Claim Your Founders Badge',
    helperText: 'Text for the right box button'
  }
];
