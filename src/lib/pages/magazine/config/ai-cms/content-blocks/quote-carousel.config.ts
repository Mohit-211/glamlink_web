/**
 * AI Configuration for QuoteCarousel Content Block
 * Carousel component displaying inspirational quotes
 */

export interface QuoteCarouselConfig {
  type: 'QuoteCarousel';
  displayName: 'Quote Carousel';
  description: 'Carousel of inspirational quotes with theme and styling options';
  category: 'editorial';
  complexity: 'medium';
  fields: {
    theme: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Theme';
      description: 'Theme or category for the quotes';
    };
    backgroundColor: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Background Color';
      description: 'Background color for the carousel';
    };
    textColor: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Text Color';
      description: 'Color for the quote text';
    };
    showAuthor: {
      aiEnabled: boolean;
      type: 'checkbox';
      displayName: 'Show Author';
      description: 'Whether to display quote authors';
    };
    quotes: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Quotes';
      description: 'Array of inspirational quotes';
      itemFields: {
        text: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Quote Text';
          description: 'The inspirational quote text';
        };
        author: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Author';
          description: 'Author of the quote';
        };
        category: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Category';
          description: 'Category or theme of the quote';
        };
        backgroundColor: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Quote Background';
          description: 'Background color for individual quote';
        };
      };
    };
    autoplay: {
      aiEnabled: boolean;
      type: 'checkbox';
      displayName: 'Autoplay';
      description: 'Whether the carousel should autoplay';
    };
    interval: {
      aiEnabled: boolean;
      type: 'number';
      displayName: 'Interval';
      description: 'Time between slides in milliseconds';
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const quoteCarouselConfig: QuoteCarouselConfig = {
  type: 'QuoteCarousel',
  displayName: 'Quote Carousel',
  description: 'Carousel of inspirational quotes with theme and styling options',
  category: 'editorial',
  complexity: 'medium',
  fields: {
    theme: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Theme',
      description: 'Theme or category for the quotes'
    },
    backgroundColor: {
      aiEnabled: false,
      type: 'text',
      displayName: 'Background Color',
      description: 'Background color for the carousel'
    },
    textColor: {
      aiEnabled: false,
      type: 'text',
      displayName: 'Text Color',
      description: 'Color for the quote text'
    },
    showAuthor: {
      aiEnabled: false,
      type: 'checkbox',
      displayName: 'Show Author',
      description: 'Whether to display quote authors'
    },
    quotes: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Quotes',
      description: 'Array of inspirational quotes',
      itemFields: {
        text: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Quote Text',
          description: 'The inspirational quote text'
        },
        author: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Author',
          description: 'Author of the quote'
        },
        category: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Category',
          description: 'Category or theme of the quote'
        },
        backgroundColor: {
          aiEnabled: false,
          type: 'text',
          displayName: 'Quote Background',
          description: 'Background color for individual quote'
        }
      }
    },
    autoplay: {
      aiEnabled: false,
      type: 'checkbox',
      displayName: 'Autoplay',
      description: 'Whether the carousel should autoplay'
    },
    interval: {
      aiEnabled: false,
      type: 'number',
      displayName: 'Interval',
      description: 'Time between slides in milliseconds'
    }
  },
  aiPrompts: {
    system: 'You are creating inspirational quotes for a beauty magazine, focusing on empowerment, self-care, and beauty.',
    examples: [
      'Generate inspirational quotes about beauty and self-confidence',
      'Create motivational quotes for beauty professionals',
      'Write empowering quotes about self-care and wellness'
    ]
  }
};