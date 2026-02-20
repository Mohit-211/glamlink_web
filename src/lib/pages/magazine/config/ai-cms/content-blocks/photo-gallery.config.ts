/**
 * AI Configuration for PhotoGallery Content Block
 * Photo gallery component with title and image grid
 */

export interface PhotoGalleryConfig {
  type: 'PhotoGallery';
  displayName: 'Photo Gallery';
  description: 'Photo gallery with title and configurable grid layout';
  category: 'shared';
  complexity: 'medium';
  fields: {
    title: {
      aiEnabled: boolean;
      type: 'text';
      displayName: 'Gallery Title';
      description: 'Title for the photo gallery';
    };
    titleTag: {
      aiEnabled: boolean;
      type: 'select';
      displayName: 'Title Tag';
      description: 'HTML tag for the title';
      options: string[];
    };
    titleTypography: {
      aiEnabled: boolean;
      type: 'object';
      displayName: 'Title Typography';
      description: 'Typography settings for the title';
    };
    photos: {
      aiEnabled: boolean;
      type: 'array';
      displayName: 'Photos';
      description: 'Array of photo objects with images and captions';
      itemFields: {
        image: {
          aiEnabled: boolean;
          type: 'image';
          displayName: 'Image';
          description: 'Photo image';
        };
        caption: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Caption';
          description: 'Photo caption or description';
        };
        title: {
          aiEnabled: boolean;
          type: 'text';
          displayName: 'Photo Title';
          description: 'Title for the photo';
        };
      };
    };
    columns: {
      aiEnabled: boolean;
      type: 'select';
      displayName: 'Columns';
      description: 'Number of columns in the gallery';
      options: string[];
    };
    imageStyling: {
      aiEnabled: boolean;
      type: 'select';
      displayName: 'Image Styling';
      description: 'How images should be displayed';
      options: string[];
    };
  };
  aiPrompts: {
    system: string;
    examples: string[];
  };
}

export const photoGalleryConfig: PhotoGalleryConfig = {
  type: 'PhotoGallery',
  displayName: 'Photo Gallery',
  description: 'Photo gallery with title and configurable grid layout',
  category: 'shared',
  complexity: 'medium',
  fields: {
    title: {
      aiEnabled: true,
      type: 'text',
      displayName: 'Gallery Title',
      description: 'Title for the photo gallery'
    },
    titleTag: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Title Tag',
      description: 'HTML tag for the title',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    },
    titleTypography: {
      aiEnabled: false,
      type: 'object',
      displayName: 'Title Typography',
      description: 'Typography settings for the title'
    },
    photos: {
      aiEnabled: true,
      type: 'array',
      displayName: 'Photos',
      description: 'Array of photo objects with images and captions',
      itemFields: {
        image: {
          aiEnabled: false,
          type: 'image',
          displayName: 'Image',
          description: 'Photo image'
        },
        caption: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Caption',
          description: 'Photo caption or description'
        },
        title: {
          aiEnabled: true,
          type: 'text',
          displayName: 'Photo Title',
          description: 'Title for the photo'
        }
      }
    },
    columns: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Columns',
      description: 'Number of columns in the gallery',
      options: ['1', '2', '3', '4', 'responsive']
    },
    imageStyling: {
      aiEnabled: false,
      type: 'select',
      displayName: 'Image Styling',
      description: 'How images should be displayed',
      options: ['auto-height', 'same-height', 'square']
    }
  },
  aiPrompts: {
    system: 'You are creating photo gallery content for a beauty magazine, including titles and captions.',
    examples: [
      'Create captions and titles for a gallery of beauty transformations',
      'Generate descriptive text for a photo gallery of professional work',
      'Write engaging captions for a collection of product photos'
    ]
  }
};