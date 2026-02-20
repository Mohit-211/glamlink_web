/**
 * AI Configuration for FeatureList Content Block
 * Based on the component definition in content-discovery/whats-new-glamlink.ts
 */

export interface FeatureListConfig {
  type: 'FeatureList';
  displayName: 'Feature List';
  description: 'List of new features or updates with icons and descriptions';
  category: 'whats-new-glamlink';
  complexity: 'medium';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Section Title';
      description: 'The main title for the feature list section';
    };
    'features': {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Features';
      description: 'Array of feature objects';
      itemFields: {
        icon: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Icon';
          description: 'Emoji or icon for the feature';
        };
        title: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Feature Title';
          description: 'Name or headline of the feature';
        };
        description: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Description';
          description: 'Detailed description of the feature';
        };
        availability: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Availability';
          description: 'When the feature is available (e.g., "Now Live", "Coming Soon")';
        };
      };
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const featureListConfig: FeatureListConfig = {
  type: 'FeatureList',
  displayName: 'Feature List',
  description: 'List of new features or updates with icons and descriptions',
  category: 'whats-new-glamlink',
  complexity: 'medium',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Section Title',
      description: 'The main title for the feature list section'
    },
    'features': {
      aiEnabled: true,
      type: 'array',
      displayName: 'Features',
      description: 'Array of feature objects',
      itemFields: {
        icon: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Icon',
          description: 'Emoji or icon for the feature'
        },
        title: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Feature Title',
          description: 'Name or headline of the feature'
        },
        description: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Description',
          description: 'Detailed description of the feature'
        },
        availability: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Availability',
          description: 'When the feature is available (e.g., "Now Live", "Coming Soon")'
        }
      }
    }
  },
  aiPrompts: {
    system: 'You are editing a feature list for a beauty platform. Focus on clear, compelling descriptions of new features and updates that would appeal to beauty professionals and clients.',
    examples: [
      'Add 2 new features for beauty professionals',
      'Update feature descriptions to be more engaging',
      'Add availability dates for upcoming features',
      'Improve feature titles and descriptions for better clarity'
    ]
  }
};