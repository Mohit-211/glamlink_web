import type { VisibilityOption, PrivacyCategory, PrivacySettings } from './types';

export const VISIBILITY_OPTIONS: VisibilityOption[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can view your brand profile',
    icon: 'Globe',
  },
  {
    value: 'unlisted',
    label: 'Unlisted',
    description: 'Only people with the link can view your profile',
    icon: 'Link',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can view your brand profile',
    icon: 'Lock',
  },
];

export const PRIVACY_CATEGORIES: PrivacyCategory[] = [
  {
    id: 'visibility',
    name: 'Profile Visibility',
    description: 'Control who can find and view your brand',
    settings: [
      {
        id: 'profileVisibility',
        label: 'Profile visibility',
        description: 'Choose who can see your brand profile',
        type: 'select',
        options: VISIBILITY_OPTIONS,
      },
      {
        id: 'searchVisibility',
        label: 'Search visibility',
        description: 'Allow your brand to appear in marketplace search results',
        type: 'toggle',
        warning: 'Hiding from search may reduce customer discovery',
      },
    ],
  },
  {
    id: 'activity',
    name: 'Activity & Status',
    description: 'Control visibility of your online status',
    settings: [
      {
        id: 'showActivityStatus',
        label: 'Show online status',
        description: 'Display when you are currently online',
        type: 'toggle',
      },
      {
        id: 'showLastActive',
        label: 'Show last active',
        description: 'Display when you were last active on the platform',
        type: 'toggle',
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact Information',
    description: 'Control what contact details are visible',
    settings: [
      {
        id: 'hideEmail',
        label: 'Hide email address',
        description: 'Do not display your email on your public profile',
        type: 'toggle',
      },
      {
        id: 'hidePhone',
        label: 'Hide phone number',
        description: 'Do not display your phone number publicly',
        type: 'toggle',
      },
      {
        id: 'hideAddress',
        label: 'Hide full address',
        description: 'Only show city/region instead of full address',
        type: 'toggle',
      },
    ],
  },
  {
    id: 'social',
    name: 'Social & Engagement',
    description: 'Control how customers can interact with you',
    settings: [
      {
        id: 'allowMessages',
        label: 'Allow direct messages',
        description: 'Let customers send you direct messages',
        type: 'toggle',
      },
      {
        id: 'allowReviews',
        label: 'Allow reviews',
        description: 'Let customers leave reviews on your brand',
        type: 'toggle',
        warning: 'Disabling reviews may affect customer trust',
      },
      {
        id: 'showReviewCount',
        label: 'Show review count',
        description: 'Display total number of reviews on your profile',
        type: 'toggle',
      },
    ],
  },
];

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisibility: 'public',
  searchVisibility: 'visible',
  showActivityStatus: true,
  showLastActive: true,
  hideEmail: false,
  hidePhone: true,
  hideAddress: false,
  showCityOnly: false,
  allowMessages: true,
  allowReviews: true,
  showReviewCount: true,
  hideFromAnalytics: false,
};
