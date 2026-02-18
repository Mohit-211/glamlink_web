import type { FieldConfig } from '@/lib/pages/admin/types/forms';

/**
 * Field configuration for Banner
 *
 * Includes:
 * - Enable/disable toggle
 * - Banner message text
 * - Link URL
 * - Color customization
 * - Dismissible flag
 */
export const bannerFieldConfig: FieldConfig[] = [
  {
    name: 'enabled',
    label: 'Enable Banner',
    type: 'checkbox',
    helperText: 'Show or hide the banner on the page'
  },
  {
    name: 'message',
    label: 'Banner Message',
    type: 'text',
    required: true,
    placeholder: 'Download our app today!',
    helperText: 'Message text displayed in the banner'
  },
  {
    name: 'link',
    label: 'Link URL',
    type: 'url',
    placeholder: 'https://example.com',
    helperText: 'Optional link URL for the banner (leave empty for no link)'
  },
  {
    name: 'backgroundColor',
    label: 'Background Color',
    type: 'text',
    placeholder: '#24bbcb',
    helperText: 'Background color (hex code or CSS color name)'
  },
  {
    name: 'textColor',
    label: 'Text Color',
    type: 'text',
    placeholder: '#ffffff',
    helperText: 'Text color (hex code or CSS color name)'
  },
  {
    name: 'dismissible',
    label: 'Allow Users to Dismiss',
    type: 'checkbox',
    helperText: 'Allow users to close/hide the banner'
  }
];
