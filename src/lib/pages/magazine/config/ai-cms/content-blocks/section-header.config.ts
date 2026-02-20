/**
 * AI Configuration for SectionHeader Content Block
 * Header component with title, subtitle and styling options
 */

export interface SectionHeaderConfig {
  type: 'SectionHeader';
  displayName: 'Section Header';
  description: 'Header section with title, subtitle and styling options';
  category: 'shared';
  complexity: 'low';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Title';
      description: 'Main section title';
    };
    subtitle: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Subtitle';
      description: 'Section subtitle or tagline';
    };
    subtitle2: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Second Subtitle';
      description: 'Additional subtitle text';
    };
    titleStyles: {
      aiEnabled: boolean;
      type: 'object';
      displayName: 'Title Styles';
      description: 'Typography styles for the title';
    };
    subtitle2Styles: {
      aiEnabled: boolean;
      type: 'object';
      displayName: 'Subtitle Styles';
      description: 'Typography styles for the subtitle';
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const sectionHeaderConfig: SectionHeaderConfig = {
  type: 'SectionHeader',
  displayName: 'Section Header',
  description: 'Header section with title, subtitle and styling options',
  category: 'shared',
  complexity: 'low',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Title',
      description: 'Main section title'
    },
    subtitle: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Subtitle',
      description: 'Section subtitle or tagline'
    },
    subtitle2: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Second Subtitle',
      description: 'Additional subtitle text'
    },
    titleStyles: {
      aiEnabled: false,
      type: 'object',
      displayName: 'Title Styles',
      description: 'Typography styles for the title'
    },
    subtitle2Styles: {
      aiEnabled: false,
      type: 'object',
      displayName: 'Subtitle Styles',
      description: 'Typography styles for the subtitle'
    }
  },
  aiPrompts: {
    system: 'You are creating compelling section headers for a beauty magazine.',
    examples: [
      'Create an engaging title and subtitle for a beauty section',
      'Generate compelling headers for professional spotlights',
      'Develop catchy titles for product features'
    ]
  }
};