/**
 * AI Configuration for NumberedTips Content Block
 * Based on the component definition in content-discovery/maries-corner.ts
 */

export interface NumberedTipsConfig {
  type: 'NumberedTips';
  displayName: 'Numbered Tips';
  description: 'List of numbered tips or advice';
  category: 'maries-corner';
  complexity: 'medium';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Section Title';
      description: 'Title for the tips section (use {count} for dynamic count)';
    };
    tips: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Tips List';
      description: 'Array of numbered tips and advice';
      itemFields: {
        number: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Tip Number';
          description: 'Number or identifier for the tip';
        };
        title: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Tip Title';
          description: 'Short title or headline for the tip';
        };
        content: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Tip Description';
          description: 'Detailed description of the tip';
        };
      };
    };
    displayNumbers: {
      aiEnabled: boolean;
      type: 'checkbox';
      displayName: 'Display Numbers';
      description: 'Whether to show numbers on each tip';
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const numberedTipsConfig: NumberedTipsConfig = {
  type: 'NumberedTips',
  displayName: 'Numbered Tips',
  description: 'List of numbered tips or advice',
  category: 'maries-corner',
  complexity: 'medium',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Section Title',
      description: 'Title for the tips section (use {count} for dynamic count)'
    },
    tips: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Tips List',
      description: 'Array of numbered tips and advice',
      itemFields: {
        number: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Tip Number',
          description: 'Number or identifier for the tip'
        },
        title: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Tip Title',
          description: 'Short title or headline for the tip'
        },
        content: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Tip Description',
          description: 'Detailed description of the tip'
        }
      }
    },
    displayNumbers: {
      aiEnabled: false, // UI display options not typically AI-generated
      type: 'checkbox',
      displayName: 'Display Numbers',
      description: 'Whether to show numbers on each tip'
    }
  },
  aiPrompts: {
    system: 'You are creating practical beauty tips for professionals and enthusiasts. Focus on actionable advice that can be easily implemented and provides real value.',
    examples: [
      'Generate 5 professional makeup application tips',
      'Create skincare routine tips for different skin types',
      'Add client consultation tips for beauty professionals',
      'Generate tips for building a successful beauty business'
    ]
  }
};