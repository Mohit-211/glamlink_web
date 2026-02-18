/**
 * Section Props Configuration - Profile Sections
 *
 * Configuration for profile-related sections:
 * - Bio (simple, preview)
 * - Header and Bio
 * - About Me
 */

import { UnifiedPropField } from './types';

// =============================================================================
// BIO SIMPLE SECTION
// =============================================================================

export const BIO_SIMPLE_PROPS: UnifiedPropField[] = [
  {
    key: 'showProfileImage',
    label: 'Show Profile Image',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display the profile image in the bio section',
  },
  {
    key: 'showTitle',
    label: 'Show Title/Occupation',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display the professional title/occupation',
  },
];

// =============================================================================
// BIO PREVIEW SECTION
// =============================================================================

export const BIO_PREVIEW_PROPS: UnifiedPropField[] = [
  {
    key: 'showProfileImage',
    label: 'Show Profile Image',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display the profile image in the bio section',
  },
  {
    key: 'showTitle',
    label: 'Show Title/Occupation',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display the professional title/occupation',
  },
  {
    key: 'truncateBio',
    label: 'Truncate Bio',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Truncate long bio text with ellipsis',
  },
];

// =============================================================================
// HEADER AND BIO SECTION
// =============================================================================

export const HEADER_AND_BIO_PROPS: UnifiedPropField[] = [
  {
    key: 'showProfileImage',
    label: 'Show Profile Image',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display the profile image in the bio section',
  },
  {
    key: 'imageSize',
    label: 'Profile Image Size',
    type: 'select',
    defaultValue: 'medium',
    options: [
      { value: 'small', label: 'Small (60px)' },
      { value: 'medium', label: 'Medium (80px)' },
      { value: 'large', label: 'Large (120px)' },
      { value: 'fullWidth', label: 'Full Width (160px centered)' },
    ],
    helperText: 'Size of the profile image. Full Width centers the image with info below.',
    showWhen: (props) => props.showProfileImage !== false,
  },
  {
    key: 'displayedContent',
    label: 'Displayed Content',
    type: 'toggleGroup',
    helperText: 'Toggle which elements are shown in the header',
    toggles: [
      { key: 'showVerifiedBadge', label: 'Badge', defaultValue: true },
      { key: 'showName', label: 'Name', defaultValue: true },
      { key: 'showTitle', label: 'Title', defaultValue: true },
      { key: 'showCompany', label: 'Company', defaultValue: true },
      { key: 'showSocialLinks', label: 'Socials', defaultValue: true },
    ],
  },
];

// =============================================================================
// ABOUT ME SECTION
// =============================================================================

export const ABOUT_ME_PROPS: UnifiedPropField[] = [
  {
    key: 'showProfileImage',
    label: 'Show Profile Image',
    type: 'checkbox',
    defaultValue: true,
    helperText: 'Display the profile image',
  },
];

// =============================================================================
// PROFILE SECTIONS CONFIG EXPORT
// =============================================================================

/**
 * Profile sections configuration object
 * Maps section type IDs to their prop configurations
 */
export const PROFILE_SECTIONS_CONFIG: Record<string, UnifiedPropField[]> = {
  'bio-simple': BIO_SIMPLE_PROPS,
  'bio-preview': BIO_PREVIEW_PROPS,
  'headerAndBio': HEADER_AND_BIO_PROPS,
  'about-me': ABOUT_ME_PROPS,
};
