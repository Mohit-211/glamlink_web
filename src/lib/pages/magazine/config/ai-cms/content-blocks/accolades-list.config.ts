/**
 * AI Configuration for AccoladesList Content Block
 * Based on the component definition in content-discovery/cover-pro-feature.ts
 */

export interface AccoladesListConfig {
  type: 'AccoladesList';
  displayName: 'Accolades List';
  description: 'List of achievements and awards';
  category: 'cover-pro-feature';
  complexity: 'medium';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Section Title';
      description: 'Title for the achievements section';
    };
    titleTag: {
      aiEnabled: boolean;
      type: 'select';
      displayName: 'Heading Tag';
      description: 'HTML heading tag for the title';
    };
    accolades: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Accolades';
      description: 'List of achievements and awards';
      itemFields: {
        accolade: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Achievement';
          description: 'Individual achievement or award';
        };
      };
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const accoladesListConfig: AccoladesListConfig = {
  type: 'AccoladesList',
  displayName: 'Accolades List',
  description: 'List of achievements and awards',
  category: 'cover-pro-feature',
  complexity: 'medium',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Section Title',
      description: 'Title for the achievements section'
    },
    titleTag: {
      aiEnabled: false, // HTML tags not typically AI-generated
      type: 'select',
      displayName: 'Heading Tag',
      description: 'HTML heading tag for the title'
    },
    accolades: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Accolades',
      description: 'List of achievements and awards',
      itemFields: {
        accolade: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Achievement',
          description: 'Individual achievement or award'
        }
      }
    }
  },
  aiPrompts: {
    system: 'You are creating a list of professional achievements and accolades for a beauty industry professional. Focus on impressive, credible accomplishments that demonstrate expertise and recognition in the field.',
    examples: [
      'Generate professional achievements for a beauty entrepreneur',
      'Create accolades list for a makeup artist',
      'Add achievements for a skincare specialist',
      'Generate awards and recognition for beauty professional'
    ]
  }
};