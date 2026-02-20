/**
 * Content Type Definitions
 */

export interface ContentTypeConfig {
  id: string;
  label: string;
  description: string;
  category: 'magazine' | 'blog' | 'product' | 'general';
  icon?: string;
  supportedModes: ('single-field' | 'multi-field' | 'content-block')[];
  defaultPrompts?: {
    system?: string;
    examples?: string[];
  };
}

export const CONTENT_TYPES: Record<string, ContentTypeConfig> = {
  // Magazine Content Types
  'magazine-basic-info': {
    id: 'magazine-basic-info',
    label: 'Magazine Basic Info',
    description: 'Magazine issue metadata and basic information',
    category: 'magazine',
    icon: '📰',
    supportedModes: ['multi-field'],
    defaultPrompts: {
      system: 'You are editing magazine issue metadata. Focus on professional, engaging content suitable for a beauty magazine.',
      examples: [
        'Make this more professional and engaging',
        'Add SEO keywords for beauty industry',
        'Improve readability and flow',
        'Optimize for magazine standards'
      ]
    }
  },
  
  'magazine-cover-config': {
    id: 'magazine-cover-config',
    label: 'Magazine Cover Config',
    description: 'Cover page configuration and featured person details',
    category: 'magazine',
    icon: '🎨',
    supportedModes: ['multi-field'],
    defaultPrompts: {
      system: 'You are editing magazine cover configuration. Focus on compelling headlines and accurate featured person information.',
      examples: [
        'Update featured person details',
        'Improve alt text for accessibility',
        'Make the featured title more compelling',
        'Enhance cover text for better impact'
      ]
    }
  },
  
  'magazine-section': {
    id: 'magazine-section',
    label: 'Magazine Section',
    description: 'Individual magazine section content',
    category: 'magazine',
    icon: '📄',
    supportedModes: ['multi-field', 'content-block'],
    defaultPrompts: {
      system: 'You are editing magazine section content. Maintain the magazine tone and style while improving clarity and engagement.',
      examples: [
        'Make this section more engaging',
        'Add more professional details',
        'Improve the content flow',
        'Enhance readability'
      ]
    }
  },
  
  // Blog Content Types
  'blog-post': {
    id: 'blog-post',
    label: 'Blog Post',
    description: 'Blog post content and metadata',
    category: 'blog',
    icon: '✍️',
    supportedModes: ['single-field', 'multi-field'],
    defaultPrompts: {
      system: 'You are editing blog content. Focus on engaging, informative writing that connects with readers.',
      examples: [
        'Make this more engaging and personal',
        'Add SEO optimization',
        'Improve the introduction hook',
        'Enhance readability for web'
      ]
    }
  },
  
  // Product Content Types
  'product-description': {
    id: 'product-description',
    label: 'Product Description',
    description: 'Product information and marketing content',
    category: 'product',
    icon: '🛍️',
    supportedModes: ['single-field', 'multi-field'],
    defaultPrompts: {
      system: 'You are editing product descriptions. Focus on benefits, features, and compelling marketing copy.',
      examples: [
        'Make this more persuasive',
        'Add customer benefits focus',
        'Improve product features list',
        'Enhance marketing appeal'
      ]
    }
  },
  
  // General Content Types
  'general-content': {
    id: 'general-content',
    label: 'General Content',
    description: 'General purpose content editing',
    category: 'general',
    icon: '📝',
    supportedModes: ['single-field', 'multi-field'],
    defaultPrompts: {
      system: 'You are a professional content editor. Improve clarity, engagement, and overall quality.',
      examples: [
        'Improve this content',
        'Make it more professional',
        'Enhance clarity and flow',
        'Fix grammar and style'
      ]
    }
  }
};

// Helper functions
export const getContentTypeConfig = (contentTypeId: string): ContentTypeConfig | undefined => {
  return CONTENT_TYPES[contentTypeId];
};

export const getContentTypesByCategory = (category: string): ContentTypeConfig[] => {
  return Object.values(CONTENT_TYPES).filter(type => type.category === category);
};

export const getSupportedModes = (contentTypeId: string): string[] => {
  return CONTENT_TYPES[contentTypeId]?.supportedModes || [];
};

export const getDefaultPrompts = (contentTypeId: string) => {
  return CONTENT_TYPES[contentTypeId]?.defaultPrompts;
};

export const getAllContentTypes = (): ContentTypeConfig[] => {
  return Object.values(CONTENT_TYPES);
};