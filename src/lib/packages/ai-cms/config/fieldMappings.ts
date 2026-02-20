/**
 * Field Mapping Configurations
 * Migrated from /lib/pages/magazine/config/aiFieldMappings.ts
 */

import { FieldDefinition, FieldMappingConfig } from '../types';

export const FIELD_MAPPINGS: FieldMappingConfig = {
  magazine: {
    'basic-info': [
      {
        fieldName: 'title',
        displayName: 'Title',
        fieldType: 'text',
        description: 'Main magazine issue title',
        required: true
      },
      {
        fieldName: 'subtitle', 
        displayName: 'Subtitle',
        fieldType: 'text',
        description: 'Descriptive subtitle for the issue'
      },
      {
        fieldName: 'description',
        displayName: 'Description',
        fieldType: 'html',
        description: 'Detailed description of the magazine issue'
      },
      {
        fieldName: 'editorNote',
        displayName: "Editor's Note",
        fieldType: 'html',
        description: 'Personal note from the editor'
      },
      {
        fieldName: 'editorNoteTocTitle',
        displayName: "Editor's Note TOC Title",
        fieldType: 'text',
        description: 'Custom title for table of contents'
      },
      {
        fieldName: 'editorNoteTocSubtitle',
        displayName: "Editor's Note TOC Subtitle", 
        fieldType: 'text',
        description: 'Custom subtitle for table of contents'
      },
      {
        fieldName: 'coverQuote',
        displayName: 'Cover Quote',
        fieldType: 'html',
        description: 'Quote to display on the cover page'
      },
      // Excluded fields (AI won't modify these)
      {
        fieldName: 'id',
        displayName: 'Issue ID',
        fieldType: 'text',
        exclude: true
      },
      {
        fieldName: 'urlId',
        displayName: 'URL ID',
        fieldType: 'text', 
        exclude: true
      },
      {
        fieldName: 'issueNumber',
        displayName: 'Issue Number',
        fieldType: 'number',
        exclude: true
      },
      {
        fieldName: 'issueDate',
        displayName: 'Issue Date',
        fieldType: 'date',
        exclude: true
      },
      {
        fieldName: 'coverQuotePosition',
        displayName: 'Quote Position',
        fieldType: 'select',
        exclude: true
      }
    ],
    
    'cover-config': [
      {
        fieldName: 'featuredPerson',
        displayName: 'Featured Person',
        fieldType: 'text',
        description: 'Name of the featured person on the cover'
      },
      {
        fieldName: 'featuredTitle',
        displayName: 'Featured Title',
        fieldType: 'text',
        description: 'Title or position of the featured person'
      },
      {
        fieldName: 'coverImageAlt',
        displayName: 'Cover Image Alt Text',
        fieldType: 'text',
        description: 'Accessibility description for the cover image'
      },
      // Excluded fields
      {
        fieldName: 'coverDisplayMode',
        displayName: 'Cover Display Mode',
        fieldType: 'select',
        exclude: true
      },
      {
        fieldName: 'useCoverBackground',
        displayName: 'Use Cover Background',
        fieldType: 'select',
        exclude: true
      },
      {
        fieldName: 'coverImage',
        displayName: 'Cover Image',
        fieldType: 'text',
        exclude: true // Images should not be updated by AI
      },
      {
        fieldName: 'coverBackgroundImage',
        displayName: 'Cover Background Image',
        fieldType: 'text',
        exclude: true // Images should not be updated by AI
      }
    ]
  },
  
  blog: {
    'basic-info': [
      {
        fieldName: 'title',
        displayName: 'Title',
        fieldType: 'text',
        description: 'Blog post title',
        required: true
      },
      {
        fieldName: 'subtitle',
        displayName: 'Subtitle', 
        fieldType: 'text',
        description: 'Blog post subtitle or excerpt'
      },
      {
        fieldName: 'content',
        displayName: 'Content',
        fieldType: 'html',
        description: 'Main blog post content'
      },
      {
        fieldName: 'tags',
        displayName: 'Tags',
        fieldType: 'array',
        description: 'Blog post tags for categorization'
      },
      {
        fieldName: 'metaDescription',
        displayName: 'Meta Description',
        fieldType: 'text',
        description: 'SEO meta description'
      }
    ]
  },
  
  product: {
    'basic-info': [
      {
        fieldName: 'name',
        displayName: 'Product Name',
        fieldType: 'text',
        description: 'Product name',
        required: true
      },
      {
        fieldName: 'description',
        displayName: 'Description',
        fieldType: 'html',
        description: 'Product description'
      },
      {
        fieldName: 'features',
        displayName: 'Features',
        fieldType: 'array',
        description: 'Key product features'
      },
      {
        fieldName: 'benefits',
        displayName: 'Benefits',
        fieldType: 'array',
        description: 'Customer benefits'
      }
    ]
  }
};

// Helper functions
export const getFieldsForContentType = (
  applicationContext: string,
  contentType: string,
  excludeNonUpdatable: boolean = true
): FieldDefinition[] => {
  const fields = FIELD_MAPPINGS[applicationContext]?.[contentType] || [];
  
  if (excludeNonUpdatable) {
    return fields.filter(field => !field.exclude);
  }
  
  return fields;
};

export const getFieldDefinition = (
  applicationContext: string,
  contentType: string,
  fieldName: string
): FieldDefinition | undefined => {
  const fields = FIELD_MAPPINGS[applicationContext]?.[contentType] || [];
  return fields.find(field => field.fieldName === fieldName);
};

export const getUpdatableFieldNames = (
  applicationContext: string,
  contentType: string
): string[] => {
  return getFieldsForContentType(applicationContext, contentType, true).map(field => field.fieldName);
};