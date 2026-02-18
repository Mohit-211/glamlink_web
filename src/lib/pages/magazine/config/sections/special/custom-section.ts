import { SectionSchema } from '../types';

export const customSectionSchema: SectionSchema = {
  id: 'custom-section',
  label: 'Custom Content',
  category: 'special',
  description: 'Build your own section by combining different content components',
  icon: '🎨',
  fields: [
    {
      name: 'urlSlug',
      label: 'URL Slug',
      type: 'text',
      placeholder: 'e.g., the-glam-drop, features, pro-tips',
      helperText: 'URL-friendly identifier for direct access (e.g., /magazine/issue-1/the-glam-drop). Use lowercase letters, numbers, and hyphens only.',
      validation: {
        pattern: '^[a-z0-9-]+$'
      }
    },
    {
      name: 'layout',
      label: 'Layout Style',
      type: 'select',
      options: [
        { value: 'single-column', label: 'Single Column' },
        { value: 'two-column', label: 'Two Column (Grid)' },
        { value: 'grid', label: 'Grid (3 columns)' },
        { value: 'masonry', label: 'Masonry (Auto Flow)' },
        { value: 'flex-columns', label: 'Flex Columns (Manual Assignment)' },
        { value: 'float-columns', label: 'Compact Columns (Float)' },
      ],
      defaultValue: 'single-column',
    },
    {
      name: 'spacing',
      label: 'Content Spacing',
      type: 'select',
      options: [
        { value: 'compact', label: 'Compact' },
        { value: 'normal', label: 'Normal' },
        { value: 'spacious', label: 'Spacious' },
      ],
      defaultValue: 'normal',
      advanced: true,
    },
    {
      name: 'masonryColumns',
      label: 'Number of Columns',
      type: 'select',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
      ],
      defaultValue: '2',
      helperText: 'Number of columns for masonry layout',
      showIf: (formData: any) => formData.layout === 'masonry',
      advanced: true,
    },
    {
      name: 'gridFlow',
      label: 'Grid Fill Mode',
      type: 'select',
      options: [
        { value: 'row', label: 'Row (Default - Leave gaps)' },
        { value: 'dense', label: 'Dense (Fill gaps automatically)' },
      ],
      defaultValue: 'row',
      helperText: 'Dense mode fills gaps in the grid automatically, useful when items have different heights',
      showIf: (formData: any) => formData.layout === 'two-column' || formData.layout === 'grid',
      advanced: true,
    },
    {
      name: 'sectionBackground',
      label: 'Section Background Color',
      type: 'text',
      placeholder: 'e.g., bg-gray-50 or #f5f5f5',
      advanced: true,
    },
    {
      name: 'sectionBorder',
      label: 'Show Bottom Border',
      type: 'checkbox',
      defaultValue: false,
      advanced: true,
    },
    {
      name: 'column1Width',
      label: 'Column 1 Width (%)',
      type: 'number',
      placeholder: '50',
      helperText: 'Width percentage for column 1',
      showIf: (formData: any) => formData.layout === 'flex-columns',
      inline: true,
      inlineGroup: 'columnWidths',
      advanced: true,
    },
    {
      name: 'column2Width',
      label: 'Column 2 Width (%)',
      type: 'number',
      placeholder: '50',
      helperText: 'Width percentage for column 2',
      showIf: (formData: any) => formData.layout === 'flex-columns',
      inline: true,
      inlineGroup: 'columnWidths',
      advanced: true,
    },
    {
      name: 'column3Width',
      label: 'Column 3 Width (%)',
      type: 'number',
      placeholder: '0',
      helperText: 'Width percentage for column 3 (optional)',
      showIf: (formData: any) => formData.layout === 'flex-columns',
      inline: true,
      inlineGroup: 'columnWidths',
      advanced: true,
    },
    {
      name: 'floatBreakpoint',
      label: 'Apply Floats At',
      type: 'select',
      options: [
        { value: 'always', label: 'Always (All Screen Sizes)' },
        { value: 'xs', label: 'Extra Small (490px+) - Small Mobile and Up' },
        { value: 'sm', label: 'Small (640px+) - Mobile and Up' },
        { value: 'md', label: 'Medium (768px+) - Tablet and Up' },
        { value: 'lg', label: 'Large (1024px+) - Desktop and Up' },
        { value: 'xl', label: 'Extra Large (1280px+) - Large Desktop' },
        { value: 'never', label: 'Never (Disable Floats)' }
      ],
      defaultValue: 'sm',
      showIf: (formData: any) => formData.layout === 'float-columns',
      helperText: 'Choose minimum screen size for float layout. Below this size, content will stack vertically.',
    },
    {
      name: 'contentBlocks',
      label: 'Content Blocks & Layout',
      type: 'custom-blocks',
      placeholder: 'Configure header layout and content blocks',
      helperText: 'Manage header components and content blocks in one place',
    },
  ],
  template: {
    type: 'custom-section',
    urlSlug: '',
    sectionTitle: '',
    sectionSubtitle: '',
    sectionDescription: '',
    layout: 'single-column',
    spacing: 'normal',
    gridFlow: 'row',
    sectionBackground: '',
    sectionBorder: false,
    headerLayout: 'default',
    headerInlineComponent: undefined,
    contentBlocks: [],
  }
};

// Example templates for custom sections
export const customSectionExamples = [
  {
    name: 'Product Showcase',
    description: 'Display products with details and gallery',
    data: {
        type: 'custom-section',
        sectionTitle: 'Featured Products',
        sectionSubtitle: 'Handpicked for You',
        layout: 'grid',
        spacing: 'normal',
        contentBlocks: [
          {
            id: 'block-1',
            type: 'ProductDetails',
            category: 'top-product-spotlight',
            enabled: true,
            order: 0,
            props: {
              productName: 'Luxury Face Cream',
              price: '$89.99',
              description: 'Premium anti-aging formula',
            },
          },
          {
            id: 'block-2',
            type: 'SimilarProducts',
            category: 'top-product-spotlight',
            enabled: true,
            order: 1,
            props: {
              title: 'You May Also Like',
              products: [],
            },
          },
        ]
      }
    },
    {
      name: 'Photo Story',
      description: 'Tell a story with images and captions',
      data: {
        type: 'custom-section',
        sectionTitle: 'Behind the Scenes',
        layout: 'single-column',
        spacing: 'spacious',
        contentBlocks: [
          {
            id: 'block-1',
            type: 'PhotoGallery',
            category: 'shared',
            enabled: true,
            order: 0,
            props: {
              title: 'The Journey',
              columns: 2,
              photos: [],
            },
          },
          {
            id: 'block-2',
            type: 'RichContent',
            category: 'shared',
            enabled: true,
            order: 1,
            props: {
              content: '<p>Tell your story here...</p>',
            },
          }
        ]
      }
    }
];