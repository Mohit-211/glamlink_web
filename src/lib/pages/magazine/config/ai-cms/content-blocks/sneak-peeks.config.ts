/**
 * AI Configuration for SneakPeeks Content Block
 * Based on the component definition in content-discovery/whats-new-glamlink.ts
 */

export interface SneakPeeksConfig {
  type: 'SneakPeeks';
  displayName: 'Sneak Peeks';
  description: 'Preview of upcoming features with release dates';
  category: 'whats-new-glamlink';
  complexity: 'medium';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Section Title';
      description: 'The main title for the sneak peeks section';
    };
    titleIcon: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Title Icon';
      description: 'Emoji or icon for the section title';
    };
    titleTag: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Heading Tag';
      description: 'HTML heading tag (h1, h2, h3, etc.)';
    };
    'titleTypography.fontSize': {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Font Size';
      description: 'CSS font size classes';
    };
    'titleTypography.fontFamily': {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Font Family';
      description: 'CSS font family';
    };
    'titleTypography.fontWeight': {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Font Weight';
      description: 'CSS font weight';
    };
    'titleTypography.color': {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Text Color';
      description: 'CSS text color classes';
    };
    'peeks': {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Sneak Peeks';
      description: 'Array of upcoming feature previews';
      itemFields: {
        title: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Feature Title';
          description: 'Name of the upcoming feature';
        };
        releaseDate: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Release Date';
          description: 'When the feature will be released';
        };
        teaser: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Teaser Description';
          description: 'Brief description of what the feature will do';
        };
      };
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const sneakPeeksConfig: SneakPeeksConfig = {
  type: 'SneakPeeks',
  displayName: 'Sneak Peeks',
  description: 'Preview of upcoming features with release dates',
  category: 'whats-new-glamlink',
  complexity: 'medium',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Section Title',
      description: 'The main title for the sneak peeks section'
    },
    titleIcon: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Title Icon',
      description: 'Emoji or icon for the section title'
    },
    titleTag: {
      aiEnabled: false, // Usually not changed by AI
      type: 'text',
      displayName: 'Heading Tag',
      description: 'HTML heading tag (h1, h2, h3, etc.)'
    },
    'titleTypography.fontSize': {
      aiEnabled: false, // Typography usually not changed by AI
      type: 'text',
      displayName: 'Font Size',
      description: 'CSS font size classes'
    },
    'titleTypography.fontFamily': {
      aiEnabled: false,
      type: 'text',
      displayName: 'Font Family',
      description: 'CSS font family'
    },
    'titleTypography.fontWeight': {
      aiEnabled: false,
      type: 'text',
      displayName: 'Font Weight',
      description: 'CSS font weight'
    },
    'titleTypography.color': {
      aiEnabled: false,
      type: 'text',
      displayName: 'Text Color',
      description: 'CSS text color classes'
    },
    'peeks': {
      aiEnabled: true,
      type: 'array',
      displayName: 'Sneak Peeks',
      description: 'Array of upcoming feature previews',
      itemFields: {
        title: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Feature Title',
          description: 'Name of the upcoming feature'
        },
        releaseDate: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Release Date',
          description: 'When the feature will be released'
        },
        teaser: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Teaser Description',
          description: 'Brief description of what the feature will do'
        }
      }
    }
  },
  aiPrompts: {
    system: 'You are editing a sneak peeks section for upcoming beauty platform features. Focus on creating excitement about future releases while being realistic about timelines.',
    examples: [
      'Add 3 upcoming features with realistic release dates',
      'Update teasers to be more compelling and specific',
      'Add release dates for features coming in 2025',
      'Improve feature titles to be more descriptive'
    ]
  }
};