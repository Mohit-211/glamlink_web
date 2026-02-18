/**
 * Template Prompts - Exports
 * 
 * Centralized exports for all template prompts used in AI generation.
 * Templates provide pre-configured starting points for different content types.
 */

// Import all template functions
import {
  MAGAZINE_SECTION_TEMPLATES,
  QUICK_PROMPTS,
  CONTENT_TYPE_TEMPLATES,
  SEASONAL_TEMPLATES,
  getMagazineSectionTemplate,
  getQuickPrompts,
  getTemplateCategories,
  getSeasonalPrompts,
  generateContextualPrompts
} from './magazine';

import {
  BLOG_CONTENT_TEMPLATES,
  SEO_BLOG_TEMPLATES,
  BLOG_STRUCTURE_TEMPLATES,
  BEAUTY_BLOG_TEMPLATES,
  ENGAGEMENT_TEMPLATES,
  getBlogTemplate,
  getSEOTemplate,
  getStructureTemplate,
  getBeautyBlogTemplate,
  getEngagementTemplate,
  generateBlogPrompts,
  getContentImprovements
} from './blog';

import {
  PRODUCT_CONTENT_TEMPLATES,
  BEAUTY_CATEGORY_TEMPLATES,
  ECOMMERCE_TEMPLATES,
  VALUE_PROPOSITION_TEMPLATES,
  getProductTemplate,
  getBeautyCategoryTemplate,
  getEcommerceTemplate,
  getValuePropositionTemplate,
  generateProductPrompts,
  getSeasonalProductPrompts
} from './product';

// Re-export all imports
export {
  // Magazine
  MAGAZINE_SECTION_TEMPLATES,
  QUICK_PROMPTS,
  CONTENT_TYPE_TEMPLATES,
  SEASONAL_TEMPLATES,
  getMagazineSectionTemplate,
  getQuickPrompts,
  getTemplateCategories,
  getSeasonalPrompts,
  generateContextualPrompts,
  
  // Blog
  BLOG_CONTENT_TEMPLATES,
  SEO_BLOG_TEMPLATES,
  BLOG_STRUCTURE_TEMPLATES,
  BEAUTY_BLOG_TEMPLATES,
  ENGAGEMENT_TEMPLATES,
  getBlogTemplate,
  getSEOTemplate,
  getStructureTemplate,
  getBeautyBlogTemplate,
  getEngagementTemplate,
  generateBlogPrompts,
  getContentImprovements,
  
  // Product
  PRODUCT_CONTENT_TEMPLATES,
  BEAUTY_CATEGORY_TEMPLATES,
  ECOMMERCE_TEMPLATES,
  VALUE_PROPOSITION_TEMPLATES,
  getProductTemplate,
  getBeautyCategoryTemplate,
  getEcommerceTemplate,
  getValuePropositionTemplate,
  generateProductPrompts,
  getSeasonalProductPrompts
};

/**
 * Template registry for dynamic template selection
 */
export const TEMPLATE_REGISTRY = {
  magazine: {
    'basic-info': () => getMagazineSectionTemplate('basic-info'),
    'cover-config': () => getMagazineSectionTemplate('cover-config'),
    'maries-corner': () => getMagazineSectionTemplate('maries-corner'),
    'cover-pro-feature': () => getMagazineSectionTemplate('cover-pro-feature'),
    'top-treatment': () => getMagazineSectionTemplate('top-treatment'),
    'top-product-spotlight': () => getMagazineSectionTemplate('top-product-spotlight')
  },
  blog: {
    'how-to': () => getBlogTemplate('how-to'),
    'listicle': () => getBlogTemplate('listicle'),
    'review': () => getBlogTemplate('review'),
    'opinion': () => getBlogTemplate('opinion'),
    'news': () => getBlogTemplate('news'),
    'educational': () => getBlogTemplate('educational')
  },
  product: {
    'description': () => getProductTemplate('description'),
    'ingredients': () => getProductTemplate('ingredients'),
    'specifications': () => getProductTemplate('specifications'),
    'usage': () => getProductTemplate('usage'),
    'reviews': () => getProductTemplate('reviews')
  }
} as const;

export type ContentCategory = keyof typeof TEMPLATE_REGISTRY;
export type TemplateType<T extends ContentCategory> = keyof typeof TEMPLATE_REGISTRY[T];

/**
 * Get template by category and type
 */
export function getTemplate<T extends ContentCategory>(
  category: T,
  templateType: TemplateType<T>
) {
  const categoryRegistry = (TEMPLATE_REGISTRY as any)[category];
  const templateFunction = (categoryRegistry as any)[templateType];
  return templateFunction ? templateFunction() : null;
}

/**
 * Get all available templates for a category
 */
export function getTemplatesForCategory(category: ContentCategory): string[] {
  return Object.keys((TEMPLATE_REGISTRY as any)[category]);
}

/**
 * Get all available categories
 */
export function getAllCategories(): ContentCategory[] {
  return Object.keys(TEMPLATE_REGISTRY) as ContentCategory[];
}

/**
 * Search templates by keyword
 */
export function searchTemplates(keyword: string): Array<{
  category: ContentCategory;
  type: string;
  title: string;
  description: string;
}> {
  const results: Array<{
    category: ContentCategory;
    type: string;
    title: string;
    description: string;
  }> = [];
  
  const searchTerm = keyword.toLowerCase();
  
  // Search magazine templates
  Object.entries(MAGAZINE_SECTION_TEMPLATES).forEach(([type, template]: [string, any]) => {
    if (
      template.title?.toLowerCase().includes(searchTerm) ||
      template.description?.toLowerCase().includes(searchTerm) ||
      (Array.isArray(template.prompts) && template.prompts.some((prompt: string) => prompt.toLowerCase().includes(searchTerm)))
    ) {
      results.push({
        category: 'magazine',
        type,
        title: template.title || '',
        description: template.description || ''
      });
    }
  });
  
  // Search blog templates
  Object.entries(BLOG_CONTENT_TEMPLATES).forEach(([type, template]: [string, any]) => {
    if (
      template.title?.toLowerCase().includes(searchTerm) ||
      template.description?.toLowerCase().includes(searchTerm) ||
      (Array.isArray(template.prompts) && template.prompts.some((prompt: string) => prompt.toLowerCase().includes(searchTerm)))
    ) {
      results.push({
        category: 'blog',
        type,
        title: template.title || '',
        description: template.description || ''
      });
    }
  });
  
  // Search product templates
  Object.entries(PRODUCT_CONTENT_TEMPLATES).forEach(([type, template]: [string, any]) => {
    if (
      template.title?.toLowerCase().includes(searchTerm) ||
      template.description?.toLowerCase().includes(searchTerm) ||
      (Array.isArray(template.prompts) && template.prompts.some((prompt: string) => prompt.toLowerCase().includes(searchTerm)))
    ) {
      results.push({
        category: 'product',
        type,
        title: template.title || '',
        description: template.description || ''
      });
    }
  });
  
  return results;
}

/**
 * Get recommended templates based on content analysis
 */
export function getRecommendedTemplates(
  contentType: string,
  currentContent?: any,
  userGoals?: string[]
): Array<{
  category: ContentCategory;
  type: string;
  title: string;
  relevanceScore: number;
}> {
  const recommendations: Array<{
    category: ContentCategory;
    type: string;
    title: string;
    relevanceScore: number;
  }> = [];
  
  // Simple recommendation logic based on content type
  if (contentType.includes('magazine') || contentType.includes('issue')) {
    Object.entries(MAGAZINE_SECTION_TEMPLATES).forEach(([type, template]: [string, any]) => {
      recommendations.push({
        category: 'magazine',
        type,
        title: template.title || '',
        relevanceScore: contentType.includes(type) ? 0.9 : 0.7
      });
    });
  }
  
  if (contentType.includes('blog') || contentType.includes('article')) {
    Object.entries(BLOG_CONTENT_TEMPLATES).forEach(([type, template]: [string, any]) => {
      recommendations.push({
        category: 'blog',
        type,
        title: template.title || '',
        relevanceScore: contentType.includes(type) ? 0.9 : 0.6
      });
    });
  }
  
  if (contentType.includes('product')) {
    Object.entries(PRODUCT_CONTENT_TEMPLATES).forEach(([type, template]: [string, any]) => {
      recommendations.push({
        category: 'product',
        type,
        title: template.title || '',
        relevanceScore: contentType.includes(type) ? 0.9 : 0.8
      });
    });
  }
  
  // Boost scores based on user goals
  if (userGoals) {
    recommendations.forEach(rec => {
      if (userGoals.includes('seo') && (rec.type.includes('seo') || rec.title.toLowerCase().includes('seo'))) {
        rec.relevanceScore += 0.1;
      }
      if (userGoals.includes('engagement') && rec.title.toLowerCase().includes('engagement')) {
        rec.relevanceScore += 0.1;
      }
      if (userGoals.includes('conversion') && rec.title.toLowerCase().includes('conversion')) {
        rec.relevanceScore += 0.1;
      }
    });
  }
  
  // Sort by relevance score
  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5); // Return top 5 recommendations
}

/**
 * Generate smart prompts based on multiple factors
 */
export function generateSmartPrompts(
  contentType: string,
  currentContent: any,
  userGoals?: string[],
  season?: string
): string[] {
  const prompts: string[] = [];
  
  // Get base prompts from templates
  if (contentType.includes('magazine')) {
    const template = getMagazineSectionTemplate(contentType);
    if (template) {
      prompts.push(...template.prompts);
    }
  }
  
  // Add seasonal prompts
  if (season) {
    const seasonalPrompts = getSeasonalPrompts();
    if (seasonalPrompts) {
      prompts.push(...seasonalPrompts.prompts);
    }
  }
  
  // Add goal-specific prompts
  if (userGoals?.includes('seo')) {
    prompts.push(...getQuickPrompts('seo'));
  }
  
  if (userGoals?.includes('engagement')) {
    prompts.push(...getQuickPrompts('improve'));
  }
  
  // Add content-specific prompts based on analysis
  if (currentContent) {
    const improvements = getContentImprovements(JSON.stringify(currentContent));
    prompts.push(...improvements);
  }
  
  return [...new Set(prompts)]; // Remove duplicates
}