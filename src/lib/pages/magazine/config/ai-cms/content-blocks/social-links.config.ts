/**
 * AI Configuration for SocialLinks Content Block
 * Social media links component with title and link array
 */

export interface SocialLinksConfig {
  type: 'SocialLinks';
  displayName: 'Social Links';
  description: 'Social media links with title and configurable styling';
  category: 'shared';
  complexity: 'low';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Section Title';
      description: 'Title for the social links section';
    };
    titleTypography: {
      aiEnabled: boolean;
      type: 'object';
      displayName: 'Title Typography';
      description: 'Typography settings for the title';
    };
    backgroundColor: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Background Color';
      description: 'Background color for the section';
    };
    links: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Social Links';
      description: 'Array of social media links';
      itemFields: {
        platform: {
          aiEnabled: boolean;
          type: 'select';
          displayName: 'Platform';
          description: 'Social media platform';
          options: string[];
        };
        url: {
          aiEnabled: boolean;
          type: 'url';
          displayName: 'URL';
          description: 'Link to the social media profile';
        };
        handle: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Handle';
          description: 'Username or handle for the platform';
        };
        displayText: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Display Text';
          description: 'Text to display for the link';
        };
      };
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const socialLinksConfig: SocialLinksConfig = {
  type: 'SocialLinks',
  displayName: 'Social Links',
  description: 'Social media links with title and configurable styling',
  category: 'shared',
  complexity: 'low',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Section Title',
      description: 'Title for the social links section'
    },
    titleTypography: {
      aiEnabled: false,
      type: 'object',
      displayName: 'Title Typography',
      description: 'Typography settings for the title'
    },
    backgroundColor: {
      aiEnabled: false,
      type: 'text',
      displayName: 'Background Color',
      description: 'Background color for the section'
    },
    links: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Social Links',
      description: 'Array of social media links',
      itemFields: {
        platform: {
          aiEnabled: false,
          type: 'select',
          displayName: 'Platform',
          description: 'Social media platform',
          options: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Website']
        },
        url: {
          aiEnabled: false,
          type: 'url',
          displayName: 'URL',
          description: 'Link to the social media profile'
        },
        handle: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Handle',
          description: 'Username or handle for the platform'
        },
        displayText: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Display Text',
          description: 'Text to display for the link'
        }
      }
    }
  },
  aiPrompts: {
    system: 'You are creating social media link sections for beauty professionals and brands.',
    examples: [
      'Generate compelling titles and display text for social media links',
      'Create engaging calls-to-action for following social media profiles',
      'Write inviting text for connecting with beauty professionals online'
    ]
  }
};