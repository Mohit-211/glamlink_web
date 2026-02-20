/**
 * AI Configuration for RichContent Content Block
 * Rich text content with optional drop cap and styling
 */

export interface RichContentConfig {
  type: 'RichContent';
  displayName: 'Rich Content';
  description: 'Rich text content with title and styling options';
  category: 'shared';
  complexity: 'medium';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Title';
      description: 'Section title or heading';
    };
    titleTag: {
      aiEnabled: boolean;
      type: 'select';
      displayName: 'Title Tag';
      description: 'HTML tag for the title';
      options: string[];
    };
    content: {
      aiEnabled: boolean;
      type: 'html';
      displayName: 'Content';
      description: 'Main rich text content';
    };
    enableDropCap: {
      aiEnabled: boolean;
      type: 'checkbox';
      displayName: 'Enable Drop Cap';
      description: 'Enable decorative first letter';
    };
    dropCapStyle: {
      aiEnabled: boolean;
      type: 'select';
      displayName: 'Drop Cap Style';
      description: 'Style for the drop cap';
      options: string[];
    };
    dropCapColor: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Drop Cap Color';
      description: 'Color for the drop cap';
    };
    backgroundColor: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Background Color';
      description: 'Background color for the content';
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const richContentConfig: RichContentConfig = {
  type: 'RichContent',
  displayName: 'Rich Content',
  description: 'Rich text content with title and styling options',
  category: 'shared',
  complexity: 'medium',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Title',
      description: 'Section title or heading'
    },
    titleTag: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Title Tag',
      description: 'HTML tag for the title',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    },
    content: {
      aiEnabled: true,
      type: 'html',
      displayName: 'Content',
      description: 'Main rich text content'
    },
    enableDropCap: {
      aiEnabled: false,
      type: 'checkbox',
      displayName: 'Enable Drop Cap',
      description: 'Enable decorative first letter'
    },
    dropCapStyle: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Drop Cap Style',
      description: 'Style for the drop cap',
      options: ['classic', 'modern', 'elegant']
    },
    dropCapColor: {
      aiEnabled: false,
      type: 'text',
      displayName: 'Drop Cap Color',
      description: 'Color for the drop cap'
    },
    backgroundColor: {
      aiEnabled: false,
      type: 'text',
      displayName: 'Background Color',
      description: 'Background color for the content'
    }
  },
  aiPrompts: {
    system: 'You are a content writer creating engaging rich text content for a beauty magazine.',
    examples: [
      'Write an engaging article about the latest beauty trends',
      'Create compelling content about skincare routines',
      'Develop informative text about professional beauty treatments'
    ]
  }
};