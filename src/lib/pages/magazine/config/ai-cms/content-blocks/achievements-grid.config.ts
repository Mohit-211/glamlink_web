/**
 * AI Configuration for AchievementsGrid Content Block
 * Based on the component definition in content-discovery/rising-star.ts
 */

export interface AchievementsGridConfig {
  type: 'AchievementsGrid';
  displayName: 'Achievements Grid';
  description: 'Grid of achievements and milestones';
  category: 'rising-star';
  complexity: 'high';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Achievements Title';
      description: 'Title for the achievements section';
    };
    accolades: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Achievements';
      description: 'List of achievements and recognitions';
      itemFields: {
        title: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Achievement Title';
          description: 'Title or headline of the achievement';
        };
        description: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Achievement Description';
          description: 'Optional description of the achievement';
        };
        icon: {
          aiEnabled: boolean;
          type: 'select';
          displayName: 'Achievement Icon';
          description: 'Icon representing the achievement';
        };
      };
    };
    bgClassName: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Background Color';
      description: 'Background color or gradient for the section';
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const achievementsGridConfig: AchievementsGridConfig = {
  type: 'AchievementsGrid',
  displayName: 'Achievements Grid',
  description: 'Grid of achievements and milestones',
  category: 'rising-star',
  complexity: 'high',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Achievements Title',
      description: 'Title for the achievements section'
    },
    accolades: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Achievements',
      description: 'List of achievements and recognitions',
      itemFields: {
        title: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Achievement Title',
          description: 'Title or headline of the achievement'
        },
        description: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Achievement Description',
          description: 'Optional description of the achievement'
        },
        icon: {
          aiEnabled: true,
          type: 'select',
          displayName: 'Achievement Icon',
          description: 'Icon representing the achievement'
        }
      }
    },
    bgClassName: {
      aiEnabled: false, // Background styling not typically AI-generated
      type: 'text',
      displayName: 'Background Color',
      description: 'Background color or gradient for the section'
    }
  },
  aiPrompts: {
    system: 'You are creating an achievements grid for a rising star in the beauty industry. Focus on impressive, credible accomplishments that demonstrate growth, recognition, and impact in their field.',
    examples: [
      'Generate 6 achievements for a rising beauty entrepreneur',
      'Create accomplishments for a young makeup artist',
      'Add achievements for skincare specialist under 30',
      'Generate recognition milestones for beauty influencer'
    ]
  }
};